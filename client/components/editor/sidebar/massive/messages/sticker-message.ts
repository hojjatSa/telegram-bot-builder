/**
 * @fileoverview Определение компонента стикера
 * Анимированный стикер
 */
import { ComponentDefinition } from "@shared/schema";

/** Сообщение со стикером */
export const stickerMessage: ComponentDefinition = {
  id: 'sticker-message',
  name: 'Sticker',
  description: "Animated sticker",
  icon: 'fas fa-laugh',
  color: 'bg-pink-100 text-pink-600',
  type: 'sticker',
  defaultData: {
    messageText: 'Sticker',
    stickerUrl: '',
    stickerFileId: '',
    markdown: false,
    oneTimeKeyboard: false,
    resizeKeyboard: true
  }
};
