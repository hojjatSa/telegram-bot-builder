/**
 * @fileoverview Страница просмотрщика документации API во фрейме
 * @module components/admin/pages/admin-docs-viewer
 */

import { Link, useParams } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DOCS_UI_OPTIONS, getDocsEmbedPath } from '../docs/docs-ui-options';

/**
 * Просмотрщик Swagger / Scalar / Redoc / RapiDoc с боковым меню
 * @returns JSX элемент страницы просмотрщика
 */
export function AdminDocsViewerPage() {
  const params = useParams<{ viewer: string }>();
  const option = DOCS_UI_OPTIONS.find((item) => item.suffix === `/${params.viewer}`);

  if (!option) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">Неизвестный просмотрщик документации.</p>
        <Link href="/admin/docs">
          <Button variant="outline">К выбору UI</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="-m-6 md:-m-8 flex flex-col">
      <div className="flex items-center gap-3 px-6 py-3 border-b border-border/50 bg-background">
        <Link href="/admin/docs">
          <Button variant="ghost" size="sm" className="gap-2 h-8">
            <ArrowLeft className="h-4 w-4" />
            Все варианты
          </Button>
        </Link>
        <h1 className="text-sm font-semibold">{option.title}</h1>
      </div>
      <iframe
        title={option.title}
        src={getDocsEmbedPath(option.suffix)}
        className="w-full border-0 bg-background"
        style={{ height: 'calc(100vh - 7rem)' }}
      />
    </div>
  );
}
