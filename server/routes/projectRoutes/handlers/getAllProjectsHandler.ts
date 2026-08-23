/**
 * @fileoverview Хендлер получения всех проектов
 *
 * Этот модуль предоставляет функцию для обработки запросов
 * на получение всех проектов с данными.
 *
 * @module projectRoutes/handlers/getAllProjectsHandler
 */

import type { Request, Response } from "express";
import { storage } from "../../../storages/storage";
import { getOwnerIdFromRequest } from "../../../telegram/auth-middleware";
import { parseArchivedQuery } from "../parse-archived-query";

/**
 * Обрабатывает запрос на получение всех проектов
 * @param req - Объект запроса
 * @param res - Объект ответа
 */
export async function getAllProjectsHandler(req: Request, res: Response): Promise<void> {
    try {
        const ownerId = getOwnerIdFromRequest(req);
        const archived = parseArchivedQuery(req);
        const projects = ownerId !== null
            ? await storage.getUserBotProjects(ownerId, { archived })
            : [];

        res.json(projects.map((project) => ({
            ...project,
            isArchivedForMe: archived,
        })));
    } catch {
        res.status(500).json({ message: "Не удалось получить проекты" });
    }
}
