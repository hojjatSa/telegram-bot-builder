import type { Express } from 'express';
import { registerTelegramGatewayDiagnostics } from './telegram-gateway/register';
import { registerGolnoorAccessControlRoutes } from './access-control/register';

/**
 * Central registry for fork-only server extensions.
 * Keep upstream integration limited to a single mount call from server/admin/setup-admin-routes.ts.
 */
export function registerForkExtensions(app: Express): void {
  registerTelegramGatewayDiagnostics(app);
  registerGolnoorAccessControlRoutes(app);
}
