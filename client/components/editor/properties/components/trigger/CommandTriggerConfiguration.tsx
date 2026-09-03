/**
 * @fileoverview Панель свойств узла триггера команды
 *
 * Позволяет редактировать команду, описание и флаги доступа
 * для узла типа command_trigger в панели свойств редактора.
 * Каждый узел — одна команда. Для нескольких команд
 * используйте несколько узлов на холсте.
 *
 * Флаги доступа:
 * - `adminOnly` — команда доступна только администраторам бота
 *   (генерирует проверку is_admin в Python-коде).
 * - `requiresAuth` — команда доступна только пользователям,
 *   которые уже запускали бота через /start (проверка check_auth).
 *
 * Поле «Следующий узел» задаёт `autoTransitionTo` — ID узла,
 * к которому будет нарисовано жёлтое соединение на холсте.
 * @module components/editor/properties/components/trigger/CommandTriggerConfiguration
 */

import type { Node } from '@shared/schema';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { TriggerTargetSelector } from './TriggerTargetSelector';
import { DeepLinkSection } from './DeepLinkSection';
import { formatNodeDisplay as defaultFormatNodeDisplay } from '../../utils/node-formatters';

interface CommandTriggerConfigurationProps {
  selectedNode: Node;
  onNodeUpdate: (nodeId: string, updates: Partial<any>) => void;
  getAllNodesFromAllSheets?: Array<{ node: Node; sheetId?: string; sheetName?: string }>;
  formatNodeDisplay?: (node: Node, sheetName?: string) => string;
}

export function CommandTriggerConfiguration({
  selectedNode,
  onNodeUpdate,
  getAllNodesFromAllSheets,
  formatNodeDisplay = defaultFormatNodeDisplay,
}: CommandTriggerConfigurationProps) {
  const isStartCommand = selectedNode.data?.command === '/start';

  function handleDeepLinkChange(updates: Record<string, unknown>) {
    onNodeUpdate(selectedNode.id, updates);
  }

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Label>Command</Label>
        <Input
          value={selectedNode.data?.command || ''}
          onChange={e => onNodeUpdate(selectedNode.id, { command: e.target.value })}
          placeholder="/start"
          className="font-mono"
        />
      </div>

      <div className="space-y-2">
        <Label>Description (for BotFather)</Label>
        <Input
          value={selectedNode.data?.description || ''}
          onChange={e => onNodeUpdate(selectedNode.id, { description: e.target.value })}
          placeholder="Command description"
        />
      </div>

      {isStartCommand && (
        <DeepLinkSection
          deepLinkMatchMode={selectedNode.data?.deepLinkMatchMode ?? 'exact'}
          deepLinkParam={selectedNode.data?.deepLinkParam ?? ''}
          deepLinkSaveToVar={selectedNode.data?.deepLinkSaveToVar ?? false}
          deepLinkVarName={selectedNode.data?.deepLinkVarName ?? ''}
          onChange={handleDeepLinkChange}
        />
      )}

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label>Administrators only</Label>
          <Switch
            checked={selectedNode.data?.adminOnly ?? false}
            onCheckedChange={checked => onNodeUpdate(selectedNode.id, { adminOnly: checked })}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          This command is available only to bot administrators.
        </p>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label>Require /start</Label>
          <Switch
            checked={selectedNode.data?.requiresAuth ?? false}
            onCheckedChange={checked => onNodeUpdate(selectedNode.id, { requiresAuth: checked })}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          This command is available only to users who have already started the bot with /start.
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
