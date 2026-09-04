/**
 * @fileoverview Конфигурация логики для условных сообщений
 * @description Содержит опции логических операторов (AND/OR).
 */

/** Логический оператор */
export type LogicOperator = 'AND' | 'OR';

/** Опция оператора */
export interface LogicOperatorOption {
  /** Значение */
  value: LogicOperator;
  /** Текст отображения */
  label: string;
  /** Описание */
  description: string;
  /** Символ */
  symbol: string;
  /** Цвет символа */
  symbolColor: string;
}

/** Доступные логические операторы */
export const LOGIC_OPERATORS: LogicOperatorOption[] = [
  {
    value: 'AND',
    label: "AND (AND) - ALL questions must be completed",
    description: "The user must answer ALL selected questions",
    symbol: '∧',
    symbolColor: 'text-green-600'
  },
  {
    value: 'OR',
    label: "OR (OR) - ANY of the questions are suitable",
    description: "The user can answer ANY of the selected questions",
    symbol: '∨',
    symbolColor: 'text-blue-600'
  }
];
