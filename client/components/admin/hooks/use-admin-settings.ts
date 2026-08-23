/**
 * @fileoverview Хук чтения и сохранения настроек приложения
 * @module components/admin/hooks/use-admin-settings
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/queryClient';
import type { AdminAppSettings, AdminSettingsFormValues, AuthLoginMode } from '../types';

/**
 * Загружает текущие настройки приложения из панели управления.
 * @returns Запрос настроек
 */
export function useAdminSettings() {
  return useQuery<AdminAppSettings>({
    queryKey: ['/admin/api/app-settings'],
    queryFn: () => apiRequest('GET', '/admin/api/app-settings'),
  });
}

/**
 * Сохраняет настройки приложения через PUT /admin/api/app-settings.
 * @returns Мутация сохранения
 */
export function useSaveAdminSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: AdminSettingsFormValues) => {
      const body: {
        auth: { loginMode: AuthLoginMode };
        telegram?: Record<string, string | undefined>;
      } = {
        auth: { loginMode: values.loginMode },
      };

      const clientId = values.clientId.trim();
      if (values.loginMode === 'telegram_widget' || clientId) {
        body.telegram = {
          clientId: values.clientId,
          clientSecret: values.clientSecret.trim() || undefined,
          botToken: values.botToken.trim() || undefined,
          botUsername: values.botUsername.trim() || undefined,
        };
      }

      return apiRequest('PUT', '/admin/api/app-settings', body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/admin/api/app-settings'] });
    },
  });
}
