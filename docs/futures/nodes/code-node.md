# Нода `code` — произвольный Python-код

## Концепция

Пользователь пишет **тело async-функции** в редакторе. Переменные пользователя доступны по имени. В том же пространстве имён — `client` / `userbot_client` (глобальный Telethon-клиент воркера), `callback_query`, `user_id`.

Это не RestrictedPython: self-hosted, полный доступ к сессии юзербота (клики в чужих ботах, сообщения). Исходник в `bot.py` уходит **строкой** (`tojson`), выполняется через `async def __code_entry` + `asyncio.wait_for(..., 180)`.

Аналог блока «Калькулятор» в Salebot и «Code node» в n8n, плюс Telethon.

---

## Пример использования — сравнение курсов

```python
# Сортируем обменники по выгодности и помечаем лучший
lines = [l for l in rates_text.split('\n') if l.strip()]
lines = [l for l in lines if '<b>0</b>' not in l]  # убираем пустые курсы

# Сортируем: больше крипты = лучше
def get_rate(line):
    try:
        return float(line.split('<b>')[1].split('</b>')[0])
    except:
        return 0

lines.sort(key=get_rate, reverse=True)

# Помечаем лучший
if lines:
    lines[0] = lines[0].replace('🔸', '🏆')

rates_text = '\n'.join(lines)
```

---

## Интерфейс узла

### Поля конфигурации

| Поле | Тип | Описание |
|---|---|---|
| `code` | string (multiline) | Python-код пользователя |
| `autoTransitionTo` | string | ID следующего узла |

### Доступные переменные в коде

Код выполняется в контексте, где доступны:

| Переменная | Тип | Описание |
|---|---|---|
| Все user_data переменные | any | Доступны напрямую по имени (`rates_text`, `user_amount`, etc.) |
| `user_id` | int | Telegram ID пользователя |
| `user_data` | dict | Полный словарь переменных пользователя |
| `bot_tables` | dict | Данные таблиц проекта (read-only) |

### Запись переменных

Любое присваивание переменной автоматически сохраняется в `user_data`:

```python
# Эти переменные будут доступны в следующих узлах
result = 42
formatted_text = f"Итого: {result} ₽"
my_list = [1, 2, 3]
```

---

## Безопасность

### Текущий MVP (self-hosted)

Песочницы нет. Код крутится в процессе бота проекта, с той же сессией юзербота, что визуальные userbot-узлы. Не для мультитенантного SaaS без изоляции воркеров.

Таймаут 180 секунд. Ошибка логируется, автопереход не рвётся.

### Уровень позже — Docker per Worker (SaaS)

Когда конструктор станет мультитенантным:
- Каждый проект в отдельном контейнере
- Ресурсные лимиты memory/cpu
- RestrictedPython как дополнительный слой — опционально, не текущий путь

---

## Генерация Python-кода

Канонический шаблон: `lib/templates/code/code.py.jinja2`.

- Исходник — JSON-строка (`tojson`), не `indent` в файл бота.
- Обёртка `async def __code_entry():` + `textwrap.indent`.
- `await asyncio.wait_for(..., timeout=180)` на event loop (не `to_thread`).
- `client` = `userbot_client`, lock вокруг выполнения.
- Diff локалов → `set_user_var`.

## UI

Сейчас textarea в `CodeConfiguration`. Monaco / автокомплит / кнопка «Тест» — позже.

## Таймаут

180 секунд, константа. Внутренние таймауты на отдельного бота — в скрипте пользователя.

## Сравнение с конкурентами

| Платформа | Code node | Изоляция | Модули |
|---|---|---|---|
| **Salebot** | «Калькулятор» | Whitelist | Ограниченный набор |
| **n8n** | JS/Python | AST + Task Runner | Полный runtime |
| **Наш конструктор** | Python + Telethon | Процесс воркера (self-hosted) | Полный Python, сессия юзербота |

---

## Этапы реализации

### Этап 1 — MVP (сделано)

- [x] Шаблон `code.py.jinja2` — исходник строкой, `async def __code_entry`, Telethon `client`
- [x] Schema + params (`code`, `autoTransitionTo`)
- [x] Renderer + диспетчер + `hasUserbotNodes` включает `code`
- [x] UI — textarea
- [x] Таймаут `asyncio.wait_for` 180 сек

### Этап 2 — UI улучшения

- [ ] Monaco Editor
- [ ] Автокомплит переменных
- [ ] Кнопка «Тест»
- [ ] Поле таймаута в UI

### Этап 3 — Docker isolation (SaaS)

- [ ] Контейнер на воркер, лимиты CPU/RAM

---

## Примеры использования

### Форматирование числа с разделителями

```python
amount = float(user_amount)
formatted_amount = f"{amount:,.0f}".replace(',', ' ')
# 10000 → "10 000"
```

### Фильтрация и сортировка массива

```python
import json
items = json.loads(items_json) if isinstance(items_json, str) else items_json
items = [i for i in items if float(i.get('price', 0)) > 0]
items.sort(key=lambda x: float(x['price']), reverse=True)
items_json = json.dumps(items, ensure_ascii=False)
```

### Генерация текста из массива

```python
lines = []
for i, item in enumerate(exchangers_list):
    emoji = '🏆' if i == 0 else '🔸'
    lines.append(f"{emoji} {item['name']}: <b>{item['rate']}</b>")
rates_text = '\n'.join(lines)
```

### Работа с датами

```python
from datetime import datetime, timedelta
now = datetime.now()
expires = now + timedelta(hours=24)
expires_text = expires.strftime('%d.%m.%Y %H:%M')
```

### Хеширование (верификация webhook)

```python
import hashlib
expected = hashlib.sha256(f"{secret}:{user_id}".encode()).hexdigest()
is_valid = "true" if expected == received_hash else "false"
```
