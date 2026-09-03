/**
 * @fileoverview Функция рендеринга шаблона конфигурации
 * @module templates/config/config.renderer
 */

import type { ConfigTemplateParams } from './config.params';
import { configParamsSchema } from './config.schema';
import { renderPartialTemplate } from '../template-renderer';

const BOT_INIT_MARKER = 'bot = Bot(token=BOT_TOKEN)';

/**
 * Генерация Python конфигурации с валидацией параметров
 * @param params - Параметры конфигурации
 * @returns Сгенерированный Python код конфигурации
 *
 * @example
 * ```typescript
 * const code = generateConfig({
 *   userDatabaseEnabled: true,
 *   projectId: 123,
 * });
 * ```
 */
export function generateConfig(params: ConfigTemplateParams): string {
  const validated = configParamsSchema.parse({
    ...params,
    userDatabaseEnabled: params.userDatabaseEnabled ?? false,
    projectId: params.projectId ?? null,
    protectContent: params.protectContent ?? false,
  });

  const config = renderPartialTemplate('config/config.py.jinja2', validated);
  if (!config.includes(BOT_INIT_MARKER)) {
    throw new Error('Bot initialization marker not found in config template');
  }

  const telegramApiSession = renderPartialTemplate(
    'config/telegram-api-session.py.jinja2',
    validated,
  ).trim();

  return config.replace(BOT_INIT_MARKER, telegramApiSession);
}
