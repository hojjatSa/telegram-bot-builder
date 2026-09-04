import { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, Loader2, ShieldCheck, ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

type AccessStatus = 'pending' | 'allowed' | 'blocked';

interface AccessUser {
  id: string;
  firstName: string;
  lastName: string | null;
  username: string | null;
  photoUrl: string | null;
  createdAt: string | null;
  status: AccessStatus;
  accessUpdatedAt: string | null;
}

interface AccessResponse {
  enabled: boolean;
  users: AccessUser[];
}

function statusLabel(status: AccessStatus): string {
  if (status === 'allowed') return 'Allowed';
  if (status === 'blocked') return 'Blocked';
  return 'Pending approval';
}

function statusClasses(status: AccessStatus): string {
  if (status === 'allowed') return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
  if (status === 'blocked') return 'bg-destructive/10 text-destructive';
  return 'bg-amber-500/10 text-amber-700 dark:text-amber-300';
}

function displayName(user: AccessUser): string {
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  if (name) return name;
  if (user.username) return `@${user.username}`;
  return `Telegram ${user.id}`;
}

export function AdminAccessControlPanel() {
  const { toast } = useToast();
  const [data, setData] = useState<AccessResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [changingId, setChangingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const response = await fetch('/admin/api/fork/access-control/users', {
        credentials: 'include',
        cache: 'no-store',
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setData(await response.json());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load access control');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const counts = useMemo(() => {
    const users = data?.users ?? [];
    return {
      pending: users.filter((user) => user.status === 'pending').length,
      allowed: users.filter((user) => user.status === 'allowed').length,
      blocked: users.filter((user) => user.status === 'blocked').length,
    };
  }, [data]);

  const updateStatus = async (user: AccessUser, status: AccessStatus) => {
    setChangingId(user.id);
    try {
      const response = await fetch(`/admin/api/fork/access-control/users/${encodeURIComponent(user.id)}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body?.error || `HTTP ${response.status}`);

      setData((current) => current ? {
        ...current,
        users: current.users.map((item) => item.id === user.id ? { ...item, status } : item),
      } : current);

      toast({
        title: status === 'allowed' ? 'Access allowed' : 'Access blocked',
        description: `${displayName(user)} is now ${statusLabel(status).toLowerCase()}.`,
      });
    } catch (updateError) {
      toast({
        title: 'Could not change access',
        description: updateError instanceof Error ? updateError.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setChangingId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" />
          Login access
        </CardTitle>
        <CardDescription>
          New Telegram accounts are denied by default until you approve them here. Existing accounts from before this feature was enabled keep their access until you block them.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading access rules…
          </div>
        )}

        {error && (
          <div className="flex items-center justify-between gap-3 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm">
            <span className="text-destructive">Could not load access rules: {error}</span>
            <Button variant="outline" size="sm" onClick={() => void load()}>Retry</Button>
          </div>
        )}

        {data && !data.enabled && (
          <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-sm text-amber-700 dark:text-amber-300">
            Access control is currently disabled by server configuration.
          </div>
        )}

        {data && (
          <>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-amber-700 dark:text-amber-300">Pending: {counts.pending}</span>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-emerald-700 dark:text-emerald-300">Allowed: {counts.allowed}</span>
              <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-destructive">Blocked: {counts.blocked}</span>
            </div>

            <div className="divide-y rounded-lg border border-border/60">
              {data.users.length === 0 && (
                <p className="p-4 text-sm text-muted-foreground">No Telegram accounts have signed in yet.</p>
              )}

              {data.users.map((user) => {
                const busy = changingId === user.id;
                return (
                  <div key={user.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{displayName(user)}</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusClasses(user.status)}`}>
                          {statusLabel(user.status)}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {user.username ? `@${user.username} · ` : ''}Telegram ID: {user.id}
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      {user.status !== 'allowed' && (
                        <Button
                          size="sm"
                          onClick={() => void updateStatus(user, 'allowed')}
                          disabled={busy}
                          className="gap-1.5"
                        >
                          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                          Allow access
                        </Button>
                      )}

                      {user.status !== 'blocked' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => void updateStatus(user, 'blocked')}
                          disabled={busy}
                          className="gap-1.5"
                        >
                          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldX className="h-4 w-4" />}
                          Block access
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
