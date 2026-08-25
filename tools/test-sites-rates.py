"""
@fileoverview Автономный тестер курсов с сайтов-обменников для режима «📋 Сайты».

Читает конфиг прямо из таблиц проекта (exchangers, pair_map, pairs) в Postgres,
поэтому не расходится с тем, что делает бот. Повторяет логику ноды http_request:
разбор JSON/XML, извлечение по json_path с фильтром массива `?key=value`.

Запуск (из корня проекта):
    python tools/test-sites-rates.py
    python tools/test-sites-rates.py --project 289 --from 2 --to 5
    python tools/test-sites-rates.py --insecure          # без проверки SSL
    python tools/test-sites-rates.py --amount 10000

Выход: таблица «сайт → курс», и для неудач — конкретная причина
(SSL, HTTP-код, путь не найден, нечисловое значение).
"""

import argparse
import asyncio
import json
import os
import ssl
import sys
import xml.etree.ElementTree as ET

import aiohttp
import asyncpg
from dotenv import load_dotenv

load_dotenv()

DB_URL = os.getenv('DATABASE_URL', '')
TIMEOUT = 15


def xml_to_dict(el):
    """Превращает XML-элемент в словарь так же, как это делает нода http_request.

    Args:
        el: XML-элемент
    Returns:
        dict | str: вложенная структура либо текст листа
    """
    children = list(el)
    if not children:
        return el.text.strip() if el.text and el.text.strip() else ''
    groups = {}
    for child in children:
        groups.setdefault(child.tag, []).append(xml_to_dict(child))
    return {tag: (items[0] if len(items) == 1 else items) for tag, items in groups.items()}


def extract_by_path(data, path):
    """Извлекает значение по пути вида `exchange.2.to.5.xr` или `item.?from=X&to=Y.in`.

    Args:
        data: Разобранный ответ (dict/list/str)
        path: Путь с точками; сегмент `?k=v&k2=v2` фильтрует список словарей
    Returns:
        tuple[object, str]: значение и сегмент, на котором путь оборвался ('' если дошёл)
    """
    cur = data
    for seg in path.split('.'):
        if not seg or cur is None:
            continue
        if seg.startswith('?') and isinstance(cur, list):
            conds = {}
            for part in seg[1:].split('&'):
                if '=' in part:
                    k, v = part.split('=', 1)
                    conds[k] = v
            found = None
            for it in cur:
                if isinstance(it, dict) and all(str(it.get(k, '')) == v for k, v in conds.items()):
                    found = it
                    break
            cur = found
            if cur is None:
                return None, seg
        elif isinstance(cur, dict):
            if seg not in cur:
                return None, seg
            cur = cur[seg]
        elif isinstance(cur, list) and seg.isdigit():
            idx = int(seg)
            if idx >= len(cur):
                return None, seg
            cur = cur[idx]
        else:
            return None, seg
    return cur, ''


def subst(text, variables):
    """Подставляет {переменные} в строку.

    Args:
        text: Шаблон с фигурными скобками
        variables: Словарь значений
    Returns:
        str: строка с подставленными значениями
    """
    out = text or ''
    for key, val in variables.items():
        out = out.replace('{' + key + '}', str(val))
    return out


async def load_config(project_id):
    """Читает таблицы exchangers, pair_map, pairs проекта и приводит к словарям.

    Args:
        project_id: Числовой ID проекта
    Returns:
        dict[str, list[dict]]: имя таблицы → список строк
    """
    conn = await asyncpg.connect(DB_URL)
    try:
        rows = await conn.fetch(
            """
            SELECT t.name AS tbl, r.row_index, c.name AS col, kv.value
            FROM bot_table_rows r
            JOIN bot_tables t ON t.id = r.table_id
            JOIN LATERAL jsonb_each_text(r.data) kv ON TRUE
            JOIN bot_table_columns c ON c.id::text = kv.key AND c.table_id = t.id
            WHERE t.project_id = $1 AND t.name = ANY($2::text[])
            ORDER BY t.name, r.row_index
            """,
            project_id, ['exchangers', 'pair_map', 'pairs'],
        )
    finally:
        await conn.close()

    tables = {}
    for r in rows:
        bucket = tables.setdefault(r['tbl'], {})
        bucket.setdefault(r['row_index'], {})[r['col']] = r['value']
    return {name: [rows_by_idx[k] for k in sorted(rows_by_idx)] for name, rows_by_idx in tables.items()}


BROWSER_UA = ('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
              '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36')

# Полный набор заголовков живого Chrome — проверяем, хватит ли его против Cloudflare
BROWSER_HEADERS = {
    'User-Agent': BROWSER_UA,
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
    # br не запрашиваем: aiohttp не всегда его разбирает, а Cloudflare
    # на swop/pocket/ferma всё равно не обходится подменой заголовков.
    'Accept-Encoding': 'gzip, deflate',
    'sec-ch-ua': '"Chromium";v="126", "Not:A-Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
    'Connection': 'keep-alive',
}


async def fetch_one(session, ex, variables, headers=None, dump=None):
    """Запрашивает один сайт и извлекает курс по его json_path.

    Args:
        session: aiohttp-сессия
        ex: Строка таблицы exchangers
        variables: Переменные для подстановки в json_path
        headers: Дополнительные заголовки запроса
        dump: Имя сайта, для которого печатать начало ответа
    Returns:
        tuple[str, float, str]: имя, курс (0 при неудаче), описание проблемы
    """
    name = ex.get('name', '?')
    url = ex.get('url', '')
    path = subst(ex.get('json_path', ''), variables)
    try:
        async with session.get(url, headers=headers or {},
                               timeout=aiohttp.ClientTimeout(total=TIMEOUT)) as resp:
            status = resp.status
            text = await resp.text()
            if dump and dump in name:
                print(f'\n── Ответ {name} (HTTP {status}, '
                      f'{resp.headers.get("Content-Type", "?")}) ──')
                print(text[:600])
                print('── конец фрагмента ──\n')
    except aiohttp.ClientConnectorCertificateError as err:
        return name, 0.0, f'SSL: {err.certificate_error}'
    except Exception as err:
        return name, 0.0, f'{type(err).__name__}: {str(err)[:80]}'

    if status != 200:
        return name, 0.0, f'HTTP {status}'

    try:
        data = json.loads(text)
    except Exception:
        stripped = text.strip()
        if stripped.startswith('<'):
            try:
                data = xml_to_dict(ET.fromstring(text))
            except Exception as err:
                return name, 0.0, f'XML не разобран: {str(err)[:60]}'
        else:
            return name, 0.0, 'ответ не JSON и не XML'

    value, failed_at = extract_by_path(data, path)
    if value is None:
        top = list(data)[:6] if isinstance(data, dict) else type(data).__name__
        return name, 0.0, f"путь оборвался на '{failed_at}' | путь: {path} | верхний уровень: {top}"

    try:
        return name, float(str(value).replace(' ', '').replace(',', '.')), ''
    except ValueError:
        return name, 0.0, f'нечисловое значение: {str(value)[:40]}'


async def main():
    """Точка входа: читает конфиг, опрашивает все сайты, печатает отчёт."""
    ap = argparse.ArgumentParser(description='Проверка курсов с сайтов-обменников')
    ap.add_argument('--project', type=int, default=289, help='ID проекта (по умолчанию 289)')
    ap.add_argument('--from', dest='from_id', default='2', help='our_from_id пары')
    ap.add_argument('--to', dest='to_id', default='5', help='our_to_id пары')
    ap.add_argument('--amount', type=float, default=10000, help='Сумма в рублях для расчёта BTC')
    ap.add_argument('--insecure', action='store_true', help='Не проверять SSL-сертификаты')
    ap.add_argument('--ua', action='store_true', help='Отправлять браузерный User-Agent')
    ap.add_argument('--dump', default=None, help='Показать начало ответа сайта (подстрока имени)')
    args = ap.parse_args()

    if not DB_URL:
        print('❌ Нет DATABASE_URL в .env')
        return

    cfg = await load_config(args.project)
    exchangers = cfg.get('exchangers', [])
    pair_map = cfg.get('pair_map', [])
    pairs = cfg.get('pairs', [])

    print(f'�project {args.project}: exchangers={len(exchangers)}, '
          f'pair_map={len(pair_map)}, pairs={len(pairs)}')
    if not exchangers:
        print('❌ Таблица exchangers пуста — нечего опрашивать')
        return

    mapping = next((r for r in pair_map
                    if r.get('our_from_id') == args.from_id and r.get('our_to_id') == args.to_id), None)
    if mapping is None:
        have = [(r.get('our_from_id'), r.get('our_to_id')) for r in pair_map]
        print(f'❌ В pair_map нет пары ({args.from_id}, {args.to_id}). Есть: {have}')
        return

    pair = next((r for r in pairs
                 if r.get('from_id') == args.from_id and r.get('to_id') == args.to_id), {})
    decimals = int(pair.get('decimals') or 8)
    print(f'💱 Пара: {pair.get("from_name", "?")} → {pair.get("to_name", "?")}, '
          f'decimals={decimals}, сумма={args.amount:.0f} ₽\n')

    connector = None
    if args.insecure:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        connector = aiohttp.TCPConnector(ssl=ctx)

    headers = dict(BROWSER_HEADERS) if args.ua else {}

    async with aiohttp.ClientSession(connector=connector) as session:
        results = await asyncio.gather(
            *[fetch_one(session, ex, mapping, headers, args.dump) for ex in exchangers])

    ok = [(n, v) for n, v, e in results if v > 0]
    bad = [(n, e) for n, v, e in results if v <= 0]

    print('── Курсы ──')
    for name, rate in sorted(ok, key=lambda x: x[1]):
        got = round(args.amount / rate, decimals)
        print(f'  ✅ {name:<24} {rate:>14,.2f} ₽/BTC   → {got} BTC'.replace(',', ' '))

    if bad:
        print('\n── Не получилось ──')
        for name, err in bad:
            print(f'  ⚠️ {name:<24} {err}')

    print(f'\nИтого: {len(ok)} из {len(results)}')


if __name__ == '__main__':
    if sys.platform.startswith('win'):
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main())
