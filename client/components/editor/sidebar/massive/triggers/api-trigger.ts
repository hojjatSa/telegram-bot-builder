/**
 * @fileoverview Определение триггера входящего HTTP API (API Trigger)
 * @module components/editor/sidebar/massive/triggers/api-trigger
 */

import { ComponentDefinition } from '@shared/schema';

/**
 * Определение компонента API-триггера.
 * Запускает цепочку при входящем HTTP-запросе от внешней системы.
 */
export const apiTrigger: ComponentDefinition = {
  id: 'api-trigger',
  name: 'API триггер',
  description: 'Входящий HTTP API — запуск сценария извне',
  icon: 'fas fa-plug',
  color: 'bg-violet-100 text-violet-600',
  type: 'api_trigger' as any,
  defaultData: {
    apiMethod: 'POST',
    apiPath: '/hook',
    apiSecretToken: '',
    apiSaveBodyTo: 'body',
    apiSaveQueryTo: '',
    apiSaveHeadersTo: '',
    apiParseJson: true,
    autoTransitionTo: '',
  },
};
