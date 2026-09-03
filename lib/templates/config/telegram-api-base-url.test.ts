import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { generateConfig } from './config.renderer';
import { validParamsAllDisabled } from './config.fixture';

describe('Telegram API base URL config extension', () => {
  it('keeps aiogram default behavior when TELEGRAM_API_BASE_URL is unset', () => {
    const result = generateConfig(validParamsAllDisabled);

    assert.ok(result.includes('TELEGRAM_API_BASE_URL = os.getenv("TELEGRAM_API_BASE_URL", "")'));
    assert.ok(result.includes('if TELEGRAM_API_BASE_URL:'));
    assert.ok(result.includes('else:\n    bot = Bot(token=BOT_TOKEN)'));
  });

  it('configures both Bot API methods and file downloads through TelegramAPIServer.from_base', () => {
    const result = generateConfig(validParamsAllDisabled);

    assert.ok(result.includes('from aiogram.client.session.aiohttp import AiohttpSession'));
    assert.ok(result.includes('from aiogram.client.telegram import TelegramAPIServer'));
    assert.ok(result.includes('api=TelegramAPIServer.from_base(TELEGRAM_API_BASE_URL)'));
    assert.ok(result.includes('bot = Bot(token=BOT_TOKEN, session=_telegram_session)'));
  });
});
