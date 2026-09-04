/**
 * @fileoverview Пресет команды /settings — настройки бота
 * @module components/editor/sidebar/massive/commands/settings-command
 */
import type { CommandPreset } from './command-preset.types';

/** Пресет команды /settings — создаёт command_trigger + message на холсте */
export const settingsCommand: CommandPreset = {
  id: 'settings-command',
  name: '/settings',
  description: "Bot settings",
  icon: 'fas fa-cog',
  color: 'bg-gray-100 text-gray-600',
  type: 'command_preset',
  triggerData: {
    command: '/settings',
    description: 'Settings',
    showInMenu: true,
  },
  messageData: {
    text: '⚙️ Настройки',
    buttons: [
      { text: '🔔 Уведомления' },
      { text: '🌐 Язык' },
    ],
  },
};
