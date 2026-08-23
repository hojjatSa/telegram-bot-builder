/**
 * @fileoverview Поля настроек Telegram OIDC
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

/**
 * Пропсы компонента TelegramFields
 */
interface TelegramFieldsProps {
  /** Управление формой react-hook-form */
  control: Control<AdminSettingsSchemaValues>;
  /** Client Secret уже сохранён на сервере */
  clientSecretConfigured: boolean;
  /** Bot Token уже сохранён на сервере */
  botTokenConfigured: boolean;
  /** Выбран режим Telegram Widget */
  widgetMode: boolean;
}

/**
 * Поля Client ID, Secret, username и token бота
 * @param props - Свойства компонента
 * @returns JSX блок полей Telegram
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
        <h3 className="text-base font-semibold">Данные Telegram (для виджета)</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {widgetMode
            ? 'Обязательно: Client ID, Secret и username из BotFather.'
            : 'Не обязательно при dev-login. Заполните перед переключением на Telegram Widget.'}
        </p>
      </div>

      <FormField
        control={control}
        name="clientId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Client ID {widgetMode && '(обязательно)'}</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Числовой Client ID из BotFather → Web Login" />
            </FormControl>
            <FormDescription>
              Скопируйте из @BotFather → Login Widget → OpenID (см. инструкцию справа).
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
              Client Secret {widgetMode && !clientSecretConfigured && '(обязательно при первой настройке)'}
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                type="password"
                autoComplete="new-password"
                placeholder={
                  clientSecretConfigured
                    ? 'Задан — оставьте пустым, чтобы не менять'
                    : 'Из BotFather → Web Login (не bot token!)'
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
            <FormLabel>Bot Username (опционально)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="my_bot — без @, или из Bot Token" />
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
            <FormLabel>Bot Token (опционально)</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="password"
                autoComplete="new-password"
                placeholder={
                  botTokenConfigured
                    ? 'Задан — оставьте пустым, чтобы не менять'
                    : 'Опционально — Mini App в Telegram, не для виджета'
                }
              />
            </FormControl>
            <FormDescription>
              Не путать с Client Secret. Для Mini App (initData) и username. Виджет в браузере — без токена.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
