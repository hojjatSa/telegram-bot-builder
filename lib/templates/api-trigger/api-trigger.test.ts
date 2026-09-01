/**
 * @fileoverview Тесты шаблона api_trigger
 * @module templates/api-trigger/api-trigger.test
 */

import { describe, expect, it } from 'vitest';
import {
  collectApiTriggerEntries,
  generateApiTrigger,
  generateApiTriggerHandlers,
} from './api-trigger.renderer';
import { apiTriggerParamsSchema } from './api-trigger.schema';
import { apiTriggerNodes, validApiTriggerParams } from './api-trigger.fixture';

describe('generateApiTrigger()', () => {
  it('генерирует register_api_trigger_routes и проверку secret', () => {
    const code = generateApiTrigger(validApiTriggerParams);
    expect(code).toContain('register_api_trigger_routes');
    expect(code).toContain('invalid_secret');
    expect(code).toContain('_api_handler_api_trigger_1');
    expect(code).toContain('add_post');
  });

  it('валидирует параметры через Zod', () => {
    expect(() => apiTriggerParamsSchema.parse(validApiTriggerParams)).not.toThrow();
  });
});

describe('collectApiTriggerEntries()', () => {
  it('собирает записи из узлов графа', () => {
    const entries = collectApiTriggerEntries(apiTriggerNodes);
    expect(entries).toHaveLength(1);
    expect(entries[0].path).toBe('/payment');
    expect(entries[0].targetNodeId).toBe('msg-1');
  });
});

describe('generateApiTriggerHandlers()', () => {
  it('возвращает пустую строку без api_trigger', () => {
    expect(generateApiTriggerHandlers([])).toBe('');
  });
});
