/**
 * @fileoverview Переключение страниц списка аккаунтов
 * @module components/admin/users/platform-users-pager
 */

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

/** Пропсы постраничного вывода */
interface PlatformUsersPagerProps {
  /** Текущая страница */
  page: number;
  /** Размер страницы */
  perPage: number;
  /** Общее число записей */
  total: number;
  /** Смена страницы */
  onPageChange: (page: number) => void;
}

/**
 * Кнопки «назад» и «вперёд» для списка аккаунтов
 * @param props - Свойства компонента
 * @returns JSX элемент или null
 */
export function PlatformUsersPager({
  page,
  perPage,
  total,
  onPageChange,
}: PlatformUsersPagerProps) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-4 pt-2">
      <p className="text-sm text-muted-foreground">
        Страница {page} из {totalPages} · всего {total}
      </p>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          Назад
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Вперёд
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
