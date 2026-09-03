/**
 * Telegram Bot API endpoint helpers.
 *
 * TELEGRAM_API_BASE_URL is intentionally optional. When it is not set (or is
 * invalid), the application keeps Telegram's official production endpoint.
 * This keeps the fork compatible with upstream defaults while allowing a
 * reverse gateway such as a Cloudflare Worker to be enabled at deploy time.
 */

export const TELEGRAM_PRODUCTION_API_BASE_URL = 'https://api.telegram.org';

/**
 * Resolve and normalize the optional Telegram Bot API base URL.
 */
export function resolveTelegramApiBaseUrl(
  value: string | undefined = process.env.TELEGRAM_API_BASE_URL,
): string {
  const candidate = value?.trim();
  if (!candidate) return TELEGRAM_PRODUCTION_API_BASE_URL;

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return TELEGRAM_PRODUCTION_API_BASE_URL;
    }

    parsed.search = '';
    parsed.hash = '';
    parsed.pathname = parsed.pathname.replace(/\/+$/, '');

    return parsed.toString().replace(/\/$/, '');
  } catch {
    return TELEGRAM_PRODUCTION_API_BASE_URL;
  }
}

/**
 * Rewrite only requests targeting Telegram's official Bot API origin.
 * Non-Telegram URLs are returned unchanged.
 */
export function rewriteTelegramApiUrl(
  url: string,
  baseUrl: string | undefined = process.env.TELEGRAM_API_BASE_URL,
): string {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }

  if (parsed.origin !== TELEGRAM_PRODUCTION_API_BASE_URL) {
    return url;
  }

  const resolvedBase = resolveTelegramApiBaseUrl(baseUrl);
  if (resolvedBase === TELEGRAM_PRODUCTION_API_BASE_URL) {
    return url;
  }

  return `${resolvedBase}${parsed.pathname}${parsed.search}${parsed.hash}`;
}
