/**
 * @fileoverview Определение компонента текстового сообщения
 * Обычный текст или Markdown
 */
import { ComponentDefinition } from "@shared/schema";

/** Текстовое сообщение с поддержкой Markdown */
export const textMessage: ComponentDefinition = {
  id: 'text-message',
  name: 'Text Message',
  description: "Plain text or Markdown",
  icon: 'fas fa-comment',
  color: 'bg-blue-100 text-blue-600',
  type: 'message',
  defaultData: {
    messageText: 'New message',
    markdown: false
  }
};
