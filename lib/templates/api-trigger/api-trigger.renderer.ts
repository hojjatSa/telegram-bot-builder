/**
 * @fileoverview Рендерер шаблона api_trigger
 * @module templates/api-trigger/api-trigger.renderer
 */

import type { Node } from '@shared/schema';
import type { ApiTriggerEntry, ApiTriggerTemplateParams } from './api-trigger.params';
import { apiTriggerParamsSchema } from './api-trigger.schema';
import { renderPartialTemplate } from '../template-renderer';

/**
 * Собирает ApiTriggerEntry[] из узлов графа
 * @param nodes - Массив узлов холста
 * @returns Массив записей API-триггеров
 */
export function collectApiTriggerEntries(nodes: Node[]): ApiTriggerEntry[] {
  const validNodes = nodes.filter((n) => n != null);
  const nodeMap = new Map(validNodes.map((n) => [n.id, n]));
  const entries: ApiTriggerEntry[] = [];

  for (const node of validNodes) {
    if ((node.type as string) !== 'api_trigger') continue;
    const data = node.data as Record<string, unknown>;
    const targetNodeId = String(data.autoTransitionTo ?? '').trim();
    if (!targetNodeId) continue;

    const targetNode = nodeMap.get(targetNodeId);
    const path = String(data.apiPath ?? '/').trim() || '/';
    const method = String(data.apiMethod ?? 'POST').toUpperCase() as ApiTriggerEntry['method'];

    entries.push({
      nodeId: node.id,
      safeName: node.id.replace(/[^a-zA-Z0-9_]/g, '_'),
      method: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method) ? method : 'POST',
      path: path.startsWith('/') ? path : `/${path}`,
      secretToken: String(data.apiSecretToken ?? ''),
      saveBodyTo: String(data.apiSaveBodyTo ?? 'body'),
      saveQueryTo: String(data.apiSaveQueryTo ?? ''),
      saveHeadersTo: String(data.apiSaveHeadersTo ?? ''),
      parseJson: data.apiParseJson !== false,
      targetNodeId,
      targetNodeType: targetNode?.type ?? 'message',
    });
  }

  return entries;
}

/**
 * Генерирует Python-код api_trigger из параметров
 * @param params - Параметры шаблона
 * @returns Сгенерированный Python-код
 */
export function generateApiTrigger(params: ApiTriggerTemplateParams): string {
  if (params.entries.length === 0) return '';
  const validated = apiTriggerParamsSchema.parse(params);
  return renderPartialTemplate('api-trigger/api-trigger.py.jinja2', {
    entries: validated.entries,
  });
}

/**
 * Генерирует Python-код api_trigger из массива узлов
 * @param nodes - Массив узлов холста
 * @returns Сгенерированный Python-код
 */
export function generateApiTriggerHandlers(nodes: Node[]): string {
  const entries = collectApiTriggerEntries(nodes);
  if (entries.length === 0) return '';
  return generateApiTrigger({ entries });
}
