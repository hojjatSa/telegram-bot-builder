/**
 * @fileoverview Переключатель «Активные | Архив» для вкладки проектов
 * @module components/editor/sidebar/components/projects-view-toggle
 */

/** Режим отображения списка проектов */
export type ProjectsViewMode = 'active' | 'archived';

/**
 * Пропсы переключателя активные/архив
 */
export interface ProjectsViewToggleProps {
  /** Текущий режим */
  value: ProjectsViewMode;
  /** Обработчик смены режима */
  onChange: (value: ProjectsViewMode) => void;
}

/**
 * Переключатель между активными и архивными проектами
 * @param props - Свойства компонента
 * @returns JSX элемент переключателя
 */
export function ProjectsViewToggle({ value, onChange }: ProjectsViewToggleProps) {
  return (
    <div className="flex space-x-1 bg-gradient-to-r from-slate-200/40 to-slate-100/20 dark:from-slate-800/40 dark:to-slate-700/20 rounded-lg p-1 backdrop-blur-sm border border-slate-300/20 dark:border-slate-600/20">
      <button
        type="button"
        onClick={() => onChange('active')}
        className={`flex-1 px-2 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
          value === 'active'
            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
            : 'text-muted-foreground hover:text-foreground hover:bg-white/40 dark:hover:bg-slate-700/30'
        }`}
      >
        Активные
      </button>
      <button
        type="button"
        onClick={() => onChange('archived')}
        className={`flex-1 px-2 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
          value === 'archived'
            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
            : 'text-muted-foreground hover:text-foreground hover:bg-white/40 dark:hover:bg-slate-700/30'
        }`}
      >
        Архив
      </button>
    </div>
  );
}
