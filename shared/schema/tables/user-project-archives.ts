/**
 * @fileoverview Таблица личного архива проектов пользователя
 * @module shared/schema/tables/user-project-archives
 */

import { pgTable, integer, bigint, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { botProjects } from "./bot-projects";
import { telegramUsers } from "./telegram-users";

/**
 * Личный архив проектов: каждый пользователь может скрыть проект только у себя.
 */
export const userProjectArchives = pgTable(
  "user_project_archives",
  {
    /** Идентификатор пользователя (ссылка на telegram_users.id) */
    userId: bigint("user_id", { mode: "number" })
      .notNull()
      .references(() => telegramUsers.id, { onDelete: "cascade" }),

    /** Идентификатор проекта (ссылка на bot_projects.id) */
    projectId: integer("project_id")
      .notNull()
      .references(() => botProjects.id, { onDelete: "cascade" }),

    /** Дата архивации проекта для пользователя */
    archivedAt: timestamp("archived_at").defaultNow().notNull(),
  },
  (table) => ({
    /** Составной первичный ключ: пользователь + проект */
    pk: primaryKey({ columns: [table.userId, table.projectId] }),
  })
);

/** Тип записи личного архива проекта */
export type UserProjectArchive = typeof userProjectArchives.$inferSelect;

/** Тип для вставки записи личного архива */
export type InsertUserProjectArchive = typeof userProjectArchives.$inferInsert;
