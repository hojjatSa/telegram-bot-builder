/**
 * @fileoverview Подсчёт проектов для списка аккаунтов платформы
 * @module server/admin/handlers/platform-users-counts
 */

import { botProjects, projectCollaborators } from "@shared/schema";
import { inArray, sql } from "drizzle-orm";
import { db } from "../../database/db";

/** Число проектов во владении и участий */
export interface PlatformUserProjectCounts {
  /** Проектов во владении */
  owned: number;
  /** Проектов, где участник */
  shared: number;
}

/**
 * Считает проекты для набора опознавателей
 * @param userIds - Опознаватели Telegram
 * @returns Карта опознаватель → счётчики
 */
export async function fetchPlatformUserProjectCounts(
  userIds: number[],
): Promise<Map<number, PlatformUserProjectCounts>> {
  const counts = new Map<number, PlatformUserProjectCounts>();
  if (userIds.length === 0) return counts;

  for (const id of userIds) {
    counts.set(id, { owned: 0, shared: 0 });
  }

  const ownedRows = await db
    .select({
      ownerId: botProjects.ownerId,
      count: sql<number>`count(*)::int`,
    })
    .from(botProjects)
    .where(inArray(botProjects.ownerId, userIds))
    .groupBy(botProjects.ownerId);

  for (const row of ownedRows) {
    if (row.ownerId == null) continue;
    const entry = counts.get(row.ownerId);
    if (entry) entry.owned = row.count ?? 0;
  }

  const sharedRows = await db
    .select({
      userId: projectCollaborators.userId,
      count: sql<number>`count(*)::int`,
    })
    .from(projectCollaborators)
    .where(inArray(projectCollaborators.userId, userIds))
    .groupBy(projectCollaborators.userId);

  for (const row of sharedRows) {
    const entry = counts.get(row.userId);
    if (entry) entry.shared = row.count ?? 0;
  }

  return counts;
}
