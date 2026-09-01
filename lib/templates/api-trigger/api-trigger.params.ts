/**
 * @fileoverview Параметры шаблона api_trigger
 * @module templates/api-trigger/api-trigger.params
 */

/** HTTP-метод API-триггера */
export type ApiTriggerMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/** Один узел api_trigger */
export interface ApiTriggerEntry {
  /** ID узла api_trigger */
  nodeId: string;
  /** Безопасное имя для Python-идентификаторов */
  safeName: string;
  /** HTTP-метод */
  method: ApiTriggerMethod;
  /** Путь эндпоинта (например /payment) */
  path: string;
  /** Secret-токен для проверки заголовка */
  secretToken: string;
  /** Имя переменной для тела запроса */
  saveBodyTo: string;
  /** Имя переменной для query-параметров */
  saveQueryTo: string;
  /** Имя переменной для заголовков */
  saveHeadersTo: string;
  /** Парсить JSON-тело */
  parseJson: boolean;
  /** ID целевого узла цепочки */
  targetNodeId: string;
  /** Тип целевого узла */
  targetNodeType: string;
}

/** Параметры генерации api_trigger */
export interface ApiTriggerTemplateParams {
  /** Список API-триггеров */
  entries: ApiTriggerEntry[];
}
