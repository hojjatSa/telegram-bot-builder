/**
 * @fileoverview Панель свойств узла триггера исходящего сообщения
 *
 * Минималистичная панель с информацией о триггере и выбором следующего узла.
 * @module properties/components/trigger/OutgoingMessageTriggerConfiguration
 */

import type { Node } from '@shared/schema';
import { TriggerTargetSelector } from './TriggerTargetSelector';
import { formatNodeDisplay as defaultFormatNodeDisplay } from '../../utils/node-formatters';

/** Пропсы компонента OutgoingMessageTriggerConfiguration */
interface OutgoingMessageTriggerConfigurationProps {
  /** Выбранный узел */
  selectedNode: Node;
  /** Функция обновления данных узла */
  onNodeUpdate: (nodeId: string, updates: Partial<any>) => void;
  /** Все узлы из всех листов */
  getAllNodesFromAllSheets?: Array<{ node: Node; sheetId?: string; sheetName?: string }>;
  /** Форматирование названия узла */
  formatNodeDisplay?: (node: Node, sheetName?: string) => string;
}

/**
 * Панель свойств триггера исходящего сообщения
 * @param props - Пропсы компонента
 * @returns JSX элемент панели свойств
 */
export function OutgoingMessageTriggerConfiguration({
  selectedNode,
  onNodeUpdate,
  getAllNodesFromAllSheets = [],
  formatNodeDisplay = defaultFormatNodeDisplay,
}: OutgoingMessageTriggerConfigurationProps) {
  return (
    <div className="space-y-4 p-4">
      <div className="rounded-xl bg-purple-50/60 dark:bg-purple-900/20 border border-purple-200/50 dark:border-purple-700/40 p-4 space-y-2">
        <div className="flex items-center gap-2">
          <i className="fas fa-paper-plane text-purple-600 dark:text-purple-400 text-sm" />
          <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
            Outgoing Message Trigger
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Fires when the bot sends a message to the user.
          Works in parallel with the main thread - does not interrupt it.
          Variable available <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">{'{message_text}'}</code> — text of the sent message.
        </p>
      </div>

      <TriggerTargetSelector
        selectedNode={selectedNode}
        autoTransitionTo={selectedNode.data?.autoTransitionTo || ''}
        getAllNodesFromAllSheets={getAllNodesFromAllSheets}
        onNodeUpdate={onNodeUpdate}
        formatNodeDisplay={formatNodeDisplay}
      />
    </div>
  );
}
