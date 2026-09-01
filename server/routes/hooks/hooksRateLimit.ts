/**
 * @fileoverview Rate limit для публичных API hooks
 * @module server/routes/hooks/hooksRateLimit
 */

/** Параметры окна лимита */
export interface HooksRateLimitOptions {
  /** Максимум запросов в окне */
  max: number;
  /** Длина окна в миллисекундах */
  windowMs: number;
}

/** Значения по умолчанию: 60 запросов в минуту на (projectId, path) */
const DEFAULT_OPTS: HooksRateLimitOptions = { max: 60, windowMs: 60_000 };

/** Счётчики по ключу projectId:path */
const buckets = new Map<string, { count: number; resetAt: number }>();

/**
 * Потребляет один слот rate limit
 * @param key - Ключ (projectId + path)
 * @param opts - Параметры окна
 * @returns true если запрос разрешён
 */
export function consumeHooksRateLimit(
  key: string,
  opts: HooksRateLimitOptions = DEFAULT_OPTS,
): boolean {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now >= entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
    return true;
  }

  if (entry.count >= opts.max) {
    return false;
  }

  entry.count += 1;
  return true;
}

/**
 * Сбрасывает бакеты (для тестов)
 */
export function resetHooksRateLimitBuckets(): void {
  buckets.clear();
}
