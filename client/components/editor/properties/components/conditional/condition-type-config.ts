/**
 * @fileoverview Конфигурация типов условий для условных сообщений
 */

export type ConditionType = 'user_data_exists' | 'user_data_not_exists' | 'user_data_equals' | 'user_data_contains';

export interface ConditionOption {
  value: ConditionType;
  label: string;
  symbol: string;
  symbolColor: string;
}

export const CONDITION_TYPES: ConditionOption[] = [
  {
    value: 'user_data_exists',
    label: "The user has already answered",
    symbol: '✓',
    symbolColor: 'text-green-600'
  },
  {
    value: 'user_data_not_exists',
    label: "The user did not respond",
    symbol: '✕',
    symbolColor: 'text-red-600'
  },
  {
    value: 'user_data_equals',
    label: "The answer is equal to the value",
    symbol: '=',
    symbolColor: 'text-blue-600'
  },
  {
    value: 'user_data_contains',
    label: "The answer contains text",
    symbol: '⊃',
    symbolColor: 'text-orange-600'
  }
];
