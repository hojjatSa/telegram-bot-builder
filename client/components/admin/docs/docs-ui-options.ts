/**
 * @fileoverview Варианты UI для документации OpenAPI
 * @module components/admin/docs/docs-ui-options
 */

/** Вариант просмотра документации API */
export interface DocsUiOption {
  /** Заголовок карточки */
  title: string;
  /** Краткое описание */
  description: string;
  /** Путь относительно /admin/docs */
  suffix: string;
  /** Тип UI: интерактивный или только чтение */
  badge: 'interactive' | 'read-only';
}

/** Список доступных UI документации API */
export const DOCS_UI_OPTIONS: DocsUiOption[] = [
  {
    title: 'Swagger UI',
    description: 'Классика: Try it out, Authorize, отправка запросов из браузера.',
    suffix: '/swagger',
    badge: 'interactive',
  },
  {
    title: 'Scalar',
    description: 'Современный UI: поиск, тёмная тема, удобный Try it out.',
    suffix: '/scalar',
    badge: 'interactive',
  },
  {
    title: 'Redoc',
    description: 'Read-only документация: трёхколоночный layout, удобно читать схемы.',
    suffix: '/redoc',
    badge: 'read-only',
  },
  {
    title: 'RapiDoc',
    description: 'Компактный read-only viewer с боковой навигацией.',
    suffix: '/rapidoc',
    badge: 'read-only',
  },
];

/** Путь к JSON-спецификации OpenAPI */
export const OPENAPI_SPEC_PATH = '/admin/openapi.json';

/**
 * Возвращает URL встроенного просмотрщика на сервере (без React-оболочки).
 * @param suffix - Суффикс вида /swagger
 * @returns Полный путь для iframe
 */
export function getDocsEmbedPath(suffix: string): string {
  return `/admin/docs/embed${suffix}`;
}
