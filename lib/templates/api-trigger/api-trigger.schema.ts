/**
 * @fileoverview Zod-схема параметров api_trigger
 * @module templates/api-trigger/api-trigger.schema
 */

import { z } from 'zod';

/** Допустимые HTTP-методы */
export const apiTriggerMethodSchema = z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);

/** Схема одного api_trigger */
export const apiTriggerEntrySchema = z.object({
  nodeId: z.string().min(1),
  safeName: z.string().min(1),
  method: apiTriggerMethodSchema,
  path: z.string().min(1),
  secretToken: z.string(),
  saveBodyTo: z.string(),
  saveQueryTo: z.string(),
  saveHeadersTo: z.string(),
  parseJson: z.boolean(),
  targetNodeId: z.string().min(1),
  targetNodeType: z.string(),
});

/** Схема параметров шаблона api_trigger */
export const apiTriggerParamsSchema = z.object({
  entries: z.array(apiTriggerEntrySchema).min(1),
});

/** Тип параметров (выведен из схемы) */
export type ApiTriggerParams = z.infer<typeof apiTriggerParamsSchema>;
