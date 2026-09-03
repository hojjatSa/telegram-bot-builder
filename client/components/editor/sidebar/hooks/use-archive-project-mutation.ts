/**
 * @fileoverview Хук мутации архивации/разархивации проекта
 * @module components/editor/sidebar/hooks/use-archive-project-mutation
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/queryClient';
import { useToast } from '@/hooks/use-toast';

/**
 * Результат хука архивации проекта
 */
export interface UseArchiveProjectMutationResult {
  /** Поместить проект в личный архив */
  archiveProject: (projectId: number) => void;
  /** Вернуть проект из личного архива */
  unarchiveProject: (projectId: number) => void;
  /** Идёт ли операция */
  isPending: boolean;
}

/**
 * Хук для архивации и возврата проекта из личного архива
 * @returns Функции archive/unarchive и состояние загрузки
 */
export function useArchiveProjectMutation(): UseArchiveProjectMutationResult {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const invalidateProjectQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    await queryClient.invalidateQueries({ queryKey: ['/api/projects/list'] });
  };

  const archiveMutation = useMutation({
    mutationFn: (projectId: number) => apiRequest('POST', `/api/projects/${projectId}/archive`),
    onSuccess: async () => {
      await invalidateProjectQueries();
      toast({ title: 'Проект в архиве', description: 'Проект скрыт из активных списков' });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Не удалось заархивировать проект',
        variant: 'destructive',
      });
    },
  });

  const unarchiveMutation = useMutation({
    mutationFn: (projectId: number) => apiRequest('POST', `/api/projects/${projectId}/unarchive`),
    onSuccess: async () => {
      await invalidateProjectQueries();
      toast({ title: 'Проект восстановлен', description: 'Проект снова в активных' });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Не удалось вернуть проект из архива',
        variant: 'destructive',
      });
    },
  });

  return {
    archiveProject: (projectId) => archiveMutation.mutate(projectId),
    unarchiveProject: (projectId) => unarchiveMutation.mutate(projectId),
    isPending: archiveMutation.isPending || unarchiveMutation.isPending,
  };
}
