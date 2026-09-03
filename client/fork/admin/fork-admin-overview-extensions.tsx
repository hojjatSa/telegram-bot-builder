import { TelegramGatewayDiagnosticsCard } from '../telegram-gateway/telegram-gateway-diagnostics-card';

/**
 * Fork-only widgets mounted into the upstream Admin Overview.
 * Keep all custom admin UI behind this single integration point.
 */
export function ForkAdminOverviewExtensions() {
  return <TelegramGatewayDiagnosticsCard />;
}
