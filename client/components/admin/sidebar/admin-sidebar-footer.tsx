/**
 * @fileoverview Admin sidebar footer
 * @module components/admin/sidebar/admin-sidebar-footer
 */

import { ArrowLeft, LogOut } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/utils';

interface AdminSidebarFooterProps {
  isCollapsed?: boolean;
}

export function AdminSidebarFooter({ isCollapsed }: AdminSidebarFooterProps) {
  return (
    <div className={cn('flex flex-col gap-1', isCollapsed && 'items-center')}>
      <Link href="/projects">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start gap-2 h-9 px-2 text-muted-foreground hover:bg-muted/60',
            isCollapsed && 'justify-center px-0',
          )}
        >
          <ArrowLeft className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm">Back to Editor</span>}
        </Button>
      </Link>

      <form method="post" action="/admin/api/logout" className="w-full">
        <Button
          type="submit"
          variant="ghost"
          className={cn(
            'w-full justify-start gap-2 h-9 px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10',
            isCollapsed && 'justify-center px-0',
          )}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm">Log out</span>}
        </Button>
      </form>
    </div>
  );
}
