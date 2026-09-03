/**
 * @fileoverview Превью ноды Python-кода на холсте
 * @module components/editor/canvas/canvas-node/code-preview
 */

/** Пропсы компонента превью кода */
interface CodePreviewProps {
  /** Данные ноды */
  data: any;
}

/** Максимум строк в превью на холсте */
const MAX_PREVIEW_LINES = 4;

/**
 * Берёт первые непустые строки кода для превью
 * @param source - Исходный Python-код
 * @returns Усечённый текст превью
 */
function previewLines(source: string): string {
  const lines = source.split('\n').filter((line) => line.trim().length > 0);
  if (lines.length === 0) return '';
  const shown = lines.slice(0, MAX_PREVIEW_LINES);
  const extra = lines.length > MAX_PREVIEW_LINES ? '\n…' : '';
  return shown.join('\n') + extra;
}

/**
 * Компонент превью ноды Python-кода на холсте.
 * Показывает первые строки скрипта в моноширинном виде.
 * @param props - Свойства компонента
 * @returns JSX элемент
 */
export function CodePreview({ data }: CodePreviewProps) {
  const source = typeof data?.code === 'string' ? data.code : '';
  const preview = previewLines(source);

  return (
    <div className="px-3 py-2 text-xs space-y-1">
      <div className="flex items-center gap-1.5">
        <i className="fas fa-code text-indigo-500 text-[10px]" />
        <span className="font-semibold text-indigo-700 dark:text-indigo-300 text-[11px]">
          Python Code
        </span>
      </div>
      {preview ? (
        <pre className="font-mono text-[10px] leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-wrap break-all max-h-24 overflow-hidden">
          {preview}
        </pre>
      ) : (
        <div className="text-gray-400 dark:text-gray-500 text-[10px] italic">
          Пустой скрипт
        </div>
      )}
    </div>
  );
}
