/**
 * @fileoverview Пресеты раскладок клавиатуры
 * @module components/editor/properties/utils/keyboard-presets
 */

import { KeyboardPreset } from '../types/keyboard-layout';

/** Список доступных пресетов раскладок */
export const KEYBOARD_PRESETS: KeyboardPreset[] = [
  { name: 'Одна колонка', columns: 1, description: "Vertical list" },
  { name: 'Две колонки', columns: 2, description: "Standard mesh" },
  { name: 'Три колонки', columns: 3, description: "Compact view" },
  { name: 'Четыре колонки', columns: 4, description: "As compact as possible" },
];

/**
 * Получает пресет по количеству колонок
 * @param columns - Количество колонок
 * @returns Пресет или undefined
 */
export function getPresetByColumns(columns: number): KeyboardPreset | undefined {
  return KEYBOARD_PRESETS.find(preset => preset.columns === columns);
}
