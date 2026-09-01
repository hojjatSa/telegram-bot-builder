/**
 * @fileoverview Тесты шаблона api_response
 * @module templates/api-response/api-response.test
 */

import { describe, expect, it } from 'vitest';
import {
  collectApiResponseEntries,
  generateApiResponse,
  generateApiResponseHandlers,
} from './api-response.renderer';
import { apiResponseParamsSchema } from './api-response.schema';
import { apiResponseNode, validApiResponseParams } from './api-response.fixture';

describe('generateApiResponse()', () => {
  it('генерирует callback-обработчик api_response', () => {
    const code = generateApiResponse(validApiResponseParams);
    expect(code).toContain('@dp.callback_query(lambda c: c.data == "api-response-1")');
    expect(code).toContain('handle_callback_api_response_1');
    expect(code).toContain('_api_pending_responses');
  });

  it('валидирует параметры через Zod', () => {
    expect(() => apiResponseParamsSchema.parse(validApiResponseParams)).not.toThrow();
  });
});

describe('collectApiResponseEntries()', () => {
  it('собирает записи из узлов', () => {
    const entries = collectApiResponseEntries([apiResponseNode]);
    expect(entries[0].body).toBe('{"paid":true}');
  });
});

describe('generateApiResponseHandlers()', () => {
  it('возвращает пустую строку без узлов', () => {
    expect(generateApiResponseHandlers([])).toBe('');
  });
});
