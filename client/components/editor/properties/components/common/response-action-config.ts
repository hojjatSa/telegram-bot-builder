/**
 * @fileoverview Конфигурация действий для кнопок ответов
 * @description Содержит типы действий и их конфигурацию.
 */

/** Тип действия кнопки */
export type ResponseAction = 'goto' | 'command' | 'url' | 'selection';

/** Опция действия */
export interface ActionOption {
  /** Значение действия */
  value: ResponseAction;
  /** Текст отображения */
  label: string;
  /** Иконка */
  icon: string;
  /** Цвет иконки */
  iconColor: string;
}

/** Доступные действия */
export const ACTION_OPTIONS: ActionOption[] = [
  {
    value: 'goto',
    label: "Go to screen",
    icon: 'fa-arrow-right',
    iconColor: 'text-blue-500'
  },
  {
    value: 'command',
    label: "Run command",
    icon: 'fa-terminal',
    iconColor: 'text-purple-500'
  },
  {
    value: 'url',
    label: "Open link",
    icon: 'fa-external-link-alt',
    iconColor: 'text-green-500'
  },
  {
    value: 'selection',
    label: "Selecting an option",
    icon: 'fa-check-square',
    iconColor: 'text-purple-500'
  }
];
