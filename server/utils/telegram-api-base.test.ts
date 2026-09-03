import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  TELEGRAM_PRODUCTION_API_BASE_URL,
  resolveTelegramApiBaseUrl,
  rewriteTelegramApiUrl,
} from './telegram-api-base';

describe('telegram-api-base', () => {
  it('keeps the official Telegram endpoint when no override is configured', () => {
    assert.equal(resolveTelegramApiBaseUrl(undefined), TELEGRAM_PRODUCTION_API_BASE_URL);
  });

  it('normalizes a custom HTTPS base URL', () => {
    assert.equal(
      resolveTelegramApiBaseUrl(' https://sadrabt.golnoorstore.ir/ '),
      'https://sadrabt.golnoorstore.ir',
    );
  });

  it('falls back to the official endpoint for an invalid override', () => {
    assert.equal(resolveTelegramApiBaseUrl('not-a-url'), TELEGRAM_PRODUCTION_API_BASE_URL);
  });

  it('rewrites Telegram Bot API requests while preserving path and query', () => {
    assert.equal(
      rewriteTelegramApiUrl(
        'https://api.telegram.org/bot123:ABC/deleteWebhook?drop_pending_updates=false',
        'https://sadrabt.golnoorstore.ir/',
      ),
      'https://sadrabt.golnoorstore.ir/bot123:ABC/deleteWebhook?drop_pending_updates=false',
    );
  });

  it('rewrites Telegram file API requests', () => {
    assert.equal(
      rewriteTelegramApiUrl(
        'https://api.telegram.org/file/bot123:ABC/photos/file_1.jpg',
        'https://sadrabt.golnoorstore.ir',
      ),
      'https://sadrabt.golnoorstore.ir/file/bot123:ABC/photos/file_1.jpg',
    );
  });

  it('does not rewrite non-Telegram URLs', () => {
    const url = 'https://example.com/api.telegram.org/test';
    assert.equal(rewriteTelegramApiUrl(url, 'https://sadrabt.golnoorstore.ir'), url);
  });
});
