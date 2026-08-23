/**
 * @fileoverview Загрузка эталонного version.json с GitHub
 * @module server/app-version/fetch-latest-version
 */

import {
  buildVersionManifestRawUrl,
  resolveGithubRepoSlug,
} from "../../shared/app-version";
import type { VersionManifest } from "../../shared/version-manifest.types";

/** Запись кеша удалённого манифеста */
interface RemoteVersionCache {
  /** Загруженный манифест */
  data: VersionManifest;
  /** Время fetch, ms */
  fetchedAt: number;
}

/** TTL кеша эталонной версии, мс (1 час) */
const REMOTE_CACHE_TTL_MS = 60 * 60 * 1000;

/** Таймаут HTTP-запроса, мс */
const FETCH_TIMEOUT_MS = 8000;

/** Кеш последнего успешного ответа */
let remoteCache: RemoteVersionCache | null = null;

/**
 * Загружает version.json с GitHub raw.
 * @param options - Параметры запроса
 * @returns Манифест или null при ошибке
 */
export async function fetchLatestVersionManifest(options?: {
  /** Игнорировать кеш и запросить заново */
  forceRefresh?: boolean;
}): Promise<VersionManifest | null> {
  const forceRefresh = options?.forceRefresh ?? false;
  const now = Date.now();

  if (
    !forceRefresh &&
    remoteCache &&
    now - remoteCache.fetchedAt < REMOTE_CACHE_TTL_MS
  ) {
    return remoteCache.data;
  }

  const repoSlug = resolveGithubRepoSlug(process.env.GITHUB_REPO);
  const url = buildVersionManifestRawUrl(repoSlug);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as VersionManifest;
    if (!data.version || typeof data.version !== "string") {
      return null;
    }

    remoteCache = { data, fetchedAt: now };
    return data;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
