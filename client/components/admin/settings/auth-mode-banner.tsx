/**
 * @fileoverview Current login mode banner on the settings page
 * @module components/admin/settings/auth-mode-banner
 */

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { AdminAppSettings } from '../types';

interface AuthModeBannerProps {
  settings: AdminAppSettings;
}

export function AuthModeBanner({ settings }: AuthModeBannerProps) {
  const { loginMode } = settings.auth;

  if (loginMode === 'dev_login') {
    return (
      <Alert>
        <AlertTitle>Current mode: Dev login</AlertTitle>
        <AlertDescription>
          Users sign in by entering a Telegram ID. BotFather credentials are not required. Before production deployment or sharing access with other users, switch to Telegram Login Widget below and configure the bot credentials.
        </AlertDescription>
      </Alert>
    );
  }

  if (settings.configured) {
    return (
      <Alert className="border-green-500/40 bg-green-500/10">
        <AlertTitle>Current mode: Telegram Login Widget</AlertTitle>
        <AlertDescription>Users sign in through the Telegram button on the website.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-amber-500/40 bg-amber-500/10">
      <AlertTitle>Telegram Login needs configuration</AlertTitle>
      <AlertDescription>
        Fill in the BotFather credentials below, or switch back to Dev login for local development without the widget.
      </AlertDescription>
    </Alert>
  );
}
