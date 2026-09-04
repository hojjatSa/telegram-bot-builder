# Golnoor Telegram Bot Builder — Production Runbook

This fork is deployed from the `golnoor` branch. Do not deploy `main` to Golnoor production.

## Required Coolify environment

```env
NODE_ENV=production
IMAGE_TAG=golnoor
APP_PULL_POLICY=always
TELEGRAM_API_BASE_URL=https://sadrabt.golnoorstore.ir
TELEGRAM_JWKS_URL=https://sadrabt.golnoorstore.ir/oauth/jwks
TELEGRAM_PROXY_URL=
USE_WORKER_POOL=true
```

`SESSION_SECRET` and `ADMIN_API_KEY` must be strong unique production secrets. Never commit them.

## Deployment

1. Push only to `golnoor`.
2. Wait for both GitHub checks to pass:
   - `Fork compatibility guard`
   - `Build Golnoor image`
3. Coolify redeploys/pulls `ghcr.io/hojjatsa/telegram-bot-builder:golnoor`.
4. After deploy, run inside the app container:

```bash
node /app/scripts/golnoor-production-smoke.mjs
```

A production deploy is accepted only when the smoke test ends with:

```text
Production smoke test PASSED.
```

If the smoke test reports a stale generated bot, open that bot in the Builder and use **Save & Restart**, then rerun the smoke test.

## Runtime health

The app container healthcheck uses:

```text
http://127.0.0.1:5000/api/health
```

It checks application/database readiness without tying container health to an external Telegram outage. The Telegram gateway and JWKS relay are checked separately by the smoke test and admin diagnostics.

Gateway endpoints:

```text
https://sadrabt.golnoorstore.ir/health
https://sadrabt.golnoorstore.ir/oauth/jwks
```

The JWKS endpoint is public by design. It contains Telegram public signing keys, not secrets.

## Rollback

Every `golnoor` build publishes an immutable image tag:

```text
ghcr.io/hojjatsa/telegram-bot-builder:sha-<full-git-sha>
```

If a deployment fails:

1. In Coolify set `IMAGE_TAG=sha-<known-good-full-git-sha>`.
2. Redeploy.
3. Run the production smoke test.
4. After the issue is fixed, return `IMAGE_TAG=golnoor` and redeploy.

Do not reset or force-push `main` as part of production rollback.

## Backups

Production data is not only the container image.

Back up all of the following:

- PostgreSQL database (`postgres_data`) — contains projects, settings and application data.
- `./uploads` — user/media files when local storage is enabled.
- `./bots` — generated runtime bot files.
- Coolify environment/secrets should be stored separately in a secure password/secrets manager.

Recommended baseline: daily PostgreSQL backup, at least 7 daily restore points, plus a periodic off-server copy. Test restoration, not only backup creation.

The current compose uses bind mounts for `./uploads` and `./bots`. Do not switch these to new named volumes without first copying existing data, otherwise the application may appear to lose files after deployment.

## Redis compatibility

The runtime uses Redis server 7 and keeps `redis-py` on the 7.x line. This avoids the `CLIENT MAINT_NOTIFICATIONS` noise introduced by newer redis-py behavior against Redis 7 while preserving the existing FSM/lock behavior.

## Security baseline

- Keep Bot Builder admin access restricted to trusted administrators.
- Keep `ADMIN_API_KEY`, session secret, bot tokens and database passwords out of Git.
- Keep HTTPS enabled through Coolify/Traefik.
- Do not expose PostgreSQL or Redis ports publicly.
- Keep the Telegram gateway limited to Telegram-related routes only.
- Treat generated bot code as privileged code because the worker executes it inside the application container.

## Fast incident checks

Application:

```bash
docker ps --filter name=bot-builder-app
docker logs --tail 200 bot-builder-app
```

Inside the app container:

```bash
printenv TELEGRAM_API_BASE_URL
node /app/scripts/golnoor-production-smoke.mjs
```

A healthy Golnoor production environment should show the configured gateway, healthy app/JWKS/gateway checks, and gateway-aware generated bot files.
