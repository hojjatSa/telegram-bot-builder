/**
 * @fileoverview Определение ноды произвольного Python-кода для палитры
 * @module components/editor/sidebar/massive/logic/code-node
 */

import { ComponentDefinition } from '@shared/schema';

/** Определение ноды Python-кода */
export const codeNode: ComponentDefinition = {
  id: 'code-node',
  name: '💻 Python-код',
  description: 'Произвольный Python: переменные пользователя доступны по имени',
  icon: 'fas fa-code',
  color: 'bg-indigo-100 text-indigo-600',
  type: 'code',
  defaultData: {
    /** Python-код пользователя */
    code: '',
    /** ID следующего узла для автоперехода */
    autoTransitionTo: '',
    /** Включить автопереход */
    enableAutoTransition: false,
  },
};
