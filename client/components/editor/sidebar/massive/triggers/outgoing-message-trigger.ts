/**
 * @fileoverview Определение компонента триггера исходящего сообщения
 * @module components/editor/sidebar/massive/triggers/outgoing-message-trigger
 */

import { ComponentDefinition } from "@shared/schema";

/** Триггер исходящего сообщения — срабатывает когда бот отправляет сообщение */
export const outgoingMessageTrigger: ComponentDefinition = {
  id: 'outgoing-message-trigger',
  name: 'Outgoing Message Trigger',
  description: "Fires when the bot sends a message to the user. Runs in parallel with the main thread.",
  icon: 'fas fa-paper-plane',
  color: 'bg-purple-100 text-purple-600',
  type: 'outgoing_message_trigger' as any,
  defaultData: {
    autoTransitionTo: '',
  },
};
