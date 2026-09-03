import {
  TELEGRAM_PRODUCTION_API_BASE_URL,
  resolveTelegramApiBaseUrl,
} from '../../utils/telegram-api-base';
import { fetchWithProxy } from '../../utils/telegram-proxy';

const DEFAULT_TIMEOUT_MS = 8_000;
const PROBE_TOKEN = '000000000:AAForkGatewayDiagnosticToken00000000000';

export interface TelegramGatewayStatus {
  configured: boolean;
  rawConfigured: boolean;
  effectiveBaseUrl: string;
  usingOfficialEndpoint: boolean;
  healthUrl: string | null;
}

export interface TelegramGatewayCheck {
  ok: boolean;
  detail: string;
  latencyMs?: number;
  statusCode?: number;
}

export interface TelegramGatewayDiagnosticResult {
  ok: boolean;
  testedAt: string;
  effectiveBaseUrl: string;
  checks: {
    environment: TelegramGatewayCheck;
    gatewayHealth: TelegramGatewayCheck;
    telegramApi: TelegramGatewayCheck;
  };
}

export function getTelegramGatewayStatus(
  configuredValue: string | undefined = process.env.TELEGRAM_API_BASE_URL,
): TelegramGatewayStatus {
  const raw = configuredValue?.trim() ?? '';
  const effectiveBaseUrl = resolveTelegramApiBaseUrl(configuredValue);
  const usingOfficialEndpoint = effectiveBaseUrl === TELEGRAM_PRODUCTION_API_BASE_URL;
  const configured = Boolean(raw) && !usingOfficialEndpoint;

  return {
    configured,
    rawConfigured: Boolean(raw),
    effectiveBaseUrl,
    usingOfficialEndpoint,
    healthUrl: configured ? `${effectiveBaseUrl}/health` : null,
  };
}

export function isTelegramProbeResponse(statusCode: number, body: unknown): boolean {
  if (!body || typeof body !== 'object') return false;

  const payload = body as Record<string, unknown>;
  const telegramErrorCode = payload.error_code;
  const description = payload.description;

  return (
    payload.ok === false &&
    typeof telegramErrorCode === 'number' &&
    typeof description === 'string' &&
    statusCode >= 400
  );
}

async function readJsonSafely(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function timedRequest(
  url: string,
  timeoutMs: number,
): Promise<{ response: Response; latencyMs: number }> {
  const startedAt = Date.now();
  const response = await fetchWithProxy(url, {
    method: 'GET',
    signal: AbortSignal.timeout(timeoutMs),
    headers: {
      accept: 'application/json',
      'user-agent': 'telegram-bot-builder-gateway-diagnostic/1.0',
    },
  });

  return {
    response,
    latencyMs: Date.now() - startedAt,
  };
}

export async function runTelegramGatewayDiagnostic(
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<TelegramGatewayDiagnosticResult> {
  const status = getTelegramGatewayStatus();
  const environment: TelegramGatewayCheck = status.configured
    ? {
        ok: true,
        detail: `TELEGRAM_API_BASE_URL is active: ${status.effectiveBaseUrl}`,
      }
    : {
        ok: false,
        detail: status.rawConfigured
          ? 'TELEGRAM_API_BASE_URL is invalid or resolves to the official Telegram endpoint.'
          : 'TELEGRAM_API_BASE_URL is not configured.',
      };

  const notRun: TelegramGatewayCheck = {
    ok: false,
    detail: 'Not run because the gateway is not configured.',
  };

  if (!status.configured || !status.healthUrl) {
    return {
      ok: false,
      testedAt: new Date().toISOString(),
      effectiveBaseUrl: status.effectiveBaseUrl,
      checks: {
        environment,
        gatewayHealth: notRun,
        telegramApi: notRun,
      },
    };
  }

  let gatewayHealth: TelegramGatewayCheck;
  try {
    const { response, latencyMs } = await timedRequest(status.healthUrl, timeoutMs);
    const body = await readJsonSafely(response);
    const bodyStatus =
      body && typeof body === 'object' ? (body as Record<string, unknown>).status : undefined;
    const ok = response.ok && (bodyStatus === undefined || bodyStatus === 'ok');

    gatewayHealth = {
      ok,
      detail: ok
        ? 'Gateway health endpoint is reachable from the application server.'
        : 'Gateway health endpoint returned an unexpected response.',
      latencyMs,
      statusCode: response.status,
    };
  } catch (error) {
    gatewayHealth = {
      ok: false,
      detail: error instanceof Error ? error.message : 'Gateway health request failed.',
    };
  }

  let telegramApi: TelegramGatewayCheck;
  try {
    // Deliberately use an invalid probe token. A Telegram-formatted error proves
    // that this application request passed through the configured gateway and
    // reached Telegram without exposing or depending on a real bot token.
    const probeUrl = `${TELEGRAM_PRODUCTION_API_BASE_URL}/bot${PROBE_TOKEN}/getMe`;
    const { response, latencyMs } = await timedRequest(probeUrl, timeoutMs);
    const body = await readJsonSafely(response);
    const ok = isTelegramProbeResponse(response.status, body);

    telegramApi = {
      ok,
      detail: ok
        ? 'Telegram Bot API responded through the configured gateway.'
        : 'The response did not look like a Telegram Bot API response.',
      latencyMs,
      statusCode: response.status,
    };
  } catch (error) {
    telegramApi = {
      ok: false,
      detail: error instanceof Error ? error.message : 'Telegram Bot API probe failed.',
    };
  }

  return {
    ok: environment.ok && gatewayHealth.ok && telegramApi.ok,
    testedAt: new Date().toISOString(),
    effectiveBaseUrl: status.effectiveBaseUrl,
    checks: {
      environment,
      gatewayHealth,
      telegramApi,
    },
  };
}
