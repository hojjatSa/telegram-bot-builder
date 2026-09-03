/**
 * @fileoverview Telegram OIDC settings fields
 * @module components/admin/settings/telegram-fields
 */

import type { Control } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { AdminSettingsSchemaValues } from './settings-schema';

interface TelegramFieldsProps {
  /** react-hook-form control */
  control: Control<AdminSettingsSchemaValues>;
  /** Client Secret is already stored on the server */
  clientSecretConfigured: boolean;
  /** Bot Token is already stored on the server */
  botTokenConfigured: boolean;
  /** Telegram Widget mode is selected */
  widgetMode: boolean;
}

/**
 * Client ID, Client Secret, bot username and bot token fields.
 */
export function TelegramFields({
  control,
  clientSecretConfigured,
  botTokenConfigured,
  widgetMode,
}: TelegramFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold">Telegram credentials</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {widgetMode
            ? 'Required: Client ID, Client Secret and bot username from BotFather.'
            : 'Optional for dev login. Fill these in before switching to Telegram Login Widget.'}
        </p>
      </div>

      <FormField
        control={control}
        name="clientId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Client ID {widgetMode && '(required)'}</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Numeric Client ID from BotFather → Web Login" />
            </FormControl>
            <FormDescription>
              Copy it from @BotFather → Login Widget → OpenID. See the instructions on the right.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="clientSecret"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Client Secret {widgetMode && !clientSecretConfigured && '(required for initial setup)'}
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                type="password"
                autoComplete="new-password"
                placeholder={
                  clientSecretConfigured
                    ? 'Configured — leave blank to keep the current value'
                    : 'From BotFather → Web Login (not the bot token)'
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="botUsername"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bot Username (optional)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="my_bot — without @, or derived from Bot Token" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="botToken"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bot Token (optional)</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="password"
                autoComplete="new-password"
                placeholder={
                  botTokenConfigured
                    ? 'Configured — leave blank to keep the current value'
                    : 'Optional — used for Telegram Mini App, not browser login'
                }
              />
            </FormControl>
            <FormDescription>
              This is different from Client Secret. It is used for Telegram Mini App initData and bot username lookup. Browser login does not require it.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
