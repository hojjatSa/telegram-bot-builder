/**
 * @fileoverview Хук действий менеджера хранилищ (`useStorageManagerActions`).
 * Инкапсулирует обработчики «сделать активным» (Req 11.6) и «удалить»
 * (Req 11.8) поверх useStorageConfigs с дружелюбными тостами, включая
 * распознавание серверного 409 «на хранилище есть файлы». Вынесено из
 * StorageConfigManager, чтобы тело модалки оставалось в пределах лимита строк.
 * @module components/editor/files/panel/storage/use-storage-manager-actions
 */

import { useToast } from '@/hooks/use-toast';
import { useStorageConfigs } from '../../hooks/use-storage-configs';

/** Признак того, что ошибка — это серверный 409 «на хранилище есть файлы» */
function isFilesConflict(error: unknown): boolean {
  const e = error as { message?: string; filesCount?: number } | null;
  if (!e) return false;
  return typeof e.filesCount === 'number' || Boolean(e.message?.startsWith('409'));
}

/** Результат хука действий менеджера хранилищ */
export interface UseStorageManagerActionsResult {
  /** Пометить хранилище активным для новых загрузок */
  handleSetActive: (configId: string) => Promise<void>;
  /** Удалить хранилище (дружелюбно обрабатывает 409) */
  handleDelete: (configId: string) => Promise<void>;
  /** Выполняется ли изменяющая операция */
  isMutating: boolean;
}

/**
 * Хук обработчиков активации/удаления хранилищ с тостами.
 * @returns Обработчики действий и флаг изменяющей операции
 */
export function useStorageManagerActions(): UseStorageManagerActionsResult {
  const { remove, setActive, isMutating } = useStorageConfigs();
  const { toast } = useToast();

  const handleSetActive = async (configId: string) => {
    try {
      await setActive(configId);
      toast({ title: "The storage is made active" });
    } catch {
      toast({ variant: 'destructive', title: "Failed to change active storage" });
    }
  };

  const handleDelete = async (configId: string) => {
    try {
      await remove(configId);
      toast({ title: "Storage deleted" });
    } catch (error) {
      if (isFilesConflict(error)) {
        toast({
          variant: 'destructive',
          title: "Storage cannot be deleted",
          description: "There are files on this storage. First move or delete them.",
        });
        return;
      }
      toast({ variant: 'destructive', title: "Failed to delete storage" });
    }
  };

  return { handleSetActive, handleDelete, isMutating };
}
