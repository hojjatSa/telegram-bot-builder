/**
 * @fileoverview Панель свойств ноды произвольного Python-кода
 * @module components/editor/properties/components/configuration/code-configuration
 */

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Node } from '@shared/schema';

/** Пропсы компонента конфигурации Python-кода */
interface CodeConfigurationProps {
  /** Выбранный узел code */
  selectedNode: Node;
  /** Функция обновления данных узла */
  onNodeUpdate: (nodeId: string, updates: Partial<any>) => void;
  /** Все узлы всех листов для выбора следующего узла */
  getAllNodesFromAllSheets: Array<{ node: Node; sheetName: string }>;
  /** Функция форматирования отображения узла */
  formatNodeDisplay: (node: Node, sheetName: string) => string;
}

/**
 * Панель конфигурации ноды Python-кода.
 * Содержит редактор скрипта и выбор следующего узла.
 * @param props - Свойства компонента
 * @returns JSX элемент
 */
export function CodeConfiguration({
  selectedNode,
  onNodeUpdate,
  getAllNodesFromAllSheets,
  formatNodeDisplay,
}: CodeConfigurationProps) {
  const data = selectedNode.data as any;
  const source: string = data?.code || '';
  const autoTransitionTo: string = data?.autoTransitionTo || '';
  const availableTargets = getAllNodesFromAllSheets.filter(
    ({ node }) => node.id !== selectedNode.id,
  );

  /**
   * Обновляет цель автоперехода и флаг включения
   * @param value - ID узла или sentinel без перехода
   */
  const applyTarget = (value: string) => {
    const next = value === 'no-transition' ? '' : value;
    onNodeUpdate(selectedNode.id, {
      autoTransitionTo: next,
      enableAutoTransition: Boolean(next),
    });
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-2">
        <i className="fas fa-code text-indigo-500 dark:text-indigo-400 text-sm" />
        <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
          Python Code
        </span>
      </div>
      <p className="text-[10px] text-muted-foreground leading-relaxed">
        Пишите тело async-функции с await. Переменные пользователя доступны по имени, присваивание сохраняется.
        client и userbot_client — тот же вход юзербота, что у узлов «Сообщение / Нажать кнопку».
        Без USERBOT_API_ID / USERBOT_API_HASH / USERBOT_SESSION_STRING вызовы Telethon не сработают, остальной Python — да.
      </p>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Скрипт</Label>
        <textarea
          value={source}
          onChange={(e) => onNodeUpdate(selectedNode.id, { code: e.target.value })}
          spellCheck={false}
          placeholder={'# msgs = await client.get_messages(entity, limit=1)\n# result = 42'}
          className="w-full min-h-[220px] p-3 text-xs font-mono leading-relaxed border border-indigo-200/60 dark:border-indigo-800/50 rounded-lg bg-slate-50/80 dark:bg-slate-950/60 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
        />
      </div>
      <div className="flex flex-col p-3 rounded-lg bg-gradient-to-br from-indigo-50/60 to-slate-50/40 dark:from-indigo-950/30 dark:to-slate-950/20 border border-indigo-200/40 dark:border-indigo-700/40">
        <Label className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
          Следующий узел
        </Label>
        <Select value={autoTransitionTo || 'no-transition'} onValueChange={applyTarget}>
          <SelectTrigger className="text-xs h-8 bg-white/60 dark:bg-slate-950/60">
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
          onChange={(e) => applyTarget(e.target.value || 'no-transition')}
          className="text-xs h-8 mt-1.5 bg-white/60 dark:bg-slate-950/60"
          placeholder="or enter an ID manually"
        />
      </div>
    </div>
  );
}
