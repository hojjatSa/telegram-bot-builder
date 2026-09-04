#!/usr/bin/env node

import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const timeoutMs = Number(process.env.SMOKE_TIMEOUT_MS || 8000);
const port = process.env.PORT || '5000';
const appHealthUrl = process.env.SMOKE_APP_HEALTH_URL || `http://127.0.0.1:${port}/api/health`;
const telegramBase = (process.env.TELEGRAM_API_BASE_URL || '').trim().replace(/\/$/, '');
const jwksUrl = (process.env.TELEGRAM_JWKS_URL || '').trim();
const botsDir = process.env.BOTS_DIR || '/app/bots';

let failed = false;

function ok(label, detail = '') {
  console.log(`✅ ${label}${detail ? ` — ${detail}` : ''}`);
}

function fail(label, detail = '') {
  failed = true;
  console.error(`❌ ${label}${detail ? ` — ${detail}` : ''}`);
}

function warn(label, detail = '') {
  console.warn(`⚠️ ${label}${detail ? ` — ${detail}` : ''}`);
}

async function getJson(url) {
  const response = await fetch(url, {
    headers: { accept: 'application/json', 'user-agent': 'golnoor-production-smoke/1.0' },
    signal: AbortSignal.timeout(timeoutMs),
  });
  const text = await response.text();
  let body = null;
  try {
    body = JSON.parse(text);
  } catch {
    // Leave body as null; caller will report the unexpected response.
  }
  return { response, body };
}

async function checkAppHealth() {
  try {
    const { response, body } = await getJson(appHealthUrl);
    if (response.ok && body?.ready === true) {
      ok('Application health', appHealthUrl);
    } else {
      fail('Application health', `HTTP ${response.status}, ready=${String(body?.ready)}`);
    }
  } catch (error) {
    fail('Application health', error instanceof Error ? error.message : String(error));
  }
}

async function checkGateway() {
  if (!telegramBase) {
    fail('Telegram gateway env', 'TELEGRAM_API_BASE_URL is empty');
    return;
  }

  try {
    const { response, body } = await getJson(`${telegramBase}/health`);
    if (response.ok && (body?.status === undefined || body?.status === 'ok')) {
      ok('Telegram gateway health', telegramBase);
    } else {
      fail('Telegram gateway health', `HTTP ${response.status}`);
    }
  } catch (error) {
    fail('Telegram gateway health', error instanceof Error ? error.message : String(error));
  }
}

async function checkJwks() {
  if (!jwksUrl) {
    fail('Telegram JWKS env', 'TELEGRAM_JWKS_URL is empty');
    return;
  }

  try {
    const { response, body } = await getJson(jwksUrl);
    if (response.ok && Array.isArray(body?.keys) && body.keys.length > 0) {
      ok('Telegram JWKS relay', `${body.keys.length} key(s)`);
    } else {
      fail('Telegram JWKS relay', `HTTP ${response.status}, keys=${body?.keys?.length ?? 0}`);
    }
  } catch (error) {
    fail('Telegram JWKS relay', error instanceof Error ? error.message : String(error));
  }
}

async function listPythonFiles(dir) {
  const result = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return result;
  }

  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...await listPythonFiles(path));
    } else if (entry.isFile() && entry.name.endsWith('.py')) {
      result.push(path);
    }
  }
  return result;
}

async function checkGeneratedBots() {
  const files = await listPythonFiles(botsDir);
  if (files.length === 0) {
    warn('Generated bot check', `no Python bot files found under ${botsDir}`);
    return;
  }

  let compatible = 0;
  const stale = [];
  for (const file of files) {
    const source = await readFile(file, 'utf8');
    if (source.includes('TELEGRAM_API_BASE_URL') && source.includes('TelegramAPIServer.from_base')) {
      compatible += 1;
    } else if (source.includes('Bot(token=BOT_TOKEN)')) {
      stale.push(file);
    }
  }

  if (stale.length > 0) {
    fail('Generated bot gateway support', `${stale.length} stale bot file(s) need Save & Restart`);
    for (const file of stale.slice(0, 10)) console.error(`   ${file}`);
  } else {
    ok('Generated bot gateway support', `${compatible}/${files.length} Python bot file(s) gateway-aware`);
  }
}

console.log('Golnoor Telegram Bot Builder production smoke test');
await checkAppHealth();
await checkGateway();
await checkJwks();
await checkGeneratedBots();

if (failed) {
  console.error('\nProduction smoke test FAILED.');
  process.exit(1);
}

console.log('\nProduction smoke test PASSED.');
