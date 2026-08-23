/**
 * @fileoverview Страница выбора UI документации API
 * @module components/admin/pages/admin-docs
 */

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DOCS_UI_OPTIONS, OPENAPI_SPEC_PATH } from '../docs/docs-ui-options';

/**
 * Hub документации API: выбор Swagger, Scalar, Redoc или RapiDoc
 * @returns JSX элемент страницы документации
 */
export function AdminDocsPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Telegram Bot Builder API</h1>
        <p className="text-muted-foreground mt-1">
          JSON:{' '}
          <a
            href={OPENAPI_SPEC_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {OPENAPI_SPEC_PATH}
          </a>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {DOCS_UI_OPTIONS.map((ui) => (
          <a key={ui.suffix} href={`/admin/docs${ui.suffix}`} className="block group">
            <Card className="h-full transition-colors group-hover:border-primary/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-lg">{ui.title}</CardTitle>
                  <Badge
                    variant={ui.badge === 'interactive' ? 'default' : 'secondary'}
                    className="text-[10px] uppercase tracking-wide"
                  >
                    {ui.badge}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {ui.description}
                </CardDescription>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
