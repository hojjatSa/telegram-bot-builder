/**
 * @fileoverview Конфигурация действий для кнопок условных сообщений
 */

export type ConditionalButtonAction = 'goto' | 'url' | 'command' | 'selection';

export interface ConditionalActionOption {
  value: ConditionalButtonAction;
  label: string;
}

export const CONDITIONAL_BUTTON_ACTIONS: ConditionalActionOption[] = [
  { value: 'goto', label: "Go to node" },
  { value: 'url', label: "Open link" },
  { value: 'command', label: "Run command" },
  { value: 'selection', label: "Selecting an option" }
];
