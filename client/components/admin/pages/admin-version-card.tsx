/**
 * @fileoverview Карточка версии и проверки обновлений на сводке admin
 * @module components/admin/pages/admin-version-card
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiRequest } from '@/queryClient';
import type { AdminUpdateCheckResult, AdminVersionInfo } from '../types';

/**
 * Блок версии приложения и кнопка проверки обновлений
 * @returns JSX элемент карточки версии
 */
export function AdminVersionCard() {
  const [checkResult, setCheckResult] = useState<AdminUpdateCheckResult | null>(null);
  const [checking, setChecking] = useState(false);

  const { data: version, isLoading } = useQuery<AdminVersionInfo>({
    queryKey: ['/admin/api/version'],
    queryFn: () => apiRequest('GET', '/admin/api/version'),
  });

  const handleCheck = async () => {
    setChecking(true);
    try {
      const result = await apiRequest('GET', '/admin/api/update-check?refresh=1');
      setCheckResult(result as AdminUpdateCheckResult);
    } finally {
      setChecking(false);
    }
  };

  if (isLoading || !version) {
    return (
      <Card>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>Версия приложения</CardDescription>
        <CardTitle className="text-lg">v{version.version}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {version.releasedAt && (
          <p className="text-sm text-muted-foreground">Сборка от {version.releasedAt}</p>
        )}

        <Button variant="outline" size="sm" className="gap-2" onClick={handleCheck} disabled={checking}>
          {checking ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Проверить обновления
        </Button>

        {checkResult && !checkResult.checkFailed && !checkResult.updateAvailable && (
          <Alert>
            <AlertTitle>Актуальная версия</AlertTitle>
            <AlertDescription>
              Установлена последняя версия ({checkResult.current.version}).
            </AlertDescription>
          </Alert>
        )}

        {checkResult?.updateAvailable && checkResult.latest && (
          <Alert>
            <AlertTitle>Доступно обновление</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>
                У вас <Badge variant="secondary">v{checkResult.current.version}</Badge>, на GitHub{' '}
                <Badge>v{checkResult.latest.version}</Badge>
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {checkResult.latest.notesUrl && (
                  <a href={checkResult.latest.notesUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="link" size="sm" className="h-auto p-0 gap-1">
                      Что нового
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </a>
                )}
                <a href={checkResult.deployGuideUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="link" size="sm" className="h-auto p-0 gap-1">
                    Как обновить
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </a>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {checkResult?.checkFailed && (
          <Alert variant="destructive">
            <AlertTitle>Не удалось проверить</AlertTitle>
            <AlertDescription>
              Нет доступа к GitHub или version.json на main. Показана только локальная версия.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
