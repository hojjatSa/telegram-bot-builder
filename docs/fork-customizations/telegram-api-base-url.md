# Telegram Bot API base URL override

This fork supports an optional reverse gateway for Telegram Bot API traffic without changing the upstream default behavior.

## Configuration

Set the following environment variable on the application service:

```env
TELEGRAM_API_BASE_URL=https://sadrabt.golnoorstore.ir
```

When the variable is absent or empty, the application uses Telegram's official endpoint:

```text
https://api.telegram.org
```

`TELEGRAM_API_BASE_URL` is a reverse-gateway base URL, not an HTTP/SOCKS proxy. It is independent from `TELEGRAM_PROXY_URL`.

## Required gateway routes

The gateway must preserve Telegram Bot API paths and proxy them to `https://api.telegram.org`:

```text
/bot<TOKEN>/<METHOD>
/file/bot<TOKEN>/<FILE_PATH>
```

For example:

```text
https://sadrabt.golnoorstore.ir/bot<TOKEN>/getMe
https://sadrabt.golnoorstore.ir/file/bot<TOKEN>/photos/file.jpg
```

## Compatibility design

The customization is intentionally isolated from upstream code:

- Node-side Telegram requests are rewritten centrally in `server/utils/telegram-proxy.ts` through `server/utils/telegram-api-base.ts`.
- Generated aiogram bots receive an optional session extension from `lib/templates/config/telegram-api-session.py.jinja2`.
- The original `config.py.jinja2` template remains unchanged.
- When the environment variable is not configured, upstream Telegram behavior is preserved.
- Tests cover default fallback, URL rewriting, Bot API paths and Telegram file paths.

This layout minimizes merge conflicts when syncing future releases from `fedorabakumets/telegram-bot-builder`.
