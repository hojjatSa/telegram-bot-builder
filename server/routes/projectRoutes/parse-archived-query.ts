/**
 * @fileoverview Парсинг query-параметра archived для списков проектов
 * @module projectRoutes/parse-archived-query
 */

import type { Request } from "express";

/**
 * Разбирает ?archived=true|false (по умолчанию false — только активные)
 * @param req - HTTP-запрос Express
 * @returns true — только архивные проекты, false — только активные
 */
export function parseArchivedQuery(req: Request): boolean {
  return req.query.archived === "true";
}
