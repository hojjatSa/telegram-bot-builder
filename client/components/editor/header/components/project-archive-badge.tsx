/**
 * @fileoverview Бейдж «В архиве» и кнопка возврата в шапке редактора
 * @module components/editor/header/components/project-archive-badge
 */

import { ArchiveRestore } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Пропсы бейджа архива проекта
 */
export interface ProjectArchiveBadgeProps {
  /** Обработчик возврата из архива */
  onUnarchive: () => void;
  /** Блокировка кнопки */
  disabled?: boolean;
}

/**
 * Бейдж «В архиве» с кнопкой «Вернуть» для текущего проекта
 * @param props - Свойства компонента
 * @returns JSX элемент или null
 */
export function ProjectArchiveBadge({ onUnarchive, disabled = false }: ProjectArchiveBadgeProps) {
  return (
    <div className="flex items-center gap-1.5 flex-shrink-0">
      <span className="text-[10px] xs:text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-400/30 whitespace-nowrap">
        В архиве
      </span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled}
        onClick={onUnarchive}
        className="h-7 px-2 text-xs gap-1 text-amber-700 dark:text-amber-300 hover:bg-amber-500/15"
        title="Вернуть из архива"
      >
        <ArchiveRestore className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Вернуть</span>
      </Button>
    </div>
  );
}
