/**
 * @fileoverview Главная панель вкладки "Version History" проекта
 * @module editor/versions/versions-panel
 */

import { useCallback, useState } from 'react';
import { History, RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { TabHeader } from '@/components/ui/tab-header';
import { useToast } from '@/hooks/use-toast';
import { useProjectVersions, useRestoreProjectVersion } from '@/hooks/use-project-versions';
import { VersionList } from './version-list';
import { CommitForm } from './commit-form';

/** Пропсы панели версий */
export interface VersionsPanelProps {
  /** ID проекта */
  projectId: number;
  /** Колбэк после успешного восстановления версии */
  onRestored?: () => void;
}

/**
 * Панель истории версий проекта с возможностью отката
 * @param props - Свойства компонента
 * @returns JSX элемент панели версий
 */
export function VersionsPanel({ projectId, onRestored }: VersionsPanelProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: versions = [], isLoading } = useProjectVersions(projectId);
  const restoreMutation = useRestoreProjectVersion(projectId);
  const [restoringId, setRestoringId] = useState<number | null>(null);

  /** Обработчик восстановления версии */
  const handleRestore = useCallback((versionId: number) => {
    setRestoringId(versionId);
    restoreMutation.mutate(versionId, {
      onSuccess: () => {
        // Сначала показываем уведомление — гарантированно, до обновления холста
        toast({
          title: 'Version restored',
          description: 'Project restored to the selected version. Changes are visible on the canvas.',
        });
        // Обновление холста оборачиваем, чтобы возможная ошибка не «съела» фидбек
        try {
          onRestored?.();
        } catch (err) {
          console.error('[VersionsPanel] Ошибка обновления холста после отката:', err);
        }
      },
      onError: () => {
        toast({
          title: 'Restore failed',
          description: 'Could not restore project version',
          variant: 'destructive',
        });
      },
      onSettled: () => {
        setRestoringId(null);
      },
    });
  }, [restoreMutation, onRestored, toast]);

  return (
    <div className="flex flex-col h-full bg-background">
      <TabHeader
        icon={<History className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />}
        title="Version History"
        actions={
          <button type="button" title="Refresh"
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'versions'] });
              toast({ title: 'List refreshed' });
            }}
            className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <RefreshCw className="h-4 w-4" />
          </button>
        }
      />
      <div className="border-b border-border">
        <CommitForm projectId={projectId} />
      </div>
      <div className="flex-1 overflow-auto">
        <VersionList
          versions={versions}
          projectId={projectId}
          isLoading={isLoading}
          restoringId={restoringId}
          onRestore={handleRestore}
        />
      </div>
    </div>
  );
}
