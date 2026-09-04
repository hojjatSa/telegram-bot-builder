/**
 * @fileoverview Нижняя плашка массовых действий над выбранными файлами
 * `SelectionActionBar`: показывает количество выбранных и действия
 * «Прикрепить» (при canAttach, даже если файлы ещё не отмечены — кнопка
 * тогда неактивна), «Удалить» и «Снять выбор» (Req 3.2–3.5).
 * @module components/editor/files/panel/selection-action-bar
 */

import { Paperclip, Trash2, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { SELECTION_BAR_CLASS } from './panel-styles';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

/** Пропсы панели действий над выбранными файлами */
export interface SelectionActionBarProps {
  /** Кол-во выбранных файлов */
  selectedCount: number;
  /** Доступно ли прикрепление (есть attachTarget) */
  canAttach: boolean;
  /** Прикрепить выбранные файлы к ноде */
  onAttach: () => void;
  /** Массовое удаление выбранных файлов */
  onDelete: () => void;
  /** Снять выделение со всех файлов */
  onClearSelection: () => void;
  /** Идёт удаление (дизейблит кнопку «Удалить») */
  isDeleting?: boolean;
}

/**
 * Плашка массовых действий: видна при выборе файлов или когда можно прикреплять.
 * @param props - Кол-во выбранных, флаги и колбэки действий
 * @returns JSX элемент плашки действий
 */
export function SelectionActionBar({
  selectedCount,
  canAttach,
  onAttach,
  onDelete,
  onClearSelection,
  isDeleting = false,
}: SelectionActionBarProps) {
  return (
    <div
      className={SELECTION_BAR_CLASS}
      data-testid="selection-action-bar"
    >
      <span className="text-sm text-muted-foreground tabular-nums" data-testid="selection-count">
        {selectedCount > 0
          ? `Выбрано: ${selectedCount}`
          : "Mark files with a checkmark on the left"}
      </span>

      <div className="flex flex-wrap items-center gap-2">
        {selectedCount > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            data-testid="clear-selection"
          >
            <X className="mr-1.5 h-3.5 w-3.5" />
            Deselect
          </Button>
        )}

        {canAttach && (
          <Button
            type="button"
            variant="default"
            size="sm"
            disabled={selectedCount === 0}
            onClick={onAttach}
            title={selectedCount === 0 ? "First, mark the files with a checkmark on the left" : "Attach selected files to node"}
            data-testid="attach-selected"
          >
            <Paperclip className="mr-1.5 h-3.5 w-3.5" />
            {selectedCount > 0 ? `Прикрепить (${selectedCount})` : "Attach to node"}
          </Button>
        )}

        {selectedCount > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={isDeleting}
                data-testid="delete-selected"
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                Delete ({selectedCount})
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete selected files?</AlertDialogTitle>
                <AlertDialogDescription>
                  The following files will be deleted: {selectedCount}. The action is irreversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} data-testid="confirm-delete">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
