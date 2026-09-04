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
        <h1 className="text-2xl font-bold">Database (live)</h1>
        <p className="text-muted-foreground">
          Drizzle Studio is only available in development mode. Run{' '}
          <code className="text-foreground">npm run db:studio</code> locally.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Database (live)</h1>
        <p className="text-muted-foreground mt-1">Drizzle Studio - viewing and editing tables</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How to open</CardTitle>
          <CardDescription>
            The studio runs as a separate process and opens in a new browser tab.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>
              In the project terminal, run:{' '}
              <code className="text-foreground">npm run db:studio</code>
            </li>
            <li>Wait for the message about the launch of the studio</li>
            <li>Click the button below</li>
          </ol>
          <a href={DRIZZLE_STUDIO_URL} target="_blank" rel="noopener noreferrer">
            <Button className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Open Drizzle Studio
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
