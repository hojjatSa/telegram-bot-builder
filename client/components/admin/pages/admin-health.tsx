/**
 * @fileoverview Страница проверки работоспособности сервера
 * @module components/admin/pages/admin-health
 */

import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiRequest } from '@/queryClient';

/** Ответ GET /api/health */
interface HealthResponse {
  /** База данных готова */
  database?: boolean;
  /** Шаблоны загружены */
  templates?: boolean;
  /** Telegram подключён */
  telegram?: boolean;
  /** Сервер готов */
  ready?: boolean;
}

/**
 * Отображает статус компонентов из /api/health
 * @returns JSX элемент страницы проверки
 */
export function AdminHealthPage() {
  const { data, isLoading, error } = useQuery<HealthResponse>({
    queryKey: ['/api/health'],
    queryFn: () => apiRequest('GET', '/api/health'),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl space-y-4">
        <h1 className="text-2xl font-bold">Проверка работы</h1>
        <p className="text-destructive">Не удалось получить статус сервера.</p>
      </div>
    );
  }

  const items = [
    { label: 'Database', ok: data.database },
    { label: 'Шаблоны', ok: data.templates },
    { label: 'Telegram', ok: data.telegram },
    { label: 'Готовность', ok: data.ready },
  ];

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Проверка работы</h1>
        <p className="text-muted-foreground mt-1">GET /api/health</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Components</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map(({ label, ok }) => (
            <div key={label} className="flex items-center justify-between">
              <span>{label}</span>
              <Badge variant={ok ? 'default' : 'secondary'}>{ok ? 'OK' : 'Нет'}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">JSON</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs overflow-auto rounded-lg bg-muted p-4">
            {JSON.stringify(data, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
