/**
 * @fileoverview Разбор и проверка параметров списка аккаунтов
 * @module server/admin/handlers/platform-users-params
 */

/** Максимальная длина строки поиска */
export const PLATFORM_USERS_SEARCH_MAX = 100;

/** Максимальный размер страницы */
export const PLATFORM_USERS_PER_PAGE_MAX = 100;

/** Размер страницы по умолчанию */
export const PLATFORM_USERS_PER_PAGE_DEFAULT = 25;

/** Разобранные параметры списка */
export interface PlatformUsersListParams {
  /** Строка поиска или null */
  search: string | null;
  /** Номер страницы */
  page: number;
  /** Размер страницы */
  perPage: number;
}

/**
 * Проверяет опознаватель из пути
 * @param raw - Значение из req.params.id
 * @returns Число или null при неверном формате
 */
export function parsePlatformUserId(raw: string): number | null {
  const id = Number(raw);
  if (!Number.isSafeInteger(id) || id <= 0) return null;
  return id;
}

/**
 * Разбирает query-параметры списка аккаунтов
 * @param query - req.query
 * @returns Параметры списка
 */
export function parsePlatformUsersListParams(
  query: Record<string, unknown>,
): PlatformUsersListParams {
  const rawSearch = typeof query.search === "string" ? query.search.trim() : "";
  const search = rawSearch ? rawSearch.slice(0, PLATFORM_USERS_SEARCH_MAX) : null;

  const pageRaw = Number(query.page ?? 1);
  const page = Number.isFinite(pageRaw) && pageRaw >= 1 ? Math.floor(pageRaw) : 1;

  const perPageRaw = Number(query.perPage ?? PLATFORM_USERS_PER_PAGE_DEFAULT);
  const perPage = Number.isFinite(perPageRaw)
    ? Math.min(PLATFORM_USERS_PER_PAGE_MAX, Math.max(1, Math.floor(perPageRaw)))
    : PLATFORM_USERS_PER_PAGE_DEFAULT;

  return { search, page, perPage };
}
