/**
 * @fileoverview Определение компонента блокировки пользователя
 * Забанить участника группы
 */
import { ComponentDefinition } from "@shared/schema";

/** Блокировка пользователя (бан) */
export const banUser: ComponentDefinition = {
  id: 'ban-user',
  name: 'Ban User',
  description: "Ban a group member",
  icon: 'fas fa-ban',
  color: 'bg-red-100 text-red-600',
  type: 'ban_user',
  defaultData: {
    command: '/ban_user',
    targetUserId: '',
    userIdSource: 'last_message',
    userVariableName: '',
    reason: 'Violation of group rules',
    untilDate: 0
  }
};
