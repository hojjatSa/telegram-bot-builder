/**
 * @fileoverview Превью узла api_response на канвасе
 * @module components/editor/canvas/canvas-node/api-response-preview
 */

import { Node } from '@shared/schema';

/** Пропсы превью ответа API */
interface ApiResponsePreviewProps {
  /** Узел api_response */
  node: Node;
}

/**
 * Превью узла ответа API
 * @param props - Свойства компонента
 * @returns JSX элемент
 */
export function ApiResponsePreview({ node }: ApiResponsePreviewProps) {
  const data = node.data as Record<string, unknown>;
  const status = Number(data.apiResponseStatusCode ?? 200);
  const contentType = String(data.apiResponseContentType ?? 'application/json');
  const body = String(data.apiResponseBody ?? '');

  return (
    <div className="space-y-1.5 p-1">
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
          {status}
        </span>
        <span className="text-xs text-muted-foreground truncate">{contentType}</span>
      </div>
      {body && (
        <div className="text-xs text-muted-foreground font-mono truncate">{body}</div>
      )}
    </div>
  );
}
