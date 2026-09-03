/**
 * @fileoverview Хук остановки рассылки
 * @module client/components/editor/broadcast/hooks/use-stop-broadcast
 */

import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/queryClient';
import { useToast } from '@/hooks/use-toast';

/**
 * Параметры хука useStopBroadcast
 */
interface UseStopBroadcastParams {
  /** Идентификатор проекта */
  projectId: number;
  /** Колбэк для обновления списка */
  refetch?: () => void;
}

/**
 * Хук остановки рассылки через POST /api/projects/:projectId/broadcasts/:id/stop.
 * При успехе показывает toast и вызывает refetch.
 *
 * @param params - Параметры хука
 * @returns Мутация остановки рассылки
 */
export function useStopBroadcast({ projectId, refetch }: UseStopBroadcastParams) {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (broadcastId: number) => {
      return apiRequest(
        'POST',
        `/api/projects/${projectId}/broadcasts/${broadcastId}/stop`,
      );
    },
    onSuccess: () => {
      toast({ title: 'Broadcast stopped' });
      refetch?.();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Could not stop broadcast',
        variant: 'destructive',
      });
    },
  });
}
