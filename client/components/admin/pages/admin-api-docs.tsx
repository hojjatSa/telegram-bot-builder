/**
 * @fileoverview Страница справочника API (markdown)
 * @module components/admin/pages/admin-api-docs
 */

import { useParams } from 'wouter';
import { AdminEmbedFrame } from '../admin-embed-frame';

/**
 * Просмотр docs/api с боковым меню
 * @returns JSX элемент страницы справочника
 */
export function AdminApiDocsPage() {
  const params = useParams<{ slug?: string }>();
  const slug = params.slug && params.slug !== 'embed' ? params.slug : undefined;
  const embedSrc = slug ? `/admin/api-docs/embed/${slug}` : '/admin/api-docs/embed';

  return (
    <AdminEmbedFrame
      title={slug ?? 'API Reference'}
      embedSrc={embedSrc}
      backHref={slug ? '/admin/api-docs' : undefined}
      backLabel="Все разделы"
    />
  );
}
