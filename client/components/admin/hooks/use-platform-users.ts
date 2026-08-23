/**
 * @fileoverview Хук загрузки списка аккаунтов платформы
 * @module components/admin/hooks/use-platform-users
 */

import { useQuery } from '@tanstack/react-query';
import type { PlatformUsersListResponse } from '@shared/admin/platform-users.types';
import { apiRequest } from '@/queryClient';

/** Параметры запроса списка */
export interface UsePlatformUsersParams {
  /** Строка поиска */
  search: string;
  /** Номер страницы */
  page: number;
  /** Размер страницы */
  perPage: number;
}

/**
 * Загружает страницу аккаунтов платформы
 * @param params - Поиск и постраничный вывод
 * @returns Запрос списка
 */
export function usePlatformUsers(params: UsePlatformUsersParams) {
  const trimmed = params.search.trim();
  const query = new URLSearchParams({
    page: String(params.page),
    perPage: String(params.perPage),
  });
  if (trimmed) query.set('search', trimmed);

  return useQuery<PlatformUsersListResponse>({
    queryKey: ['/admin/api/users', trimmed, params.page, params.perPage],
    queryFn: () => apiRequest('GET', `/admin/api/users?${query.toString()}`),
  });
}
