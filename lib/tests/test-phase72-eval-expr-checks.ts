/**
 * @fileoverview Фаза 72 — методы-проверки строк в _eval_expr (isdigit и родственные)
 *
 * Блок A: белый список методов
 * Блок B: документация функции
 * Блок C: рантайм-поведение на реальных значениях
 */

import { execFileSync } from 'node:child_process';
import { writeFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { renderPartialTemplate } from '../templates/template-renderer.ts';

type Result = { id: string; name: string; passed: boolean; note: string };
const results: Result[] = [];

/** @param id - Идентификатор теста @param name - Название @param fn - Проверка */
function test(id: string, name: string, fn: () => void) {
  try {
    fn();
    results.push({ id, name, passed: true, note: 'OK' });
    console.log(`  ✅ ${id}. ${name}`);
  } catch (e: unknown) {
    const note = e instanceof Error ? e.message : String(e);
    results.push({ id, name, passed: false, note });
    console.log(`  ❌ ${id}. ${name}\n     → ${note}`);
  }
}

/** @param cond - Условие @param msg - Сообщение об ошибке */
function ok(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

/** Рендерит utils-шаблон без базы данных пользователей */
function renderUtils(): string {
  return renderPartialTemplate('utils/utils.py.jinja2', { userDatabaseEnabled: false });
}

/** Возвращает тело функции _eval_expr из отрендеренного шаблона */
function evalExprBody(): string {
  const code = renderUtils();
  const start = code.indexOf('def _eval_expr(');
  const end = code.indexOf('def replace_variables_in_text', start);
  ok(start > -1 && end > start, '_eval_expr должна присутствовать в utils');
  return code.slice(start, end);
}

console.log('\n╔══════════════════════════════════════════════════════════════╗');
console.log('║   Фаза 72 — _eval_expr: isdigit и другие проверки строк      ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

console.log('── Блок A: белый список методов ──────────────────────────────────');

test('A01', 'isdigit в _safe_methods', () => {
  ok(evalExprBody().includes("'isdigit'"), 'Должен разрешать isdigit');
});

test('A02', 'isnumeric и isdecimal в _safe_methods', () => {
  const body = evalExprBody();
  ok(body.includes("'isnumeric'"), 'Должен разрешать isnumeric');
  ok(body.includes("'isdecimal'"), 'Должен разрешать isdecimal');
});

test('A03', 'isalpha, isalnum, isspace в _safe_methods', () => {
  const body = evalExprBody();
  ok(body.includes("'isalpha'"), 'Должен разрешать isalpha');
  ok(body.includes("'isalnum'"), 'Должен разрешать isalnum');
  ok(body.includes("'isspace'"), 'Должен разрешать isspace');
});

test('A04', 'ранее разрешённые методы не потеряны', () => {
  const body = evalExprBody();
  for (const m of ['replace', 'strip', 'lower', 'upper', 'split', 'join', 'count', 'find', 'format']) {
    ok(body.includes(`'${m}'`), `Метод ${m} должен остаться в белом списке`);
  }
});

test('A05', 'comprehension по-прежнему запрещён (нет GeneratorExp)', () => {
  const body = evalExprBody();
  ok(!body.includes('GeneratorExp'), 'GeneratorExp не должен попадать в белый список');
  ok(!body.includes('ListComp'), 'ListComp не должен попадать в белый список');
});

console.log('\n── Блок B: документация ──────────────────────────────────────────');

test('B01', 'Docstring перечисляет методы-проверки', () => {
  const code = renderUtils();
  const start = code.indexOf('def _eval_expr(');
  const end = code.indexOf('import re as _re_expr', start);
  const doc = code.slice(start, end);
  ok(doc.includes('isdigit'), 'Docstring должен упоминать isdigit');
});

test('B02', 'Docstring предупреждает про comprehension', () => {
  const code = renderUtils();
  const start = code.indexOf('def _eval_expr(');
  const end = code.indexOf('import re as _re_expr', start);
  const doc = code.slice(start, end);
  ok(doc.includes('omprehension'), 'Docstring должен предупреждать про comprehension');
});

console.log('\n── Блок C: рантайм ───────────────────────────────────────────────');

/**
 * Прогоняет выражение через отрендеренную _eval_expr в реальном Python.
 * @param expr - Выражение с {переменными}
 * @param vars - Переменные пользователя
 * @returns Строковый результат из stdout
 */
function runEval(expr: string, vars: Record<string, string>): string {
  const code = renderUtils();
  const start = code.indexOf('def _eval_expr(');
  const end = code.indexOf('def replace_variables_in_text', start);
  const fn = code.slice(start, end);
  const script = `${fn}\nimport json\nprint(_eval_expr(${JSON.stringify(expr)}, json.loads(${JSON.stringify(JSON.stringify(vars))})))\n`;
  const file = join(tmpdir(), `evalexpr_${Date.now()}_${Math.random().toString(36).slice(2)}.py`);
  writeFileSync(file, script, 'utf8');
  try {
    return String(execFileSync('python', [file], { encoding: 'utf8' })).trim();
  } finally {
    unlinkSync(file);
  }
}

test('C01', 'isdigit отсеивает мусорный ввод → 0', () => {
  const out = runEval("int('{amt}') if '{amt}'.isdigit() else 0", { amt: 'хммм' });
  ok(out === '0', `Ожидался 0, получено ${out}`);
});

test('C02', 'isdigit пропускает корректное целое', () => {
  const out = runEval("int('{amt}') if '{amt}'.isdigit() else 0", { amt: '10000' });
  ok(out === '10000', `Ожидалось 10000, получено ${out}`);
});

test('C03', 'дробное значение через replace + isdigit', () => {
  const expr = "float('{q}') if '{q}'.replace('.', '', 1).isdigit() else 0";
  ok(runEval(expr, { q: '0.001' }) === '0.001', 'Дробное должно пройти');
  ok(runEval(expr, { q: 'хммм' }) === '0', 'Мусор должен дать 0');
});

test('C04', 'comprehension возвращает исходный шаблон (не вычисляется)', () => {
  const expr = "''.join(c for c in '{q}' if c.isdigit())";
  const out = runEval(expr, { q: 'a1b2' });
  ok(out === expr, `Ожидался неизменённый шаблон, получено ${out}`);
});

const passed = results.filter((r) => r.passed).length;
const failed = results.filter((r) => !r.passed).length;
console.log(`\n${'─'.repeat(64)}`);
console.log(`Фаза 72 — Итого: ${passed} ✅  ${failed} ❌  из ${results.length}`);
if (failed > 0) {
  process.exit(1);
}
