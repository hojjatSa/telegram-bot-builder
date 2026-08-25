"""
@fileoverview Автономный тестер прохода по ботам-обменникам через Telethon.

Назначение: быстро отлаживать логику клика/парсинга для code-ноды
«Сравнение курсов» без перезапуска всего бота-конструктора.

Запуск (из корня проекта):
    python tools/test-exchangers.py shaxta vortex
    python tools/test-exchangers.py all

ВАЖНО: использует ту же USERBOT-сессию, что и рабочий бот. Перед запуском
останови бота проекта — два клиента на одной сессии могут её разлогинить.
"""

import asyncio
import glob
import os
import re
import sys
import time

from dotenv import load_dotenv
from telethon import TelegramClient
from telethon.sessions import StringSession


def load_envs() -> str:
    """Ищет .env с USERBOT_* : корень, TEST_ENV_FILE, затем папки ботов.

    Returns:
        str: путь к файлу, из которого взята сессия (или пустая строка)
    """
    load_dotenv()
    if os.getenv("USERBOT_SESSION_STRING"):
        return ".env"

    candidates = []
    explicit = os.getenv("TEST_ENV_FILE")
    if explicit:
        candidates.append(explicit)
    bot_envs = sorted(glob.glob(os.path.join("bots", "*", ".env")))
    candidates += [p for p in bot_envs if "289" in p]
    candidates += [p for p in bot_envs if "289" not in p]

    for path in candidates:
        if not path or not os.path.exists(path):
            continue
        load_dotenv(path, override=True)
        if os.getenv("USERBOT_SESSION_STRING"):
            return path
    return ""


ENV_SOURCE = load_envs()

API_ID = int(os.getenv("USERBOT_API_ID", "0") or 0)
API_HASH = os.getenv("USERBOT_API_HASH", "")
SESSION = os.getenv("USERBOT_SESSION_STRING", "")

BTC_AMOUNT = os.getenv("TEST_BTC_AMOUNT", "0.001")
RUB_AMOUNT = os.getenv("TEST_RUB_AMOUNT", "5000")
WALLET = os.getenv("TEST_BTC_WALLET", "bc1q5at58r5qlwuclpvk4hv0c0wughe69evxle068q")

# Универсальная регулярка итога: «К оплате: 8 100», «Итого: 9044», «составит: 9051»
RES_PAY = r"(?:к оплате|итого|составит)[^\d]*([\d][\d\s,\u00a0]{2,})"

# Капча Shaxta: «Выбери Банан» → нужная кнопка-эмодзи
FRUITS = {
    "банан": "🍌", "морков": "🥕", "апельсин": "🍊", "кив": "🥝",
    "яблок": "🍏", "лимон": "🍋", "вишн": "🍒", "виноград": "🍇",
    "груш": "🍐", "арбуз": "🍉", "персик": "🍑", "клубник": "🍓",
    "ананас": "🍍", "манго": "🥭", "помидор": "🍅", "баклажан": "🍆",
    "кукуруз": "🌽", "перец": "🌶", "огур": "🥒", "картош": "🥔",
    "лук": "🧅", "чеснок": "🧄", "гриб": "🍄", "авокадо": "🥑",
    "кокос": "🥥", "дын": "🍈",
}


def log(tag: str, msg: str) -> None:
    """Печатает строку трассировки с меткой бота."""
    print(f"[{tag}] {msg}", flush=True)


def btn_text(m) -> str:
    """Склеивает подписи всех кнопок сообщения."""
    if not m or not m.buttons:
        return ""
    return " | ".join(b.text for r in m.buttons for b in r if b.text)


def snippet(m, n: int = 90) -> str:
    """Короткий фрагмент текста сообщения для лога."""
    t = (m.text or "").replace("\n", " ⏎ ") if m else ""
    return t[:n]


def to_int(raw: str) -> int:
    """Число из захвата: убирает пробелы, запятые и nbsp («8,100» → 8100)."""
    digits = re.sub(r"\D", "", raw or "")
    return int(digits) if digits else 0


def to_num(raw, default: float) -> float:
    """Дробное число из строки. Защита от неподставленных «{user_amount}»."""
    mm = re.search(r"\d+(?:[.,]\d+)?", str(raw or "").replace(" ", ""))
    if not mm:
        return default
    try:
        return float(mm.group(0).replace(",", "."))
    except ValueError:
        return default


async def hit(b) -> None:
    """Клик по кнопке без ожидания answerCallbackQuery."""
    try:
        await asyncio.wait_for(b.click(), timeout=2)
    except Exception:
        pass


async def tap(m, needle: str, lower: bool = True) -> str:
    """Жмёт кнопку по подстроке: сначала inline, иначе reply (отправка текстом).

    Returns:
        str: подпись нажатой кнопки (пустая строка, если ничего не нашли)
    """
    if not m or not m.buttons:
        return ""
    fallback = None
    for row in m.buttons:
        for b in row:
            label = b.text or ""
            ok = (needle in label.lower()) if lower else (needle in label)
            if not ok:
                continue
            if getattr(b, "data", None) is not None:
                await hit(b)
                return label
            if fallback is None:
                fallback = b
    if fallback is not None:
        await hit(fallback)
        return fallback.text or "?"
    return ""


async def tap_first(m) -> bool:
    """Жмёт первую inline-кнопку сообщения."""
    if not m or not m.buttons:
        return False
    for row in m.buttons:
        for b in row:
            if getattr(b, "data", None) is not None:
                await hit(b)
                return True
    return False


async def solve_captcha(cli, tag: str, m) -> str:
    """Решает капчу двух видов.

    1. «Выбери Банан» — название словом, ищем эмодзи по словарю FRUITS.
    2. «Нажмите на кнопку с эмодзи: 🍊» — символ есть прямо в тексте задания.

    Returns:
        str: подпись нажатой кнопки (пустая строка, если капчи не нашли)
    """
    raw = m.text or ""
    t = raw.lower()
    if "выбер" not in t and "нажмите" not in t:
        return ""
    labels = btn_text(m)
    for word, emoji in FRUITS.items():
        if word in t and emoji in labels:
            log(tag, f"капча: '{word}' → {emoji}")
            return await tap(m, emoji, lower=False)
    for row in (m.buttons or []):
        for b in row:
            lab = (b.text or "").strip()
            if lab and len(lab) <= 4 and lab in raw:
                log(tag, f"капча-эмодзи: {lab}")
                return await tap(m, lab, lower=False)
    return ""


async def say(cli, entity: str, text: str) -> int:
    """Отправляет сообщение и возвращает его id (база для поиска ответов)."""
    m = await cli.send_message(entity, text)
    return m.id if m else 0


async def find(cli, entity: str, pred, to: float = 8, after: int = 0):
    """Ищет входящее сообщение новее after по предикату."""
    dl = time.time() + to
    while time.time() < dl:
        for m in await cli.get_messages(entity, limit=8):
            if m.out or m.id <= after:
                continue
            try:
                if pred(m):
                    return m
            except Exception:
                pass
        await asyncio.sleep(0.4)
    return None


async def scan_result(cli, entity, base, res_re, res_need, src="text", pick="first"):
    """Ищет итоговую сумму среди последних сообщений (боты правят старые id).

    Args:
        src: где искать — "text", "buttons" или "both"
        pick: "first" (первое совпадение) или "min" (минимум из всех, для цен в кнопках)
    """
    vals = []
    for m in await cli.get_messages(entity, limit=8):
        if m.out or m.id <= base:
            continue
        haystacks = []
        if src in ("text", "both"):
            haystacks.append((m.text or "").lower())
        if src in ("buttons", "both"):
            haystacks.append(btn_text(m).lower())
        for t in haystacks:
            if not all(w in t for w in res_need):
                continue
            found = [to_int(x) for x in re.findall(res_re, t)]
            found = [v for v in found if v > 0]
            if not found:
                continue
            if pick == "first":
                return found[0]
            vals += found
    return min(vals) if vals else None


async def read_state(cli, entity, base, limit=4):
    """Состояние диалога: текст нескольких свежих экранов + список сообщений.

    Подсказка вида «Введи сумму» часто уходит в отдельное сообщение,
    а самым новым оказывается «Например: 0.001» — поэтому текст склеивается.
    """
    msgs = [m for m in await cli.get_messages(entity, limit=limit)
            if not m.out and m.id > base]
    text_all = " \n ".join((m.text or "") for m in msgs).lower()
    return msgs, text_all


async def walk(cli, tag, entity, first, steps, res_re, res_need, to=40,
               src="text", pick="first", amount=None):
    """Универсальный проход: база фиксирована, результат ищется по всем экранам."""
    base = await say(cli, entity, first)
    log(tag, f"→ отправлено {first!r} (base={base})")
    amount = amount or BTC_AMOUNT
    done = set()
    dl = time.time() + to
    last_seen = None
    # Подпись экрана на момент последнего действия. Фолбэк ввода суммы ждёт не
    # фиксированную паузу, а смену экрана — опрос идёт каждые 0.5 с.
    act_sig = None
    last_act = time.time()
    while time.time() < dl:
        found = await scan_result(cli, entity, base, res_re, res_need, src, pick)
        if found is not None:
            log(tag, f"✅ результат: {found}")
            return found

        msgs, t = await read_state(cli, entity, base)
        if not msgs:
            await asyncio.sleep(0.6)
            continue
        all_btns = " ┃ ".join(btn_text(x) for x in msgs if x.buttons)
        sig = (t[:70], all_btns[:70])
        if sig != last_seen:
            log(tag, f"экран id={msgs[0].id}: {snippet(msgs[0])} | кнопки: {all_btns[:160]}")
            last_seen = sig

        if "captcha" not in done:
            solved = False
            for mm in msgs:
                if mm.buttons and await solve_captcha(cli, tag, mm):
                    solved = True
                    break
            if solved:
                done.add("captcha")
                act_sig, last_act = sig, time.time()
                await asyncio.sleep(1.2)
                continue

        # Адрес отправляем только если его прямо просят: у Imperia есть экран
        # «выберите криптовалюту для отправки на ваш кошелек», это не запрос адреса
        asks = "введи" in t or "укажи" in t or "пришли" in t
        if ("кошел" in t or "адрес" in t) and asks and "wallet" not in done:
            done.add("wallet")
            act_sig, last_act = sig, time.time()
            await say(cli, entity, WALLET)
            log(tag, "→ отправлен кошелёк")
            await asyncio.sleep(1.0)
            continue

        if "сумм" in t and asks and "amount" not in done:
            done.add("amount")
            act_sig, last_act = sig, time.time()
            await say(cli, entity, amount)
            log(tag, f"→ отправлена сумма {amount}")
            await asyncio.sleep(1.0)
            continue

        # Клик ищем по всем свежим сообщениям: нужные кнопки часто не в самом новом
        acted = False
        for label, needle in steps:
            if label in done:
                continue
            for mm in msgs:
                if not mm.buttons or needle not in btn_text(mm).lower():
                    continue
                hit_label = await tap(mm, needle)
                if hit_label:
                    done.add(label)
                    acted = True
                    act_sig, last_act = sig, time.time()
                    log(tag, f"→ клик [{label}] по '{needle}' → {hit_label!r} (id={mm.id})")
                    break
            if acted:
                await asyncio.sleep(0.4)
                break
        if acted:
            continue

        # Все кнопки нажаты, а подсказки про сумму так и не было (Vortex пишет
        # только «Минимальная сумма»). Отправляем сумму сами, но лишь когда бот
        # уже перерисовал экран после нашего клика — иначе ввод улетит в пустоту.
        if "amount" not in done and all(lb in done for lb, _ in steps):
            redrawn = act_sig is None or sig != act_sig
            if redrawn or time.time() - last_act > 10:
                done.add("amount")
                act_sig, last_act = sig, time.time()
                await say(cli, entity, amount)
                mark = "" if redrawn else " (экран не сменился)"
                log(tag, f"→ отправлена сумма {amount} без подсказки{mark}")
                await asyncio.sleep(1.0)
                continue
        await asyncio.sleep(0.5)
    log(tag, f"⏱ таймаут {to}с, шаги: {sorted(done)}")
    return 0


async def run_lucky(cli) -> int:
    """Lucky: Купить → Купить BTC → метод оплаты → в токенах → сумма → кошелёк."""
    e = "@LuckyExchange_Bot"
    a = await say(cli, e, "/start")
    m = await find(cli, e, lambda x: "Купить" in btn_text(x), 8, a)
    log("lucky", f"меню: {btn_text(m)[:100]}")
    await tap(m, "купить")
    await asyncio.sleep(0.8)
    m = await find(cli, e, lambda x: "Купить BTC" in btn_text(x), 8, a)
    await tap(m, "купить btc")
    await asyncio.sleep(0.8)
    m = await find(cli, e, lambda x: x.text and "метод оплаты" in x.text.lower(), 8, a)
    await tap_first(m)
    await asyncio.sleep(0.8)
    m = await find(cli, e, lambda x: "токен" in btn_text(x).lower(), 8, a)
    await tap(m, "токен")
    await asyncio.sleep(1)
    await say(cli, e, BTC_AMOUNT)
    await asyncio.sleep(1)
    a = await say(cli, e, WALLET)
    m = await find(cli, e, lambda x: x.text and "Итого" in x.text, 12, a)
    log("lucky", f"итог: {snippet(m)}")
    mm = re.search(r"\*?\*?Итого\*?\*?[^0-9]*([\d][\d\s,\u00a0]*)", (m.text if m else "") or "")
    return to_int(mm.group(1)) if mm else 0


async def run_litebit(cli) -> int:
    """LiteBit: reply-кнопки Купить → Купить BTC → сумма → цены в кнопках."""
    e = "@litebitbit_bot"
    await say(cli, e, "/start")
    await asyncio.sleep(0.9)
    await say(cli, e, "📈 Купить")
    await asyncio.sleep(0.6)
    await say(cli, e, "🔄 Купить BTC")
    await asyncio.sleep(0.6)
    a = await say(cli, e, BTC_AMOUNT)
    m = await find(cli, e, lambda x: re.search(r"\(\d+\s*руб", btn_text(x)), 12, a)
    log("litebit", f"кнопки оплаты: {btn_text(m)[:140]}")
    prices = [int(x) for x in re.findall(r"\((\d+)\s*руб", btn_text(m))] if m else []
    return min(prices) if prices else 0


# Love переведён на табличный проход: цена лежит в кнопках способов оплаты,
# а «Эквивалент» в тексте — это чистый курс без наценки, он не подходит.


# Боты, укладывающиеся в общий walk: параметры вместо отдельной функции
CFG = {
    "shaxta": {
        "entity": "@shaxta24_bot",
        "first": "/start",
        "steps": [("buy", "купить"), ("btc", "btc"), ("pay", "сбп"), ("pay2", "карт")],
        "res": r"сумма\s*\u2796?\s*\*{0,2}([\d][\d\s,\u00a0]{2,})",
        "need": ["получению"],
        "to": 45,
    },
    "vortex": {
        "entity": "@vrtxbtc_bot",
        "first": "🚀 Купить ВТС",
        "prestart": "/start",
        "steps": [("dir", "обычн"), ("pay", "сбп")],
        "res": r"составит[^\d]*([\d][\d\s,\u00a0]{2,})",
        "need": ["составит"],
        "to": 45,
    },
    "capitalist": {
        "entity": "@btccapital_bot",
        "first": "/start",
        "steps": [("buy", "купить"), ("btc", "btc"), ("pay", "сбп"), ("pay2", "карт")],
        "res": RES_PAY,
        "need": [],
        "to": 45,
    },
    "sanchez": {
        "entity": "@Sanchez_exchange_bot",
        "first": "/start",
        "steps": [("buy", "купить"), ("pay", "сбп"), ("ready", "готов"), ("btc", "btc")],
        "res": RES_PAY,
        "need": [],
        "to": 45,
    },
    "casper": {
        "entity": "@casper_btc_bot",
        "first": "/start",
        "steps": [("btc", "btc"), ("pay", "сбп"), ("pay2", "карт")],
        "res": r"[—–-]\s*([\d][\d\s,\u00a0]{2,})\s*₽",
        "need": [],
        "src": "both",
        "pick": "min",
        "to": 45,
    },
    "love": {
        "entity": "@Exchange_Love_Bot",
        "first": "/start",
        "steps": [("buy", "купить втс")],
        # цена способа оплаты в кнопке: «🔄СБП 8603₽»
        "res": r"сбп\s*([\d][\d\s,\u00a0]{2,})\s*₽",
        "need": [],
        "src": "buttons",
        "to": 30,
    },
    "monopoly": {
        "entity": "@MPL_BTC_BOT",
        "first": "/start",
        "steps": [("buy", "купить btc"), ("pay", "сбп"), ("pay2", "карт")],
        "res": r"\(([\d][\d\s,\u00a0]{2,})\s*руб",
        "need": [],
        "src": "both",
        "pick": "min",
        "to": 45,
    },
    "crazy": {
        # «Bigmafia BTC» — внутренний баланс, нужен именно «Внешний BTC»
        "entity": "@BTCrzyBOT",
        "first": "/start",
        "steps": [("buy", "купить btc"), ("ext", "внешний"), ("pay", "сбп"), ("pay2", "карт")],
        "res": RES_PAY,
        "need": [],
        "src": "both",
        "to": 45,
    },
    "inf": {
        "entity": "@Infinity_exchange_bot",
        "first": "/start",
        "steps": [("buy", "купить"), ("btc", "btc"), ("next", "далее"),
                  ("pay", "сбп"), ("pay2", "карт")],
        "res": r"сбп[^\d]*([\d][\d\s,\u00a0]{2,})",
        "need": [],
        "src": "both",
        "to": 50,
    },
    "viron": {
        "entity": "@popol_ni_bot",
        "first": "/start",
        "steps": [("buy", "купить"), ("btc", "btc"), ("prov", "провайдер 5"), ("pay", "сбп")],
        "res": r"(?:сумма к оплате|к оплате|итого)[^\d]*([\d][\d\s,\u00a0]{2,})",
        "need": [],
        "src": "both",
        "to": 60,
    },
    "imperia": {
        "entity": "@IMPERIA_OBMENA_BOT",
        "first": "/start",
        "steps": [("buy", "карты в кошел"), ("btc", "btc")],
        # «Итого к оплате: 8,600.33 ₽» — берём только целую часть до точки
        "res": r"итого к оплате[^\d]*([\d][\d,\s\u00a0]*)",
        "need": [],
        "to": 40,
    },
    "cf": {
        "entity": "@Crypto_Flow_exchange_bot",
        "first": "/start",
        "steps": [("btc", "btc"), ("buy", "купить btc")],
        # «Вы заплатите 👉 8250.0 RUB» — дробную часть не захватываем
        "res": r"заплатите[^\d]*(\d[\d\s\u00a0]*)",
        "need": ["заплатите"],
        "to": 45,
    },
}


def make_runner(name: str):
    """Создаёт runner из записи CFG."""
    cfg = CFG[name]

    async def runner(cli):
        if cfg.get("prestart"):
            await say(cli, cfg["entity"], cfg["prestart"])
            await asyncio.sleep(1)
        return await walk(
            cli, name, cfg["entity"], cfg["first"],
            cfg["steps"], cfg["res"], cfg["need"], cfg.get("to", 40),
            cfg.get("src", "text"), cfg.get("pick", "first"), cfg.get("amount"))

    return runner


async def run_scooby(cli) -> int:
    """ScoobyChange: inline-запрос «buy_btc 0.001», итог в заголовке результата."""
    res = await cli.inline_query("@scdoo_bot", f"buy_btc {BTC_AMOUNT}")
    if not res:
        log("scooby", "пустой inline-ответ")
        return 0
    for i, r in enumerate(res[:3]):
        log("scooby", f"[{i}] {getattr(r, 'title', '')!r} / {getattr(r, 'description', '')!r}")
    for r in res:
        blob = f"{getattr(r, 'title', '') or ''} {getattr(r, 'description', '') or ''}"
        rm = re.search(r"оплате[^\d]*([\d][\d\s,\u00a0]{2,})", blob.lower())
        if rm:
            return to_int(rm.group(1))
    return 0


RUNNERS = {
    "lucky": run_lucky,
    "litebit": run_litebit,
    "scooby": run_scooby,
}
RUNNERS.update({name: make_runner(name) for name in CFG})

ORDER = ["lucky", "litebit", "love", "shaxta", "vortex", "capitalist",
         "sanchez", "casper", "scooby", "monopoly", "cf", "crazy", "inf", "viron",
         "imperia"]


async def main() -> None:
    """Точка входа: подключается к Telethon и прогоняет выбранных ботов."""
    if not (API_ID and API_HASH and SESSION):
        print("❌ Не нашёл USERBOT_API_ID / USERBOT_API_HASH / USERBOT_SESSION_STRING")
        print("   Укажи путь к нужному .env: TEST_ENV_FILE=bots/<папка_бота>/.env")
        return
    print(f"🔑 Сессия взята из: {ENV_SOURCE}")

    args = [a.lower() for a in sys.argv[1:]] or ["shaxta", "vortex"]
    if "all" in args:
        names = [n for n in ORDER if n in RUNNERS]
    else:
        names = [a for a in args if a in RUNNERS]
    if not names:
        print(f"❌ Неизвестные боты. Доступны: {', '.join(RUNNERS)}, all")
        return

    cli = TelegramClient(StringSession(SESSION), API_ID, API_HASH)
    await cli.connect()
    if not await cli.is_user_authorized():
        print("❌ Userbot не авторизован — проверь USERBOT_SESSION_STRING")
        return

    me = await cli.get_me()
    print(f"🟣 Подключён как {me.first_name} (@{me.username})")
    print(f"₿ Сумма: {BTC_AMOUNT} BTC | 💰 Рубли: {RUB_AMOUNT}\n")

    results = {}
    for name in names:
        started = time.time()
        try:
            results[name] = await RUNNERS[name](cli)
        except Exception as err:
            log(name, f"❌ {type(err).__name__}: {err}")
            results[name] = 0
        log(name, f"⏱ {int(time.time() - started)}с\n")

    print("── Итог ──")
    for name in names:
        val = results.get(name, 0)
        mark = "✅" if val > 0 else "⚠️"
        print(f"{mark} {name}: {val or 'нет данных'} ₽")

    await cli.disconnect()


if __name__ == "__main__":
    asyncio.run(main())
