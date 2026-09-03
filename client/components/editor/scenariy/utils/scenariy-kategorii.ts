/**
 * @fileoverview Массив категорий сценариев и вспомогательная функция получения метки
 * @module client/components/editor/scenariy/utils/scenariy-kategorii
 */

/**
 * Элемент списка категорий
 */
export interface KategoriyaElement {
  /** Внутреннее значение категории */
  value: string;
  /** Отображаемое название на русском */
  label: string;
}

/**
 * Полный список категорий сценариев для фильтрации
 */
export const KATEGORII: KategoriyaElement[] = [
  { value: 'all', label: 'All categories' },
  { value: 'official', label: 'Official' },
  { value: 'userTemplates', label: 'User templates' },
  { value: 'community', label: 'Community' },
  { value: 'business', label: 'Business' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'education', label: 'Education' },
  { value: 'utility', label: 'Utilities' },
  { value: 'games', label: 'Games' },
];

/** Словарь для быстрого поиска метки по значению категории */
const KATEGORIYA_MAP: Record<string, string> = {
  business: 'Business',
  community: 'Community',
  custom: 'Custom',
  entertainment: 'Entertainment',
  education: 'Education',
  utility: 'Utilities',
  games: 'Games',
  official: 'Official',
};

/**
 * Возвращает русское название категории по её внутреннему значению
 * @param category - внутреннее значение категории
 * @returns русское название или оригинальное значение, если не найдено
 */
export function getCategoryLabel(category: string): string {
  return KATEGORIYA_MAP[category] ?? category;
}
