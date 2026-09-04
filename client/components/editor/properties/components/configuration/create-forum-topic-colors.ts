/**
 * @fileoverview Константы цветов иконок топиков Telegram и вспомогательные функции
 * @module components/editor/properties/components/configuration/create-forum-topic-colors
 */

import { TopicIconColor } from './create-forum-topic-types';

/** Список доступных цветов иконок топиков Telegram */
export const TOPIC_ICON_COLORS: { value: TopicIconColor; label: string }[] = [
  { value: '7322096',  label: "🔵 Blue" },
  { value: '16766590', label: "🟡 Yellow" },
  { value: '13338331', label: "🟣 Purple" },
  { value: '9367192',  label: "🟢 Green" },
  { value: '16749490', label: "🟠Orange" },
  { value: '16478047', label: "🔴 Red" },
];

/**
 * Возвращает метку цвета по его значению
 * @param value - числовое значение цвета
 * @returns метка цвета или само значение, если цвет не найден
 */
export function getTopicColorLabel(value: string): string {
  return TOPIC_ICON_COLORS.find((c) => c.value === value)?.label ?? value;
}
