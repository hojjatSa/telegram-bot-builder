/**
 * @fileoverview OpenAPI: GET /admin/api/version и GET /admin/api/update-check
 * @module server/swagger/paths/admin-version-paths
 */

import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import {
  AdminUpdateCheckResponseSchema,
  AdminVersionResponseSchema,
} from "../schemas/admin-version";
import {
  ADMIN_SECURITY,
  AdminCookiesSchema,
  AdminUnauthorizedSchema,
} from "../schemas/admin-common";
import {
  ADMIN_CURL_LOGIN,
  ADMIN_UNAUTHORIZED_EXAMPLE,
  ADMIN_UPDATE_CHECK_EXAMPLE,
  ADMIN_VERSION_EXAMPLE,
} from "./admin-examples";

/**
 * Регистрирует admin paths версии и проверки обновлений.
 * @param registry - Реестр zod-to-openapi
 * @returns void
 */
export function registerAdminVersionPaths(registry: OpenAPIRegistry): void {
  registry.registerPath({
    method: "get",
    path: "/admin/api/version",
    tags: ["admin"],
    summary: "Установленная версия приложения",
    description:
      "Читает `version.json` из образа/рабочей копии. Без обращения к GitHub.\n\n" +
      "**Auth:** cookie `admin_auth`. **UI:** карточка на `/admin`.\n\n" +
      "```bash\n" +
      `${ADMIN_CURL_LOGIN}\n` +
      "curl -s http://localhost:5000/admin/api/version -b admin.txt\n" +
      "```",
    security: ADMIN_SECURITY,
    request: { cookies: AdminCookiesSchema },
    responses: {
      200: {
        description: "Текущая версия",
        content: {
          "application/json": {
            schema: AdminVersionResponseSchema,
            example: ADMIN_VERSION_EXAMPLE,
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
    },
  });

  registry.registerPath({
    method: "get",
    path: "/admin/api/update-check",
    tags: ["admin"],
    summary: "Проверка обновлений на GitHub",
    description:
      "Сравнивает локальный `version.json` с `main` на GitHub. " +
      "`?refresh=1` сбрасывает кеш проверки.\n\n" +
      "**Auth:** cookie `admin_auth`. **UI:** кнопка «Проверить обновления» на `/admin`.\n\n" +
      "```bash\n" +
      `${ADMIN_CURL_LOGIN}\n` +
      "curl -s 'http://localhost:5000/admin/api/update-check?refresh=1' -b admin.txt\n" +
      "```",
    security: ADMIN_SECURITY,
    request: {
      cookies: AdminCookiesSchema,
      query: z.object({
        refresh: z.enum(["1", "true"]).optional().openapi({
          description: "Сбросить кеш проверки",
          example: "1",
        }),
      }),
    },
    responses: {
      200: {
        description: "Результат сравнения версий",
        content: {
          "application/json": {
            schema: AdminUpdateCheckResponseSchema,
            example: ADMIN_UPDATE_CHECK_EXAMPLE,
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
    },
  });
}
