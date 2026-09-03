# Telegram Gateway diagnostics

This fork adds an admin-only diagnostic card for the optional `TELEGRAM_API_BASE_URL` integration.

## Location

Open the Admin Overview. The **Telegram Gateway** card shows the effective Bot API base URL and provides a **Run gateway test** action.

## What the test verifies

The diagnostic runs on the application server, not in the browser.

It checks:

1. `TELEGRAM_API_BASE_URL` is configured as a custom endpoint.
2. `<TELEGRAM_API_BASE_URL>/health` is reachable from the application server.
3. A Bot API `getMe` probe sent by the application's normal Telegram HTTP helper reaches Telegram through the configured gateway.

The Bot API probe deliberately uses an invalid synthetic token. Telegram's structured error response is used as proof that the request reached Telegram. No real bot token is required, returned to the browser, or written to diagnostic output.

## Upgrade-safe layout

Fork-only code lives under:

```text
server/fork/
client/fork/
```

Only two upstream integration points are intentionally touched:

```text
server/admin/setup-admin-routes.ts
client/components/admin/pages/admin-overview.tsx
```

The server mounts all fork functionality through `registerForkExtensions(app)`. The client mounts all fork Overview UI through `ForkAdminOverviewExtensions`.

Future fork-only features should be added behind these registries instead of modifying more upstream files.

## CI protection

`.github/workflows/fork-telegram-api-base.yml` acts as the fork compatibility guard. It runs focused Telegram integration tests, loads the server fork registry, and builds the client whenever fork integration points change.

This does not make merge conflicts impossible, but it keeps the customization surface small and makes incompatible upstream changes fail visibly in CI.
