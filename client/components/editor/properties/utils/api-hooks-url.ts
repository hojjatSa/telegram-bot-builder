/**
 * @fileoverview Сборка публичного URL и подсказок для api_trigger
 * @module properties/utils/api-hooks-url
 */

/**
 * Собирает базовый URL для hooks из конфига сервера или вкладки браузера
 * @param apiBaseUrlFromServer - apiBaseUrl из GET /api/config
 * @returns Базовый URL без завершающего слэша
 */
export function resolveApiHooksBaseUrl(apiBaseUrlFromServer?: string): string {
  const fromServer = apiBaseUrlFromServer?.trim();
  if (fromServer) {
    return fromServer.replace(/\/$/, "");
  }
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "";
}

/**
 * Собирает полный публичный URL hook
 * @param baseUrl - Базовый URL API
 * @param projectId - ID проекта
 * @param apiPath - Путь из настроек узла
 * @returns Полный URL
 */
export function buildApiHookPublicUrl(baseUrl: string, projectId: number, apiPath: string): string {
  const path = apiPath.trim() || "/";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl.replace(/\/$/, "")}/api/hooks/${projectId}${normalizedPath}`;
}

/**
 * Подсказка под полем URL в зависимости от окружения
 * @param baseUrl - Базовый URL
 * @param fromServerEnv - true если baseUrl пришёл с сервера (API_BASE_URL или proxy)
 * @returns Текст подсказки или null если показывать не нужно
 */
export function getApiHookUrlHint(baseUrl: string, fromServerEnv: boolean): string | null {
  try {
    const u = new URL(baseUrl);
    const isLocal = u.hostname === "localhost" || u.hostname === "127.0.0.1";
    if (isLocal) {
      return "Локальный адрес недоступен из интернета. Для внешних сервисов — туннель (ngrok) на порт Node или deploy.";
    }
    if (u.protocol === "http:") {
      return "Используется HTTP. На production задайте API_BASE_URL с https:// в окружении сервера.";
    }
    if (!fromServerEnv) {
      return "Адрес взят из текущей вкладки. Для фиксированного URL укажите API_BASE_URL на сервере.";
    }
    return null;
  } catch {
    return null;
  }
}
