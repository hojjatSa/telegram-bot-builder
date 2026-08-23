/**
 * @fileoverview Таблица аккаунтов платформы
 * @module components/admin/users/platform-users-table
 */

import type { PlatformUserListItem } from '@shared/admin/platform-users.types';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlatformUserRow } from './platform-user-row';

/** Пропсы таблицы */
interface PlatformUsersTableProps {
  /** Строки текущей страницы */
  items: PlatformUserListItem[];
}

/**
 * Таблица списка аккаунтов
 * @param props - Свойства компонента
 * @returns JSX элемент
 */
export function PlatformUsersTable({ items }: PlatformUsersTableProps) {
  if (items.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Аккаунты не найдены.
      </p>
    );
  }

  return (
    <div className="rounded-lg border border-border/60 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Аккаунт</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Первый вход</TableHead>
            <TableHead className="text-center">Владелец</TableHead>
            <TableHead className="text-center">Участник</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <PlatformUserRow key={item.id} item={item} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
