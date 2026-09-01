# api_response

Завершает HTTP-запрос, инициированный `api_trigger`.

## Параметры entry

| Поле | Тип | Описание |
|------|-----|----------|
| `statusCode` | number | HTTP-статус |
| `body` | string | Тело (поддерживает `{переменные}`) |
| `contentType` | string | Content-Type ответа |

## Runtime

Устанавливает результат в `_api_pending_responses` для текущего `request_id`.
