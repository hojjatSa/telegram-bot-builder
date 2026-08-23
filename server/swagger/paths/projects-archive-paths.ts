/**
 * @fileoverview OpenAPI: POST /api/projects/{id}/archive и /unarchive.
 * @module server/swagger/paths/projects-archive-paths
 */

import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { MessageErrorSchema } from "../schemas/common";
import { ProjectsCookiesSchema, ProjectsAuthHeadersSchema } from "../schemas/projects";

/** Path id проекта */
const ProjectIdParamsSchema = z.object({
  /** Числовой ID проекта */
  id: z.string().openapi({
    example: "42",
    description: "Числовой ID проекта",
    param: { description: "Числовой ID проекта", example: "42" },
  }),
});

/** Успешный ответ архивации/разархивации */
const ArchiveSuccessSchema = z
  .object({
    /** Флаг успешного выполнения */
    success: z.boolean().openapi({ example: true }),
  })
  .openapi("ProjectArchiveSuccess");

/**
 * Регистрирует личную архивацию и возврат проекта.
 * @param registry - Реестр zod-to-openapi
 * @param cookieSecurity - Session cookie / Bearer PAT
 * @returns void
 */
export function registerProjectsArchivePaths(
  registry: OpenAPIRegistry,
  cookieSecurity: Array<Record<string, string[]>>,
): void {
  registry.registerPath({
    method: "post",
    path: "/api/projects/{id}/archive",
    tags: ["projects"],
    summary: "Поместить проект в личный архив",
    description:
      "Скрывает проект только у текущего пользователя (владелец или коллаборатор). " +
      "Боты **не останавливаются**. Другие участники проекта не затрагиваются.\n\n" +
      "**Auth:** cookie / Bearer PAT + `requireProjectAccess`.\n\n" +
      "```bash\n" +
      "curl -s -X POST http://localhost:5000/api/projects/42/archive -b cookies.txt\n" +
      "```",
    security: cookieSecurity,
    request: {
      cookies: ProjectsCookiesSchema,
      headers: ProjectsAuthHeadersSchema,
      params: ProjectIdParamsSchema,
    },
    responses: {
      200: {
        description: "Проект заархивирован для текущего пользователя",
        content: {
          "application/json": {
            schema: ArchiveSuccessSchema,
            example: { success: true },
          },
        },
      },
      401: {
        description: "Нет авторизации",
        content: {
          "application/json": {
            schema: MessageErrorSchema,
            example: { message: "Требуется авторизация через Telegram" },
          },
        },
      },
      403: {
        description: "Нет доступа к проекту",
        content: {
          "application/json": {
            schema: MessageErrorSchema,
            example: { message: "Нет прав доступа к проекту" },
          },
        },
      },
      500: {
        description: "Ошибка БД",
        content: {
          "application/json": {
            schema: MessageErrorSchema,
            example: { message: "Не удалось заархивировать проект" },
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "post",
    path: "/api/projects/{id}/unarchive",
    tags: ["projects"],
    summary: "Вернуть проект из личного архива",
    description:
      "Убирает личную запись архива для текущего пользователя. " +
      "Проект снова появляется в активных списках и переключателе.\n\n" +
      "**Auth:** cookie / Bearer PAT + `requireProjectAccess`.\n\n" +
      "```bash\n" +
      "curl -s -X POST http://localhost:5000/api/projects/42/unarchive -b cookies.txt\n" +
      "```",
    security: cookieSecurity,
    request: {
      cookies: ProjectsCookiesSchema,
      headers: ProjectsAuthHeadersSchema,
      params: ProjectIdParamsSchema,
    },
    responses: {
      200: {
        description: "Проект возвращён из архива для текущего пользователя",
        content: {
          "application/json": {
            schema: ArchiveSuccessSchema,
            example: { success: true },
          },
        },
      },
      401: {
        description: "Нет авторизации",
        content: {
          "application/json": {
            schema: MessageErrorSchema,
            example: { message: "Требуется авторизация через Telegram" },
          },
        },
      },
      403: {
        description: "Нет доступа к проекту",
        content: {
          "application/json": {
            schema: MessageErrorSchema,
            example: { message: "Нет прав доступа к проекту" },
          },
        },
      },
      500: {
        description: "Ошибка БД",
        content: {
          "application/json": {
            schema: MessageErrorSchema,
            example: { message: "Не удалось вернуть проект из архива" },
          },
        },
      },
    },
  });
}
