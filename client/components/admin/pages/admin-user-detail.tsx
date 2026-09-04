/**
 * @fileoverview Карточка аккаунта платформы
 * @module components/admin/pages/admin-user-detail
 */

import { Link, useParams } from 'wouter';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePlatformUser } from '../hooks/use-platform-user';
import {
  PlatformUserAvatar,
  formatPlatformUserDate,
  formatPlatformUserName,
} from '../users/platform-user-avatar';
import { PlatformUserProjectsCard } from '../users/platform-user-projects-card';

/**
 * Профиль аккаунта и его проекты
 * @returns JSX элемент страницы
 */
export function AdminUserDetailPage() {
  const params = useParams<{ id: string }>();
  const userId = Number(params.id);
  const validId = Number.isSafeInteger(userId) && userId > 0 ? userId : null;

  const { data, isLoading, error } = usePlatformUser(validId);

  if (!validId) {
    return (
      <div className="max-w-3xl space-y-4">
        <BackLink />
        <p className="text-destructive">Invalid account ID.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-3xl space-y-4">
        <BackLink />
        <p className="text-destructive">Account not found or unavailable.</p>
      </div>
    );
  }

  const { user, ownedProjects, sharedProjects } = data;
  const displayName = formatPlatformUserName(
    user.firstName,
    user.lastName,
    user.username,
    user.id,
  );

  return (
    <div className="max-w-3xl space-y-6">
      <BackLink />

      <Card>
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <PlatformUserAvatar
            photoUrl={user.photoUrl}
            name={displayName}
            userId={user.id}
            size="md"
          />
          <div className="min-w-0">
            <CardTitle className="text-xl truncate">{displayName}</CardTitle>
            <p className="text-sm text-muted-foreground font-mono">{user.id}</p>
          </div>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
          <p>
            <span className="text-muted-foreground">Name: </span>
            {user.firstName}
            {user.lastName ? ` ${user.lastName}` : ''}
          </p>
          <p>
            <span className="text-muted-foreground">First entry: </span>
            {formatPlatformUserDate(user.createdAt)}
          </p>
          <p>
            <span className="text-muted-foreground">Updated: </span>
            {formatPlatformUserDate(user.updatedAt)}
          </p>
        </CardContent>
      </Card>

      <PlatformUserProjectsCard title={"Projects in possession"} ownedProjects={ownedProjects} />
      <PlatformUserProjectsCard title={"Project participant"} sharedProjects={sharedProjects} />
    </div>
  );
}

/**
 * Ссылка назад к списку аккаунтов
 * @returns JSX элемент
 */
function BackLink() {
  return (
    <Link href="/admin/users">
      <Button variant="ghost" size="sm" className="gap-2 -ml-2">
        <ArrowLeft className="h-4 w-4" />
        To the list of accounts
      </Button>
    </Link>
  );
}
