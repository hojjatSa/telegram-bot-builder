/**
 * @fileoverview Хук проверки доступа к панели управления
 * @module components/admin/hooks/use-admin-status
 */

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/queryClient';
import type { AdminStatus } from '../types';

/**
 * Проверяет авторизацию в панели; при отсутствии доступа перенаправляет на вход.
 * @returns Состояние запроса статуса панели
 */
export function useAdminStatus() {
  const query = useQuery<AdminStatus>({
    queryKey: ['/admin/api/status'],
    queryFn: () => apiRequest('GET', '/admin/api/status'),
    retry: false,
  });

  useEffect(() => {
    if (query.isSuccess && !query.data?.authenticated) {
      window.location.replace('/admin/login');
    }
  }, [query.isSuccess, query.data?.authenticated]);

  return query;
}
