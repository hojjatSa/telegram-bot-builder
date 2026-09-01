/**
 * @fileoverview Параметры шаблона api_response
 * @module templates/api-response/api-response.params
 */

/** Один узел api_response */
export interface ApiResponseEntry {
  /** ID узла api_response */
  nodeId: string;
  /** Безопасное имя для Python-идентификаторов */
  safeName: string;
  /** HTTP-статус ответа */
  statusCode: number;
  /** Тело ответа (поддерживает {переменные}) */
  body: string;
  /** Content-Type */
  contentType: string;
  /** ID узла автоперехода */
  autoTransitionTo: string;
  /** Существует ли целевой узел автоперехода */
  autoTransitionTargetExists: boolean;
}

/** Параметры генерации api_response */
export interface ApiResponseTemplateParams {
  /** Список узлов ответа */
  entries: ApiResponseEntry[];
}
