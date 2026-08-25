/**
 * @fileoverview Рендер обработчиков узла code
 * @module templates/code/code.renderer
 */

import type { Node } from '@shared/schema';
import type { CodeEntry } from './code.params';
import { renderPartialTemplate } from '../template-renderer';

/**
 * Собирает CodeEntry[] из узлов холста
 * @param nodes - Узлы проекта
 * @returns Массив записей code
 */
export function collectCodeEntries(nodes: Node[]): CodeEntry[] {
  const validNodes = nodes.filter(n => n != null);
  return validNodes
    .filter(n => (n.type as string) === 'code')
    .map(node => ({
      nodeId: node.id,
      code: String((node.data as any)?.code || ''),
      autoTransitionTo: node.data?.autoTransitionTo || '',
    }));
}

/**
 * Генерирует Python-обработчики всех узлов code
 * @param nodes - Узлы проекта
 * @returns Сгенерированный код или пустая строка
 */
export function generateCodeHandlers(nodes: Node[]): string {
  const entries = collectCodeEntries(nodes);
  if (entries.length === 0) return '';
  return renderPartialTemplate('code/code.py.jinja2', { codeEntries: entries });
}
