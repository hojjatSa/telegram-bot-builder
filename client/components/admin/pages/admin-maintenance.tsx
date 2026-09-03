/**
 * @fileoverview Страница обслуживания платформы
 * @module components/admin/pages/admin-maintenance
 */

import { useMutation } from '@tanstack/react-query';
import { Loader2, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/queryClient';

/**
 * Выполняет служебное действие и показывает результат
 * @param method - HTTP-метод
 * @param url - Адрес обращения к серверу
 * @returns Ответ сервера
 */
async function runAdminAction(method: string, url: string) {
  return apiRequest(method, url);
}

/**
 * Страница служебных операций: шаблоны и папки ботов
 * @returns JSX элемент страницы обслуживания
 */
export function AdminMaintenancePage() {
  const { toast } = useToast();

  const refreshTemplates = useMutation({
    mutationFn: () => runAdminAction('POST', '/admin/api/templates/refresh'),
    onSuccess: (data) => {
      toast({ title: 'Шаблоны обновлены', description: data.message });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const recreateTemplates = useMutation({
    mutationFn: () => runAdminAction('POST', '/admin/api/templates/recreate'),
    onSuccess: (data) => {
      toast({ title: 'Шаблоны пересозданы', description: data.message });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const cleanupFolders = useMutation({
    mutationFn: () => runAdminAction('POST', '/admin/api/bot-folders/cleanup'),
    onSuccess: (data) => {
      toast({ title: data.message, description: `Удалено папок: ${data.count}` });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Обслуживание</h1>
        <p className="text-muted-foreground mt-1">Служебные операции платформы</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Заготовки сценариев</CardTitle>
          <CardDescription>
            Обновление или пересоздание системных шаблонов в базе данных
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="gap-2"
            disabled={refreshTemplates.isPending}
            onClick={() => refreshTemplates.mutate()}
          >
            {refreshTemplates.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Обновить шаблоны
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            disabled={recreateTemplates.isPending}
            onClick={() => recreateTemplates.mutate()}
          >
            {recreateTemplates.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Пересоздать шаблоны
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Папки ботов</CardTitle>
          <CardDescription>
            Удаление осиротевших папок в каталоге bots/ без проекта в базе данных
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            className="gap-2"
            disabled={cleanupFolders.isPending}
            onClick={() => cleanupFolders.mutate()}
          >
            {cleanupFolders.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Очистить осиротевшие папки
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
