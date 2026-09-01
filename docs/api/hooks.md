# hooks

Эндпоинты: **5 методов** на один catch-all путь

### `GET|POST|PUT|PATCH|DELETE` /api/hooks/{projectId}/{path}

Публичный HTTP hook для внешних интеграций (платёжки, CRM, backend).

**Авторизация:** Secret в заголовке `X-Api-Secret` или `Authorization: Bearer {secret}` (проверка в Python).

**Публичный URL (UI):** `{API_BASE_URL}/api/hooks/{projectId}{apiPath}`

**Поток:**
1. Внешний сервис → Node `/api/hooks/{projectId}/payment`
2. Node находит running bot по `projectId` → `tokenId` → порт `9000 + tokenId`
3. Прокси на `http://localhost:{port}{apiPath}`
4. Python `api_trigger` → цепочка → `api_response`

**Офлайн бот:** `503 {"error":"bot_offline"}`

**Rate limit:** 60 req/min на `(projectId, path)` (Node)

**Лимит body:** 1 MB

**Коды ошибок:**

| Код | Тело | Причина |
|-----|------|---------|
| 401 | `{"error":"invalid_secret"}` | Неверный secret |
| 413 | `{"error":"payload_too_large"}` | Body > 1 MB |
| 429 | `{"error":"rate_limit"}` | Превышен лимит |
| 503 | `{"error":"bot_offline"}` | Бот не запущен |
| 504 | `{"error":"timeout"}` | Нет `api_response` за 30 с |

#### Пример (curl)

```bash
curl -X POST "https://example.com/api/hooks/42/payment" \
  -H "Content-Type: application/json" \
  -H "X-Api-Secret: your-secret" \
  -d '{"order_id":"123","amount":100}'
```

#### Debug (локально, прямо на Python)

```bash
curl -X POST "http://localhost:9042/payment" \
  -H "X-Api-Secret: your-secret" \
  -d '{"order_id":"123"}'
```

(порт `9000 + tokenId`, только при запущенном боте)
