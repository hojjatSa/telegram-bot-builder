/**
 * @fileoverview Переключатель защиты контента от копирования/пересылки
 * @module BotProtectContentToggle
 */

import { Switch } from '@/components/ui/switch';
import { ShieldCheck } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SettingCard } from './SettingCard';

interface BotProtectContentToggleProps {
  projectId: number;
  tokenId: number;
  protectContent: number | null;
  className?: string;
  /** Колбэк для pending (если передан — не сохраняет мгновенно) */
  onPendingChange?: (key: string, value: string) => void;
}

async function updateProtectContent(
  projectId: number,
  tokenId: number,
  protectContent: number,
): Promise<void> {
  const res = await fetch(`/api/projects/${projectId}/tokens/${tokenId}/protect-content`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ protectContent }),
  });

  if (!res.ok) {
    throw new Error('Ошибка обновления защиты контента');
  }
}

export function BotProtectContentToggle({
  projectId,
  tokenId,
  protectContent,
  className = '',
  onPendingChange,
}: BotProtectContentToggleProps) {
  const [localEnabled, setLocalEnabled] = useState(protectContent === 1);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    setLocalEnabled(protectContent === 1);
  }, [protectContent]);

  const mutation = useMutation({
    mutationFn: (enabled: boolean) =>
      updateProtectContent(projectId, tokenId, enabled ? 1 : 0),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/tokens`] });
      toast({
        title: 'Setting saved',
        description: "Restart the bot to apply content protection",
      });
    },
    onError: () => {
      setLocalEnabled(protectContent === 1);
      toast({
        title: 'Error',
        description: "Failed to update content protection",
        variant: 'destructive',
      });
    },
  });

  return (
    <SettingCard
      icon={ShieldCheck}
      title={"Copy protection"}
      description={
        localEnabled
          ? "Telegram will prohibit forwarding and saving messages from this bot"
          : "Messages from this bot can be forwarded and saved"
      }
      active={localEnabled}
      className={className}
      action={
        <Switch
          id={`protect-content-${tokenId}`}
          aria-label={"Copy protection"}
          checked={localEnabled}
          onCheckedChange={(checked) => {
            setLocalEnabled(checked);
            if (onPendingChange) {
              onPendingChange('PROTECT_CONTENT', checked ? 'true' : 'false');
            } else {
              mutation.mutate(checked);
            }
          }}
          disabled={mutation.isPending}
        />
      }
    />
  );
}
