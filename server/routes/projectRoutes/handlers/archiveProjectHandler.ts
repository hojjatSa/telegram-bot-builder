/**
 * @fileoverview Хендлер архивации проекта для текущего пользователя
 * @module projectRoutes/handlers/archiveProjectHandler
 */

import type { Request, Response } from "express";
import { storage } from "../../../storages/storage";
import { getOwnerIdFromRequest } from "../../../telegram/auth-middleware";

/**
 * Помещает проект в личный архив пользователя (боты не останавливаются)
 * @param req - Объект запроса Express
 * @param res - Объект ответа Express
 */
export async function archiveProjectHandler(req: Request, res: Response): Promise<void> {
  try {
    const userId = getOwnerIdFromRequest(req);
    if (userId === null) {
      res.status(401).json({ message: "Требуется авторизация через Telegram" });
      return;
    }

    const projectId = Number(req.params.id);
    await storage.archiveProjectForUser(userId, projectId);
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: "Не удалось заархивировать проект" });
  }
}
