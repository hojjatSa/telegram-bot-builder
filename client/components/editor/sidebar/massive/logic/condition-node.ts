/**
 * @fileoverview Определение узла условия для сайдбара редактора
 *
 * Узел `condition` — ветвление потока (аналог IF/Switch).
 * Проверяет переменную и направляет поток по одной из веток.
 *
 * @module components/editor/sidebar/massive/logic/condition-node
 */

import { ComponentDefinition } from '@shared/schema';

/**
 * Определение компонента узла условия для сайдбара
 */
export const conditionNode: ComponentDefinition = {
  id: 'condition-node',
  name: 'Condition',
  description: "Branching a thread based on the value of a variable",
  icon: 'fas fa-code-branch',
  color: 'bg-violet-100 text-violet-600',
  type: 'condition',
  defaultData: {
    /** Переменная для проверки */
    variable: '',
    /** Ветки условия */
    branches: [
      { id: 'branch_filled', label: "Yes, filled", operator: 'filled', value: '' },
      { id: 'else', label: "No", operator: 'else', value: '' },
    ],
  },
};
