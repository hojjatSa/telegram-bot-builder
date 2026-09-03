/**
 * @fileoverview Компонент одной ветки узла условия в панели свойств.
 * Для ветки else отображает статичный текст "Иначе" вместо поля лейбла.
 * Содержит поле редактирования текста сообщения связанного message-узла.
 */
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Node } from '@shared/schema';
import type { ConditionBranch, ConditionOperator } from '@shared/types/condition-node';
import type { Variable } from '../../../inline-rich/types';
import { formatNodeDisplay } from '../../utils/node-formatters';
import { SubscriptionChannelsInput } from './SubscriptionChannelsInput';
import { VariableSelector } from '../variables/variable-selector';

interface ConditionBranchItemProps {
  /** Ветка условия */
  branch: ConditionBranch;
  /** Имя переменной из родительского узла (для заголовка ветки) */
  variable: string;
  /** Связанный message-узел для этой ветки (null для ветки else) */
  messageNode: Node | null;
  /** Обработчик изменения поля ветки */
  onChange: (id: string, field: keyof ConditionBranch, value: string) => void;
  /** Обработчик удаления ветки */
  onDelete: (id: string) => void;
  /** Обработчик обновления данных узла (для message-узла) */
  onNodeUpdate: (nodeId: string, updates: Partial<any>) => void;
  /** Все узлы из всех листов для выбора цели перехода */
  getAllNodesFromAllSheets: Array<{ node: Node; sheetName: string }>;
  /** Доступные переменные для вставки в поле значения */
  textVariables: Variable[];
}

/** Метки операторов для отображения в выпадающем списке */
const OPERATOR_LABELS: Record<ConditionOperator, string> = {
  'filled': 'If variable is set',
  'empty': 'If variable is empty',
  'equals': 'If variable equals',
  'not_equals': 'Does not equal',
  'contains': 'If variable contains',
  'not_contains': 'Does not contain',
  'starts_with': 'Starts with',
  'ends_with': 'Ends with',
  'matches_regex': 'Matches regex',
  'greater_than': 'If variable is greater than',
  'less_than': 'If variable is less than',
  'between': 'If variable is in range',
  'is_even': 'Even number',
  'is_odd': 'Odd number',
  'divisible_by': 'Divisible by',
  'is_private': 'If private chat',
  'is_group': 'If group chat',
  'is_channel': 'If channel',
  'is_admin': 'If user is a bot administrator',
  'is_premium': 'If user has Telegram Premium',
  'is_bot': 'If user is a bot',
  'is_subscribed': 'If user is subscribed to the channel / belongs to the group',
  'is_not_subscribed': 'If user is not subscribed to the channel / does not belong to the group',
  'else': 'In all other cases',
};

/** Операторы, доступные для выбора пользователем */
const SELECTABLE_OPERATORS: ConditionOperator[] = [
  'filled', 'empty', 'equals', 'not_equals', 'contains', 'not_contains', 'starts_with', 'ends_with', 'matches_regex',
  'greater_than', 'less_than', 'between', 'is_even', 'is_odd', 'divisible_by',
  'is_private', 'is_group', 'is_channel', 'is_admin', 'is_premium', 'is_bot', 'is_subscribed', 'is_not_subscribed', 'else',
];


/**
 * Генерирует текст выбранного оператора с подстановкой имени переменной.
 * Для операторов подписки поддерживает несколько каналов через запятую.
 * @param operator - Оператор ветки условия
 * @param variable - Имя переменной узла
 * @param value - Значение (для подписки — каналы через запятую)
 * @param value2 - Второе значение (для оператора between)
 * @param subscriptionMode - Режим проверки нескольких каналов
 * @returns Человекочитаемая строка описания условия
 */
export function getSelectedLabel(
  operator: ConditionOperator,
  variable: string,
  value: string,
  value2?: string,
  subscriptionMode?: 'all' | 'any',
): string {
  const varName = variable.replace(/[{}]/g, '').trim() || 'variable';
  switch (operator) {
    case 'filled':       return `If variable "${varName}" is set`;
    case 'empty':        return `If variable "${varName}" is empty`;
    case 'equals':       return `If variable "${varName}" equals "${value || '...'}"`;
    case 'not_equals':   return `If variable "${varName}" does not equal "${value || '...'}"`;
    case 'contains':     return `If variable "${varName}" contains "${value || '...'}"`;
    case 'not_contains': return `If variable "${varName}" does not contain "${value || '...'}"`;
    case 'starts_with':  return `If variable "${varName}" starts with "${value || '...'}"`;
    case 'ends_with':    return `If variable "${varName}" ends with "${value || '...'}"`;
    case 'matches_regex':return `If variable "${varName}" matches regex "${value || '...'}"`;
    case 'greater_than': return `If variable "${varName}" is greater than ${value || '...'}`;
    case 'less_than':    return `If variable "${varName}" is less than ${value || '...'}`;
    case 'between':      return `If variable "${varName}" is between ${value || '...'} and ${value2 || '...'}`;
    case 'is_even':      return `If variable "${varName}" is even`;
    case 'is_odd':       return `If variable "${varName}" is odd`;
    case 'divisible_by': return `If variable "${varName}" is divisible by ${value || '...'}`;
    case 'is_private':   return 'If private chat';
    case 'is_group':     return 'If group chat';
    case 'is_channel':   return 'If channel';
    case 'is_admin':     return 'If user is a bot administrator';
    case 'is_premium':   return 'If user has Telegram Premium';
    case 'is_bot':       return 'If user is a bot';
    case 'is_subscribed':     return buildSubscriptionLabel(value, subscriptionMode, false);
    case 'is_not_subscribed': return buildSubscriptionLabel(value, subscriptionMode, true);
    default:             return OPERATOR_LABELS[operator];
  }
}

/**
 * Формирует метку для операторов подписки с учётом числа каналов и режима.
 * @param value - Каналы через запятую
 * @param mode - Режим all/any
 * @param negated - true для is_not_subscribed
 * @returns Строка описания условия подписки
 */
function buildSubscriptionLabel(value: string, mode: 'all' | 'any' | undefined, negated: boolean): string {
  const channels = value ? value.split(',').map(c => c.trim()).filter(Boolean) : [];
  if (channels.length === 0) return negated ? 'If user is not subscribed to the channel / does not belong to the group' : 'If user is subscribed to the channel / belongs to the group';
  if (channels.length === 1) {
    return negated
      ? `Not subscribed to ${channels[0]}`
      : `Subscribed to ${channels[0]}`;
  }
  const list = channels.join(', ');
  if (mode === 'any') {
    return negated
      ? `Not subscribed to any of: ${list}`
      : `Subscribed to at least one of: ${list}`;
  }
  // mode === 'all' (по умолчанию)
  return negated
    ? `Not subscribed to all of: ${list}`
    : `Subscribed to all: ${list}`;
}

/**
 * Компонент отдельной ветки условия.
 * Для ветки else показывает статичный текст "Иначе".
 * Для остальных веток отображает выбор оператора, поле значения и текст сообщения.
 * @param props - Свойства компонента
 * @returns JSX элемент
 */
export function ConditionBranchItem({ branch, variable, messageNode, onChange, onDelete, onNodeUpdate, getAllNodesFromAllSheets, textVariables }: ConditionBranchItemProps) {
  /** Операторы, которым требуется одно текстовое значение. */
  const singleValueOperators = new Set<ConditionOperator>(['equals', 'not_equals', 'contains', 'not_contains', 'starts_with', 'ends_with', 'matches_regex', 'greater_than', 'less_than', 'divisible_by', 'is_subscribed', 'is_not_subscribed']);
  const needsValue = singleValueOperators.has(branch.operator) || branch.operator === 'between';
  const isBetween = branch.operator === 'between';
  const isSubscriptionOperator = branch.operator === 'is_subscribed' || branch.operator === 'is_not_subscribed';
  const messageText: string = (messageNode?.data as any)?.messageText ?? '';
  const availableTargets = getAllNodesFromAllSheets;

  /** Обновляет текст сообщения в связанном message-узле */
  const handleMessageTextChange = (value: string) => {
    if (!messageNode) return;
    onNodeUpdate(messageNode.id, { messageText: value });
  };

  /**
   * Обрабатывает изменение режима подписки (all/any).
   * @param mode - Новый режим проверки каналов
   */
  const handleModeChange = (mode: 'all' | 'any') => {
    onChange(branch.id, 'subscriptionMode' as any, mode);
  };

  /** JSX кнопки удаления ветки — передаётся в SubscriptionChannelsInput для subscription-операторов */
  const deleteButtonJsx = (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onDelete(branch.id)}
      className="h-7 w-7 p-0 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0"
      title="Delete branch"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  );

  return (
    <div className="rounded-lg border p-3 space-y-2 border-violet-200 bg-violet-50/50 dark:bg-violet-900/10 dark:border-violet-800/40">
      {/* Строка с селектом оператора + кнопка удаления (только для не-subscription операторов) */}
      <div className="flex flex-wrap items-start gap-2">
        <Select
          value={branch.operator}
          onValueChange={(value) => onChange(branch.id, 'operator', value)}
        >
          <SelectTrigger className="text-xs h-7 bg-white/60 dark:bg-slate-950/60 border border-violet-300/40 dark:border-violet-700/40 hover:border-violet-400/60 focus:border-violet-500 focus:ring-2 focus:ring-violet-400/30 rounded-md text-violet-900 dark:text-violet-50 min-w-[120px] flex-1">
            <SelectValue>{getSelectedLabel(branch.operator, variable, branch.value, branch.value2, branch.subscriptionMode)}</SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-gradient-to-br from-violet-50/95 to-purple-50/90 dark:from-slate-900/95 dark:to-slate-800/95 border border-violet-200/50 dark:border-violet-800/50 shadow-xl">
            {SELECTABLE_OPERATORS.map(op => (
              <SelectItem key={op} value={op}>
                <span className="text-xs text-violet-700 dark:text-violet-300">{getSelectedLabel(op, variable, branch.value, branch.value2, branch.subscriptionMode)}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Кнопка удаления — для не-subscription в этой строке, для subscription — в строке с селектом оператора */}
        <div className="ml-auto">{deleteButtonJsx}</div>
      </div>

      {/* Поля значений — только для не-subscription операторов */}
      {!isSubscriptionOperator && needsValue && (
        <div className="flex flex-wrap items-center gap-1">
          <Input
            value={branch.value}
            onChange={e => onChange(branch.id, 'value', e.target.value)}
            placeholder={isBetween ? 'from (or {variable})' : 'value or {variable}'}
            className="text-sm h-7 flex-1"
          />
          <VariableSelector
            availableVariables={textVariables}
            onSelect={(v) => onChange(branch.id, 'value', `{${v}}`)}
          />
          {isBetween && (
            <>
              <Input
                value={branch.value2 ?? ''}
                onChange={e => onChange(branch.id, 'value2', e.target.value)}
                placeholder="to (or {variable})"
                className="text-sm h-7 flex-1"
              />
              <VariableSelector
                availableVariables={textVariables}
                onSelect={(v) => onChange(branch.id, 'value2', `{${v}}`)}
              />
            </>
          )}
        </div>
      )}

      {/* Для subscription-операторов — компонент с chips и полем ввода (без deleteButton — кнопка уже в строке выше) */}
      {isSubscriptionOperator && (
        <SubscriptionChannelsInput
          value={branch.value}
          subscriptionMode={branch.subscriptionMode}
          onValueChange={(val) => onChange(branch.id, 'value', val)}
          onModeChange={handleModeChange}
        />
      )}

      {/* Поле ID целевого узла для перехода */}
      <div className="space-y-1">
        <Select
          value={branch.target || ''}
          onValueChange={(value) => onChange(branch.id, 'target', value)}
        >
          <SelectTrigger className="w-full text-xs sm:text-sm bg-white/60 dark:bg-slate-950/60 border border-sky-300/40 dark:border-sky-700/40 hover:border-sky-400/60 dark:hover:border-sky-600/60 hover:bg-white/80 dark:hover:bg-slate-900/60 focus:border-sky-500 dark:focus:border-sky-500 focus:ring-2 focus:ring-sky-400/30 dark:focus:ring-sky-600/30 transition-all duration-200 rounded-lg text-sky-900 dark:text-sky-50">
            <SelectValue placeholder="⊘ Not selected" />
          </SelectTrigger>
          <SelectContent className="bg-gradient-to-br from-sky-50/95 to-blue-50/90 dark:from-slate-900/95 dark:to-slate-800/95 border border-sky-200/50 dark:border-sky-800/50 shadow-xl max-h-48 overflow-y-auto">
            {availableTargets.map(({ node, sheetName }) => (
              <SelectItem key={node.id} value={node.id}>
                <span className="text-xs font-mono text-sky-700 dark:text-sky-300 truncate">
                  {formatNodeDisplay(node, sheetName)}
                </span>
              </SelectItem>
            ))}
            {availableTargets.length === 0 && (
              <SelectItem value="no-nodes" disabled>
                <span className="text-muted-foreground text-xs">No available nodes</span>
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        <Input
          value={branch.target || ''}
          onChange={e => onChange(branch.id, 'target', e.target.value)}
          className="text-xs sm:text-sm bg-white/60 dark:bg-slate-950/60 border border-sky-300/40 dark:border-sky-700/40 text-sky-900 dark:text-sky-50 placeholder:text-sky-500/50 dark:placeholder:text-sky-400/50 focus:border-sky-500 focus:ring-2 focus:ring-sky-400/30"
          placeholder="Or enter a node ID manually"
        />
      </div>

      {/* Текст сообщения ветки — редактирует связанный message-узел */}
      {messageNode && (
        <div className="space-y-1">
          <Textarea
            value={messageText}
            onChange={e => handleMessageTextChange(e.target.value)}
            placeholder="Message text for this branch..."
            className="text-xs min-h-[60px] resize-none"
          />
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Message sent through this branch
          </p>
        </div>
      )}
    </div>
  );
}
