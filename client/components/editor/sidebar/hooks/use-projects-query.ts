/**
 * @fileoverview Хук для загрузки списка проектов
 * Предоставляет данные о проектах и состояние загрузки
 * @module components/editor/sidebar/hooks/use-projects-query
 */

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/queryClient';
import type { BotProject } from '@shared/schema';
import { useTelegramAuth } from '@/components/editor/header/hooks/use-telegram-auth';

/** Проект с флагом личного архива из API */
export type BotProjectWithArchive = BotProject & { isArchivedForMe?: boolean };

/**
 * Результат работы хука загрузки проектов
 */
export interface UseProjectsQueryResult {
  /** Список проектов */
  projects: BotProjectWithArchive[];
  /** Индикатор загрузки */
  isLoading: boolean;
  /** Функция для принудительного обновления данных */
  refetch: () => void;
}

/**
 * Хук для получения списка проектов с сервера.
 * Ожидает готовности серверной сессии перед первым запросом,
 * чтобы не получить пустой список до авторизации.
 *
 * @param archived - true — только архивные проекты, false — только активные
 * @returns Объект с данными о проектах и состоянием
 */
export function useProjectsQuery(archived = false): UseProjectsQueryResult {
  const { sessionReady, user } = useTelegramAuth();
  const userId =
    user && 'id' in user ? user.id : 'anon';
  const viewKey = archived ? 'archived' : 'active';

  const { data, isLoading, refetch } = useQuery<BotProjectWithArchive[]>({
    queryKey: ['/api/projects', userId, viewKey],
    queryFn: () => apiRequest('GET', `/api/projects?archived=${archived}`),
    staleTime: 0,
    enabled: sessionReady,
  });

  useEffect(() => {
    if (sessionReady) {
      refetch();
    }
  }, [sessionReady, refetch]);

  return {
    projects: data || [],
    isLoading,
    refetch,
  };
}
