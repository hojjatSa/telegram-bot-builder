/**
 * @fileoverview Запрос списка аккаунтов платформы
 * @module server/admin/handlers/platform-users-query
 */

import { telegramUsers } from "@shared/schema";
import type { PlatformUserListItem, PlatformUsersListResponse } from "@shared/admin/platform-users.types";
import { desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { db } from "../../database/db";
import { fetchPlatformUserProjectCounts } from "./platform-users-counts";
import type { PlatformUsersListParams } from "./platform-users-params";

/**
 * Собирает условие поиска по имени, @name и опознавателю
 * @param search - Строка поиска
 * @returns Условие WHERE или undefined
 */
function buildSearchCondition(search: string | null): SQL | undefined {
  if (!search) return undefined;

  const pattern = `%${search.replace(/[%_\\]/g, "\\$&")}%`;
  const numericId = Number(search);
  const conditions: SQL[] = [
    ilike(telegramUsers.firstName, pattern),
    ilike(telegramUsers.lastName, pattern),
    ilike(telegramUsers.username, pattern),
  ];

  if (Number.isSafeInteger(numericId) && numericId > 0) {
    conditions.push(eq(telegramUsers.id, numericId));
  }

  return or(...conditions);
}

/**
 * Преобразует дату в ISO-строку
 * @param value - Значение из базы
 * @returns ISO или null
 */
function toIso(value: Date | null | undefined): string | null {
  return value ? value.toISOString() : null;
}

/**
 * Загружает страницу аккаунтов платформы
 * @param params - Параметры списка
 * @returns Ответ списка
 */
export async function queryPlatformUsersList(
  params: PlatformUsersListParams,
): Promise<PlatformUsersListResponse> {
  const where = buildSearchCondition(params.search);
  const offset = (params.page - 1) * params.perPage;

  const baseQuery = db
    .select({
      id: telegramUsers.id,
      firstName: telegramUsers.firstName,
      lastName: telegramUsers.lastName,
      username: telegramUsers.username,
      photoUrl: telegramUsers.photoUrl,
      createdAt: telegramUsers.createdAt,
      updatedAt: telegramUsers.updatedAt,
    })
    .from(telegramUsers);

  const rows = await (where ? baseQuery.where(where) : baseQuery)
    .orderBy(desc(telegramUsers.createdAt))
    .limit(params.perPage)
    .offset(offset);

  const countQuery = db
    .select({ count: sql<number>`count(*)::int` })
    .from(telegramUsers);

  const [{ count }] = await (where ? countQuery.where(where) : countQuery);

  const userIds = rows.map((row) => row.id);
  const projectCounts = await fetchPlatformUserProjectCounts(userIds);

  const items: PlatformUserListItem[] = rows.map((row) => {
    const counts = projectCounts.get(row.id) ?? { owned: 0, shared: 0 };
    return {
      id: row.id,
      firstName: row.firstName,
      lastName: row.lastName,
      username: row.username,
      photoUrl: row.photoUrl,
      createdAt: toIso(row.createdAt),
      updatedAt: toIso(row.updatedAt),
      ownedCount: counts.owned,
      sharedCount: counts.shared,
    };
  });

  return {
    items,
    total: count ?? 0,
    page: params.page,
    perPage: params.perPage,
  };
}
