/**
 * @fileoverview Компонент превью для узла типа "Игральный кубик" (Dice)
 * 
 * Отображает визуальное представление узла с игральным кубиком,
 * включая иконку, название и информацию о типе эмодзи.
 */

import { Node } from '@/types/bot';

/**
 * Интерфейс свойств компонента DicePreview
 *
 * @interface DicePreviewProps
 * @property {Node} node - Узел типа dice для отображения
 */
interface DicePreviewProps {
  node: Node;
}

/**
 * Компонент превью игрового кубика
 *
 * @component
 * @description Отображает превью узла с игральным кубиком
 *
 * @param {DicePreviewProps} props - Свойства компонента
 * @param {Node} props.node - Узел типа dice
 *
 * @returns {JSX.Element | null} Компонент превью или null если узел не dice
 */
export function DicePreview({ node }: DicePreviewProps) {
  return (
    <div className="bg-gradient-to-br from-slate-100/50 to-gray-100/50 dark:from-slate-900/30 dark:to-gray-900/30 rounded-lg p-4 mb-4 h-32 flex items-center justify-center">
      <div className="text-center space-y-2">
        <i className="fas fa-dice text-slate-400 dark:text-slate-300 text-3xl"></i>
        <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
          <div className="font-medium">Dice</div>
          <div className="flex items-center justify-center space-x-1">
            <i className="fas fa-gamepad text-xs"></i>
            <span>{node.data.emoji || '🎲'} Entertainment</span>
          </div>
        </div>
      </div>
    </div>
  );
}
