/**
 * @fileoverview Обёртка содержимого страницы панели управления
 * @module components/admin/admin-page-shell
 */

import type { ReactNode } from 'react';
import { cn } from '@/utils/utils';

/**
 * Пропсы компонента AdminPageShell
 */
interface AdminPageShellProps {
  /** Содержимое страницы */
  children: ReactNode;
  /** На всю высоту без внутренних отступов (для iframe) */
  fullBleed?: boolean;
}

/**
 * Стандартные отступы или полноэкранный режим для embed-страниц
 * @param props - Свойства компонента
 * @returns JSX элемент оболочки
 */
export function AdminPageShell({ children, fullBleed }: AdminPageShellProps) {
  return (
    <div
      className={cn(
        'flex-1 min-h-0',
        fullBleed ? 'flex flex-col overflow-hidden' : 'overflow-y-auto p-6 md:p-8',
      )}
    >
      {children}
    </div>
  );
}
