/**
 * @fileoverview Мутация удаления всех пользователей
 * @description Хук для очистки базы пользователей по выбранному токену
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { buildUsersApiUrl } from '@/components/editor/database/utils';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/queryClient';

/**
 * Параметры хука useDeleteAllUsers
 */
interface UseDeleteAllUsersParams {
  /** Идентификатор проекта */
  projectId: number;
  /** Идентификатор выбранного токена бота */
  selectedTokenId?: number | null;
  /** Функция обновления списка пользователей */
  refetchUsers: () => void;
  /** Функция обновления статистики */
  refetchStats: () => void;
}

/**
 * Хук для удаления всех пользователей
 * @param params - Параметры хука
 * @returns Мутация удаления всех пользователей
 */
export function useDeleteAllUsers(params: UseDeleteAllUsersParams) {
  const { projectId, selectedTokenId, refetchUsers, refetchStats } = params;
  const usersQueryKey = buildUsersApiUrl(`/api/projects/${projectId}/users`, selectedTokenId);
  const statsQueryKey = buildUsersApiUrl(`/api/projects/${projectId}/users/stats`, selectedTokenId);
  const requestUrl = buildUsersApiUrl(`/api/projects/${projectId}/users`, selectedTokenId);
  const { toast } = useToast();
  const qClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiRequest('DELETE', requestUrl),
    onSuccess: (data) => {
      qClient.removeQueries({ queryKey: [usersQueryKey, selectedTokenId] });
      qClient.removeQueries({ queryKey: [statsQueryKey, selectedTokenId] });

      setTimeout(() => {
        refetchUsers();
        refetchStats();
      }, 100);

      const deletedCount = data?.deletedCount || 0;
      toast({
        title: "Database cleared",
        description: `Удалено записей: ${deletedCount}. Все пользовательские данные удалены.`,
      });
    },
    onError: (error) => {
      console.error('Bulk deletion failed:', error);
      toast({
        title: "Database cleanup error",
        description: "Failed to clear the database. Check your console for details.",
        variant: 'destructive',
      });
    },
  });
}
