/**
 * @fileoverview Platform accounts list page
 * @module components/admin/pages/admin-users
 */

import { useEffect, useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { usePlatformUsers } from '../hooks/use-platform-users';
import { PlatformUsersPager } from '../users/platform-users-pager';
import { PlatformUsersTable } from '../users/platform-users-table';

const DEFAULT_PER_PAGE = 25;

export function AdminUsersPage() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, error } = usePlatformUsers({
    search,
    page,
    perPage: DEFAULT_PER_PAGE,
  });

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Accounts</h1>
        <p className="text-muted-foreground mt-1">
          Everyone who has signed in to the builder through Telegram
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search by name, @username or ID…"
          className="pl-9"
        />
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <p className="text-destructive">Could not load the account list.</p>
      )}

      {data && !isLoading && (
        <>
          <PlatformUsersTable items={data.items} />
          <PlatformUsersPager
            page={data.page}
            perPage={data.perPage}
            total={data.total}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
