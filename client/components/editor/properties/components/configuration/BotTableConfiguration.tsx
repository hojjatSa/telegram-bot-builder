/**
 * @fileoverview Панель свойств узла bot_table — работа с внутренними таблицами
 * @module components/editor/properties/components/configuration/BotTableConfiguration
 */

import { Node } from '@shared/schema';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VariableNameInput } from '../variables/variable-name-input';
import type { Variable } from '../../../inline-rich/types';
import { BotTableWhereSection } from './bot-table-where-section';
import { BotTableUpdatesSection } from './bot-table-updates-section';
import { BotTableRowSection } from './bot-table-row-section';
import { useTablesQuery } from '../../../tables/hooks/use-tables-query';
import { VariableSelector } from '../variables/variable-selector';
import { PropertyCheckbox } from '../common/property-checkbox';

/** Пропсы компонента BotTableConfiguration */
interface BotTableConfigurationProps {
  /** Выбранный узел bot_table */
  selectedNode: Node;
  /** ID проекта для загрузки списка таблиц */
  projectId: number;
  /** Функция обновления данных узла */
  onNodeUpdate: (nodeId: string, updates: Partial<Node['data']> & Record<string, any>) => void;
  /** Все узлы всех листов для выбора следующего узла */
  getAllNodesFromAllSheets: Array<{ node: Node; sheetName: string }>;
  /** Функция форматирования отображения узла */
  formatNodeDisplay: (node: Node, sheetName: string) => string;
  /** Доступные текстовые переменные проекта */
  textVariables: Variable[];
}

/** Метки операций */
const OPERATION_LABELS: Record<string, string> = {
  read: 'Прочитать',
  insert: 'Вставить',
  update: 'Refresh',
  upsert: 'Создать или обновить',
  delete: 'Delete',
  count: 'Подсчитать',
  sum: 'Sum',
  max: 'Maximum',
  min: 'Minimum',
  avg: 'Average',
  distinct: 'Уникальные значения',
  delete_all: 'Очистить таблицу',
};

/**
 * Панель конфигурации узла работы с таблицами
 * @param props - Пропсы компонента
 * @returns JSX-элемент панели свойств
 */
export function BotTableConfiguration({
  selectedNode,
  projectId,
  onNodeUpdate,
  getAllNodesFromAllSheets,
  formatNodeDisplay,
  textVariables,
}: BotTableConfigurationProps) {
  const data = selectedNode.data as any;
  const tableName: string = data?.tableName || '';
  const operation: string = data?.operation || 'read';
  const where: Array<{ column: string; value: string }> = data?.where || [];
  const updates: Array<{ column: string; op: string; value: string }> = data?.updates || [];
  const row: Record<string, string> = data?.row || {};
  const key: string = data?.key || '';
  const onConflict: string = data?.onConflict || 'ignore';
  const saveResultTo: string = data?.saveResultTo || '';
  const resultFormat: string = data?.resultFormat || 'first_row';
  const orderBy: string = data?.orderBy || '';
  const orderDirection: string = data?.orderDirection || 'desc';
  const limit: number = data?.limit || 0;
  const autoTransitionTo: string = data?.autoTransitionTo || '';

  /** Загрузка списка таблиц проекта */
  const { data: tables = [] } = useTablesQuery(projectId);

  /** Показывать WHERE: read, update, delete, count, sum, max, min, avg, distinct */
  const showWhere = ['read', 'update', 'delete', 'count', 'sum', 'max', 'min', 'avg', 'distinct'].includes(operation);
  /** Показывать Updates: update */
  const showUpdates = operation === 'update';
  /** Показывать Row: insert, upsert */
  const showRow = ['insert', 'upsert'].includes(operation);
  /** Показывать ключ и onConflict: upsert */
  const showUpsert = operation === 'upsert';
  /** Показывать сохранение результата: read, update, upsert, count, sum, max, min, avg, distinct, delete_all */
  const showSaveResult = ['read', 'update', 'upsert', 'count', 'sum', 'max', 'min', 'avg', 'distinct', 'delete_all'].includes(operation);
  /** Показывать формат результата: read */
  const showResultFormat = operation === 'read';
  /** Показывать поле колонки для агрегации: sum, max, min, avg, distinct */
  const showAggregateColumn = ['sum', 'max', 'min', 'avg', 'distinct'].includes(operation);
  /** Для delete_all не нужны WHERE/Row/Updates — только предупреждение */
  const showNoConfig = operation === 'delete_all';

  /** Доступные узлы для перехода */
  const availableTargets = getAllNodesFromAllSheets.filter(
    ({ node }) => node.id !== selectedNode.id
  );

  return (
    <div className="space-y-4 p-4">
      {/* Заголовок */}
      <div className="flex items-center gap-2">
        <i className="fas fa-table text-amber-500 dark:text-amber-400 text-sm" />
        <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
          Project table
        </span>
      </div>

      {/* Описание */}
      <p className="text-xs text-muted-foreground leading-relaxed">
        Reading, writing and updating data in internal project tables. Supports operations: read, insert, update, upsert and delete.
      </p>

      {/* Подсказка про управление таблицами */}
      <button
        type="button"
        onClick={() => window.dispatchEvent(new CustomEvent('navigate-tab', { detail: 'tables' }))}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/40 dark:border-amber-800/30 hover:bg-amber-100/80 dark:hover:bg-amber-900/30 transition-colors cursor-pointer w-full text-left"
      >
        <i className="fas fa-lightbulb text-amber-500 text-xs" />
        <span className="text-xs text-amber-700 dark:text-amber-400">
          Manage your data in the “Tables” tab →
        </span>
      </button>

      {/* Имя таблицы */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Table
        </Label>
        <Select
          value={tableName || 'no-table'}
          onValueChange={(value) => onNodeUpdate(selectedNode.id, { tableName: value === 'no-table' ? '' : value })}
        >
          <SelectTrigger className="text-xs h-8 bg-white/60 dark:bg-slate-950/60">
            <SelectValue placeholder={"Select table"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no-table" disabled>Select table</SelectItem>
            {tables.map((t: any) => (
              <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1">
          <Input
            value={tableName}
            onChange={(e) => onNodeUpdate(selectedNode.id, { tableName: e.target.value })}
            placeholder={"or enter a name for the new table"}
            className="text-xs h-7 flex-1 bg-white/60 dark:bg-slate-950/60 border-dashed"
          />
          <VariableSelector
            availableVariables={textVariables}
            onSelect={(name) => onNodeUpdate(selectedNode.id, { tableName: tableName + `{${name}}` })}
          />
        </div>
        <p className="text-[10px] text-muted-foreground/70 leading-tight">
          If the table does not exist, it will be created automatically on the first record
        </p>
      </div>

      {/* Операция */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Operation
        </Label>
        <Select
          value={operation}
          onValueChange={(value) => onNodeUpdate(selectedNode.id, { operation: value })}
        >
          <SelectTrigger className="text-xs h-8 bg-white/60 dark:bg-slate-950/60">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(OPERATION_LABELS).map(([val, label]) => (
              <SelectItem key={val} value={val}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Предупреждение для delete_all */}
      {showNoConfig && (
        <div className="p-2 rounded bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
          <p className="text-xs text-red-600 dark:text-red-400 font-medium">⚠️ Will delete ALL rows from the table!</p>
        </div>
      )}

      {/* WHERE секция */}
      {showWhere && (
        <BotTableWhereSection
          where={where as any}
          onChange={(w) => onNodeUpdate(selectedNode.id, { where: w })}
        />
      )}

      {/* Колонка для агрегации (sum, max, min) */}
      {showAggregateColumn && (
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Column for aggregation
          </Label>
          <Input
            value={data?.aggregateColumn || ''}
            onChange={(e) => onNodeUpdate(selectedNode.id, { aggregateColumn: e.target.value })}
            placeholder="balance"
            className="text-xs h-8 bg-white/60 dark:bg-slate-950/60"
          />
          <p className="text-[10px] text-muted-foreground/70">Numeric column for calculating sum/max/min/average or column for unique values</p>
        </div>
      )}

      {/* Updates секция */}
      {showUpdates && (
        <BotTableUpdatesSection
          updates={updates}
          onChange={(u) => onNodeUpdate(selectedNode.id, { updates: u })}
        />
      )}

      {/* Row секция */}
      {showRow && (
        <BotTableRowSection
          row={row}
          onChange={(r) => onNodeUpdate(selectedNode.id, { row: r })}
        />
      )}

      {/* Upsert: ключ и onConflict */}
      {showUpsert && (
        <>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Key (unique column)
            </Label>
            <Input
              value={key}
              onChange={(e) => onNodeUpdate(selectedNode.id, { key: e.target.value })}
              placeholder="telegram_id"
              className="text-xs h-8 bg-white/60 dark:bg-slate-950/60"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              In case of conflict
            </Label>
            <Select
              value={onConflict}
              onValueChange={(value) => onNodeUpdate(selectedNode.id, { onConflict: value })}
            >
              <SelectTrigger className="text-xs h-8 bg-white/60 dark:bg-slate-950/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ignore">Ignore</SelectItem>
                <SelectItem value="update">Overwrite</SelectItem>
                <SelectItem value="merge">Merge (empty only)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {/* Вернуть ID вставленной строки (insert/upsert) */}
      {['insert', 'upsert'].includes(operation) && (
        <PropertyCheckbox
          id="returnInsertedId"
          label={"Save the ID of the inserted row into a variable"}
          checked={data?.returnInsertedId || false}
          onChange={(checked) => onNodeUpdate(selectedNode.id, { returnInsertedId: checked })}
        />
      )}

      {/* Формат результата (только read) */}
      {showResultFormat && (
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Result Format
          </Label>
          <Select
            value={resultFormat}
            onValueChange={(value) => onNodeUpdate(selectedNode.id, { resultFormat: value as any })}
          >
            <SelectTrigger className="text-xs h-8 bg-white/60 dark:bg-slate-950/60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="first_row">First line (object)</SelectItem>
              <SelectItem value="all_rows">All lines (array)</SelectItem>
              <SelectItem value="scalar">One value</SelectItem>
              <SelectItem value="count">Quantity (number)</SelectItem>
              <SelectItem value="random_row">Random string</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Сортировка и лимит (только read) */}
      {showResultFormat && (
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Sort
            </Label>
            <Input
              value={orderBy}
              onChange={(e) => onNodeUpdate(selectedNode.id, { orderBy: e.target.value })}
              placeholder={"column"}
              className="text-xs h-8 bg-white/60 dark:bg-slate-950/60"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Direction
            </Label>
            <Select
              value={orderDirection}
              onValueChange={(value) => onNodeUpdate(selectedNode.id, { orderDirection: value })}
            >
              <SelectTrigger className="text-xs h-8 bg-white/60 dark:bg-slate-950/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {showResultFormat && (
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Limit (0 = no limit)
          </Label>
          <Input
            type="number"
            value={limit || ''}
            onChange={(e) => onNodeUpdate(selectedNode.id, { limit: parseInt(e.target.value) || 0 })}
            placeholder="0"
            className="text-xs h-8 bg-white/60 dark:bg-slate-950/60"
          />
          <Input
            type="number"
            value={data?.offset || ''}
            onChange={(e) => onNodeUpdate(selectedNode.id, { offset: parseInt(e.target.value) || 0 })}
            placeholder="0"
            className="text-xs h-8 bg-white/60 dark:bg-slate-950/60"
          />
          <p className="text-[10px] text-muted-foreground/70">Skip N lines (for pagination)</p>
        </div>
      )}

      {/* Сохранить результат */}
      {showSaveResult && (
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Save the result to a variable
          </Label>
          <VariableNameInput
            value={saveResultTo}
            availableVariables={textVariables}
            onChange={(value) => onNodeUpdate(selectedNode.id, { saveResultTo: value })}
            placeholder="profile"
          />
        </div>
      )}

      {/* Следующий узел */}
      <div className="flex flex-col p-3 rounded-lg bg-gradient-to-br from-amber-50/60 to-yellow-50/40 dark:from-amber-950/30 dark:to-yellow-950/20 border border-amber-200/40 dark:border-amber-700/40">
        <Label className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-2 flex items-center gap-1.5">
          <i className="fas fa-share-right text-xs" />
          Next node
        </Label>
        <Select
          value={autoTransitionTo || 'no-transition'}
          onValueChange={(value) =>
            onNodeUpdate(selectedNode.id, {
              autoTransitionTo: value === 'no-transition' ? '' : value,
              enableAutoTransition: value !== 'no-transition',
            })
          }
        >
          <SelectTrigger className="text-xs h-8 bg-white/60 dark:bg-slate-950/60 border border-amber-300/40 dark:border-amber-700/40">
            <SelectValue placeholder="No transition" />
          </SelectTrigger>
          <SelectContent className="max-h-48 overflow-y-auto">
            <SelectItem value="no-transition">No transition</SelectItem>
            {availableTargets.map(({ node, sheetName }) => (
              <SelectItem key={node.id} value={node.id}>
                <span className="text-xs font-mono truncate">
                  {formatNodeDisplay(node, sheetName)}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          value={autoTransitionTo && autoTransitionTo !== 'no-transition' ? autoTransitionTo : ''}
          onChange={(e) =>
            onNodeUpdate(selectedNode.id, {
              autoTransitionTo: e.target.value || '',
              enableAutoTransition: Boolean(e.target.value),
            })
          }
          className="text-xs h-8 mt-1.5 bg-white/60 dark:bg-slate-950/60 border border-amber-300/40 dark:border-amber-700/40"
          placeholder="or enter an ID manually"
        />
      </div>
    </div>
  );
}
