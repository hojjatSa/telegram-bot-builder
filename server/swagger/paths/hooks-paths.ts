/**
 * @fileoverview OpenAPI paths для публичных HTTP hooks
 * @module server/swagger/paths/hooks-paths
 */

import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

/**
 * Регистрирует OpenAPI paths для `/api/hooks/{projectId}/*`
 * @param registry - Реестр zod-to-openapi
 * @param publicSecurity - Пустой security (публичный эндпоинт)
 */
export function registerHooksPaths(
  registry: OpenAPIRegistry,
  publicSecurity: never[],
): void {
  const methods = ["get", "post", "put", "patch", "delete"] as const;

  for (const method of methods) {
    registry.registerPath({
      method,
      path: "/api/hooks/{projectId}/{path}",
      tags: ["hooks"],
      summary: `HTTP hook (${method.toUpperCase()}) — api_trigger`,
      description:
        "**Публичный** эндпоинт для сервер-сервер интеграций. Путь в allowlist `requireApiAuth` (`/hooks/`).\n\n" +
        "**Поток:** Node → `http://localhost:{9000+tokenId}{apiPath}` → Python `api_trigger`.\n\n" +
        "**Auth:** `X-Api-Secret` или `Authorization: Bearer` (проверка в Python).\n\n" +
        "См. также `docs/api/hooks.md`.",
      security: publicSecurity,
      request: {
        params: z.object({
          projectId: z.string().openapi({ example: "42" }),
          path: z.string().openapi({ example: "payment" }),
        }),
      },
      responses: {
        200: { description: "Успешный ответ из api_response или дефолт {\"ok\":true}" },
        401: { description: "invalid_secret" },
        413: { description: "payload_too_large" },
        429: { description: "rate_limit" },
        503: { description: "bot_offline" },
        504: { description: "timeout (нет api_response за 30 с)" },
      },
    });
  }
}
