/**
 * @fileoverview Компонент текста пустого состояния
 * 
 * Отображает заголовок и описание.
 */

/**
 * Компонент текста пустого состояния
 * 
 * @returns {JSX.Element} Текст пустого состояния
 */
export function EmptyStateText() {
  return (
    <div className="space-y-3 mb-6">
      <h3 className="text-sm font-medium text-foreground gradient-text">Select item</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Click on any element in the editor to see its settings here
      </p>
    </div>
  );
}
