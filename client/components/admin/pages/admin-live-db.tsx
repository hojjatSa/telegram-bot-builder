/**
 * @fileoverview Страница Drizzle Studio (живая БД)
 * @module components/admin/pages/admin-live-db
 */

import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/** URL Drizzle Studio в режиме разработки */
const DRIZZLE_STUDIO_URL = 'https://local.drizzle.studio';

/**
 * Инструкция и ссылка на Drizzle Studio (открывается отдельно — iframe не поддерживается)
 * @returns JSX элемент страницы живой БД
 */
export function AdminLiveDbPage() {
  if (!import.meta.env.DEV) {
    return (
      <div className="max-w-xl space-y-4">
        <h1 className="text-2xl font-bold">База данных (живая)</h1>
        <p className="text-muted-foreground">
          Drizzle Studio доступен только в режиме разработки. Запустите{' '}
          <code className="text-foreground">npm run db:studio</code> локально.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">База данных (живая)</h1>
        <p className="text-muted-foreground mt-1">Drizzle Studio — просмотр и редактирование таблиц</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Как открыть</CardTitle>
          <CardDescription>
            Студия работает отдельным процессом и открывается в новой вкладке браузера.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>
              В терминале проекта выполните:{' '}
              <code className="text-foreground">npm run db:studio</code>
            </li>
            <li>Дождитесь сообщения о запуске студии</li>
            <li>Нажмите кнопку ниже</li>
          </ol>
          <a href={DRIZZLE_STUDIO_URL} target="_blank" rel="noopener noreferrer">
            <Button className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Открыть Drizzle Studio
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
