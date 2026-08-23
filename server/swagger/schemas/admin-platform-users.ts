/**
 * @fileoverview OpenAPI-схемы списка аккаунтов платформы
 * @module server/swagger/schemas/admin-platform-users
 */

import "./common";
import { z } from "zod";

/** Краткая запись проекта в admin */
export const AdminPlatformUserProjectSchema = z
  .object({
    id: z.number().int().openapi({ example: 42 }),
    name: z.string().openapi({ example: "Мой бот" }),
    createdAt: z.string().nullable().openapi({ example: "2026-01-15T10:00:00.000Z" }),
    updatedAt: z.string().nullable().openapi({ example: "2026-03-01T12:30:00.000Z" }),
  })
  .openapi("AdminPlatformUserProject");

/** Проект, где пользователь участник */
export const AdminPlatformUserSharedProjectSchema = AdminPlatformUserProjectSchema.extend({
  ownerId: z.number().nullable().openapi({ example: 100001 }),
  ownerDisplayName: z.string().openapi({ example: "@owner_bot" }),
}).openapi("AdminPlatformUserSharedProject");

/** Строка списка аккаунтов */
export const AdminPlatformUserListItemSchema = z
  .object({
    id: z.number().int().openapi({ example: 123456789 }),
    firstName: z.string().openapi({ example: "Иван" }),
    lastName: z.string().nullable().openapi({ example: "Петров" }),
    username: z.string().nullable().openapi({ example: "ivan_bot" }),
    photoUrl: z.string().nullable().openapi({ example: "https://t.me/i/userpic/320/abc.jpg" }),
    createdAt: z.string().nullable().openapi({ example: "2026-01-01T08:00:00.000Z" }),
    updatedAt: z.string().nullable().openapi({ example: "2026-03-10T09:15:00.000Z" }),
    ownedCount: z.number().int().openapi({ example: 3 }),
    sharedCount: z.number().int().openapi({ example: 1 }),
  })
  .openapi("AdminPlatformUserListItem");

/** Ответ GET /admin/api/users */
export const AdminPlatformUsersListResponseSchema = z
  .object({
    items: z.array(AdminPlatformUserListItemSchema),
    total: z.number().int().openapi({ example: 128 }),
    page: z.number().int().openapi({ example: 1 }),
    perPage: z.number().int().openapi({ example: 25 }),
  })
  .openapi("AdminPlatformUsersListResponse");

/** Профиль аккаунта */
export const AdminPlatformUserProfileSchema = z
  .object({
    id: z.number().int().openapi({ example: 123456789 }),
    firstName: z.string().openapi({ example: "Иван" }),
    lastName: z.string().nullable().openapi({ example: "Петров" }),
    username: z.string().nullable().openapi({ example: "ivan_bot" }),
    photoUrl: z.string().nullable(),
    createdAt: z.string().nullable(),
    updatedAt: z.string().nullable(),
  })
  .openapi("AdminPlatformUserProfile");

/** Ответ GET /admin/api/users/{id} */
export const AdminPlatformUserDetailResponseSchema = z
  .object({
    user: AdminPlatformUserProfileSchema,
    ownedProjects: z.array(AdminPlatformUserProjectSchema),
    sharedProjects: z.array(AdminPlatformUserSharedProjectSchema),
  })
  .openapi("AdminPlatformUserDetailResponse");

/** Ошибка 404 карточки аккаунта */
export const AdminPlatformUserNotFoundSchema = z
  .object({
    error: z.literal("Аккаунт не найден").openapi({ example: "Аккаунт не найден" }),
  })
  .openapi("AdminPlatformUserNotFound");

/** Ошибка 400 неверного id */
export const AdminPlatformUserBadIdSchema = z
  .object({
    error: z.literal("Неверный опознаватель").openapi({ example: "Неверный опознаватель" }),
  })
  .openapi("AdminPlatformUserBadId");
