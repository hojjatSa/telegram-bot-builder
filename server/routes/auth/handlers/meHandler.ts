/**
 * @fileoverview Хендлер текущего пользователя Studio-сессии
 * @module auth/handlers/meHandler
 */

import type { Request, Response } from "express";
import { getGolnoorUserAccess } from "../../../fork/access-control/service";

/**
 * Возвращает пользователя из session cookie без сайд-эффектов.
 * При отсутствии сессии или telegramUser отвечает `{ user: null }`.
 *
 * @param req - Объект запроса Express
 * @param res - Ответ Express
 * @returns Promise без значения
 */
export async function handleMe(req: Request, res: Response): Promise<void> {
    try {
        const user = req.session?.telegramUser ?? null;
        if (!user) {
            res.json({ user: null });
            return;
        }

        const access = await getGolnoorUserAccess(Number(user.id), {
            createIfMissing: true,
        });

        if (!access.allowed) {
            if (req.session) {
                delete req.session.telegramUser;
                await new Promise<void>((resolve) => {
                    req.session.save((error) => {
                        if (error) {
                            console.warn(
                                '[Fork/AccessControl] failed to persist revoked /me session:',
                                error.message,
                            );
                        }
                        resolve();
                    });
                });
            }
            res.json({ user: null, accessStatus: access.status });
            return;
        }

        res.json({ user });
    } catch (error) {
        console.error("Ошибка GET /api/auth/me:", error);
        res.status(500).json({ user: null, error: "Ошибка чтения сессии" });
    }
}
