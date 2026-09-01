/**
 * @fileoverview Фикстуры для тестов api_response
 * @module templates/api-response/api-response.fixture
 */

import type { Node } from '@shared/schema';
import type { ApiResponseTemplateParams } from './api-response.params';

/** Создаёт узел графа */
export function makeNode(id: string, type: string, data: Record<string, unknown>): Node {
  return { id, type: type as Node['type'], position: { x: 0, y: 0 }, data: data as Node['data'] };
}

/** Валидные параметры шаблона */
export const validApiResponseParams: ApiResponseTemplateParams = {
  entries: [{
    nodeId: 'api-response-1',
    safeName: 'api_response_1',
    statusCode: 200,
    body: '{"ok":true}',
    contentType: 'application/json',
    autoTransitionTo: '',
    autoTransitionTargetExists: false,
  }],
};

/** Узел api_response */
export const apiResponseNode: Node = makeNode('api-response-1', 'api_response', {
  apiResponseStatusCode: 200,
  apiResponseBody: '{"paid":true}',
  apiResponseContentType: 'application/json',
  autoTransitionTo: '',
  buttons: [],
  keyboardType: 'none',
});
