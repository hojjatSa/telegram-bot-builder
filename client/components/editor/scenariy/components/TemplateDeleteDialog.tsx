/**
 * @fileoverview Диалог подтверждения удаления сценария на основе AlertDialog из shadcn/ui
 * @module client/components/editor/scenariy/components/TemplateDeleteDialog
 */

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { TemplateDeleteDialogProps } from '../types/scenariy-tipy';

/**
 * Диалог подтверждения удаления сценария
 * Заменяет window.confirm — использует AlertDialog из shadcn/ui
 * @param props - свойства компонента
 * @returns JSX элемент диалога
 */
export function TemplateDeleteDialog({ template, onConfirm, onCancel }: TemplateDeleteDialogProps) {
  return (
    <AlertDialog open={template !== null} onOpenChange={(open) => { if (!open) onCancel(); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete the script?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the script?{' '}
            <span className="font-semibold text-foreground">«{template?.name}»</span>?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
