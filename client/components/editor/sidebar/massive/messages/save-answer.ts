/**
 * @fileoverview Описание ноды сохранения ответа в переменную.
 * Отдельная фронтенд-обвязка для узла input.
 */
import { ComponentDefinition } from "@shared/schema";

/** Нода сохранения ответа пользователя в переменную */
export const saveAnswerNode: ComponentDefinition = {
  id: 'save-answer-node',
  name: 'Save answer to variable',
  description: "Saves the user's response to the selected variable",
  icon: 'fas fa-edit',
  color: 'bg-cyan-100 text-cyan-600',
  type: 'input',
  defaultData: {
    inputType: 'any',
    inputVariable: '',
    inputTargetNodeId: '',
    appendVariable: false,
    saveToDatabase: false,
    inputPrompt: 'Enter a response',
    inputRequired: true,
  }
};
