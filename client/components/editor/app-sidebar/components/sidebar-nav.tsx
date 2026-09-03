/**
 * @fileoverview Vertical editor sidebar navigation
 */

import { LayoutDashboard, Code2, Bot, Users, Megaphone, BarChart2, MessageSquare, Table2, Terminal, FileImage, History, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/utils';
import type { HeaderTab } from '../types';

interface SidebarNavProps {
  currentTab: HeaderTab;
  onTabChange: (tab: HeaderTab) => void;
  isCollapsed?: boolean;
}

interface NavItem {
  tab: HeaderTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { tab: 'editor',    label: 'Editor',          icon: LayoutDashboard },
  { tab: 'bot',       label: 'Bot',             icon: Bot },
  { tab: 'terminal',  label: 'Terminal',        icon: Terminal },
  { tab: 'users',     label: 'Users',           icon: Users },
  { tab: 'dialogs',   label: 'Dialogs',         icon: MessageSquare },
  { tab: 'broadcast', label: 'Broadcasts',      icon: Megaphone },
  { tab: 'analytics', label: 'Analytics',       icon: BarChart2 },
  { tab: 'tables',    label: 'Tables',          icon: Table2 },
  { tab: 'files',     label: 'Files',           icon: FileImage },
  { tab: 'versions',  label: 'Version History', icon: History },
  { tab: 'agent',     label: 'Agent',           icon: Sparkles },
  { tab: 'export',    label: 'Code',            icon: Code2 },
];

export function SidebarNav({ currentTab, onTabChange, isCollapsed }: SidebarNavProps) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map(({ tab, label, icon: Icon }) => {
        const isActive = currentTab === tab;
        return (
          <Button
            key={tab}
            variant="ghost"
            onClick={() => onTabChange(tab)}
            className={cn(
              'w-full justify-start gap-2 h-9 px-2',
              isCollapsed && 'justify-center px-0',
              isActive
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600'
                : 'text-muted-foreground hover:bg-muted/60'
            )}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span className="text-sm whitespace-nowrap">{label}</span>}
          </Button>
        );
      })}
    </nav>
  );
}
