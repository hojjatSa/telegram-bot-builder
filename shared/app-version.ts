/**
 * @fileoverview Репозиторий и URL для проверки обновлений по version.json
 * @module shared/app-version
 */

/** Владелец GitHub-репозитория по умолчанию */
export const DEFAULT_GITHUB_REPO_OWNER = "fedorabakumets";

/** Имя GitHub-репозитория по умолчанию */
export const DEFAULT_GITHUB_REPO_NAME = "telegram-bot-builder";

/** Ветка, с которой читается эталонный version.json */
export const DEFAULT_VERSION_BRANCH = "main";

/**
 * Возвращает slug репозитория owner/name для GitHub.
 * @param envRepo - Переменная окружения GITHUB_REPO (owner/name)
 * @returns Slug репозитория
 */
export function resolveGithubRepoSlug(envRepo?: string): string {
  const trimmed = envRepo?.trim();
  if (trimmed && /^[\w.-]+\/[\w.-]+$/.test(trimmed)) {
    return trimmed;
  }
  return `${DEFAULT_GITHUB_REPO_OWNER}/${DEFAULT_GITHUB_REPO_NAME}`;
}

/**
 * URL raw version.json на GitHub.
 * @param repoSlug - Slug owner/name
 * @param branch - Ветка (по умолчанию main)
 * @returns URL для fetch эталонной версии
 */
export function buildVersionManifestRawUrl(
  repoSlug: string,
  branch: string = DEFAULT_VERSION_BRANCH,
): string {
  return `https://raw.githubusercontent.com/${repoSlug}/${branch}/version.json`;
}

/**
 * Ссылка на инструкцию деплоя на VPS в репозитории.
 * @param repoSlug - Slug owner/name
 * @returns URL markdown-инструкции
 */
export function buildDeployGuideUrl(repoSlug: string): string {
  return `https://github.com/${repoSlug}/blob/main/docs/deployment/VPS_GITHUB_ACTIONS.md`;
}
