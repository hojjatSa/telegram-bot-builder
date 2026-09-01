/**
 * @fileoverview Интеграционные тесты api_trigger + api_response (фаза 73)
 */

import fs from 'fs';
import { execSync } from 'child_process';
import { generatePythonCode } from '../bot-generator.ts';

function makeCleanProject(nodes: unknown[]) {
  return {
    sheets: [{
      id: 'sheet1',
      name: 'Test',
      nodes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewState: { pan: { x: 0, y: 0 }, zoom: 100 },
    }],
    version: 2,
    activeSheetId: 'sheet1',
  };
}

function gen(project: unknown, label: string): string {
  return generatePythonCode(project as any, { botName: `Phase73_${label}`, userDatabaseEnabled: false });
}

function checkSyntax(code: string, label: string): { ok: boolean; error?: string } {
  const tmp = `_tmp_p73_${label}.py`;
  fs.writeFileSync(tmp, code, 'utf-8');
  try {
    execSync(`python -m py_compile ${tmp}`, { stdio: 'pipe' });
    fs.unlinkSync(tmp);
    return { ok: true };
  } catch (e: any) {
    try { fs.unlinkSync(tmp); } catch {}
    return { ok: false, error: e.stderr?.toString() ?? String(e) };
  }
}

function ok(cond: boolean, msg: string) { if (!cond) throw new Error(msg); }
function syntax(code: string, label: string) {
  const r = checkSyntax(code, label);
  ok(r.ok, `Синтаксическая ошибка:\n${r.error}`);
}

function makeApiTrigger(id: string, targetId: string) {
  return {
    id,
    type: 'api_trigger',
    position: { x: 0, y: 0 },
    data: {
      apiMethod: 'POST',
      apiPath: '/payment',
      apiSecretToken: 'secret',
      apiSaveBodyTo: 'body',
      apiParseJson: true,
      autoTransitionTo: targetId,
      buttons: [],
      keyboardType: 'none',
    },
  };
}

function makeApiResponse(id: string) {
  return {
    id,
    type: 'api_response',
    position: { x: 200, y: 0 },
    data: {
      apiResponseStatusCode: 200,
      apiResponseBody: '{"ok":true}',
      apiResponseContentType: 'application/json',
      autoTransitionTo: '',
      buttons: [],
      keyboardType: 'none',
    },
  };
}

function makeMessageNode(id: string) {
  return {
    id,
    type: 'message',
    position: { x: 400, y: 0 },
    data: { messageText: 'ok', buttons: [], keyboardType: 'none', formatMode: 'none', markdown: false },
  };
}

console.log('\n╔══════════════════════════════════════════════════════════════╗');
console.log('║   Фаза 73 — api_trigger + api_response                      ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

const project = makeCleanProject([
  makeApiTrigger('api1', 'resp1'),
  makeApiResponse('resp1'),
  makeMessageNode('msg1'),
]);

const code = gen(project, 'main');

ok(code.includes('register_api_trigger_routes'), 'должен быть register_api_trigger_routes');
ok(code.includes('invalid_secret'), 'должна быть проверка secret');
ok(code.includes('handle_callback_resp1'), 'должен быть api_response handler');
ok(code.includes('API сервер запущен') || code.includes('register_api_trigger_routes'), 'polling API infra');
syntax(code, 'main');

console.log('\n✅ Все тесты фазы 73 (api_trigger + api_response) пройдены!\n');
