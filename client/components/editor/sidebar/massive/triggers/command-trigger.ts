/**
 * @fileoverview Определение компонента триггера команды
 *
 * Каждый узел command_trigger — это ОДНА команда/точка входа.
 * Для нескольких команд используйте несколько узлов на холсте.
 * Синонимы не поддерживаются — заменяются отдельными узлами.
 * @module components/editor/sidebar/massive/triggers/command-trigger
 */

import { ComponentDefinition } from "@shared/schema";

/** Триггер команды — точка входа без контента */
export const commandTrigger: ComponentDefinition = {
  id: 'command-trigger',
  name: 'Command Trigger',
  description: "A command without content is the entry point into the scenario",
  icon: 'fas fa-bolt',
  color: 'bg-yellow-100 text-yellow-600',
  type: 'command_trigger',
  defaultData: {
    /** Команда триггера, например "/start" */
    command: '/start',
    /** Описание команды для BotFather */
    description: "Launch bot",
    /** Показывать команду в меню бота */
    showInMenu: true,
  }
};
