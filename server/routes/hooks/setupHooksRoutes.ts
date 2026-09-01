/**
 * @fileoverview Прокси HTTP hooks на Python aiohttp бота
 * @module server/routes/hooks/setupHooksRoutes
 */

import type { Express, Request, Response } from 'express';
import { getBotWebhookPort } from '../setupWebhookRoutes';
import { storage } from '../../storages/storage';
import { consumeHooksRateLimit } from './hooksRateLimit';

/** Максимальный размер тела запроса (1 MB) */
const MAX_BODY_BYTES = 1_048_576;

/** Заголовки, которые не проксируем и не логируем */
const SENSITIVE_HEADERS = new Set(['x-api-secret', 'authorization', 'cookie']);

/**
 * Собирает безопасные заголовки для проксирования в Python
 * @param req - Входящий запрос Express
 * @returns Заголовки без secret
 */
function buildForwardHeaders(req: Request): Record<string, string> {
  const headers: Record<string, string> = {};
  for (const [key, value] of Object.entries(req.headers)) {
    if (!value || SENSITIVE_HEADERS.has(key.toLowerCase())) continue;
    headers[key] = Array.isArray(value) ? value.join(', ') : value;
  }
  return headers;
}

/**
 * Регистрирует публичные роуты `/api/hooks/:projectId/*`
 * @param app - Экземпляр Express
 */
export function setupHooksRoutes(app: Express): void {
  app.use('/api/hooks/:projectId', async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.projectId, 10);
    if (Number.isNaN(projectId)) {
      res.status(400).json({ error: 'invalid_project' });
      return;
    }

    const apiPath = (req.url.split('?')[0] || '/').trim() || '/';
    const rateKey = `${projectId}:${apiPath}`;
    if (!consumeHooksRateLimit(rateKey)) {
      res.status(429).json({ error: 'rate_limit' });
      return;
    }

    const instance = await storage.getBotInstance(projectId);
    if (!instance || instance.status !== 'running' || !instance.tokenId) {
      res.status(503).json({ error: 'bot_offline' });
      return;
    }

    const tokenId = instance.tokenId;
    const botPort = getBotWebhookPort(tokenId);
    const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    const targetUrl = `http://127.0.0.1:${botPort}${apiPath}${query}`;

    const forwardHeaders = buildForwardHeaders(req);
    if (req.headers['x-api-secret']) {
      forwardHeaders['X-Api-Secret'] = String(req.headers['x-api-secret']);
    }
    if (req.headers.authorization) {
      forwardHeaders.Authorization = String(req.headers.authorization);
    }

    const method = req.method.toUpperCase();
    const hasBody = !['GET', 'HEAD'].includes(method);

    try {
      let body: string | undefined;
      if (hasBody) {
        const raw = typeof req.body === 'string'
          ? req.body
          : JSON.stringify(req.body ?? {});
        if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) {
          res.status(413).json({ error: 'payload_too_large' });
          return;
        }
        body = raw;
        if (!forwardHeaders['Content-Type'] && !forwardHeaders['content-type']) {
          forwardHeaders['Content-Type'] = 'application/json';
        }
      }

      const started = Date.now();
      const response = await fetch(targetUrl, {
        method,
        headers: forwardHeaders,
        body: hasBody ? body : undefined,
        signal: AbortSignal.timeout(35_000),
      });

      const responseText = await response.text();
      const duration = Date.now() - started;
      console.log(
        `[Hooks] project=${projectId} path=${apiPath} method=${method} status=${response.status} duration=${duration}ms`
      );

      res.status(response.status);
      const contentType = response.headers.get('content-type');
      if (contentType) {
        res.setHeader('Content-Type', contentType);
      }
      res.send(responseText);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'unknown';
      console.error(
        `[Hooks] Ошибка проксирования project=${projectId} path=${apiPath} port=${botPort}: ${message}`
      );
      res.status(502).json({ error: 'proxy_error' });
    }
  });
}
