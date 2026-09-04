/**
 * @fileoverview Боковое меню панели управления
 * @module components/admin/sidebar/admin-sidebar
 */

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/utils';
import { SidebarSeparator } from '@/components/editor/app-sidebar/components/sidebar-separator';
import { AdminSidebarBrand } from './admin-sidebar-brand';
import { AdminSidebarNav } from './admin-sidebar-nav';
import { AdminSidebarLinks } from './admin-sidebar-links';
import { AdminSidebarFooter } from './admin-sidebar-footer';

/**
 * Боковое меню панели управления в стиле редактора
 * @returns JSX элемент бокового меню
 */
export function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'h-full flex flex-col z-40',
        'bg-background dark:bg-slate-950',
        'border-r border-border/50',
        'transition-all duration-300',
        isCollapsed ? 'w-14' : 'w-56',
      )}
    >
      <div
        className={cn(
          'h-14 flex items-center flex-shrink-0 border-b border-border/50 relative',
          isCollapsed ? 'justify-center px-0' : 'justify-between px-3',
        )}
      >
        <AdminSidebarBrand isCollapsed={isCollapsed} />
        <button
          type="button"
          onClick={() => setIsCollapsed((value) => !value)}
          className={cn(
            'flex-shrink-0 h-6 w-6 rounded flex items-center justify-center',
            'text-muted-foreground hover:bg-muted/60 transition-colors',
            isCollapsed && 'absolute right-0.5 top-1/2 -translate-y-1/2',
          )}
          aria-label={isCollapsed ? "Expand menu" : "Collapse menu"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      <div
        className={cn(
          'flex flex-1 flex-col gap-1 overflow-y-auto p-2',
          isCollapsed && '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        )}
      >
        <AdminSidebarNav isCollapsed={isCollapsed} />
        <SidebarSeparator />
        <AdminSidebarLinks isCollapsed={isCollapsed} />
      </div>

      <div className="px-2">
        <SidebarSeparator />
      </div>

      <div className="p-2">
        <AdminSidebarFooter isCollapsed={isCollapsed} />
      </div>
    </aside>
  );
}
