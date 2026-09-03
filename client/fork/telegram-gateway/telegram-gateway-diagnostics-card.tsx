import { useMutation, useQuery } from '@tanstack/react-query';
import { CheckCircle2, Loader2, RefreshCw, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { apiRequest } from '@/queryClient';

interface TelegramGatewayStatus {
  configured: boolean;
  rawConfigured: boolean;
  effectiveBaseUrl: string;
  usingOfficialEndpoint: boolean;
  healthUrl: string | null;
}

interface DiagnosticCheck {
  ok: boolean;
  detail: string;
  latencyMs?: number;
  statusCode?: number;
}

interface TelegramGatewayDiagnosticResult {
  ok: boolean;
  testedAt: string;
  effectiveBaseUrl: string;
  checks: {
    environment: DiagnosticCheck;
    gatewayHealth: DiagnosticCheck;
    telegramApi: DiagnosticCheck;
  };
}

function DiagnosticRow({ label, check }: { label: string; check: DiagnosticCheck }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-border/60 p-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {check.ok ? (
            <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500" />
          ) : (
            <XCircle className="h-4 w-4 flex-shrink-0 text-destructive" />
          )}
          <span className="text-sm font-medium">{label}</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{check.detail}</p>
      </div>
      <div className="flex flex-shrink-0 items-center gap-2 text-xs text-muted-foreground">
        {typeof check.statusCode === 'number' && <span>HTTP {check.statusCode}</span>}
        {typeof check.latencyMs === 'number' && <span>{check.latencyMs} ms</span>}
      </div>
    </div>
  );
}

export function TelegramGatewayDiagnosticsCard() {
  const statusQuery = useQuery<TelegramGatewayStatus>({
    queryKey: ['/admin/api/fork/telegram-gateway/status'],
    queryFn: () => apiRequest('GET', '/admin/api/fork/telegram-gateway/status'),
    staleTime: 0,
    retry: false,
  });

  const testMutation = useMutation<TelegramGatewayDiagnosticResult>({
    mutationFn: () => apiRequest('POST', '/admin/api/fork/telegram-gateway/test'),
  });

  const status = statusQuery.data;
  const result = testMutation.data;
  const loading = statusQuery.isLoading || testMutation.isPending;

  return (
    <Card>
      <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>Telegram Gateway</CardTitle>
          <CardDescription className="mt-1">
            Tests this server → configured gateway → Telegram Bot API. No bot token is exposed or required.
          </CardDescription>
        </div>
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          disabled={loading || !status?.configured}
          onClick={() => testMutation.mutate()}
        >
          {testMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Run gateway test
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {statusQuery.isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading gateway configuration…
          </div>
        ) : statusQuery.error || !status ? (
          <p className="text-sm text-destructive">Could not load gateway configuration.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Effective API base</p>
              <p className="mt-1 break-all font-mono text-sm">{status.effectiveBaseUrl}</p>
            </div>
            <Badge variant={status.configured ? 'default' : 'secondary'}>
              {status.configured ? 'Gateway configured' : 'Official Telegram endpoint'}
            </Badge>
          </div>
        )}

        {status && !status.configured && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm">
            Set <code className="font-mono">TELEGRAM_API_BASE_URL</code> to a custom gateway and redeploy before running the test.
          </div>
        )}

        {testMutation.error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            Gateway test failed to run. Check the application logs for details.
          </div>
        )}

        {result && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Last diagnostic</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(result.testedAt).toLocaleString()}
                </p>
              </div>
              <Badge variant={result.ok ? 'default' : 'destructive'}>
                {result.ok ? 'All checks passed' : 'Needs attention'}
              </Badge>
            </div>

            <DiagnosticRow label="Environment" check={result.checks.environment} />
            <DiagnosticRow label="Gateway health" check={result.checks.gatewayHealth} />
            <DiagnosticRow label="Telegram Bot API" check={result.checks.telegramApi} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
