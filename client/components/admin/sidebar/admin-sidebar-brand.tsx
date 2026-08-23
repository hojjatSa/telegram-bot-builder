/**
 * @fileoverview Брендинг бокового меню панели управления
 * @module components/admin/sidebar/admin-sidebar-brand
 */

import { Shield } from 'lucide-react';
import { cn } from '@/utils/utils';
import { CLIENT_APP_VERSION } from '@/lib/app-version';

/**
 * Пропсы компонента AdminSidebarBrand
 */
interface AdminSidebarBrandProps {
  /** Свёрнуто ли боковое меню */
  isCollapsed?: boolean;
}

/**
 * Название панели и номер сборки в шапке бокового меню
 * @param props - Свойства компонента
 * @returns JSX элемент
 */
export function AdminSidebarBrand({ isCollapsed }: AdminSidebarBrandProps) {
  return (
    <div className={cn('flex items-center gap-2 min-w-0', isCollapsed && 'justify-center')}>
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-sm">
        <Shield className="text-white h-4 w-4" />
      </div>

      {!isCollapsed && (
        <div className="flex flex-col leading-tight min-w-0">
          <span className="text-sm font-bold text-foreground whitespace-nowrap">
            Панель управления
          </span>
          <span className="text-[10px] text-muted-foreground/70 font-medium">
            v{CLIENT_APP_VERSION}
          </span>
        </div>
      )}
    </div>
  );
}
