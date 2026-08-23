/**
 * @fileoverview Строка таблицы аккаунтов платформы
 * @module components/admin/users/platform-user-row
 */

import { Link } from 'wouter';
import type { PlatformUserListItem } from '@shared/admin/platform-users.types';
import { TableCell, TableRow } from '@/components/ui/table';
import {
  PlatformUserAvatar,
  formatPlatformUserDate,
  formatPlatformUserName,
} from './platform-user-avatar';

/** Пропсы строки таблицы */
interface PlatformUserRowProps {
  /** Данные аккаунта */
  item: PlatformUserListItem;
}

/**
 * Одна строка списка аккаунтов
 * @param props - Свойства компонента
 * @returns JSX элемент
 */
export function PlatformUserRow({ item }: PlatformUserRowProps) {
  const displayName = formatPlatformUserName(
    item.firstName,
    item.lastName,
    item.username,
    item.id,
  );

  return (
    <TableRow>
      <TableCell>
        <Link
          href={`/admin/users/${item.id}`}
          className="flex items-center gap-3 hover:underline"
        >
          <PlatformUserAvatar
            photoUrl={item.photoUrl}
            name={displayName}
            userId={item.id}
          />
          <div className="min-w-0">
            <div className="font-medium truncate">{displayName}</div>
            <div className="text-xs text-muted-foreground truncate">
              {item.firstName}
              {item.lastName ? ` ${item.lastName}` : ''}
            </div>
          </div>
        </Link>
      </TableCell>
      <TableCell className="font-mono text-xs">{item.id}</TableCell>
      <TableCell className="text-sm">{formatPlatformUserDate(item.createdAt)}</TableCell>
      <TableCell className="text-center tabular-nums">{item.ownedCount}</TableCell>
      <TableCell className="text-center tabular-nums">{item.sharedCount}</TableCell>
    </TableRow>
  );
}
