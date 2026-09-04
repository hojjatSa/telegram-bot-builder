/**
 * @fileoverview Варианты UI для срока хранения сообщений
 * @module bot/card/messages-retention-options
 */

import {
  MESSAGES_RETENTION_DAYS_VALUES,
  type MessagesRetentionDays,
} from '@shared/messages-retention';

/** Подписи селекта «Хранить сообщения» */
export const RETENTION_OPTIONS: Array<{ value: MessagesRetentionDays; label: string }> = [
  { value: 0, label: "Unlimited" },
  { value: 7, label: "7 days" },
  { value: 30, label: "30 days" },
  { value: 60, label: "60 days" },
  { value: 90, label: "90 days" },
  { value: 180, label: "180 days" },
  { value: 365, label: "365 days" },
];

/**
 * Нормализует значение к допустимому сроку
 * @param value - Сырое значение из токена
 * @returns Допустимое значение из whitelist
 */
export function normalizeRetentionDays(value: number | null): MessagesRetentionDays {
  const n = value ?? 0;
  return (MESSAGES_RETENTION_DAYS_VALUES as readonly number[]).includes(n)
    ? (n as MessagesRetentionDays)
    : 0;
}
