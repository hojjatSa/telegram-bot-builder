/**
 * @fileoverview Определение компонента разблокировки пользователя
 * Снять бан с участника группы
 */
import { ComponentDefinition } from "@shared/schema";

/** Разблокировка пользователя (снятие бана) */
export const unbanUser: ComponentDefinition = {
  id: 'unban-user',
  name: 'Unban User',
  description: "Remove a ban from a group member",
  icon: 'fas fa-user-check',
  color: 'bg-green-100 text-green-600',
  type: 'unban_user',
  defaultData: {
    command: '/unban_user',
    targetUserId: '',
    userIdSource: 'last_message',
    userVariableName: ''
  }
};
