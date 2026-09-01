/**
 * @fileoverview Рендерер шаблона api_response
 * @module templates/api-response/api-response.renderer
 */

import type { Node } from '@shared/schema';
import type { ApiResponseEntry, ApiResponseTemplateParams } from './api-response.params';
import { apiResponseParamsSchema } from './api-response.schema';
import { renderPartialTemplate } from '../template-renderer';

/** Контекст графа для разрешения автоперехода */
export interface ApiResponseNodeContext {
  /** Все узлы проекта */
  allNodes?: Node[];
}

/**
 * Собирает ApiResponseEntry[] из узлов графа
 * @param nodes - Массив узлов
 * @param context - Контекст графа
 * @returns Массив записей api_response
 */
export function collectApiResponseEntries(nodes: Node[], context?: ApiResponseNodeContext): ApiResponseEntry[] {
  const validNodes = nodes.filter((n) => n != null);
  return validNodes
    .filter((n) => (n.type as string) === 'api_response')
    .map((node) => {
      const data = node.data as Record<string, unknown>;
      const autoTransitionTo = String(data.autoTransitionTo ?? '').trim();
      return {
        nodeId: node.id,
        safeName: node.id.replace(/[^a-zA-Z0-9_]/g, '_'),
        statusCode: Number(data.apiResponseStatusCode ?? 200) || 200,
        body: String(data.apiResponseBody ?? '{"ok":true}'),
        contentType: String(data.apiResponseContentType ?? 'application/json'),
        autoTransitionTo,
        autoTransitionTargetExists: autoTransitionTo
          ? (context?.allNodes ?? validNodes).some((n) => n.id === autoTransitionTo)
          : false,
      };
    });
}

/**
 * Генерирует Python-код api_response из параметров
 * @param params - Параметры шаблона
 * @returns Сгенерированный Python-код
 */
export function generateApiResponse(params: ApiResponseTemplateParams): string {
  if (params.entries.length === 0) return '';
  const validated = apiResponseParamsSchema.parse(params);
  return renderPartialTemplate('api-response/api-response.py.jinja2', validated);
}

/**
 * Генерирует Python-код api_response из массива узлов
 * @param nodes - Массив узлов
 * @param context - Контекст графа
 * @returns Сгенерированный Python-код
 */
export function generateApiResponseHandlers(nodes: Node[], context?: ApiResponseNodeContext): string {
  const entries = collectApiResponseEntries(nodes, context);
  if (entries.length === 0) return '';
  return generateApiResponse({ entries });
}
