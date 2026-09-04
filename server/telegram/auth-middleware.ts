import { NextFunction, Request, Response } from "express";
import "express-session";
import { TelegramUserDB } from "@shared/schema";
import { getGolnoorUserAccess } from "../fork/access-control/service";

// Расширяем типы Express для поддержки req.user и session
declare module "express-session" {
  interface SessionData {
    telegramUser?: TelegramUserDB;
  }
}

declare global {
  namespace Express {
    interface Request {
      /** Пользователь из сессии или MCP PAT */
      user?: TelegramUserDB;
      /** Сырой Bearer PAT для remote MCP (только на /mcp) */
      mcpAgentToken?: string;
      /** Scopes PAT через запятую (если личность из Bearer) */
      agentScopes?: string;
      /** Действующий telegram id для `/api/bot/*` (после resolveBotApiActor) */
      botActorId?: number;
    }
  }
}

/**
 * Middleware для установки req.user из Telegram сессии.
 * Golnoor production additionally checks the fork-isolated approval table.
 */
export async function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const sessionUser = req.session?.telegramUser;
  if (!sessionUser) {
    next();
    return;
  }

  try {
    const access = await getGolnoorUserAccess(Number(sessionUser.id), {
      createIfMissing: true,
    });

    if (access.allowed) {
      req.user = sessionUser;
    } else if (req.session) {
      // Revocation should take effect for already-open browser sessions too.
      delete req.session.telegramUser;
      req.session.save((error) => {
        if (error) {
          console.warn('[Fork/AccessControl] failed to persist revoked session:', error.message);
        }
      });
    }
  } catch (error) {
    // Fail closed: a DB/access-control failure must not silently grant access.
    console.error(
      '[Fork/AccessControl] session check failed:',
      error instanceof Error ? error.message : error,
    );
  }

  next();
}

/**
 * Алиас authMiddleware по эталонной модели безопасности (см. api-security-ideal-architecture.md).
 * Обогащает req.user из сессии, не блокирует запрос. Блокировку выполняет requireAuth/requireApiAuth.
 */
export const identifyUser = authMiddleware;

/**
 * Middleware для проверки авторизации
 * Возвращает 401, если пользователь не авторизован
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Требуется авторизация через Telegram"
    });
  }

  next();
  return; // Явно указываем, что функция завершается
}

/**
 * Опциональный middleware для получения ownerId
 * Возвращает ownerId из req.user или null для неавторизованных пользователей
 */
export function getOwnerIdFromRequest(req: Request): number | null {
  if (req.user) {
    return req.user.id;
  }
  return null;
}

/**
 * Возвращает ID сессии для неавторизованных пользователей
 * @deprecated Концепция гостевых сессий удалена (deny-by-default). Не используется.
 * @param req - Объект запроса Express
 * @returns ID сессии или null если пользователь авторизован
 */
export function getSessionIdFromRequest(req: Request): string | null {
  if (req.user) return null; // авторизованный — sessionId не нужен
  return req.session?.id ?? null;
}
