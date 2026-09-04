/**
 * @fileoverview Хуки useMutation для использования и удаления сценариев
 * @module client/components/editor/scenariy/hooks/use-scenariy-mutatsii
 */

import { useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { queryClient } from '@/queryClient';
import { useToast } from '@/hooks/use-toast';
import { dobavitIdStsenariya, sokhranitVybrannyyStsenary } from '../utils/scenariy-hranilishche';
import type { BotTemplate } from '@shared/schema';

/**
 * Хук для мутации "использовать сценарий"
 * Инкрементирует счётчик, сохраняет в localStorage и перенаправляет в редактор
 * @returns объект мутации и обработчик handleUseTemplate
 */
export function useIspolzovatStsenary() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (templateId: number) => {
      const response = await fetch(`/api/templates/${templateId}/use`, { method: 'POST' });
      if (!response.ok) throw new Error('Не удалось обновить счётчик использования');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/templates/category/custom'] });
      queryClient.invalidateQueries({ queryKey: ['/api/templates'] });
      toast({ title: "✅ Success!", description: "The script has been added to your projects and collection" });
    },
    onError: () => {
      toast({ title: '❌ Error', description: "Failed to use script", variant: 'destructive' });
    },
  });

  /**
   * Обработчик выбора сценария для использования
   * @param template - выбранный сценарий
   */
  const handleUseTemplate = (template: BotTemplate) => {
    mutation.mutate(template.id);
    sokhranitVybrannyyStsenary(template);
    dobavitIdStsenariya(template.id);
    setLocation('/');
    toast({
      title: "Script loaded!",
      description: `Сценарий "${template.name}" будет применён к вашему проекту`,
    });
  };

  return { mutation, handleUseTemplate };
}

/**
 * Хук для мутации "удалить сценарий"
 * @returns объект мутации и обработчик handleDeleteTemplate
 */
export function useUdalitStsenary() {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (templateId: number) => {
      const response = await fetch(`/api/templates/${templateId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Could not delete template');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/templates/category/custom'] });
      queryClient.invalidateQueries({ queryKey: ['/api/templates'] });
      toast({ title: "✅ Script deleted", description: "Your script has been successfully deleted" });
    },
    onError: () => {
      toast({ title: '❌ Error', description: 'Could not delete template', variant: 'destructive' });
    },
  });

  return mutation;
}
