/**
 * @fileoverview Фикстуры для тестов api_trigger
 * @module templates/api-trigger/api-trigger.fixture
 */

import type { Node } from '@shared/schema';
import type { ApiTriggerTemplateParams } from './api-trigger.params';

/** Создаёт узел графа */
export function makeNode(id: string, type: string, data: Record<string, unknown>): Node {
  return { id, type: type as Node['type'], position: { x: 0, y: 0 }, data: data as Node['data'] };
}

/** Валидные параметры шаблона */
export const validApiTriggerParams: ApiTriggerTemplateParams = {
  entries: [{
    nodeId: 'api-trigger-1',
    safeName: 'api_trigger_1',
    method: 'POST',
    path: '/payment',
    secretToken: 'test-secret',
    saveBodyTo: 'body',
    saveQueryTo: '',
    saveHeadersTo: '',
    parseJson: true,
    targetNodeId: 'msg-1',
    targetNodeType: 'message',
  }],
};

/** Узлы графа с api_trigger */
export const apiTriggerNodes: Node[] = [
  makeNode('api-trigger-1', 'api_trigger', {
    apiMethod: 'POST',
    apiPath: '/payment',
    apiSecretToken: 'secret',
    apiSaveBodyTo: 'body',
    apiParseJson: true,
    autoTransitionTo: 'msg-1',
    buttons: [],
    keyboardType: 'none',
  }),
  makeNode('msg-1', 'message', { messageText: 'ok', buttons: [], keyboardType: 'none' }),
];
