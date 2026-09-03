/**
 * @fileoverview Sidebar actions for loading and saving templates
 */

import { FolderOpen, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/utils';

interface SidebarActionsProps {
  onLoadTemplate?: () => void;
  onSaveAsTemplate?: () => void;
  isCollapsed?: boolean;
}

export function SidebarActions({ onLoadTemplate, onSaveAsTemplate, isCollapsed }: SidebarActionsProps) {
  const btnClass = cn(
    'w-full justify-start gap-2 h-9 px-2 text-muted-foreground hover:bg-muted/60',
    isCollapsed && 'justify-center px-0'
  );

  return (
    <div className="flex flex-col gap-1">
      <Button variant="ghost" className={btnClass} onClick={onLoadTemplate}>
        <FolderOpen className="h-4 w-4 flex-shrink-0" />
        {!isCollapsed && <span className="text-sm whitespace-nowrap">Load Template</span>}
      </Button>
      <Button variant="ghost" className={btnClass} onClick={onSaveAsTemplate}>
        <Save className="h-4 w-4 flex-shrink-0" />
        {!isCollapsed && <span className="text-sm whitespace-nowrap">Save as Template</span>}
      </Button>
    </div>
  );
}
