/**
 * @fileoverview Admin panel sidebar navigation items
 * @module components/admin/sidebar/nav-items
 */

import {
  LayoutDashboard,
  Settings,
  Wrench,
  BookOpen,
  Database,
  FileText,
  HeartPulse,
  Braces,
  Users,
} from 'lucide-react';

/** Internal admin panel section */
export interface AdminNavItem {
  /** Path relative to /admin */
  href: string;
  /** Menu label */
  label: string;
  /** Menu item icon */
  icon: React.ComponentType<{ className?: string }>;
}

/** Main sections inside the admin panel */
export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/users', label: 'Accounts', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/docs', label: 'API Documentation', icon: BookOpen },
  { href: '/maintenance', label: 'Maintenance', icon: Wrench },
];

/** Documentation and service pages inside the admin panel */
export const ADMIN_DOC_NAV_ITEMS: AdminNavItem[] = [
  { href: '/live-db', label: 'Live Database', icon: Database },
  { href: '/schema', label: 'Database Schema', icon: Database },
  { href: '/api-docs', label: 'API Reference', icon: FileText },
  { href: '/health', label: 'Health Check', icon: HeartPulse },
  { href: '/openapi', label: 'OpenAPI JSON', icon: Braces },
];

/**
 * Returns documentation items based on the current environment.
 * @returns Sidebar navigation items
 */
export function getAdminDocNavItems(): AdminNavItem[] {
  return ADMIN_DOC_NAV_ITEMS.filter(
    (item) => item.href !== '/live-db' || import.meta.env.DEV,
  );
}

/**
 * Checks whether a menu item is active for the current URL.
 * @param location - Current path
 * @param href - Item path relative to /admin
 * @returns true when the section is active
 */
export function isAdminNavItemActive(location: string, href: string): boolean {
  const path = href === '/' ? '/admin' : `/admin${href}`;

  if (href === '/docs') {
    return location === '/admin/docs' || location.startsWith('/admin/docs/');
  }
  if (href === '/schema') {
    return location === '/admin/schema' || location.startsWith('/admin/schema/');
  }
  if (href === '/api-docs') {
    return location === '/admin/api-docs' || location.startsWith('/admin/api-docs/');
  }
  if (href === '/users') {
    return location === '/admin/users' || location.startsWith('/admin/users/');
  }

  return location === path || location === `${path}/`;
}
