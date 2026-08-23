/**
 * @fileoverview GET /admin/api/users и GET /admin/api/users/:id
 * @module server/admin/handlers/platform-users-handlers
 */

import type { Request, Response } from "express";
import { queryPlatformUserDetail } from "./platform-user-detail-query";
import {
  parsePlatformUserId,
  parsePlatformUsersListParams,
} from "./platform-users-params";
import { queryPlatformUsersList } from "./platform-users-query";

/**
 * GET /admin/api/users — список аккаунтов платформы
 * @param req - Запрос Express
 * @param res - Ответ Express
 */
export async function handleGetAdminPlatformUsers(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const params = parsePlatformUsersListParams(req.query as Record<string, unknown>);
    const result = await queryPlatformUsersList(params);
    res.json(result);
  } catch (err) {
    console.error("[admin] Ошибка списка аккаунтов:", err);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}

/**
 * GET /admin/api/users/:id — карточка аккаунта платформы
 * @param req - Запрос Express
 * @param res - Ответ Express
 */
export async function handleGetAdminPlatformUser(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = parsePlatformUserId(String(req.params.id ?? ""));
  if (userId == null) {
    res.status(400).json({ error: "Неверный опознаватель" });
    return;
  }

  try {
    const detail = await queryPlatformUserDetail(userId);
    if (!detail) {
      res.status(404).json({ error: "Аккаунт не найден" });
      return;
    }
    res.json(detail);
  } catch (err) {
    console.error(`[admin] Ошибка карточки аккаунта ${userId}:`, err);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}
