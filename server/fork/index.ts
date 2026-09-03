import type { Express } from 'express';
import { registerTelegramGatewayDiagnostics } from './telegram-gateway/register';

/**
 * Central registry for fork-only server extensions.
 * Keep upstream integration limited to a single mount call from server/index.ts.
 */
export function registerForkExtensions(app: Express): void {
  registerTelegramGatewayDiagnostics(app);
}
