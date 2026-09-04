/**
 * @fileoverview Определение компонента триггера входящего callback_query
 * @module components/editor/sidebar/massive/triggers/incoming-callback-trigger
 */

import { ComponentDefinition } from "@shared/schema";

/** Триггер входящего callback_query — срабатывает на каждое нажатие инлайн-кнопки */
export const incomingCallbackTrigger: ComponentDefinition = {
  id: 'incoming-callback-trigger',
  name: 'Button Click Trigger',
  description: "Fires every time an inline button is pressed by the user. Runs in parallel with the main thread.",
  icon: 'fas fa-hand-pointer',
  color: 'bg-orange-100 text-orange-600',
  type: 'incoming_callback_trigger' as any,
  defaultData: {
    autoTransitionTo: '',
  },
};
