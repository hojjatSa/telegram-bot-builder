/**
 * @fileoverview Version and update-check card on the admin overview page
 * @module components/admin/pages/admin-version-card
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiRequest } from '@/queryClient';
import type { AdminUpdateCheckResult, AdminVersionInfo } from '../types';

function UpdateCheckAlert({ result }: { result: AdminUpdateCheckResult }) {
  if (result.checkFailed) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Update check failed</AlertTitle>
        <AlertDescription>
          GitHub or version.json on main could not be reached. Only the local version is shown.
        </AlertDescription>
      </Alert>
    );
  }

  if (result.updateAvailable && result.latest) {
    return (
      <Alert>
        <AlertTitle>Update available</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>
            Installed <Badge variant="secondary">v{result.current.version}</Badge>, latest on GitHub{' '}
            <Badge>v{result.latest.version}</Badge>
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {result.latest.notesUrl && (
              <a href={result.latest.notesUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="link" size="sm" className="h-auto p-0 gap-1">
                  What's new
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </a>
            )}
            <a href={result.deployGuideUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="link" size="sm" className="h-auto p-0 gap-1">
                Update guide
                <ExternalLink className="h-3 w-3" />
              </Button>
            </a>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert>
      <AlertTitle>Up to date</AlertTitle>
      <AlertDescription>
        The latest version is installed ({result.current.version}).
      </AlertDescription>
    </Alert>
  );
}

export function AdminVersionCard() {
  const [checkResult, setCheckResult] = useState<AdminUpdateCheckResult | null>(null);
  const [checking, setChecking] = useState(false);

  const { data: version, isLoading } = useQuery<AdminVersionInfo>({
    queryKey: ['/admin/api/version'],
    queryFn: () => apiRequest('GET', '/admin/api/version'),
  });

  const handleCheck = async () => {
    setChecking(true);
    try {
      const result = await apiRequest('GET', '/admin/api/update-check?refresh=1');
      setCheckResult(result as AdminUpdateCheckResult);
    } finally {
      setChecking(false);
    }
  };

  if (isLoading || !version) {
    return (
      <Card>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>Application version</CardDescription>
        <CardTitle className="text-lg">v{version.version}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {version.releasedAt && (
          <p className="text-sm text-muted-foreground -mt-1">Build date: {version.releasedAt}</p>
        )}
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2"
          onClick={handleCheck}
          disabled={checking}
        >
          {checking ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Check for updates
        </Button>
        {checkResult && <UpdateCheckAlert result={checkResult} />}
      </CardContent>
    </Card>
  );
}
