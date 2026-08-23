/**
 * @fileoverview Правила проверки формы настроек приложения
 * @module components/admin/settings/settings-schema
 */

import { z } from 'zod';

/** Схема проверки полей настроек панели управления */
export const adminSettingsSchema = z
  .object({
    /** Режим входа на сайте */
    loginMode: z.enum(['dev_login', 'telegram_widget']),
    /** Client ID Telegram OIDC */
    clientId: z.string(),
    /** Client Secret (пустое — не менять) */
    clientSecret: z.string(),
    /** Username бота без @ */
    botUsername: z.string(),
    /** Bot Token (пустой — не менять) */
    botToken: z.string(),
  })
  .superRefine((values, ctx) => {
    if (values.loginMode !== 'telegram_widget') return;

    if (!values.clientId.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Client ID обязателен для Telegram Login Widget',
        path: ['clientId'],
      });
    }
  });

/** Тип значений формы настроек */
export type AdminSettingsSchemaValues = z.infer<typeof adminSettingsSchema>;
