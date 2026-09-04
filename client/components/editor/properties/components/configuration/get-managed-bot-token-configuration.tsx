/**
 * @fileoverview Панель свойств узла получения токена управляемого бота
 * @module components/editor/properties/components/configuration/get-managed-bot-token-configuration
 */
import { Node } from '@shared/schema';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InfoBlock } from '@/components/ui/info-block';
import { TriggerTargetSelector } from '../trigger/TriggerTargetSelector';
import { formatNodeDisplay as defaultFormatNodeDisplay } from '../../utils/node-formatters';

/** Пропсы компонента настройки узла получения токена */
interface GetManagedBotTokenConfigurationProps {
  /** Выбранный узел */
  selectedNode: Node;
  /** Функция обновления данных узла */
  onNodeUpdate: (nodeId: string, updates: Partial<Node['data']>) => void;
  /** Все узлы из всех листов */
  getAllNodesFromAllSheets: Array<{ node: Node; sheetId?: string; sheetName?: string }>;
  /** Форматирование названия узла */
  formatNodeDisplay?: (node: Node, sheetName?: string) => string;
}

/**
 * Компонент настройки узла получения токена управляемого бота.
 * Позволяет задать источник bot_id, переменную для токена и ошибки.
 *
 * @param props - Свойства компонента
 * @returns JSX элемент
 */
export function GetManagedBotTokenConfiguration({
  selectedNode,
  onNodeUpdate,
  getAllNodesFromAllSheets = [],
  formatNodeDisplay = defaultFormatNodeDisplay,
}: GetManagedBotTokenConfigurationProps) {
  const data = selectedNode.data as any;
  const source = data.botIdSource || 'variable';

  /** Обновляет поле данных узла */
  const update = (field: string, value: string) =>
    onNodeUpdate(selectedNode.id, { [field]: value });

  return (
    <div className="space-y-4 p-4">
      <InfoBlock
        variant="info"
        title="getManagedBotToken (Bot API 9.6)"
        description={"Calls bot.get_managed_bot_token(user_id=<bot_id>) and saves the token to a variable."}
      />

      {/* Источник bot_id */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Source bot_id</Label>
        <Select
          value={source}
          onValueChange={(v) => update('botIdSource', v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="variable">From variable</SelectItem>
            <SelectItem value="manual">Manually</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Поле ввода в зависимости от источника */}
      {source === 'variable' ? (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Variable with bot_id</Label>
          <Input
            placeholder="bot_id"
            value={data.botIdVariable || ''}
            onChange={(e) => update('botIdVariable', e.target.value)}
            className="font-mono text-sm"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Bot ID (number)</Label>
          <Input
            placeholder="123456789"
            value={data.botIdManual || ''}
            onChange={(e) => update('botIdManual', e.target.value)}
            className="font-mono text-sm"
          />
        </div>
      )}

      {/* Сохранить токен */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Save token to variable</Label>
        <Input
          placeholder="bot_token"
          value={data.saveTokenTo || ''}
          onChange={(e) => update('saveTokenTo', e.target.value)}
          className="font-mono text-sm"
        />
      </div>

      {/* Сохранить ошибку (опционально) */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Save error to variable (optional)</Label>
        <Input
          placeholder="error"
          value={data.saveErrorTo || ''}
          onChange={(e) => update('saveErrorTo', e.target.value)}
          className="font-mono text-sm"
        />
      </div>

      {/* Следующий узел — селектор */}
      <TriggerTargetSelector
        selectedNode={selectedNode}
        autoTransitionTo={data.autoTransitionTo ?? ''}
        getAllNodesFromAllSheets={getAllNodesFromAllSheets}
        onNodeUpdate={onNodeUpdate}
        formatNodeDisplay={formatNodeDisplay}
      />
    </div>
  );
}
