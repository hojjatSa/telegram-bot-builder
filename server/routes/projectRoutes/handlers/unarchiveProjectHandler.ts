/**
 * @fileoverview Хендлер возврата проекта из личного архива
 * @module projectRoutes/handlers/unarchiveProjectHandler
 */

import type { Request, Response } from "express";
import { storage } from "../../../storages/storage";
import { getOwnerIdFromRequest } from "../../../telegram/auth-middleware";

/**
 * Убирает проект из личного архива пользователя
 * @param req - Объект запроса Express
 * @param res - Объект ответа Express
 */
export async function unarchiveProjectHandler(req: Request, res: Response): Promise<void> {
  try {
    const userId = getOwnerIdFromRequest(req);
    if (userId === null) {
      res.status(401).json({ message: "Требуется авторизация через Telegram" });
      return;
    }

    const projectId = Number(req.params.id);
    await storage.unarchiveProjectForUser(userId, projectId);
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: "Не удалось вернуть проект из архива" });
  }
}
