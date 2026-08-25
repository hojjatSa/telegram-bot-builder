/**
 * @fileoverview Параметры шаблона узла code
 * @module templates/code/code.params
 */

/** Параметры одного узла code */
export interface CodeEntry {
  /** ID узла */
  nodeId: string;
  /** Исходный Python-код (тело async-функции) */
  code: string;
  /** ID следующего узла для автоперехода */
  autoTransitionTo: string;
}

/** Параметры генерации всех узлов code */
export interface CodeTemplateParams {
  /** Массив узлов code */
  codeEntries: CodeEntry[];
}
