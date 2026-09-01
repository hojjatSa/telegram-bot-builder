/**
 * @fileoverview Превью узла api_trigger на канвасе
 * @module components/editor/canvas/canvas-node/api-trigger-preview
 */

import { Node } from '@shared/schema';

/** Пропсы превью API-триггера */
interface ApiTriggerPreviewProps {
  /** Узел api_trigger */
  node: Node;
}

/** Цвета HTTP-методов */
const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  POST: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  PUT: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  PATCH: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

/**
 * Превью API-триггера на канвасе
 * @param props - Свойства компонента
 * @returns JSX элемент
 */
export function ApiTriggerPreview({ node }: ApiTriggerPreviewProps) {
  const data = node.data as Record<string, unknown>;
  const method = String(data.apiMethod || 'POST');
  const path = String(data.apiPath || '/path');
  const bodyVar = String(data.apiSaveBodyTo || '');

  return (
    <div className="px-3 py-2 text-xs space-y-1">
      <div className="flex items-center gap-1.5 mb-1">
        <i className="fas fa-plug text-violet-500 text-[10px]" />
        <span className="font-semibold text-violet-700 dark:text-violet-300 text-[11px]">API триггер</span>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${METHOD_COLORS[method] || METHOD_COLORS.POST}`}>
          {method}
        </span>
        <span className="font-medium text-violet-700 dark:text-violet-300 truncate">{path}</span>
      </div>
      {bodyVar && (
        <div className="text-gray-500 dark:text-gray-400 text-[10px] truncate">
          body → {'{'}{bodyVar}{'}'}
        </div>
      )}
    </div>
  );
}
