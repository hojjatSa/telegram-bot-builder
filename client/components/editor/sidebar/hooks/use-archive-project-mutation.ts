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
      toast({ title: "Archived project", description: "The project is hidden from active lists" });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: "Failed to archive project",
        variant: 'destructive',
      });
    },
  });

  const unarchiveMutation = useMutation({
    mutationFn: (projectId: number) => apiRequest('POST', `/api/projects/${projectId}/unarchive`),
    onSuccess: async () => {
      await invalidateProjectQueries();
      toast({ title: "The project has been restored", description: "The project is active again" });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: "Failed to return project from archive",
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
