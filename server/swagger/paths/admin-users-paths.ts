/**
 * @fileoverview OpenAPI: GET /admin/api/users и GET /admin/api/users/{id}
 * @module server/swagger/paths/admin-users-paths
 */

import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { MessageErrorSchema } from "../schemas/common";
import {
  AdminPlatformUserBadIdSchema,
  AdminPlatformUserDetailResponseSchema,
  AdminPlatformUserNotFoundSchema,
  AdminPlatformUsersListResponseSchema,
} from "../schemas/admin-platform-users";
import {
  ADMIN_SECURITY,
  AdminCookiesSchema,
  AdminUnauthorizedSchema,
} from "../schemas/admin-common";
import {
  ADMIN_CURL_LOGIN,
  ADMIN_PLATFORM_USER_DETAIL_EXAMPLE,
  ADMIN_PLATFORM_USERS_LIST_EXAMPLE,
  ADMIN_UNAUTHORIZED_EXAMPLE,
} from "./admin-examples";

/**
 * Регистрирует admin paths списка и карточки аккаунтов платформы.
 * @param registry - Реестр zod-to-openapi
 * @returns void
 */
export function registerAdminUsersPaths(registry: OpenAPIRegistry): void {
  registry.registerPath({
    method: "get",
    path: "/admin/api/users",
    tags: ["admin"],
    summary: "Список аккаунтов платформы",
    description:
      "Все записи `telegram_users` с числом проектов во владении и участий. " +
      "Поиск по имени, @username и числовому Telegram ID. Только чтение.\n\n" +
      "**Auth:** cookie `admin_auth`. Сессия Studio (`connect.sid`) **не** подходит.\n\n" +
      "**UI:** `/admin/users`.\n\n" +
      "```bash\n" +
      `${ADMIN_CURL_LOGIN}\n` +
      "curl -s 'http://localhost:5000/admin/api/users?search=ivan&page=1&perPage=25' -b admin.txt\n" +
      "```",
    security: ADMIN_SECURITY,
    request: {
      cookies: AdminCookiesSchema,
      query: z.object({
        search: z.string().optional().openapi({
          description: "Поиск по имени, @username или ID (до 100 символов)",
          example: "ivan",
        }),
        page: z.coerce.number().int().min(1).optional().openapi({ example: 1 }),
        perPage: z.coerce.number().int().min(1).max(100).optional().openapi({ example: 25 }),
      }),
    },
    responses: {
      200: {
        description: "Страница списка аккаунтов",
        content: {
          "application/json": {
            schema: AdminPlatformUsersListResponseSchema,
            example: ADMIN_PLATFORM_USERS_LIST_EXAMPLE,
          },
        },
      },
      401: {
        description: "Нет admin-сессии",
        content: {
          "application/json": {
            schema: AdminUnauthorizedSchema,
            example: ADMIN_UNAUTHORIZED_EXAMPLE,
          },
        },
      },
      500: {
        description: "Внутренняя ошибка",
        content: {
          "application/json": {
            schema: MessageErrorSchema,
            example: { error: "Внутренняя ошибка сервера" },
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/admin/api/users/{id}",
    tags: ["admin"],
    summary: "Карточка аккаунта платформы",
    description:
      "Профиль `telegram_users` и списки проектов во владении / участия. " +
      "Из `bot_projects` отдаются только `id`, `name`, даты — без `data`, `bot_token`, `session_id`.\n\n" +
      "**Auth:** cookie `admin_auth`.\n\n" +
      "**UI:** `/admin/users/{id}`.\n\n" +
      "```bash\n" +
      `${ADMIN_CURL_LOGIN}\n` +
      "curl -s http://localhost:5000/admin/api/users/123456789 -b admin.txt\n" +
      "```",
    security: ADMIN_SECURITY,
    request: {
      cookies: AdminCookiesSchema,
      params: z.object({
        id: z.string().openapi({
          description: "Telegram user id (положительное целое)",
          example: "123456789",
        }),
      }),
    },
    responses: {
      200: {
        description: "Карточка аккаунта",
        content: {
          "application/json": {
            schema: AdminPlatformUserDetailResponseSchema,
            example: ADMIN_PLATFORM_USER_DETAIL_EXAMPLE,
          },
        },
      },
      400: {
        description: "Неверный id",
        content: {
          "application/json": {
            schema: AdminPlatformUserBadIdSchema,
            example: { error: "Неверный опознаватель" },
          },
        },
      },
      401: {
        description: "Нет admin-сессии",
        content: {
          "application/json": {
            schema: AdminUnauthorizedSchema,
            example: ADMIN_UNAUTHORIZED_EXAMPLE,
          },
        },
      },
      404: {
        description: "Аккаунт не найден",
        content: {
          "application/json": {
            schema: AdminPlatformUserNotFoundSchema,
            example: { error: "Аккаунт не найден" },
          },
        },
      },
      500: {
        description: "Внутренняя ошибка",
        content: {
          "application/json": {
            schema: MessageErrorSchema,
            example: { error: "Внутренняя ошибка сервера" },
          },
        },
      },
    },
  });
}
