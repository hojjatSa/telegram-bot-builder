/**
 * @fileoverview Доменные правила валидации project.json
 * @module lib/bot-tools/validate-domain
 */

import type { Node } from '@shared/schema';
import { CONDITION_OPERATORS, NODE_TYPES } from './constants.ts';
import { collectAllNodes, collectNodeTransitions } from './collect-nodes.ts';
import type { ValidationIssue } from './types.ts';

/**
 * Проверяет доменные правила поверх zod-структуры
 * @param project - Распарсенный project.json
 * @returns Список ошибок и предупреждений
 */
export function validateDomainRules(project: Record<string, unknown>): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const entries = collectAllNodes(project);
  const idCounts = new Map<string, number>();
  const nodeIds = new Set<string>();

  for (const { node, sheetId } of entries) {
    nodeIds.add(node.id);
    idCounts.set(node.id, (idCounts.get(node.id) ?? 0) + 1);

    if (!NODE_TYPES.includes(node.type as typeof NODE_TYPES[number])) {
      issues.push({
        severity: 'error',
        path: `sheets[].nodes[id=${node.id}].type`,
        message: `Неизвестный тип ноды: ${node.type}`,
        code: 'unknown_node_type',
      });
    }

    validateConditionNode(node, sheetId, issues);
    validateForbiddenConditionFormat(node, issues);
    validateMessageInlineKeyboard(node, issues);
    validateApiTriggerNode(node, sheetId, issues);
  }

  validateApiTriggerDuplicates(entries, issues);

  for (const [id, count] of idCounts) {
    if (count > 1) {
      issues.push({
        severity: 'error',
        path: `nodes[id=${id}]`,
        message: `Дублирующийся id ноды: ${id} (встречается ${count} раз)`,
        code: 'duplicate_node_id',
      });
    }
  }

  for (const { node, sheetId } of entries) {
    for (const { label, target } of collectNodeTransitions(node)) {
      if (isExternalOrEmptyTarget(target) || nodeIds.has(target)) continue;
      issues.push({
        severity: 'error',
        path: `sheets[${sheetId}].nodes[id=${node.id}].${label}`,
        message: `Ссылка на несуществующую ноду: ${target}`,
        code: 'broken_target',
      });
    }
  }

  const hasStart = entries.some(({ node }) => node.type === 'start' || node.type === 'command_trigger');
  if (!hasStart && entries.length > 0) {
    issues.push({
      severity: 'warning',
      path: 'sheets',
      message: 'Нет start или command_trigger — бот может не иметь точки входа',
      code: 'no_entry_node',
    });
  }

  if (entries.length === 0) {
    issues.push({
      severity: 'warning',
      path: 'sheets',
      message: 'Проект не содержит нод',
      code: 'empty_project',
    });
  }

  return issues;
}

/**
 * URL, tg-ссылки и пустые строки — не id нод, их не считаем broken_target
 * @param target - Значение target у кнопки, ветки или автоперехода
 * @returns true если проверять существование ноды не нужно
 */
function isExternalOrEmptyTarget(target: string): boolean {
  const trimmed = target.trim();
  if (!trimmed) return true;
  return /^(https?:\/\/|tg:\/\/)/i.test(trimmed) || /^t\.me\//i.test(trimmed);
}

/**
 * Проверяет condition-ноду на корректность branches
 * @param node - Узел
 * @param sheetId - ID листа
 * @param issues - Массив для накопления проблем
 */
function validateConditionNode(node: Node, sheetId: string, issues: ValidationIssue[]): void {
  if (node.type !== 'condition') return;

  const branches = node.data?.branches ?? [];
  if (branches.length === 0) {
    issues.push({
      severity: 'error',
      path: `sheets[${sheetId}].nodes[id=${node.id}].data.branches`,
      message: 'condition-нода должна содержать массив branches',
      code: 'condition_no_branches',
    });
    return;
  }

  const hasElse = branches.some((b) => b.operator === 'else');
  if (!hasElse) {
    issues.push({
      severity: 'error',
      path: `sheets[${sheetId}].nodes[id=${node.id}].data.branches`,
      message: 'condition-нода должна иметь ветку с operator: "else"',
      code: 'condition_missing_else',
    });
  }

  for (let i = 0; i < branches.length; i++) {
    const op = branches[i].operator;
    if (!CONDITION_OPERATORS.includes(op as typeof CONDITION_OPERATORS[number])) {
      issues.push({
        severity: 'error',
        path: `sheets[${sheetId}].nodes[id=${node.id}].data.branches[${i}].operator`,
        message: `Недопустимый оператор: ${op}`,
        code: 'invalid_operator',
      });
    }
  }
}

/**
 * Ловит галлюцинации ИИ: conditions + defaultTarget
 * @param node - Узел
 * @param issues - Массив проблем
 */
function validateForbiddenConditionFormat(node: Node, issues: ValidationIssue[]): void {
  if (node.type !== 'condition') return;
  const data = node.data as Record<string, unknown>;
  if ('conditions' in data || 'defaultTarget' in data) {
    issues.push({
      severity: 'error',
      path: `nodes[id=${node.id}].data`,
      message: 'Неверный формат condition: используйте branches, а не conditions/defaultTarget',
      code: 'condition_wrong_format',
    });
  }
}

/**
 * Неблокирующее предупреждение: у message-ноды есть инлайн/reply-кнопки внутри
 * самой ноды (непустой buttons и keyboardType != 'none'). При записи через
 * API/MCP такие кнопки будут автоматически вынесены в отдельную keyboard-ноду
 * (см. hoist-keyboard.ts). Это warn, а не error, чтобы не ломать легаси-проекты.
 * @param node - Узел
 * @param issues - Массив проблем
 */
function validateMessageInlineKeyboard(node: Node, issues: ValidationIssue[]): void {
  if (node.type !== 'message') return;
  const data = node.data as Record<string, unknown>;
  const hasButtons = Array.isArray(data.buttons) && data.buttons.length > 0;
  const keyboardType = data.keyboardType;
  const isHoistableType = keyboardType === 'inline' || keyboardType === 'reply';
  if (hasButtons && isHoistableType) {
    issues.push({
      severity: 'warning',
      path: `nodes[id=${node.id}].data.buttons`,
      message: `У message-ноды ${node.id} инлайн-кнопки будут вынесены в отдельную keyboard-ноду`,
      code: 'inline_keyboard_will_hoist',
    });
  }
}

/** Допустимые HTTP-методы api_trigger */
const API_TRIGGER_METHODS = new Set(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);

/**
 * Проверяет api_trigger: path, method, зарезервированные префиксы
 * @param node - Узел
 * @param sheetId - ID листа
 * @param issues - Массив проблем
 */
function validateApiTriggerNode(node: Node, sheetId: string, issues: ValidationIssue[]): void {
  if ((node.type as string) !== 'api_trigger') return;
  const data = node.data as Record<string, unknown>;
  const method = String(data.apiMethod ?? 'POST').toUpperCase();
  const path = String(data.apiPath ?? '').trim();

  if (!API_TRIGGER_METHODS.has(method)) {
    issues.push({
      severity: 'error',
      path: `sheets[${sheetId}].nodes[id=${node.id}].data.apiMethod`,
      message: `Недопустимый apiMethod: ${method}`,
      code: 'api_trigger_invalid_method',
    });
  }

  if (!path || path === '/') {
    issues.push({
      severity: 'error',
      path: `sheets[${sheetId}].nodes[id=${node.id}].data.apiPath`,
      message: 'api_trigger: укажите путь, например /payment',
      code: 'api_trigger_empty_path',
    });
    return;
  }

  if (!path.startsWith('/')) {
    issues.push({
      severity: 'error',
      path: `sheets[${sheetId}].nodes[id=${node.id}].data.apiPath`,
      message: 'apiPath должен начинаться с /',
      code: 'api_trigger_path_format',
    });
  }

  if (path.includes('..') || /\s/.test(path)) {
    issues.push({
      severity: 'error',
      path: `sheets[${sheetId}].nodes[id=${node.id}].data.apiPath`,
      message: 'apiPath не должен содержать .. или пробелы',
      code: 'api_trigger_path_unsafe',
    });
  }

  const lower = path.toLowerCase();
  if (lower.startsWith('/api/') || lower.startsWith('/webhook')) {
    issues.push({
      severity: 'error',
      path: `sheets[${sheetId}].nodes[id=${node.id}].data.apiPath`,
      message: 'Зарезервированный префикс пути: /api/ и /webhook',
      code: 'api_trigger_reserved_path',
    });
  }
}

/**
 * Уникальность пары (apiMethod, apiPath) в проекте
 * @param entries - Все узлы
 * @param issues - Массив проблем
 */
function validateApiTriggerDuplicates(
  entries: Array<{ node: Node; sheetId: string }>,
  issues: ValidationIssue[],
): void {
  const seen = new Map<string, string>();
  for (const { node, sheetId } of entries) {
    if ((node.type as string) !== 'api_trigger') continue;
    const data = node.data as Record<string, unknown>;
    const method = String(data.apiMethod ?? 'POST').toUpperCase();
    const path = String(data.apiPath ?? '').trim();
    if (!path) continue;
    const key = `${method} ${path}`;
    const prev = seen.get(key);
    if (prev) {
      issues.push({
        severity: 'error',
        path: `sheets[${sheetId}].nodes[id=${node.id}].data.apiPath`,
        message: `Дублирующийся api_trigger: ${key} (уже есть у ноды ${prev})`,
        code: 'api_trigger_duplicate',
      });
    } else {
      seen.set(key, node.id);
    }
  }
}
