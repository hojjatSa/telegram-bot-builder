/**
 * @fileoverview Компонент узла рассылки для конструктора ботов
 * Определяет конфигурацию узла для отправки сообщений всем пользователям
 */

import { ComponentDefinition } from '@shared/schema';

/**
 * Определение компонента рассылки
 * Используется для drag-and-drop и добавления на холст
 */
export const broadcastNode: ComponentDefinition = {
  id: 'broadcast',
  name: 'Broadcast',
  description: "Sending a message to all users in the database",
  icon: 'fas fa-bullhorn',
  color: 'bg-purple-100 text-purple-600',
  type: 'broadcast',
  defaultData: {
    keyboardType: 'none',
    buttons: [],
    markdown: false,
    oneTimeKeyboard: false,
    resizeKeyboard: true,
    // Настройки рассылки
    broadcastVariable: 'user_id',
    broadcastTarget: 'all_users',
    enableConfirmation: true,
    confirmationText: 'Отправить рассылку всем пользователям?',
    successMessage: "✅ Newsletter sent!",
    errorMessage: "❌ Mailing error"
  }
};
