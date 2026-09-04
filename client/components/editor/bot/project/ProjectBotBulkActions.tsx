/**
 * @fileoverview Bulk-кнопки проекта: перезапуск и запуск офлайн
 * @module ProjectBotBulkActions
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Play, RefreshCw } from 'lucide-react';
import {
  startOfflineProgressQueryKey,
  type StartOfflineProgressCache,
} from '../start-offline-progress-query';
import { StartOfflineConfirmDialog } from './StartOfflineConfirmDialog';

/** Свойства bulk-действий проекта */
export interface ProjectBotBulkActionsProps {
  /** ID проекта */
  projectId: number;
  /** Название проекта (для диалога) */
  projectName: string;
  /** Число ботов (0 — кнопки скрыты) */
  botsCount: number;
  /** Перезапуск running */
  onRestartAll?: () => void;
  /** Идёт перезапуск */
  isRestartingAll?: boolean;
  /** Число офлайн-ботов */
  offlineCount?: number;
  /** Запуск офлайн */
  onStartOfflineAll?: () => void;
  /** Идёт массовый старт офлайн */
  isStartingOffline?: boolean;
}

/**
 * Кнопки «Перезапустить» / «Запустить офлайн» для проекта
 * @param props - Свойства
 * @returns JSX или null
 */
export function ProjectBotBulkActions({
  projectId,
  projectName,
  botsCount,
  onRestartAll,
  isRestartingAll,
  offlineCount = 0,
  onStartOfflineAll,
  isStartingOffline,
}: ProjectBotBulkActionsProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { data: progress } = useQuery<StartOfflineProgressCache | undefined>({
    queryKey: startOfflineProgressQueryKey(projectId),
    queryFn: () => undefined,
    enabled: false,
    staleTime: Infinity,
  });

  if (botsCount <= 0) return null;

  const progressLabel =
    isStartingOffline && progress && progress.status === 'running' && progress.total > 0
      ? `${progress.started + progress.failed}/${progress.total}`
      : null;

  return (
    <>
      <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-1.5 sm:px-2 text-xs text-muted-foreground"
          onClick={onRestartAll}
          disabled={isRestartingAll || isStartingOffline}
          aria-label={"Restart all running bots of the project"}
        >
          <RefreshCw className={`w-3 h-3 sm:mr-1 ${isRestartingAll ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">
            {isRestartingAll ? "Restart..." : "Restart"}
          </span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-1.5 sm:px-2 text-xs text-muted-foreground"
          onClick={() => setConfirmOpen(true)}
          disabled={offlineCount === 0 || isStartingOffline || isRestartingAll}
          aria-label={"Launch offline bots of the project"}
        >
          <Play className={`w-3 h-3 sm:mr-1 ${isStartingOffline ? 'animate-pulse' : ''}`} />
          <span className="hidden sm:inline">
            {isStartingOffline
              ? (progressLabel ? `Запуск ${progressLabel}` : 'Starting...')
              : offlineCount > 0
                ? `Запустить офлайн (${offlineCount})`
                : "Start offline"}
          </span>
        </Button>
      </div>

      <StartOfflineConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        projectName={projectName}
        offlineCount={offlineCount}
        onConfirm={() => onStartOfflineAll?.()}
      />
    </>
  );
}
