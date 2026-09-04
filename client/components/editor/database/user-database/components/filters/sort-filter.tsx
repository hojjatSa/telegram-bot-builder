/**
 * @fileoverview Компонент фильтра сортировки пользователей
 * @description Select для сортировки по различным полям и направлениям
 */

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';
import { SortField, SortDirection } from '../../types';

/**
 * Пропсы компонента SortFilter
 */
interface SortFilterProps {
  /** Текущее поле сортировки */
  sortField: SortField;
  /** Текущее направление */
  sortDirection: SortDirection;
  /** Функция изменения сортировки */
  onChange: (field: SortField, direction: SortDirection) => void;
}

/**
 * Компонент фильтра сортировки
 * @param props - Пропсы компонента
 * @returns JSX компонент фильтра
 */
export function SortFilter({
  sortField,
  sortDirection,
  onChange,
}: SortFilterProps): React.JSX.Element {
  return (
    <Select
      value={`${sortField}-${sortDirection}`}
      onValueChange={(value) => {
        const [field, direction] = value.split('-') as [SortField, SortDirection];
        onChange(field, direction);
      }}
    >
      <SelectTrigger
        className="h-10 sm:h-11 text-sm rounded-xl border-2 border-transparent bg-background shadow-sm hover:border-primary/20 transition-all"
        data-testid="select-sort-filter"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-indigo-500/10 flex items-center justify-center">
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <SelectValue placeholder="Sort" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="lastInteraction-desc">Last activity</SelectItem>
        <SelectItem value="lastInteraction-asc">Long-time activity</SelectItem>
        <SelectItem value="interactionCount-desc">More messages</SelectItem>
        <SelectItem value="interactionCount-asc">Fewer messages</SelectItem>
        <SelectItem value="createdAt-desc">New ones first</SelectItem>
        <SelectItem value="createdAt-asc">Old ones first</SelectItem>
        <SelectItem value="firstName-asc">Name A-Z</SelectItem>
        <SelectItem value="firstName-desc">Name Y-A</SelectItem>
      </SelectContent>
    </Select>
  );
}
