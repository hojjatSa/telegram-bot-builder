/**
 * @fileoverview Страница просмотрщика документации API во фрейме
 * @module components/admin/pages/admin-docs-viewer
 */

import { Link, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { AdminEmbedFrame } from '../admin-embed-frame';
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
        <p className="text-muted-foreground">Unknown documentation viewer.</p>
        <Link href="/admin/docs">
          <Button variant="outline">To the choice of UI</Button>
        </Link>
      </div>
    );
  }

  return (
    <AdminEmbedFrame
      title={option.title}
      embedSrc={getDocsEmbedPath(option.suffix)}
      backHref="/admin/docs"
      backLabel="Все варианты"
    />
  );
}
