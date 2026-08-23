/**
 * @fileoverview Типы ответов API списка аккаунтов платформы
 * @module shared/admin/platform-users.types
 */

/** Краткая запись проекта в ответах admin */
export interface PlatformUserProjectSummary {
  /** Идентификатор проекта */
  id: number;
  /** Название проекта */
  name: string;
  /** Дата создания (ISO) */
  createdAt: string | null;
  /** Дата последнего изменения (ISO) */
  updatedAt: string | null;
}

/** Проект, где пользователь участник */
export interface PlatformUserSharedProjectSummary extends PlatformUserProjectSummary {
  /** Идентификатор владельца проекта */
  ownerId: number | null;
  /** Имя владельца для отображения */
  ownerDisplayName: string;
}

/** Строка списка аккаунтов */
export interface PlatformUserListItem {
  /** Опознаватель в Telegram */
  id: number;
  /** Имя */
  firstName: string;
  /** Фамилия */
  lastName: string | null;
  /** Имя вида @name */
  username: string | null;
  /** Адрес картинки профиля */
  photoUrl: string | null;
  /** Дата первого входа (ISO) */
  createdAt: string | null;
  /** Дата последнего обновления записи (ISO) */
  updatedAt: string | null;
  /** Число проектов во владении */
  ownedCount: number;
  /** Число проектов, где участник */
  sharedCount: number;
}

/** Ответ GET /admin/api/users */
export interface PlatformUsersListResponse {
  /** Строки текущей страницы */
  items: PlatformUserListItem[];
  /** Общее число записей по фильтру */
  total: number;
  /** Номер страницы */
  page: number;
  /** Размер страницы */
  perPage: number;
}

/** Профиль аккаунта в карточке */
export interface PlatformUserProfile {
  /** Опознаватель в Telegram */
  id: number;
  /** Имя */
  firstName: string;
  /** Фамилия */
  lastName: string | null;
  /** Имя вида @name */
  username: string | null;
  /** Адрес картинки профиля */
  photoUrl: string | null;
  /** Дата первого входа (ISO) */
  createdAt: string | null;
  /** Дата последнего обновления записи (ISO) */
  updatedAt: string | null;
}

/** Ответ GET /admin/api/users/:id */
export interface PlatformUserDetailResponse {
  /** Профиль аккаунта */
  user: PlatformUserProfile;
  /** Проекты во владении */
  ownedProjects: PlatformUserProjectSummary[];
  /** Проекты, где участник */
  sharedProjects: PlatformUserSharedProjectSummary[];
}
