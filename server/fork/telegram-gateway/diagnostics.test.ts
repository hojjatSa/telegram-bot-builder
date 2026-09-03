import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  getTelegramGatewayStatus,
  isTelegramProbeResponse,
} from './diagnostics';

describe('fork Telegram gateway diagnostics', () => {
  it('reports the official endpoint when no gateway is configured', () => {
    const status = getTelegramGatewayStatus(undefined);

    assert.equal(status.configured, false);
    assert.equal(status.rawConfigured, false);
    assert.equal(status.usingOfficialEndpoint, true);
    assert.equal(status.effectiveBaseUrl, 'https://api.telegram.org');
    assert.equal(status.healthUrl, null);
  });

  it('normalizes and reports a custom gateway', () => {
    const status = getTelegramGatewayStatus(' https://sadrabt.golnoorstore.ir/ ');

    assert.equal(status.configured, true);
    assert.equal(status.rawConfigured, true);
    assert.equal(status.usingOfficialEndpoint, false);
    assert.equal(status.effectiveBaseUrl, 'https://sadrabt.golnoorstore.ir');
    assert.equal(status.healthUrl, 'https://sadrabt.golnoorstore.ir/health');
  });

  it('does not treat an invalid URL as a configured gateway', () => {
    const status = getTelegramGatewayStatus('not-a-url');

    assert.equal(status.configured, false);
    assert.equal(status.rawConfigured, true);
    assert.equal(status.usingOfficialEndpoint, true);
  });

  it('recognizes a Telegram-formatted API error as a successful connectivity probe', () => {
    assert.equal(
      isTelegramProbeResponse(404, {
        ok: false,
        error_code: 404,
        description: 'Not Found',
      }),
      true,
    );
  });

  it('rejects a generic gateway error that is not Telegram formatted', () => {
    assert.equal(
      isTelegramProbeResponse(502, {
        error: 'Bad Gateway',
      }),
      false,
    );
  });
});
