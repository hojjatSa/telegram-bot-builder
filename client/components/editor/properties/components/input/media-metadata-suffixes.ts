/**
 * @fileoverview Конфигурация суффиксов метаданных медиа.
 * Определяет какие метаданные доступны для каждого типа медиа.
 */

/** Описание одного суффикса метаданных */
export interface MetadataSuffix {
  /** Суффикс переменной (добавляется к имени через _) */
  suffix: string;
  /** Описание на русском */
  description: string;
  /** Иконка для отображения */
  icon: string;
}

/** Суффиксы метаданных по типу медиа */
export const MEDIA_METADATA_SUFFIXES: Record<string, MetadataSuffix[]> = {
  video: [
    { suffix: 'file_id', description: 'Telegram file_id', icon: '📎' },
    { suffix: 'file_unique_id', description: 'Unique file ID', icon: '🔑' },
    { suffix: 'thumbnail', description: 'Cover (file_id)', icon: '🖼️' },
    { suffix: 'duration', description: 'Duration (sec)', icon: '⏱️' },
    { suffix: 'file_size', description: 'File size (bytes)', icon: '📦' },
    { suffix: 'file_name', description: 'File name', icon: '📝' },
    { suffix: 'width', description: 'Width (px)', icon: '↔️' },
    { suffix: 'height', description: 'Height (px)', icon: '↕️' },
    { suffix: 'mime_type', description: 'MIME type', icon: '🏷️' },
  ],
  photo: [
    { suffix: 'file_id', description: "Telegram file_id (max. size)", icon: '📎' },
    { suffix: 'file_unique_id', description: 'Unique file ID', icon: '🔑' },
    { suffix: 'file_size', description: 'File size (bytes)', icon: '📦' },
    { suffix: 'width', description: 'Width (px)', icon: '↔️' },
    { suffix: 'height', description: 'Height (px)', icon: '↕️' },
    { suffix: 'small_file_id', description: "file_id thumbnail (min. size)", icon: '🔍' },
    { suffix: 'small_width', description: "Thumbnail width (px)", icon: '↔️' },
    { suffix: 'small_height', description: "Thumbnail height (px)", icon: '↕️' },
    { suffix: 'sizes_count', description: "Number of sizes", icon: '📐' },
    { suffix: 'all_sizes', description: "JSON of all sizes [{file_id, w, h, size}]", icon: '📋' },
  ],
  audio: [
    { suffix: 'file_id', description: 'Telegram file_id', icon: '📎' },
    { suffix: 'file_unique_id', description: 'Unique file ID', icon: '🔑' },
    { suffix: 'thumbnail', description: 'Cover (file_id)', icon: '🖼️' },
    { suffix: 'duration', description: 'Duration (sec)', icon: '⏱️' },
    { suffix: 'file_size', description: 'File size (bytes)', icon: '📦' },
    { suffix: 'file_name', description: 'File name', icon: '📝' },
    { suffix: 'title', description: "Track name", icon: '🎵' },
    { suffix: 'performer', description: "Executor", icon: '🎤' },
    { suffix: 'mime_type', description: 'MIME type', icon: '🏷️' },
  ],
  document: [
    { suffix: 'file_id', description: 'Telegram file_id', icon: '📎' },
    { suffix: 'file_unique_id', description: 'Unique file ID', icon: '🔑' },
    { suffix: 'thumbnail', description: 'Cover (file_id)', icon: '🖼️' },
    { suffix: 'file_name', description: 'File name', icon: '📝' },
    { suffix: 'file_size', description: 'File size (bytes)', icon: '📦' },
    { suffix: 'mime_type', description: 'MIME type', icon: '🏷️' },
  ],
};
