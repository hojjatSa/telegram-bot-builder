/**
 * @fileoverview Строка присваивания переменной с dropdown-выбором режима
 * @module components/editor/properties/components/configuration/assignment-row
 */

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import { VariableNameInput } from '../variables/variable-name-input';
import { VariableSelector } from '../variables/variable-selector';
import type { Variable } from '../../../inline-rich/types';

/** Одно присваивание переменной */
export interface Assignment {
  /** Уникальный идентификатор */
  id: string;
  /** Имя переменной */
  variable: string;
  /** Значение или шаблон */
  value: string;
  /** Режим присваивания */
  mode: AssignmentMode;
  /** Имя таблицы для поиска (только lookup) */
  lookupTable?: string;
  /** Поле таблицы для извлечения (только lookup) */
  lookupField?: string;
  /** Условия поиска (только lookup) */
  lookupWhere?: Array<{ field: string; value: string }>;
  /** На что заменить (только str_replace) */
  replaceWith?: string;
  /** Максимальное значение для mode=random, индекс для array_item */
  maxValue?: string;
  /** Имя второго массива для объединения (только array_concat) */
  concatWith?: string;
}

/** Все доступные режимы присваивания */
type AssignmentMode =
  | 'text'
  | 'expression'
  | 'lookup'
  | 'str_replace'
  | 'random'
  | 'random_item'
  | 'array_item'
  | 'array_concat'
  | 'timestamp'
  | 'format_duration'
  | 'format_number'
  | 'regex_extract'
  | 'extract_number'
  | 'split_get'
  | 'json_get'
  | 'substring'
  | 'conditional'
  | 'lowercase'
  | 'uppercase'
  | 'trim'
  | 'length';

/** Конфигурация режима для отображения в dropdown */
interface ModeConfig {
  /** Иконка режима */
  icon: string;
  /** Название режима */
  label: string;
  /** Краткое описание */
  hint: string;
  /** Цвет бордера поля ввода */
  borderClass: string;
}

/** Конфигурации всех режимов */
const MODE_CONFIGS: Record<AssignmentMode, ModeConfig> = {
  text: {
    icon: 'T',
    label: 'Текст',
    hint: 'String substitution or {variable}',
    borderClass: '',
  },
  expression: {
    icon: '=',
    label: 'Expression',
    hint: 'Arithmetic: +, -, *, /, //, %, **',
    borderClass: 'border-amber-400 dark:border-amber-600',
  },
  random: {
    icon: '🎲',
    label: 'Random number',
    hint: 'Integer from min to max',
    borderClass: 'border-green-400 dark:border-green-600',
  },
  random_item: {
    icon: '🎯',
    label: 'Random item',
    hint: 'From a comma-separated list',
    borderClass: 'border-emerald-400 dark:border-emerald-600',
  },
  timestamp: {
    icon: '⏱',
    label: 'Timestamp',
    hint: 'Unix time + offset (sec)',
    borderClass: 'border-cyan-400 dark:border-cyan-600',
  },
  format_duration: {
    icon: '⏳',
    label: 'Duration',
    hint: 'Seconds → MM:SS or HH:MM:SS',
    borderClass: 'border-orange-400 dark:border-orange-600',
  },
  format_number: {
    icon: '#',
    label: 'Number format',
    hint: 'Number with separators: 5000000 → 5 000 000',
    borderClass: 'border-violet-400 dark:border-violet-600',
  },
  array_item: {
    icon: '📋',
    label: 'Array item',
    hint: 'By index or dot-notation key',
    borderClass: 'border-emerald-400 dark:border-emerald-600',
  },
  array_concat: {
    icon: '🔗',
    label: 'Merge arrays',
    hint: 'Merge two arrays into one',
    borderClass: 'border-pink-400 dark:border-pink-600',
  },
  lookup: {
    icon: '🔍',
    label: 'Table lookup',
    hint: 'Find a value by condition',
    borderClass: 'border-blue-400 dark:border-blue-600',
  },
  str_replace: {
    icon: '✂️',
    label: 'Replace substring',
    hint: 'Find and replace in a string',
    borderClass: 'border-purple-400 dark:border-purple-600',
  },
  regex_extract: {
    icon: '🔎',
    label: 'Regex extraction',
    hint: 'Extract using a regular expression',
    borderClass: 'border-rose-400 dark:border-rose-600',
  },
  extract_number: {
    icon: '🔢',
    label: 'Number from string',
    hint: 'Extracts the first number from text',
    borderClass: 'border-rose-400 dark:border-rose-600',
  },
  split_get: {
    icon: '✂️',
    label: 'Split and take',
    hint: 'Split a string and take the Nth item',
    borderClass: 'border-indigo-400 dark:border-indigo-600',
  },
  json_get: {
    icon: '{}',
    label: 'JSON by key',
    hint: 'Value from JSON path (data.user.name)',
    borderClass: 'border-sky-400 dark:border-sky-600',
  },
  substring: {
    icon: '📏',
    label: 'Substring',
    hint: 'Extract part of a string (start, end)',
    borderClass: 'border-teal-400 dark:border-teal-600',
  },
  conditional: {
    icon: '❓',
    label: 'Condition (if/else)',
    hint: 'If condition → value A, otherwise → B',
    borderClass: 'border-amber-400 dark:border-amber-600',
  },
  lowercase: {
    icon: 'aA',
    label: 'Lowercase',
    hint: 'All letters lowercase',
    borderClass: 'border-slate-400 dark:border-slate-600',
  },
  uppercase: {
    icon: 'AA',
    label: 'Uppercase',
    hint: 'All letters uppercase',
    borderClass: 'border-slate-400 dark:border-slate-600',
  },
  trim: {
    icon: '⌫',
    label: 'Trim whitespace',
    hint: 'Remove leading and trailing whitespace',
    borderClass: 'border-slate-400 dark:border-slate-600',
  },
  length: {
    icon: '📐',
    label: 'Length',
    hint: 'Number of characters or array items',
    borderClass: 'border-cyan-400 dark:border-cyan-600',
  },
};

/** Пропсы строки присваивания */
interface AssignmentRowProps {
  /** Данные присваивания */
  assignment: Assignment;
  /** Обработчик изменения поля */
  onChange: (id: string, field: string, val: any) => void;
  /** Обработчик удаления строки */
  onRemove: (id: string) => void;
  /** Можно ли удалить строку */
  canRemove: boolean;
  /** Доступные переменные для вставки */
  textVariables: Variable[];
}

/**
 * Строка одного присваивания переменной с dropdown-выбором режима
 * @param props - Пропсы строки
 * @returns JSX-элемент строки присваивания
 */
export function AssignmentRow({
  assignment,
  onChange,
  onRemove,
  canRemove,
  textVariables,
}: AssignmentRowProps) {
  const modeConfig = MODE_CONFIGS[assignment.mode] || MODE_CONFIGS.text;

  /**
   * Вставляет переменную в поле значения
   * @param varName - имя переменной
   */
  const handleInsertVariable = (varName: string) => {
    onChange(assignment.id, 'value', assignment.value + `{${varName}}`);
  };

  return (
    <div className="rounded-lg border border-border/60 bg-card/30 p-2.5 space-y-2">
      {/* Верхняя строка: переменная = ... */}
      <div className="flex items-center gap-1.5">
        {/* Имя переменной (слева) */}
        <div className="w-[180px] flex-shrink-0">
          <VariableNameInput
            value={assignment.variable}
            availableVariables={textVariables}
            onChange={(val) => onChange(assignment.id, 'variable', val)}
            placeholder="variable"
          />
        </div>

        <span className="text-muted-foreground text-xs font-mono">=</span>

        {/* Значение (зависит от режима) */}
        <div className="flex-1 min-w-0">
          {renderValueInput(assignment, modeConfig, onChange, handleInsertVariable, textVariables)}
        </div>

        {/* Кнопка удаления */}
        {canRemove && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 flex-shrink-0 text-muted-foreground hover:text-destructive"
            onClick={() => onRemove(assignment.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Нижняя строка: выбор режима + подсказка */}
      <div className="flex items-center gap-2">
        <Select
          value={assignment.mode}
          onValueChange={(val) => onChange(assignment.id, 'mode', val)}
        >
          <SelectTrigger className="h-6 w-[160px] text-[11px] bg-muted/40 border-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(MODE_CONFIGS).map(([mode, cfg]) => (
              <SelectItem key={mode} value={mode} className="text-xs">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-4 text-center">{cfg.icon}</span>
                  <span>{cfg.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-[10px] text-muted-foreground truncate">
          {modeConfig.hint}
        </span>
      </div>

      {/* Условия lookup (если режим lookup) */}
      {assignment.mode === 'lookup' && (
        <LookupConditions
          assignment={assignment}
          onChange={onChange}
        />
      )}
    </div>
  );
}

/**
 * Рендерит поле ввода значения в зависимости от режима
 */
function renderValueInput(
  assignment: Assignment,
  modeConfig: ModeConfig,
  onChange: (id: string, field: string, val: any) => void,
  handleInsertVariable: (varName: string) => void,
  textVariables: Variable[],
) {
  const inputClass = `text-xs h-7 ${modeConfig.borderClass}`;

  switch (assignment.mode) {
    case 'random':
      return (
        <div className="flex items-center gap-1">
          <Input
            placeholder="min"
            value={assignment.value || ''}
            onChange={(e) => onChange(assignment.id, 'value', e.target.value)}
            className={`flex-1 ${inputClass}`}
          />
          <span className="text-muted-foreground text-[10px]">...</span>
          <Input
            placeholder="max"
            value={assignment.maxValue || ''}
            onChange={(e) => onChange(assignment.id, 'maxValue', e.target.value)}
            className={`flex-1 ${inputClass}`}
          />
        </div>
      );

    case 'array_item':
      return (
        <div className="flex items-center gap-1">
          <Input
            placeholder="{array}"
            value={assignment.value || ''}
            onChange={(e) => onChange(assignment.id, 'value', e.target.value)}
            className={`flex-1 ${inputClass}`}
          />
          <span className="text-muted-foreground text-[10px]">[</span>
          <Input
            placeholder="index or key"
            value={assignment.maxValue || ''}
            onChange={(e) => onChange(assignment.id, 'maxValue', e.target.value)}
            className={`flex-1 ${inputClass}`}
          />
          <span className="text-muted-foreground text-[10px]">]</span>
        </div>
      );

    case 'array_concat':
      return (
        <div className="flex items-center gap-1">
          <Input
            placeholder="first array"
            value={assignment.value || ''}
            onChange={(e) => onChange(assignment.id, 'value', e.target.value)}
            className={`flex-1 ${inputClass}`}
          />
          <VariableSelector
            availableVariables={textVariables}
            onSelect={handleInsertVariable}
          />
          <span className="text-muted-foreground text-[10px]">+</span>
          <Input
            placeholder="second array"
            value={assignment.concatWith || ''}
            onChange={(e) => onChange(assignment.id, 'concatWith', e.target.value)}
            className={`flex-1 ${inputClass}`}
          />
          <VariableSelector
            availableVariables={textVariables}
            onSelect={(varName) => onChange(assignment.id, 'concatWith', (assignment.concatWith || '') + varName)}
          />
        </div>
      );

    case 'str_replace':
      return (
        <div className="flex items-center gap-1">
          <Input
            placeholder="find"
            value={assignment.value || ''}
            onChange={(e) => onChange(assignment.id, 'value', e.target.value)}
            className={`flex-1 ${inputClass}`}
          />
          <span className="text-muted-foreground text-[10px]">→</span>
          <Input
            placeholder="replace with"
            value={assignment.replaceWith || ''}
            onChange={(e) => onChange(assignment.id, 'replaceWith', e.target.value)}
            className={`flex-1 ${inputClass}`}
          />
        </div>
      );

    case 'regex_extract':
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Input
              placeholder="{variable} — source"
              value={assignment.value || ''}
              onChange={(e) => onChange(assignment.id, 'value', e.target.value)}
              className={`flex-1 ${inputClass}`}
            />
            <VariableSelector
              availableVariables={textVariables}
              onSelect={handleInsertVariable}
            />
          </div>
          <div className="flex items-center gap-1">
            <Input
              placeholder="паттерн: (\d+)\s*рублей"
              value={(assignment as any).pattern || ''}
              onChange={(e) => onChange(assignment.id, 'pattern', e.target.value)}
              className={`flex-1 ${inputClass} font-mono`}
            />
            <Input
              placeholder="group"
              value={(assignment as any).regexGroup || '0'}
              onChange={(e) => onChange(assignment.id, 'regexGroup', e.target.value)}
              className={`w-16 ${inputClass}`}
            />
          </div>
        </div>
      );

    case 'extract_number':
      return (
        <div className="flex items-center gap-1">
          <Input
            placeholder="{variable} — source"
            value={assignment.value || ''}
            onChange={(e) => onChange(assignment.id, 'value', e.target.value)}
            className={`flex-1 ${inputClass}`}
          />
          <VariableSelector
            availableVariables={textVariables}
            onSelect={handleInsertVariable}
          />
        </div>
      );

    case 'split_get':
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Input
              placeholder="{variable} — source"
              value={assignment.value || ''}
              onChange={(e) => onChange(assignment.id, 'value', e.target.value)}
              className={`flex-1 ${inputClass}`}
            />
            <VariableSelector
              availableVariables={textVariables}
              onSelect={handleInsertVariable}
            />
          </div>
          <div className="flex items-center gap-1">
            <Input
              placeholder="separator"
              value={(assignment as any).separator || ''}
              onChange={(e) => onChange(assignment.id, 'separator', e.target.value)}
              className={`w-24 ${inputClass}`}
            />
            <span className="text-muted-foreground text-[10px]">[</span>
            <Input
              placeholder="index"
              value={assignment.maxValue || '0'}
              onChange={(e) => onChange(assignment.id, 'maxValue', e.target.value)}
              className={`w-16 ${inputClass}`}
            />
            <span className="text-muted-foreground text-[10px]">]</span>
          </div>
        </div>
      );

    case 'json_get':
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Input
              placeholder="{variable} — JSON source"
              value={assignment.value || ''}
              onChange={(e) => onChange(assignment.id, 'value', e.target.value)}
              className={`flex-1 ${inputClass}`}
            />
            <VariableSelector
              availableVariables={textVariables}
              onSelect={handleInsertVariable}
            />
          </div>
          <Input
            placeholder="path: data.user.name"
            value={(assignment as any).jsonPath || ''}
            onChange={(e) => onChange(assignment.id, 'jsonPath', e.target.value)}
            className={`flex-1 ${inputClass} font-mono`}
          />
        </div>
      );

    case 'substring':
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Input
              placeholder="{variable} — source"
              value={assignment.value || ''}
              onChange={(e) => onChange(assignment.id, 'value', e.target.value)}
              className={`flex-1 ${inputClass}`}
            />
            <VariableSelector
              availableVariables={textVariables}
              onSelect={handleInsertVariable}
            />
          </div>
          <div className="flex items-center gap-1">
            <Input
              placeholder="start"
              value={(assignment as any).startIndex || '0'}
              onChange={(e) => onChange(assignment.id, 'startIndex', e.target.value)}
              className={`w-16 ${inputClass}`}
            />
            <span className="text-muted-foreground text-[10px]">:</span>
            <Input
              placeholder="end (empty=end)"
              value={(assignment as any).endIndex || ''}
              onChange={(e) => onChange(assignment.id, 'endIndex', e.target.value)}
              className={`w-24 ${inputClass}`}
            />
          </div>
        </div>
      );

    case 'conditional':
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Input
              placeholder="{variable}"
              value={(assignment as any).conditionVariable || ''}
              onChange={(e) => onChange(assignment.id, 'conditionVariable', e.target.value)}
              className={`w-28 ${inputClass}`}
            />
            <select
              value={(assignment as any).conditionOperator || 'equals'}
              onChange={(e) => onChange(assignment.id, 'conditionOperator', e.target.value)}
              className="h-7 text-[10px] bg-muted/40 border rounded px-1"
            >
              <option value="equals">=</option>
              <option value="not_equals">≠</option>
              <option value="greater_than">&gt;</option>
              <option value="less_than">&lt;</option>
              <option value="contains">∋</option>
              <option value="not_contains">∌</option>
            </select>
            <Input
              placeholder="value"
              value={(assignment as any).conditionValue || ''}
              onChange={(e) => onChange(assignment.id, 'conditionValue', e.target.value)}
              className={`flex-1 ${inputClass}`}
            />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-green-500 w-6">✓</span>
            <Input
              placeholder="if true"
              value={(assignment as any).trueValue || ''}
              onChange={(e) => onChange(assignment.id, 'trueValue', e.target.value)}
              className={`flex-1 ${inputClass}`}
            />
            <span className="text-[10px] text-red-500 w-6">✗</span>
            <Input
              placeholder="if false"
              value={(assignment as any).falseValue || ''}
              onChange={(e) => onChange(assignment.id, 'falseValue', e.target.value)}
              className={`flex-1 ${inputClass}`}
            />
          </div>
        </div>
      );

    case 'lowercase':
    case 'uppercase':
    case 'trim':
    case 'length':
      return (
        <div className="flex items-center gap-1">
          <Input
            placeholder="{variable} — source"
            value={assignment.value || ''}
            onChange={(e) => onChange(assignment.id, 'value', e.target.value)}
            className={`flex-1 ${inputClass}`}
          />
          <VariableSelector
            availableVariables={textVariables}
            onSelect={handleInsertVariable}
          />
        </div>
      );

    case 'lookup':
      return (
        <div className="flex items-center gap-1">
          <Input
            placeholder="table"
            value={assignment.lookupTable || ''}
            onChange={(e) => onChange(assignment.id, 'lookupTable', e.target.value)}
            className={`w-[90px] ${inputClass}`}
          />
          <span className="text-muted-foreground text-[10px]">.</span>
          <Input
            placeholder="field"
            value={assignment.lookupField || ''}
            onChange={(e) => onChange(assignment.id, 'lookupField', e.target.value)}
            className={`flex-1 ${inputClass}`}
          />
        </div>
      );

    default:
      // text, expression, random_item, timestamp, format_duration
      return (
        <div className="flex items-center gap-1">
          <Input
            placeholder={getPlaceholder(assignment.mode)}
            value={assignment.value || ''}
            onChange={(e) => onChange(assignment.id, 'value', e.target.value)}
            className={`flex-1 ${inputClass}`}
          />
          <VariableSelector
            availableVariables={textVariables}
            onSelect={handleInsertVariable}
          />
        </div>
      );
  }
}

/**
 * Возвращает placeholder для поля ввода в зависимости от режима
 */
function getPlaceholder(mode: AssignmentMode): string {
  switch (mode) {
    case 'expression':
      return '{a} + {b} * 2';
    case 'random_item':
      return 'item1, item2, item3';
    case 'timestamp':
      return '0 = now, 90 = +90 sec';
    case 'format_duration':
      return '{expires_at} - {now_ts}';
    default:
      return 'value or {variable}';
  }
}

/**
 * Блок условий для режима lookup
 */
function LookupConditions({
  assignment,
  onChange,
}: {
  assignment: Assignment;
  onChange: (id: string, field: string, val: any) => void;
}) {
  const conditions = assignment.lookupWhere || [];

  return (
    <div className="ml-3 pl-3 border-l-2 border-blue-200 dark:border-blue-800 space-y-1.5">
      <p className="text-[10px] text-blue-500 dark:text-blue-400 font-medium">
        WHERE:
      </p>
      {conditions.map((cond, idx) => (
        <div key={idx} className="flex items-center gap-1">
          <Input
            placeholder="field"
            value={cond.field}
            onChange={(e) => {
              const updated = [...conditions];
              updated[idx] = { ...updated[idx], field: e.target.value };
              onChange(assignment.id, 'lookupWhere', updated);
            }}
            className="w-20 text-xs h-6"
          />
          <span className="text-muted-foreground text-[10px]">=</span>
          <Input
            placeholder="{variable}"
            value={cond.value}
            onChange={(e) => {
              const updated = [...conditions];
              updated[idx] = { ...updated[idx], value: e.target.value };
              onChange(assignment.id, 'lookupWhere', updated);
            }}
            className="flex-1 text-xs h-6"
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 text-muted-foreground hover:text-destructive"
            onClick={() => {
              const updated = conditions.filter((_, i) => i !== idx);
              onChange(assignment.id, 'lookupWhere', updated);
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ))}
      <Button
        variant="ghost"
        size="sm"
        className="h-5 text-[10px] text-blue-500 px-1"
        onClick={() => {
          onChange(assignment.id, 'lookupWhere', [...conditions, { field: '', value: '' }]);
        }}
      >
        + condition
      </Button>
    </div>
  );
}
