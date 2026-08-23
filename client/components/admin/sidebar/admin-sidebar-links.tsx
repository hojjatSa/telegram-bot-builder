/**
 * @fileoverview Раздел «Документация» бокового меню панели управления
 * @module components/admin/sidebar/admin-sidebar-links
 */

import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/utils';
import { getAdminDocNavItems, isAdminNavItemActive } from './nav-items';

/**
 * Пропсы компонента AdminSidebarLinks
 */
interface AdminSidebarLinksProps {
  /** Свёрнуто ли боковое меню */
  isCollapsed?: boolean;
}

/**
 * Внутренние ссылки на документацию и служебные страницы
 * @param props - Свойства компонента
 * @returns JSX элемент со ссылками
 */
export function AdminSidebarLinks({ isCollapsed }: AdminSidebarLinksProps) {
  const [location] = useLocation();
  const items = getAdminDocNavItems();

  return (
    <nav className="flex flex-col gap-1">
      {!isCollapsed && (
        <span className="px-2 pt-1 text-[10px] uppercase tracking-wide text-muted-foreground/60">
          Документация
        </span>
      )}
      {items.map(({ href, label, icon: Icon }) => {
        const path = `/admin${href}`;
        const isActive = isAdminNavItemActive(location, href);

        return (
          <Link key={href} href={path}>
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start gap-2 h-9 px-2',
                isCollapsed && 'justify-center px-0',
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600'
                  : 'text-muted-foreground hover:bg-muted/60',
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span className="text-sm whitespace-nowrap">{label}</span>}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}
