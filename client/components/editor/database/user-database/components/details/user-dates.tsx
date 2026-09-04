/**
 * @fileoverview Компонент отображения дат пользователя
 * @description Показывает даты регистрации, обновления и активности
 */

import { Label } from '@/components/ui/label';
import { formatDate } from '../../../utils';

/**
 * Пропсы компонента UserDates
 */
interface UserDatesProps {
  /** Дата создания */
  createdAt: unknown;
  /** Дата обновления */
  updatedAt: unknown;
  /** Дата последней активности */
  lastInteraction: unknown;
}

/**
 * Компонент дат пользователя
 * @param props - Пропсы компонента
 * @returns JSX компонент дат
 */
export function UserDates({
  createdAt,
  updatedAt,
  lastInteraction,
}: UserDatesProps): React.JSX.Element {
  return (
    <div>
      <Label className="text-sm font-medium">Dates</Label>
      <div className="mt-2 space-y-2">
        <div>
          <span className="text-sm text-muted-foreground">Registration:</span>{' '}
          {String(formatDate(createdAt ?? null))}
        </div>
        <div>
          <span className="text-sm text-muted-foreground">Latest update:</span>{' '}
          {String(formatDate(updatedAt ?? null))}
        </div>
        <div>
          <span className="text-sm text-muted-foreground">Last activity:</span>{' '}
          {String(formatDate(lastInteraction ?? null))}
        </div>
      </div>
    </div>
  );
}
