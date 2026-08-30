# Входящий API бота (`api_trigger` + `api_response`) — Roadmap

Документ описывает планируемую фичу: **пользовательские HTTP-эндпоинты на холсте конструктора**. Внешние системы (сайт, платёжка, CRM, другой сервис, скрипт) могут вызвать URL бота, запустить сценарий и получить структурированный ответ — без отдельного бэкенда и без ручного кода.

Приоритет: 🔴 высокий → 🟡 средний → 🟢 низкий.

Связанные документы:

- [Будущие ноды: `api_trigger` / `api_response`](../futures/nodes/future-nodes.md)
- [Системный API бота (скрытые эндпоинты)](../futures/infrastructure/bot-system-api.md)
- [Telegram webhook (Node.js)](../api/webhook.md)
- [Нода `http_request`](../features/NODE_TYPES.md) — исходящие запросы (зеркальная операция)

---

## Идея одной фразой

**`http_request` = бот спрашивает мир. `api_trigger` = мир спрашивает бота. `api_response` = бот отвечает миру.**

Сейчас бот реагирует на Telegram (команды, кнопки, расписание) и сам ходит наружу через `http_request`. Нет ноды для **входящего HTTP** от пользовательских интеграций.

---

## Терминология

| Название в UI | Тип ноды | Роль |
|---------------|----------|------|
| **API триггер** | `api_trigger` | Точка входа: принять HTTP-запрос, распарсить в переменные, запустить цепочку |
| **Ответ API** | `api_response` | Завершить HTTP-запрос: статус, JSON/text body |

> Ранее в черновиках встречалось имя `webhook_trigger` — в коде и схеме проекта фиксируем **`api_trigger`**.

---

## Чем это НЕ является

| Сущность | Отличие |
|----------|---------|
| **`http_request`** | Исходящий запрос из бота наружу |
| **Telegram webhook** (`POST /api/webhook/{projectId}/{tokenId}`) | Только апдейты Telegram → Node.js → Python |
| **Системный API бота** (`/api/send-message`, `/api/broadcast`…) | Скрытые эндпоинты для Node.js, не на холсте |
| **MCP / Agent API** | Редактирование проекта, не runtime сценария |

Пользовательские эндпоинты и системные — **один HTTP-сервер в боте**, разные роуты и авторизация. См. [bot-system-api.md](../futures/infrastructure/bot-system-api.md).

---

## Уже есть в платформе ✅

- Нода **`http_request`** — исходящие HTTP-запросы, парсинг JSON в переменные
- **`schedule_trigger`** — вход по времени (без внешнего HTTP)
- **`set_variable`** с `json_get`, dot-notation в переменных
- **`condition`**, **`bot_table`**, **`psql_query`** — обработка данных в цепочке
- В [future-nodes.md](../futures/nodes/future-nodes.md) — черновое описание полей `api_trigger` и `api_response`
- В [bot-system-api.md](../futures/infrastructure/bot-system-api.md) — архитектура `aiohttp` в polling/webhook режимах

## Ещё не реализовано ❌

- Типы нод `api_trigger`, `api_response` в палитре конструктора
- Генерация роутов и handler'ов в `bot.py`
- Публичный URL для пользовательских эндпоинтов (прокси с Node.js или прямой доступ)
- UI настройки: путь, метод, secret, маппинг body → переменные
- MCP: `list_node_types`, `get_node_schema`, валидация, примеры
- Документация для пользователя + тесты генератора

---

## Зачем это нужно (кейсы)

### Интеграции без кода

```
Платёжка → POST /payment/confirmed → бот пишет юзеру + обновляет таблицу
Сайт (форма) → POST /lead/new → бот шлёт заявку в админ-чат
Мониторинг → POST /alert → бот уведомляет команду
CRM / Google Sheets → POST /status-changed → бот сообщает клиенту
Другой бот → POST /handoff → бот принимает событие
CI/CD → POST /deploy/done → бот пишет в тех-чат
```

### Паттерн использования

```
api_trigger (POST /event)
  → condition (проверка secret / полей)
    → set_variable (разобрать body)
      → message / bot_table / http_request
        → api_response (200 + JSON)
```

### Health-check без Telegram

```
api_trigger (GET /health)
  → api_response (200, { "ok": true, "uptime": ... })
```

---

## Архитектура

### Текущая схема (упрощённо)

```
Telegram ──► Node /api/webhook/... ──► Python bot (сценарий)
Внешний сервис ──► ??? (нет пользовательского входа)
Бот ──► http_request ──► внешний API
```

### Целевая схема

```
Внешний сервис
  → POST https://{platform}/hooks/{projectId}/{route}
      → Node.js (auth, rate limit, лог)
          → Python bot :BOT_API_PORT /{route}
              → handle_api_trigger_{nodeId}()
                  → цепочка нод
                      → api_response → HTTP ответ клиенту
```

**Polling и webhook (Telegram):** в обоих режимах бот поднимает `aiohttp` для пользовательских роутов (как в [bot-system-api.md](../futures/infrastructure/bot-system-api.md)).

### Два типа роутов на одном app

```python
# Системные (скрытые, X-Bot-Secret)
app.router.add_post("/api/send-message", handle_system_send_message)

# Пользовательские (с холста, secret из ноды)
app.router.add_post("/payment", handle_api_trigger_node_abc)
app.router.add_get("/health", handle_api_trigger_node_xyz)
```

---

## Ноды: поля и поведение

### `api_trigger`

**UI:** «API триггер»

| Поле | Тип | Описание |
|------|-----|----------|
| `apiMethod` | enum | `GET`, `POST`, `PUT`, `PATCH`, `DELETE` |
| `apiPath` | string | Путь, напр. `/payment`, `/notify` (уникален в проекте) |
| `apiSecretToken` | string | Secret для заголовка `Authorization: Bearer` или `X-Api-Secret` |
| `apiSaveBodyTo` | string | Переменная для тела (JSON object / text) |
| `apiSaveQueryTo` | string | Переменная для query-параметров (опционально) |
| `apiSaveHeadersTo` | string | Переменная для заголовков (опционально) |
| `apiParseJson` | boolean | Автопарсинг JSON body (default: true для POST) |
| `autoTransitionTo` | nodeId | Следующая нода после успешного приёма |

**Поведение runtime:**

1. Совпадение method + path
2. Проверка secret (если задан)
3. Запись body/query/headers в переменные (глобальные или контекст API-запроса)
4. Запуск цепочки с `autoTransitionTo`
5. Ожидание `api_response` или таймаут → дефолтный ответ

**Ограничения MVP:**

- Один активный `api_trigger` на уникальный `(method, path)` в проекте
- Path без пробелов; валидация при сохранении проекта

---

### `api_response`

**UI:** «Ответ API»

| Поле | Тип | Описание |
|------|-----|----------|
| `apiResponseStatusCode` | number | `200`, `400`, `401`, `403`, `404`, `500`… |
| `apiResponseBody` | string | Тело с `{переменными}` |
| `apiResponseContentType` | enum | `application/json`, `text/plain`, `text/html` |
| `apiResponseHeaders` | key-value[] | Доп. заголовки (опционально) |

**Поведение:**

- Завершает текущий HTTP-запрос, инициированный `api_trigger`
- Если в ветке нет `api_response` — дефолт: `200` + `{"ok":true}` (настраиваемо)
- После ответа цепочка может продолжиться (фоновые действия) или остановиться — **решение MVP:** ответ отправляется сразу, дальнейшие ноды выполняются асинхронно только если явно включён режим «ответить и продолжить» (фаза C)

---

## Публичный URL

### Вариант A (рекомендуется для production): прокси через Node.js

```
https://app.example.com/api/hooks/{projectId}/{tokenSlug}/{path}
```

- TLS, логирование, rate limit на Node
- Прокси на `localhost:{BOT_API_PORT}` работающего бота
- В UI показывать готовый URL + кнопка «Скопировать»

### Вариант B: прямой порт бота

Только dev / self-hosted. На Railway порт бота снаружи обычно недоступен.

### UI в редакторе

На ноде `api_trigger`:

- Полный URL (read-only)
- Метод + path
- Secret (generate / regenerate)
- Пример `curl` для теста

---

## Безопасность 🔴

| Мера | MVP | Позже |
|------|-----|-------|
| Secret token в header | ✅ | — |
| HTTPS только на production | ✅ | — |
| Rate limit per path | ✅ базовый | per IP + per project |
| Валидация path (no `..`, reserved `/api/`) | ✅ | — |
| IP allowlist | — | 🟡 |
| HMAC подпись body (Stripe-style) | — | 🟡 |
| Idempotency-Key | — | 🟢 |

Зарезервированные префиксы путей: `/api/` (системные), `/webhook/` (Telegram proxy).

---

## Примеры сценариев на холсте

### 1. Колбэк оплаты

```
api_trigger  POST /payment/confirmed  →  body → payment
  → condition  payment.status == "paid"
      → yes → bot_table (upsert order) → message (user) → api_response 200 {"ok":true}
      → else → api_response 400 {"error":"invalid_status"}
```

### 2. Заявка с сайта

```
api_trigger  POST /lead  →  lead
  → message (админ-чат: новая заявка)
  → api_response 200 {"ticket_id": "{lead_id}"}
```

### 3. Синхронизация каталога (админка → бот)

```
api_trigger  POST /catalog/sync  →  event
  → condition  event.type == "project_published"
      → message (админ-чат)
  → api_response 200 {"received": true}
```

### 4. Проверка связи

```
api_trigger  GET /health
  → api_response 200 {"ok": true, "project": "{project_name}"}
```

---

## Фазы реализации

### Фаза A — Схема и генератор 🔴

- Типы в `shared/schema/tables/node-schema.ts`
- Палитра конструктора + иконки + панель свойств
- `validate_bot_project`: уникальность path, зарезервированные префиксы
- Jinja2: регистрация роутов в `aiohttp` при старте бота
- Handler: парсинг → переменные → `autoTransitionTo`
- Базовый `api_response` handler
- Unit-тесты генератора (как `test-phase28-schedule-trigger.ts`)

**Критерий:** локальный `curl POST http://localhost:8081/test` запускает цепочку и возвращает JSON.

### Фаза B — Прокси и UI 🔴

- `POST/GET .../api/hooks/{projectId}/...` на Node.js
- Discovery: порт бота из `bot_instances` / Redis
- Панель ноды: URL, curl, secret generate
- Логи входящих API-запросов (вкладка «Логи» или отдельный фильтр)
- MCP: schema, example, `list_node_types`

**Критерий:** пользователь создаёт ноду в браузере, копирует URL, внешний POST доходит до сценария.

### Фаза C — Надёжность 🟡

- Таймаут ожидания ответа (напр. 30 с) → `504` или дефолтный body
- Режимы: «ответить и завершить» vs «ответить и продолжить в фоне»
- Повторная доставка: документировать идемпотентность для платёжек
- Ошибки: если цепочка упала → `api_response` 500 с `{ "error": "..." }` (без утечки stack trace)

### Фаза D — Расширения 🟢

- Несколько `api_response` в ветках (первый wins)
- CORS для browser-форм (осторожно с secret)
- OpenAPI-экспорт эндпоинтов проекта
- Шаблоны: «Платёж», «Форма», «Health»
- История запросов / replay в UI

---

## Связь с `http_request`

| | `http_request` | `api_trigger` |
|--|----------------|---------------|
| Направление | Бот → наружу | Наружу → бот |
| Кто инициатор | Сценарий | Внешняя система |
| Типичная пара | → `set_variable` | → `api_response` |
| Пример | Курс с API обменника | Колбэк «оплата прошла» |

Частый комбинированный сценарий:

```
api_trigger → bot_table → http_request (уведомить CRM) → api_response
```

---

## Что не делать

- ❌ Путать с Telegram webhook и документировать как одно и то же
- ❌ Давать пользователям пути под `/api/` — конфликт с системным API
- ❌ Хранить secret в открытом виде в логах
- ❌ Блокировать цепочку на 60+ секунд без ответа — внешние системы отвалятся по timeout
- ❌ Дублировать `POST /api/execute-node` из системного API без явной разницы в UX (`api_trigger` = визуальный сценарий; execute-node = внутренний вызов Node)

---

## MCP и агент

После фазы B обновить:

- `list_node_types` — `api_trigger`, `api_response`
- `get_node_schema` / `get_node_example`
- `get_prompt_guide` / `bot-json-prompt.md` — правила path, пары нод
- Примеры в MCP для типовых интеграций

---

## Метрики успеха

1. Пользователь подключает платёжный колбэк **без Python-кода**
2. Время от «создал ноду» до рабочего `curl` — **< 5 минут**
3. Документированные лимиты: timeout, max body size
4. Не менее **3** e2e-тестов: success, 403, invalid body

---

## Приоритет в общем роадмапе нод

```
1. api_trigger   — разблокирует внешние интеграции
2. api_response  — пара, без неё api_trigger неполноценен
```

См. порядок в [future-nodes.md](../futures/nodes/future-nodes.md).

---

## Открытые вопросы

1. **Контекст выполнения:** API-запрос без `userId` — глобальные переменные или отдельный `api_context`?
2. **Несколько токенов бота в проекте:** один hook URL на проект или на token?
3. **Офлайн бот:** Node возвращает `503` или ставит в очередь?

---

*Зафиксировано: 2026-08-28 — пользовательские HTTP-эндпоинты на холсте (`api_trigger` + `api_response`), отдельно от системного API и Telegram webhook.*
