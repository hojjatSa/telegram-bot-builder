/**
 * @fileoverview Определение узла ответа API для сайдбара
 * @module components/editor/sidebar/massive/api-response/api-response-node
 */

import { ComponentDefinition } from '@shared/schema';

/**
 * Узел ответа на входящий HTTP-запрос (пара к api_trigger)
 */
export const apiResponseNode: ComponentDefinition = {
  id: 'api-response',
  name: 'API Response',
  description: 'Завершить входящий HTTP-запрос с JSON или текстом',
  icon: 'fas fa-reply',
  color: 'bg-violet-100 text-violet-600',
  type: 'api_response' as any,
  defaultData: {
    apiResponseStatusCode: 200,
    apiResponseBody: '{"ok":true}',
    apiResponseContentType: 'application/json',
    apiResponseHeaders: [],
    autoTransitionTo: '',
  },
};
