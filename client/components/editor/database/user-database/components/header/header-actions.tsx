/**
 * @fileoverview Компонент кнопок действий заголовка
 * @description Кнопка очистки базы пользователей
 */

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

/**
 * Пропсы компонента HeaderActions
 */
interface HeaderActionsProps {
  /** ID проекта */
  projectId: number;
  /** Название проекта */
  projectName: string;
  /** Функция обновления (не используется в этом компоненте) */
  onRefresh?: () => void;
  /** Функция очистки базы */
  onDeleteAll: () => void;
}

/**
 * Компонент кнопок действий
 * @param props - Пропсы компонента
 * @returns JSX компонент кнопок
 */
export function HeaderActions({
  projectId,
  projectName,
  onDeleteAll,
}: HeaderActionsProps): React.JSX.Element {
  return (
    <div
      className="flex gap-2"
      data-project-id={projectId}
      title={`Действия для проекта ${projectName}`}
    >
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-9 sm:h-10 px-3 sm:px-4 rounded-xl border-2 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline ml-2">Clear</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete all user data?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All user data for this bot will be deleted permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDeleteAll}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
