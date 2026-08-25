/**
 * @fileoverview Тесты шаблона узла code
 * @module templates/code/code.test
 */

import { describe, it, expect } from 'vitest';
import { collectCodeEntries, generateCodeHandlers } from './code.renderer';
import { nodesWithCode, nodesWithoutCode, nodesWithQuotes } from './code.fixture';

describe('generateCodeHandlers()', () => {
  it('пустые узлы → пустая строка', () => {
    expect(generateCodeHandlers([])).toBe('');
  });

  it('узлы без code → пустая строка', () => {
    expect(generateCodeHandlers(nodesWithoutCode)).toBe('');
  });

  it('генерирует async def handle_callback_', () => {
    const r = generateCodeHandlers(nodesWithCode);
    expect(r).toContain('async def handle_callback_');
  });

  it('содержит обёртку async def __code_entry', () => {
    const r = generateCodeHandlers(nodesWithCode);
    expect(r).toContain('async def __code_entry');
  });

  it('содержит await client в исходнике', () => {
    const r = generateCodeHandlers(nodesWithCode);
    expect(r).toContain('await client.get_messages');
  });

  it('содержит wait_for и таймаут 180', () => {
    const r = generateCodeHandlers(nodesWithCode);
    expect(r).toContain('wait_for');
    expect(r).toContain('180');
  });

  it('не содержит RestrictedPython', () => {
    const r = generateCodeHandlers(nodesWithCode);
    expect(r).not.toContain('RestrictedPython');
  });

  it('передаёт исходник JSON-строкой (экранированные кавычки)', () => {
    const r = generateCodeHandlers(nodesWithQuotes);
    expect(r).toContain('_run_code_node');
    expect(r).toContain('quoted');
    expect(r).toMatch(/_run_code_node\([^)]*\\"/);
  });

  it('переходит к autoTransitionTo', () => {
    const r = generateCodeHandlers(nodesWithCode);
    expect(r).toContain('await handle_callback_msg_1');
  });
});

describe('collectCodeEntries()', () => {
  it('собирает code-узлы', () => {
    const entries = collectCodeEntries(nodesWithCode);
    expect(entries).toHaveLength(1);
    expect(entries[0].nodeId).toBe('code_1');
  });

  it('пропускает не-code узлы', () => {
    expect(collectCodeEntries(nodesWithoutCode)).toHaveLength(0);
  });
});
