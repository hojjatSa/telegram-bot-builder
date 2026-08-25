/**
 * @fileoverview Zod-схема параметров узла code
 * @module templates/code/code.schema
 */

import { z } from 'zod';

/** Схема одного узла code */
export const codeParamsSchema = z.object({
  /** ID узла */
  nodeId: z.string(),
  /** Python-код пользователя */
  code: z.string().default(''),
  /** ID следующего узла */
  autoTransitionTo: z.string().default(''),
});

/** Тип параметров узла code */
export type CodeParams = z.infer<typeof codeParamsSchema>;
