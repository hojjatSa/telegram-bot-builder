/**
 * @fileoverview Список того, что пропадёт при удалении бота из проекта.
 * @module bot/delete-bot-impact
 */

/** Строка последствий удаления */
export interface DeleteBotImpactItem {
  /** Что затронется */
  label: string;
}

/**
 * Собирает пункты подтверждения удаления бота.
 * @param opts - Запущен ли процесс и число пользователей
 * @returns Список для диалога
 */
export function listDeleteBotImpact(opts: {
  isRunning: boolean;
  userCount?: number;
}): DeleteBotImpactItem[] {
  const items: DeleteBotImpactItem[] = [{ label: "Bot token and card" }];
  if (opts.isRunning) items.push({ label: "Running process" });
  items.push(
    { label: "Dialogues and correspondence of this bot" },
    { label: "Analytics of this bot" },
    { label: "Launch history and logs" },
    { label: "Environment Variables" },
    { label: "Groups of this bot" },
    { label: "File_id bindings in Telegram" },
  );
  const users = opts.userCount;
  if (typeof users === 'number' && users > 0) {
    items.push({
      label: `Пользователи этого бота · ${users.toLocaleString('ru-RU')}`,
    });
  }
  return items;
}
