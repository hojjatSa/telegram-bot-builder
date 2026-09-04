/**
 * @fileoverview Определение компонента нажатия inline-кнопки через Telethon userbot
 */
import { ComponentDefinition } from "@shared/schema";

/** Нажатие inline-кнопки через юзербот (Telethon) */
export const userbotClickButton: ComponentDefinition = {
  id: 'userbot-click-button',
  name: 'Click Button (Userbot)',
  description: "Press the inline button in a message via Telethon",
  icon: 'fas fa-hand-pointer',
  color: 'bg-violet-100 text-violet-600',
  type: 'userbot_click_button' as any,
  defaultData: {
    userbotEntity: '',
    messageId: '',
    messageIdSource: 'last',
    clickMode: 'text',
    clickDelivery: 'fire_and_forget',
    clickValue: '',
    saveAlertTo: '',
    saveResultTo: '',
    saveButtonsTo: '',
    saveHasMediaTo: '',
    saveMediaTo: '',
    autoTransitionTo: '',
  }
};
