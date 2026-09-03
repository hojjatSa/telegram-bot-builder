/**
 * @fileoverview Определение компонента голосового сообщения
 * Голосовое сообщение
 */
import { ComponentDefinition } from "@shared/schema";

/** Голосовое сообщение с длительностью */
export const voiceMessage: ComponentDefinition = {
  id: 'voice-message',
  name: 'Voice Message',
  description: 'Voice Message',
  icon: 'fas fa-microphone',
  color: 'bg-teal-100 text-teal-600',
  type: 'voice',
  defaultData: {
    messageText: 'Voice Message',
    voiceUrl: '',
    duration: 0,
    markdown: false,
    oneTimeKeyboard: false,
    resizeKeyboard: true
  }
};
