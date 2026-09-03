/**
 * @fileoverview Admin dashboard overview page
 * @module components/admin/pages/admin-overview
 */

import { Link } from 'wouter';
import { Settings, Wrench, BookOpen, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminSettings } from '../hooks/use-admin-settings';
import { getAdminDocNavItems } from '../sidebar/nav-items';
import { AdminVersionCard } from './admin-version-card';

export function AdminOverview() {
  const { data: settings, isLoading } = useAdminSettings();
  const docLinks = getAdminDocNavItems();

  if (isLoading || !settings) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const loginLabel =
    settings.auth.loginMode === 'dev_login' ? 'Dev login' : 'Telegram Login Widget';

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-muted-foreground mt-1">Platform status and quick access</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 items-start">
        <AdminVersionCard />

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Login method</CardDescription>
            <CardTitle className="text-lg">{loginLabel}</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={settings.configured ? 'default' : 'secondary'}>
              {settings.configured ? 'Configured' : 'Needs configuration'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Telegram OIDC</CardDescription>
            <CardTitle className="text-lg">
              {settings.providers.telegram.configured ? 'Ready' : 'Not configured'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Client ID: {settings.providers.telegram.clientId || '—'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href="/admin/settings">
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" />
              Application Settings
            </Button>
          </Link>
          <Link href="/admin/maintenance">
            <Button variant="outline" className="gap-2">
              <Wrench className="h-4 w-4" />
              Maintenance
            </Button>
          </Link>
          <Link href="/admin/docs">
            <Button variant="outline" className="gap-2">
              <BookOpen className="h-4 w-4" />
              API Documentation
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documentation</CardTitle>
          <CardDescription>Database schema, API reference and service pages</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          {docLinks.map((link) => (
            <Link
              key={link.href}
              href={`/admin${link.href}`}
              className="text-sm text-primary hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
