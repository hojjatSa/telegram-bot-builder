/**
 * @fileoverview Zod-схема параметров api_response
 * @module templates/api-response/api-response.schema
 */

import { z } from 'zod';

/** Схема одного api_response */
export const apiResponseEntrySchema = z.object({
  nodeId: z.string().min(1),
  safeName: z.string().min(1),
  statusCode: z.number().int().min(100).max(599),
  body: z.string(),
  contentType: z.string().min(1),
  autoTransitionTo: z.string(),
  autoTransitionTargetExists: z.boolean(),
});

/** Схема параметров шаблона api_response */
export const apiResponseParamsSchema = z.object({
  entries: z.array(apiResponseEntrySchema).min(1),
});

/** Тип параметров (выведен из схемы) */
export type ApiResponseParams = z.infer<typeof apiResponseParamsSchema>;
