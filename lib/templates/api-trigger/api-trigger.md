# api_trigger

Генерирует HTTP-обработчики aiohttp для входящих запросов внешних систем.

## Параметры entry

| Поле | Тип | Описание |
|------|-----|----------|
| `method` | GET/POST/PUT/PATCH/DELETE | HTTP-метод |
| `path` | string | Путь на Python-порту (например `/payment`) |
| `secretToken` | string | Secret для `X-Api-Secret` / `Authorization: Bearer` |
| `saveBodyTo` | string | Переменная для тела запроса |
| `targetNodeId` | string | Старт цепочки сценария |

## Runtime

- Проверка secret → `401 invalid_secret`
- Таймаут ожидания `api_response` — 30 с → `504`
- Без `api_response` — `200 {"ok":true}`
