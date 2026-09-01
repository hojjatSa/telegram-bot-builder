/**
 * @fileoverview Экспорт модуля api_response
 * @module templates/api-response/index
 */

export type { ApiResponseEntry, ApiResponseTemplateParams } from './api-response.params';
export type { ApiResponseParams } from './api-response.schema';
export { apiResponseParamsSchema } from './api-response.schema';
export {
  collectApiResponseEntries,
  generateApiResponse,
  generateApiResponseHandlers,
  type ApiResponseNodeContext,
} from './api-response.renderer';
