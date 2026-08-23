/**
 * @fileoverview Типы данных панели управления
 * @module components/admin/types
 */

/** Режим входа на сайте */
export type AuthLoginMode = 'dev_login' | 'telegram_widget';

/** Ответ GET /admin/api/app-settings */
export interface AdminAppSettings {
  /** Платформа настроена и готова к работе */
  configured: boolean;
  /** Настройки входа */
  auth: {
    /** Текущий режим входа */
    loginMode: AuthLoginMode;
    /** Включён dev-login */
    devLoginEnabled: boolean;
  };
  /** Провайдеры авторизации */
  providers: {
    /** Настройки Telegram */
    telegram: {
      /** Client ID из BotFather */
      clientId: string;
      /** Username бота без @ */
      botUsername: string;
      /** Client Secret уже сохранён */
      clientSecretConfigured: boolean;
      /** Bot Token уже сохранён */
      botTokenConfigured: boolean;
      /** Telegram настроен полностью */
      configured: boolean;
    };
  };
}

/** Ответ GET /admin/api/status */
export interface AdminStatus {
  /** Пользователь авторизован в панели */
  authenticated: boolean;
  /** Панель управления включена на сервере */
  adminEnabled: boolean;
}

/** Ответ GET /admin/api/version */
export interface AdminVersionInfo {
  /** Установленная версия */
  version: string;
  /** Дата релиза или null */
  releasedAt: string | null;
  /** Ссылка на release notes или null */
  notesUrl: string | null;
}

/** Ответ GET /admin/api/update-check */
export interface AdminUpdateCheckResult {
  /** Текущая установленная версия */
  current: { version: string; releasedAt: string | null };
  /** Эталон с GitHub или null */
  latest: { version: string; releasedAt: string | null; notesUrl: string | null } | null;
  /** Есть более новая версия */
  updateAvailable: boolean;
  /** Не удалось связаться с GitHub */
  checkFailed: boolean;
  /** Инструкция по деплою на VPS */
  deployGuideUrl: string;
}

/** Значения формы настроек приложения */
export interface AdminSettingsFormValues {
  /** Режим входа */
  loginMode: AuthLoginMode;
  /** Client ID Telegram OIDC */
  clientId: string;
  /** Client Secret (пустое — не менять) */
  clientSecret: string;
  /** Username бота */
  botUsername: string;
  /** Bot Token (пустой — не менять) */
  botToken: string;
}
