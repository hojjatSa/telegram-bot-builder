/**
 * @fileoverview Пресет команды /help — справка по боту
 * @module components/editor/sidebar/massive/commands/help-command
 */
import type { CommandPreset } from './command-preset.types';

/** Пресет команды /help — создаёт command_trigger + message на холсте */
export const helpCommand: CommandPreset = {
  id: 'help-command',
  name: '/help',
  description: "Bot Help",
  icon: 'fas fa-question-circle',
  color: 'bg-blue-100 text-blue-600',
  type: 'command_preset',
  triggerData: {
    command: '/help',
    description: "Bot Help",
    showInMenu: true,
  },
  messageData: {
    text: '❓ Справка\n\nДоступные команды:\n/start — Запустить бота\n/help — Эта справка',
  },
};
