/**
 * @fileoverview Панель свойств узла "Delete Message"
 * @module properties/components/action/DeleteMessageConfiguration
 */
import { useMemo } from 'react';
import type { Node } from '@shared/schema';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VariableSelector } from '../variables/variable-selector';
import { extractVariables } from '../../utils/variables-utils';
import type { Variable } from '@/components/editor/inline-rich/types';

/** Пропсы компонента DeleteMessageConfiguration */
interface DeleteMessageConfigurationProps {
  /** Выбранный узел */
  selectedNode: Node;
  /** Функция обновления данных узла */
  onNodeUpdate: (nodeId: string, updates: Partial<any>) => void;
  /** Все узлы из всех листов (для извлечения переменных) */
  getAllNodesFromAllSheets?: Array<{ node: Node; sheetId?: string; sheetName?: string }>;
}

/**
 * Панель свойств узла удаления сообщения.
 * Позволяет выбрать источник message_id, chat_id и настроить массовое удаление.
 *
 * @param props - Свойства компонента
 * @returns JSX элемент
 */
export function DeleteMessageConfiguration({
  selectedNode,
  onNodeUpdate,
  getAllNodesFromAllSheets = [],
}: DeleteMessageConfigurationProps) {
  const data = selectedNode.data as any;

  /** Извлекаем переменные из всех узлов проекта */
  const textVariables = useMemo((): Variable[] => {
    const nodes = getAllNodesFromAllSheets.map((n) => n.node);
    const { textVariables: vars } = extractVariables(nodes);
    return vars as Variable[];
  }, [getAllNodesFromAllSheets]);

  /**
   * Обновляет поле данных узла
   * @param field - Имя поля
   * @param value - Новое значение
   */
  const update = (field: string, value: any) =>
    onNodeUpdate(selectedNode.id, { [field]: value });

  const messageIdSource = data.messageIdSource ?? 'current_message';
  const chatIdSource = data.chatIdSource ?? 'current_chat';
  const bulkDelete = data.bulkDelete ?? false;

  return (
    <div className="space-y-4 p-4">

      {/* Ограничения Telegram */}
      <div className="bg-gradient-to-br from-yellow-50/50 to-amber-50/30 dark:from-yellow-950/20 dark:to-amber-950/10 border border-yellow-200/30 dark:border-yellow-800/30 rounded-lg p-3">
        <div className="text-xs text-yellow-700 dark:text-yellow-300 leading-relaxed">
          <i className="fas fa-exclamation-triangle mr-1"></i>
          <span className="font-medium">Telegram limitations:</span> The bot can delete other people's messages in groups (administrator rights are required) and in personal chats (up to 48 hours). Messages older than 48 hours cannot be deleted. In channels - without time restrictions.
        </div>
      </div>

      {/* Секция: Источник сообщения */}
      <div className="bg-gradient-to-br from-red-50/50 to-orange-50/30 dark:from-red-950/20 dark:to-orange-950/10 border border-red-200/30 dark:border-red-800/30 rounded-lg p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
            <i className="fas fa-trash text-red-600 dark:text-red-400 text-xs"></i>
          </div>
          <Label className="text-sm font-semibold text-red-900 dark:text-red-100">Which message to delete</Label>
        </div>

        <Select
          value={messageIdSource}
          onValueChange={(v) => update('messageIdSource', v)}
        >
          <SelectTrigger className="bg-card/70 border border-red-200/50 dark:border-red-800/50">
            <SelectValue placeholder={"Select message source"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current_message">User's current message</SelectItem>
            <SelectItem value="last_bot_message">Last bot message</SelectItem>
            <SelectItem value="reply_message">Message from reply (reply)</SelectItem>
            <SelectItem value="range_from_reply">From reply to current (blizzard)</SelectItem>
            <SelectItem value="last_n">Last N messages</SelectItem>
            <SelectItem value="custom">Specify ID</SelectItem>
          </SelectContent>
        </Select>

        {/* Подсказка по выбранному режиму */}
        {messageIdSource === 'current_message' && (
          <div className="text-xs text-red-600/70 dark:text-red-400/70 leading-relaxed">
            Will delete the message that caused the trigger (user message).
          </div>
        )}
        {messageIdSource === 'last_bot_message' && (
          <div className="text-xs text-red-600/70 dark:text-red-400/70 leading-relaxed">
            Will delete the last message sent by the bot to this user (for example, the previous menu).
          </div>
        )}
        {messageIdSource === 'reply_message' && (
          <div className="text-xs text-red-600/70 dark:text-red-400/70 leading-relaxed">
            Will delete a message to which the user has replied (reply). If there is no reply, it will be missed.
          </div>
        )}
        {messageIdSource === 'range_from_reply' && (
          <div className="text-xs text-red-600/70 dark:text-red-400/70 leading-relaxed">
            Will delete all messages from the marked one (reply) to the current one inclusive. An analogue of the “!blizzard” command.
          </div>
        )}

        {/* Режим last_n — количество */}
        {messageIdSource === 'last_n' && (
          <div className="space-y-2">
            <Label className="text-xs font-medium text-red-700 dark:text-red-300">
              Number of messages
            </Label>
            <div className="flex gap-2">
              <Input
                value={data.lastNCount ?? ''}
                onChange={(e) => update('lastNCount', e.target.value)}
                placeholder={"50 or {count}"}
                className="bg-white/60 dark:bg-slate-950/60 border-red-200/50 dark:border-red-800/50 flex-1"
              />
              <VariableSelector
                availableVariables={textVariables}
                onSelect={(name) => update('lastNCount', `{${name}}`)}
              />
            </div>
            <div className="text-xs text-red-600/70 dark:text-red-400/70 leading-relaxed">
              Will delete N messages back from the current one by ID range. Gaps in numbering (remote/service) will be ignored.
            </div>
          </div>
        )}

        {/* Режим custom — указать ID вручную или через переменную */}
        {messageIdSource === 'custom' && (
          <div className="space-y-2">
            <Label className="text-xs font-medium text-red-700 dark:text-red-300">
              Message ID or variable
            </Label>
            <div className="flex gap-2">
              <Input
                value={data.messageIdManual ?? ''}
                onChange={(e) => update('messageIdManual', e.target.value)}
                placeholder={"123456789 or {message_id}"}
                className="bg-white/60 dark:bg-slate-950/60 border-red-200/50 dark:border-red-800/50 flex-1"
              />
              <VariableSelector
                availableVariables={textVariables}
                onSelect={(name) => update('messageIdManual', `{${name}}`)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Секция: Чат */}
      <div className="bg-gradient-to-br from-slate-50/50 to-slate-100/30 dark:from-slate-950/20 dark:to-slate-900/10 border border-slate-200/30 dark:border-slate-800/30 rounded-lg p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <i className="fas fa-comments text-slate-600 dark:text-slate-400 text-xs"></i>
          </div>
          <Label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Chat</Label>
        </div>

        <Select
          value={chatIdSource}
          onValueChange={(v) => update('chatIdSource', v)}
        >
          <SelectTrigger className="bg-card/70">
            <SelectValue placeholder={"Select chat source"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current_chat">Current chat</SelectItem>
            <SelectItem value="custom">Specify ID</SelectItem>
          </SelectContent>
        </Select>

        {chatIdSource === 'custom' && (
          <div className="space-y-2">
            <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Chat ID or variable
            </Label>
            <div className="flex gap-2">
              <Input
                value={data.chatIdManual ?? ''}
                onChange={(e) => update('chatIdManual', e.target.value)}
                placeholder={"-1001234567890 or {chat_id}"}
                className="bg-white/60 dark:bg-slate-950/60 flex-1"
              />
              <VariableSelector
                availableVariables={textVariables}
                onSelect={(name) => update('chatIdManual', `{${name}}`)}
              />
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Can be prefixed with -100 (<span className="font-mono">-1001234567890</span>) or without (<span className="font-mono">1234567890</span>) — the bot will substitute automatically.
            </div>
          </div>
        )}
      </div>

      {/* Секция: Массовое удаление */}
      <div className="bg-gradient-to-br from-amber-50/50 to-yellow-50/30 dark:from-amber-950/20 dark:to-yellow-950/10 border border-amber-200/30 dark:border-amber-800/30 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
              <i className="fas fa-layer-group text-amber-600 dark:text-amber-400 text-xs"></i>
            </div>
            <Label className="text-sm font-semibold text-amber-900 dark:text-amber-100">Mass deletion</Label>
          </div>
          <Switch
            checked={bulkDelete}
            onCheckedChange={(checked) => update('bulkDelete', checked)}
          />
        </div>

        {bulkDelete && (
          <div className="space-y-2">
            <Label className="text-xs font-medium text-amber-700 dark:text-amber-300">
              Variable with an array of message IDs
            </Label>
            <div className="flex gap-2">
              <Input
                value={data.bulkMessageIdsVariable ?? ''}
                onChange={(e) => update('bulkMessageIdsVariable', e.target.value)}
                placeholder="message_ids"
                className="bg-white/60 dark:bg-slate-950/60 border-amber-200/50 dark:border-amber-800/50 flex-1"
              />
              <VariableSelector
                availableVariables={textVariables}
                onSelect={(name) => update('bulkMessageIdsVariable', name)}
              />
            </div>
            <div className="text-xs text-amber-600/70 dark:text-amber-400/70 leading-relaxed">
              The variable must contain a JSON array of IDs. Telegram deletes up to 100 in one call, more - it is automatically divided into batches.
            </div>
          </div>
        )}
      </div>

      {/* Секция: Настройки */}
      <div className="bg-gradient-to-br from-green-50/50 to-emerald-50/30 dark:from-green-950/20 dark:to-emerald-950/10 border border-green-200/30 dark:border-green-800/30 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-semibold text-green-900 dark:text-green-100">Ignore errors</Label>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">
              Do not abort the script if the message is already deleted or not found
            </div>
          </div>
          <Switch
            checked={data.ignoreErrors ?? true}
            onCheckedChange={(checked) => update('ignoreErrors', checked)}
          />
        </div>
      </div>
    </div>
  );
}
