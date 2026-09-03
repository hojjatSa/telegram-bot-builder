/**
 * @fileoverview Login mode selector for the site
 * @module components/admin/settings/login-mode-field
 */

import type { Control } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { AdminSettingsSchemaValues } from './settings-schema';

/**
 * LoginModeField component props.
 */
interface LoginModeFieldProps {
  /** react-hook-form control */
  control: Control<AdminSettingsSchemaValues>;
}

/**
 * Dev-login and Telegram Login Widget selector.
 * @param props - Component properties
 * @returns Login mode selector JSX
 */
export function LoginModeField({ control }: LoginModeFieldProps) {
  return (
    <FormField
      control={control}
      name="loginMode"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Site login mode</FormLabel>
          <FormControl>
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="grid gap-3"
            >
              <label className="flex gap-3 rounded-lg border border-border/60 p-3 cursor-pointer hover:bg-muted/40">
                <RadioGroupItem value="dev_login" className="mt-0.5" />
                <span className="text-sm leading-relaxed">
                  <strong className="block text-foreground">Dev login</strong>
                  Enter a Telegram ID on the login page. Useful for local development without BotFather.
                </span>
              </label>
              <label className="flex gap-3 rounded-lg border border-border/60 p-3 cursor-pointer hover:bg-muted/40">
                <RadioGroupItem value="telegram_widget" className="mt-0.5" />
                <span className="text-sm leading-relaxed">
                  <strong className="block text-foreground">Telegram Login Widget</strong>
                  Adds a “Log in with Telegram” button. Use this before production deployment or sharing access with other users.
                </span>
              </label>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
