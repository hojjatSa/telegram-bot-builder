import type { Express } from 'express';
import { requireAdminAuth } from '../../admin/admin-auth-middleware';
import {
  getTelegramGatewayStatus,
  runTelegramGatewayDiagnostic,
} from './diagnostics';

export function registerTelegramGatewayDiagnostics(app: Express): void {
  app.get(
    '/admin/api/fork/telegram-gateway/status',
    requireAdminAuth,
    (_req, res) => {
      res.setHeader('Cache-Control', 'no-store');
      res.json(getTelegramGatewayStatus());
    },
  );

  app.post(
    '/admin/api/fork/telegram-gateway/test',
    requireAdminAuth,
    async (_req, res) => {
      res.setHeader('Cache-Control', 'no-store');
      try {
        res.json(await runTelegramGatewayDiagnostic());
      } catch (error) {
        console.error(
          '[Fork/TelegramGateway] diagnostic failed:',
          error instanceof Error ? error.message : error,
        );
        res.status(500).json({
          ok: false,
          error: 'TELEGRAM_GATEWAY_DIAGNOSTIC_FAILED',
        });
      }
    },
  );
}
