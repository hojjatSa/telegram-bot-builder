/**
 * @fileoverview API версии приложения и проверки обновлений для admin
 * @module server/admin/handlers/version-handlers
 */

import type { Request, Response } from "express";
import { compareAppVersions } from "../../../shared/compare-app-versions";
import {
  buildDeployGuideUrl,
  resolveGithubRepoSlug,
} from "../../../shared/app-version";
import { fetchLatestVersionManifest } from "../../app-version/fetch-latest-version";
import { readInstalledVersionManifest } from "../../app-version/read-installed-version";

/**
 * GET /admin/api/version — установленная версия из version.json образа.
 * @param _req - Запрос Express
 * @param res - Ответ Express
 */
export function handleGetAdminVersion(_req: Request, res: Response): void {
  const manifest = readInstalledVersionManifest();
  res.json({
    version: manifest.version,
    releasedAt: manifest.releasedAt ?? null,
    notesUrl: manifest.notesUrl ?? null,
  });
}

/**
 * GET /admin/api/update-check — сравнение с version.json на GitHub.
 * @param req - Запрос Express (?refresh=1 сбрасывает кеш)
 * @param res - Ответ Express
 */
export async function handleGetAdminUpdateCheck(req: Request, res: Response): Promise<void> {
  const current = readInstalledVersionManifest();
  const repoSlug = resolveGithubRepoSlug(process.env.GITHUB_REPO);
  const forceRefresh = req.query.refresh === "1" || req.query.refresh === "true";

  const latest = await fetchLatestVersionManifest({ forceRefresh });

  if (!latest) {
    res.json({
      current: { version: current.version, releasedAt: current.releasedAt ?? null },
      latest: null,
      updateAvailable: false,
      checkFailed: true,
      deployGuideUrl: buildDeployGuideUrl(repoSlug),
    });
    return;
  }

  const updateAvailable = compareAppVersions(current.version, latest.version) < 0;

  res.json({
    current: { version: current.version, releasedAt: current.releasedAt ?? null },
    latest: {
      version: latest.version,
      releasedAt: latest.releasedAt ?? null,
      notesUrl: latest.notesUrl ?? null,
    },
    updateAvailable,
    checkFailed: false,
    deployGuideUrl: buildDeployGuideUrl(repoSlug),
  });
}
