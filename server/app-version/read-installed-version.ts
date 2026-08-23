/**
 * @fileoverview Чтение установленной версии из version.json
 * @module server/app-version/read-installed-version
 */

import fs from "fs";
import path from "path";
import type { VersionManifest } from "../../shared/version-manifest.types";

/** Кеш распарсенного манифеста */
let cachedManifest: VersionManifest | null = null;

/**
 * Возвращает путь к version.json в корне проекта.
 * @returns Абсолютный путь к файлу
 */
function resolveVersionManifestPath(): string {
  return path.resolve(process.cwd(), "version.json");
}

/**
 * Читает version.json с диска (кешируется на время процесса).
 * @returns Манифест установленной версии
 */
export function readInstalledVersionManifest(): VersionManifest {
  if (cachedManifest) {
    return cachedManifest;
  }

  const filePath = resolveVersionManifestPath();
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = JSON.parse(raw) as VersionManifest;

  if (!parsed.version || typeof parsed.version !== "string") {
    throw new Error("version.json: отсутствует поле version");
  }

  cachedManifest = parsed;
  return parsed;
}

/**
 * Возвращает строку установленной версии.
 * @returns Версия приложения
 */
export function getInstalledAppVersion(): string {
  return readInstalledVersionManifest().version;
}
