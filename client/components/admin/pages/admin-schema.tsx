/**
 * @fileoverview Страница документации схемы базы данных
 * @module components/admin/pages/admin-schema
 */

import { useParams } from 'wouter';
import { AdminEmbedFrame } from '../admin-embed-frame';

/**
 * Просмотр docs/database с боковым меню
 * @returns JSX элемент страницы схемы БД
 */
export function AdminSchemaPage() {
  const params = useParams<{ tableName?: string }>();
  const tableName = params.tableName && params.tableName !== 'embed' ? params.tableName : undefined;
  const embedSrc = tableName
    ? `/admin/schema/embed/${tableName}`
    : '/admin/schema/embed';

  return (
    <AdminEmbedFrame
      title={tableName ?? 'Database Schema'}
      embedSrc={embedSrc}
      backHref={tableName ? '/admin/schema' : undefined}
      backLabel="All tables"
    />
  );
}
