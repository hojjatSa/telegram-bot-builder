/**
 * @fileoverview Страница просмотра OpenAPI JSON
 * @module components/admin/pages/admin-openapi
 */

import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiRequest } from '@/queryClient';

/**
 * Отображает сырой OpenAPI spec из /admin/openapi.json
 * @returns JSX элемент страницы OpenAPI
 */
export function AdminOpenapiPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/admin/openapi.json'],
    queryFn: () => apiRequest('GET', '/admin/openapi.json'),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl space-y-4">
        <h1 className="text-2xl font-bold">OpenAPI JSON</h1>
        <p className="text-destructive">Не удалось загрузить спецификацию.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">OpenAPI JSON</h1>
        <p className="text-muted-foreground mt-1">/admin/openapi.json</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Спецификация</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs overflow-auto rounded-lg bg-muted p-4 max-h-[70vh]">
            {JSON.stringify(data, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
