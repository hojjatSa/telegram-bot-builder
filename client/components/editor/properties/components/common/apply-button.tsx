/**
 * @fileoverview Компонент кнопки применения изменений
 *
 * Обрабатывает сохранение изменений узла и проекта.
 *
 * @module ApplyButton
 */

import { Button as UIButton } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

/**
 * Пропсы компонента кнопки применения
 */
interface ApplyButtonProps {
  /** Функция обновления данных узла; false — отменить сохранение */
  onNodeUpdate?: () => void | boolean;
  /** Функция сохранения проекта */
  onSaveProject?: () => void;
  /** Функция логирования действий */
  onActionLog?: (type: string, description: string) => void;
  /** Заблокировать кнопку (например, невалидный JSON) */
  disabled?: boolean;
}

/**
 * Компонент кнопки применения изменений
 *
 * Выполняет:
 * - Визуальное подтверждение применения
 * - Логирование действия
 * - Сохранение проекта
 *
 * @param {ApplyButtonProps} props - Пропсы компонента
 * @returns {JSX.Element} Кнопка применения
 */
export function ApplyButton({ onNodeUpdate, onSaveProject, onActionLog, disabled }: ApplyButtonProps) {
  const { toast } = useToast();

  const handleApply = () => {
    if (disabled) return;
    if (onActionLog) {
      onActionLog('apply', 'Applied changes in the properties panel');
    }

    if (onNodeUpdate) {
      const result = onNodeUpdate();
      if (result === false) return;
    }

    if (onSaveProject) {
      onSaveProject();
    }

    toast({
      title: 'Changes applied',
      description: 'Project saved',
    });
  };

  return (
    <UIButton
      size="sm"
      className="flex-1 text-xs sm:text-sm h-8 sm:h-9 bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/80 transition-all duration-200 shadow-sm hover:shadow-md"
      onClick={handleApply}
      disabled={disabled}
    >
      <i className="fas fa-check mr-1.5"></i>
      Apply
    </UIButton>
  );
}
