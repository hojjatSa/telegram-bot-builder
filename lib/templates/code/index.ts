/**
 * @fileoverview Экспорт модуля code
 * @module templates/code/index
 */

export type { CodeEntry, CodeTemplateParams } from './code.params';
export type { CodeParams } from './code.schema';
export { codeParamsSchema } from './code.schema';
export { collectCodeEntries, generateCodeHandlers } from './code.renderer';
