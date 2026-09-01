/**
 * @fileoverview Экспорт модуля api_trigger
 * @module templates/api-trigger/index
 */

export type { ApiTriggerEntry, ApiTriggerMethod, ApiTriggerTemplateParams } from './api-trigger.params';
export type { ApiTriggerParams } from './api-trigger.schema';
export { apiTriggerParamsSchema, apiTriggerMethodSchema } from './api-trigger.schema';
export {
  collectApiTriggerEntries,
  generateApiTrigger,
  generateApiTriggerHandlers,
} from './api-trigger.renderer';
