/**
 * @fileoverview Блок выбора режима входа на сайте
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
 * Пропсы компонента LoginModeField
 */
interface LoginModeFieldProps {
  /** Управление формой react-hook-form */
  control: Control<AdminSettingsSchemaValues>;
}

/**
 * Переключатели dev-login и Telegram Login Widget
 * @param props - Свойства компонента
 * @returns JSX элемент выбора режима входа
 */
export function LoginModeField({ control }: LoginModeFieldProps) {
  return (
    <FormField
      control={control}
      name="loginMode"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Режим входа на сайте</FormLabel>
          <FormControl>
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="grid gap-3"
            >
              <label className="flex gap-3 rounded-lg border border-border/60 p-3 cursor-pointer hover:bg-muted/40">
                <RadioGroupItem value="dev_login" className="mt-0.5" />
                <span className="text-sm leading-relaxed">
                  <strong className="block text-foreground">Dev-login</strong>
                  Ввод Telegram ID на странице входа. Для локальной работы без BotFather.
                </span>
              </label>
              <label className="flex gap-3 rounded-lg border border-border/60 p-3 cursor-pointer hover:bg-muted/40">
                <RadioGroupItem value="telegram_widget" className="mt-0.5" />
                <span className="text-sm leading-relaxed">
                  <strong className="block text-foreground">Telegram Login Widget</strong>
                  Кнопка «Войти через Telegram». Нужно перед деплоем и ссылкой для других людей.
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
