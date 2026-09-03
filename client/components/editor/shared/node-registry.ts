/**
 * @fileoverview Единый реестр метаданных узлов (названия, иконки, цвета)
 * Используется как единый источник правды для канваса, панели свойств и палитры компонентов
 * @module components/editor/shared/node-registry
 */

/** Метаданные одного типа узла */
export interface NodeMeta {
  /** Отображаемое название узла */
  name: string;
  /** CSS-класс иконки FontAwesome */
  icon: string;
  /** CSS-классы цвета для иконки в панели свойств */
  color: string;
  /** CSS-классы цвета для карточки на канвасе */
  canvasColor: string;
}

/**
 * Единый реестр метаданных всех типов узлов
 * Является источником правды для отображения названий, иконок и цветов
 */
export const nodeRegistry: Record<string, NodeMeta> = {
  start: {
    name: 'Start',
    icon: 'fas fa-play',
    color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    canvasColor: 'bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
  },
  command: {
    name: 'Command',
    icon: 'fas fa-terminal',
    color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
    canvasColor: 'bg-gradient-to-br from-indigo-50 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800',
  },
  message: {
    name: 'Text Message',
    icon: 'fas fa-comment',
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    canvasColor: 'bg-gradient-to-br from-blue-50 to-sky-100 dark:from-blue-900/30 dark:to-sky-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
  },
  keyboard: {
    name: 'Keyboard',
    icon: 'fas fa-keyboard',
    color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    canvasColor: 'bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
  },
  input: {
    name: 'Save Answer',
    icon: 'fas fa-edit',
    color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
    canvasColor: 'bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-900/30 dark:to-slate-900/30 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800',
  },
  condition: {
    name: 'Condition',
    icon: 'fas fa-code-branch',
    color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
    canvasColor: 'bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800',
  },
  media: {
    name: 'Media File',
    icon: 'fas fa-photo-video',
    color: 'bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/30 dark:text-fuchsia-400',
    canvasColor: 'bg-gradient-to-br from-fuchsia-50 to-purple-100 dark:from-fuchsia-900/30 dark:to-purple-900/30 text-fuchsia-600 dark:text-fuchsia-400 border-2 border-fuchsia-300 dark:border-fuchsia-700/50 shadow-lg shadow-fuchsia-500/20',
  },
  sticker: {
    name: 'Sticker',
    icon: 'fas fa-laugh',
    color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    canvasColor: 'bg-gradient-to-br from-pink-50 to-fuchsia-100 dark:from-pink-900/30 dark:to-fuchsia-900/30 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800',
  },
  voice: {
    name: 'Voice Message',
    icon: 'fas fa-microphone',
    color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    canvasColor: 'bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
  },
  animation: {
    name: 'GIF Animation',
    icon: 'fas fa-film',
    color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
    canvasColor: 'bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800',
  },
  location: {
    name: 'Location',
    icon: 'fas fa-map-marker-alt',
    color: 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400',
    canvasColor: 'bg-gradient-to-br from-green-50 to-lime-100 dark:from-green-900/30 dark:to-lime-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800',
  },
  contact: {
    name: 'Contact',
    icon: 'fas fa-address-book',
    color: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
    canvasColor: 'bg-gradient-to-br from-sky-50 to-blue-100 dark:from-sky-900/30 dark:to-blue-900/30 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800',
  },
  photo: {
    name: 'Photo',
    icon: 'fas fa-image',
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    canvasColor: 'bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800',
  },
  video: {
    name: 'Video',
    icon: 'fas fa-video',
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    canvasColor: 'bg-gradient-to-br from-rose-50 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800',
  },
  audio: {
    name: 'Audio',
    icon: 'fas fa-music',
    color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    canvasColor: 'bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800',
  },
  document: {
    name: 'Document',
    icon: 'fas fa-file-alt',
    color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    canvasColor: 'bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800',
  },
  broadcast: {
    name: 'Broadcast',
    icon: 'fas fa-bullhorn',
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    canvasColor: 'bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800',
  },
  client_auth: {
    name: 'Client API Authentication',
    icon: 'fas fa-key',
    color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    canvasColor: 'bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
  },
  // Триггеры
  command_trigger: {
    name: 'Command Trigger',
    icon: 'fas fa-bolt',
    color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    canvasColor: 'bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 text-yellow-600 dark:text-yellow-400 border-2 border-yellow-300 dark:border-yellow-700/50 shadow-lg shadow-yellow-500/20',
  },
  text_trigger: {
    name: 'Text Trigger',
    icon: 'fas fa-comment-dots',
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    canvasColor: 'bg-gradient-to-br from-blue-50 to-sky-100 dark:from-blue-900/30 dark:to-sky-900/30 text-blue-600 dark:text-blue-400 border-2 border-blue-300 dark:border-blue-700/50 shadow-lg shadow-blue-500/20',
  },
  incoming_message_trigger: {
    name: 'Incoming Message Trigger',
    icon: 'fas fa-inbox',
    color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    canvasColor: 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-600 dark:text-green-400 border-2 border-green-300 dark:border-green-700/50 shadow-lg shadow-green-500/20',
  },
  group_message_trigger: {
    name: 'Group Message Trigger',
    icon: 'fas fa-comments',
    color: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
    canvasColor: 'bg-gradient-to-br from-violet-50 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 text-violet-600 dark:text-violet-400 border-2 border-violet-300 dark:border-violet-700/50 shadow-lg shadow-violet-500/20',
  },
  callback_trigger: {
    name: 'Inline Button Trigger',
    icon: 'fas fa-hand-pointer',
    color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    canvasColor: 'bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 text-orange-600 dark:text-orange-400 border-2 border-orange-300 dark:border-orange-700/50 shadow-lg shadow-orange-500/20',
  },
  incoming_callback_trigger: {
    name: 'Button Click Trigger',
    icon: 'fas fa-hand-pointer',
    color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    canvasColor: 'bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 text-orange-600 dark:text-orange-400 border-2 border-orange-300 dark:border-orange-700/50 shadow-lg shadow-orange-500/20',
  },
  outgoing_message_trigger: {
    name: 'Outgoing Message Trigger',
    icon: 'fas fa-paper-plane',
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    canvasColor: 'bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 text-purple-600 dark:text-purple-400 border-2 border-purple-300 dark:border-purple-700/50 shadow-lg shadow-purple-500/20',
  },
  managed_bot_updated_trigger: {
    name: 'Bot Update Trigger',
    icon: 'fas fa-robot',
    color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
    canvasColor: 'bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-300 dark:border-indigo-700/50 shadow-lg shadow-indigo-500/20',
  },
  schedule_trigger: {
    name: 'Scheduled Trigger',
    icon: 'fas fa-clock',
    color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
    canvasColor: 'bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 text-teal-600 dark:text-teal-400 border-2 border-teal-300 dark:border-teal-700/50 shadow-lg shadow-teal-500/20',
  },
  api_trigger: {
    name: 'API Trigger',
    icon: 'fas fa-plug',
    color: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
    canvasColor: 'bg-gradient-to-br from-violet-50 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 text-violet-600 dark:text-violet-400 border-2 border-violet-300 dark:border-violet-700/50 shadow-lg shadow-violet-500/20',
  },
  api_response: {
    name: 'API Response',
    icon: 'fas fa-reply',
    color: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
    canvasColor: 'bg-gradient-to-br from-violet-50 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800',
  },
  // Управление контентом
  pin_message: {
    name: 'Pin Message',
    icon: 'fas fa-thumbtack',
    color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
    canvasColor: 'bg-gradient-to-br from-cyan-100 to-blue-200 dark:from-cyan-900/40 dark:to-blue-800/40 text-cyan-700 dark:text-cyan-300 border-2 border-cyan-300 dark:border-cyan-700/50 shadow-lg shadow-cyan-500/20',
  },
  unpin_message: {
    name: 'Unpin Message',
    icon: 'fas fa-times',
    color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
    canvasColor: 'bg-gradient-to-br from-slate-100 to-gray-200 dark:from-slate-900/40 dark:to-gray-800/40 text-slate-700 dark:text-slate-300 border-2 border-slate-300 dark:border-slate-700/50 shadow-lg shadow-slate-500/20',
  },
  delete_message: {
    name: 'Delete Message',
    icon: 'fas fa-trash',
    color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    canvasColor: 'bg-gradient-to-br from-red-100 to-rose-200 dark:from-red-900/40 dark:to-rose-800/40 text-red-700 dark:text-red-300 border-2 border-red-300 dark:border-red-700/50 shadow-lg shadow-red-500/20',
  },
  forward_message: {
    name: 'Forward Message',
    icon: 'fas fa-share',
    color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    canvasColor: 'bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/40 dark:to-orange-800/40 text-amber-700 dark:text-amber-300 border-2 border-amber-300 dark:border-amber-700/50 shadow-lg shadow-amber-500/20',
  },
  create_forum_topic: {
    name: 'Create Forum Topic',
    icon: 'fas fa-layer-group',
    color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
    canvasColor: 'bg-gradient-to-br from-teal-100 to-cyan-200 dark:from-teal-900/40 dark:to-cyan-800/40 text-teal-700 dark:text-teal-300 border-2 border-teal-300 dark:border-teal-700/50 shadow-lg shadow-teal-500/20',
  },
  edit_message: {
    name: 'Edit Message',
    icon: 'fas fa-pen',
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    canvasColor: 'bg-gradient-to-br from-blue-50 to-sky-100 dark:from-blue-900/30 dark:to-sky-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
  },
  // Управление пользователями
  ban_user: {
    name: 'Ban User',
    icon: 'fas fa-ban',
    color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    canvasColor: 'bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 text-red-700 dark:text-red-300 border-2 border-red-300 dark:border-red-700/50 shadow-lg shadow-red-500/20',
  },
  unban_user: {
    name: 'Unban User',
    icon: 'fas fa-user-check',
    color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    canvasColor: 'bg-gradient-to-br from-emerald-100 to-green-200 dark:from-emerald-900/40 dark:to-green-800/40 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-700/50 shadow-lg shadow-emerald-500/20',
  },
  mute_user: {
    name: 'Restrict User',
    icon: 'fas fa-volume-mute',
    color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    canvasColor: 'bg-gradient-to-br from-orange-100 to-amber-200 dark:from-orange-900/40 dark:to-amber-800/40 text-orange-700 dark:text-orange-300 border-2 border-orange-300 dark:border-orange-700/50 shadow-lg shadow-orange-500/20',
  },
  unmute_user: {
    name: 'Remove Restrictions',
    icon: 'fas fa-volume-up',
    color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    canvasColor: 'bg-gradient-to-br from-sky-100 to-blue-200 dark:from-sky-900/40 dark:to-blue-800/40 text-sky-700 dark:text-sky-300 border-2 border-sky-300 dark:border-sky-700/50 shadow-lg shadow-sky-500/20',
  },
  kick_user: {
    name: 'Kick User',
    icon: 'fas fa-user-times',
    color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    canvasColor: 'bg-gradient-to-br from-rose-100 to-pink-200 dark:from-rose-900/40 dark:to-pink-800/40 text-rose-700 dark:text-rose-300 border-2 border-rose-300 dark:border-rose-700/50 shadow-lg shadow-rose-500/20',
  },
  promote_user: {
    name: 'Promote Administrator',
    icon: 'fas fa-crown',
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    canvasColor: 'bg-gradient-to-br from-yellow-100 to-amber-200 dark:from-yellow-900/40 dark:to-amber-800/40 text-yellow-700 dark:text-yellow-300 border-2 border-yellow-300 dark:border-yellow-700/50 shadow-lg shadow-yellow-500/20',
  },
  demote_user: {
    name: 'Demote Administrator',
    icon: 'fas fa-user-minus',
    color: 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400',
    canvasColor: 'bg-gradient-to-br from-slate-100 to-gray-200 dark:from-slate-900/40 dark:to-gray-800/40 text-slate-700 dark:text-slate-300 border-2 border-slate-300 dark:border-slate-700/50 shadow-lg shadow-slate-500/20',
  },
  admin_rights: {
    name: 'Administrator Rights',
    icon: 'fas fa-user-shield',
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    canvasColor: 'bg-gradient-to-br from-violet-100 to-purple-200 dark:from-violet-900/40 dark:to-purple-800/40 text-violet-800 dark:text-violet-200 border-2 border-violet-300 dark:border-violet-700/50 shadow-xl shadow-violet-500/25 ring-1 ring-violet-400/30 dark:ring-violet-600/30',
  },
  // Интеграции
  http_request: {
    name: 'HTTP Request',
    icon: 'fas fa-globe',
    color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
    canvasColor: 'bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800',
  },
  psql_query: {
    name: 'PostgreSQL',
    icon: 'fas fa-database',
    color: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
    canvasColor: 'bg-gradient-to-br from-violet-50 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800',
  },
  convert_file: {
    name: 'File Converter',
    icon: 'fas fa-file-export',
    color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    canvasColor: 'bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
  },
  set_variable: {
    name: 'Variables',
    icon: 'fas fa-calculator',
    color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    canvasColor: 'bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
  },
  get_managed_bot_token: {
    name: 'Get Bot Token',
    icon: 'fas fa-key',
    color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
    canvasColor: 'bg-gradient-to-br from-indigo-50 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800',
  },
  answer_callback_query: {
    name: 'Inline Button Notification',
    icon: 'fas fa-bell',
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    canvasColor: 'bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800',
  },
  bot_table: {
    name: 'Table',
    icon: 'fas fa-table',
    color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    canvasColor: 'bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
  },
  // Логика — цикл
  loop: {
    name: 'Loop',
    icon: 'fas fa-sync-alt',
    color: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
    canvasColor: 'bg-gradient-to-br from-violet-50 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 text-violet-600 dark:text-violet-400 border-2 border-violet-300 dark:border-violet-700/50 shadow-lg shadow-violet-500/20',
  },
  // Логика — параллельный запуск веток (fan-out)
  parallel_split: {
    name: 'Parallel Group',
    icon: 'fas fa-sitemap',
    color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
    canvasColor: 'bg-gradient-to-br from-rose-50 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 text-rose-600 dark:text-rose-400 border-2 border-rose-300 dark:border-rose-700/50 shadow-lg shadow-rose-500/20',
  },
  // Логика — задержка
  delay: {
    name: 'Delay',
    icon: 'fas fa-stopwatch',
    color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    canvasColor: 'bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 text-amber-600 dark:text-amber-400 border-2 border-amber-300 dark:border-amber-700/50 shadow-lg shadow-amber-500/20',
  },
  // Логика — произвольный Python
  code: {
    name: 'Python Code',
    icon: 'fas fa-code',
    color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
    canvasColor: 'bg-gradient-to-br from-slate-50 to-indigo-100 dark:from-slate-900/40 dark:to-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-300 dark:border-indigo-700/50 shadow-lg shadow-indigo-500/20',
  },
  // Юзербот
  userbot_message: {
    name: 'Message (Userbot)',
    icon: 'fas fa-paper-plane',
    color: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
    canvasColor: 'bg-gradient-to-br from-violet-50 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 text-violet-600 dark:text-violet-400 border-2 border-violet-300 dark:border-violet-700/50 shadow-lg shadow-violet-500/20',
  },
  userbot_click_button: {
    name: 'Click Button (Userbot)',
    icon: 'fas fa-hand-pointer',
    color: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
    canvasColor: 'bg-gradient-to-br from-violet-50 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 text-violet-600 dark:text-violet-400 border-2 border-violet-300 dark:border-violet-700/50 shadow-lg shadow-violet-500/20',
  },
  userbot_inline_query: {
    name: 'Inline Query (Userbot)',
    icon: 'fas fa-at',
    color: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
    canvasColor: 'bg-gradient-to-br from-violet-50 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 text-violet-600 dark:text-violet-400 border-2 border-violet-300 dark:border-violet-700/50 shadow-lg shadow-violet-500/20',
  },
  userbot_edit_trigger: {
    name: 'Edit (Userbot)',
    icon: 'fas fa-pen',
    color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    canvasColor: 'bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 text-amber-600 dark:text-amber-400 border-2 border-amber-300 dark:border-amber-700/50 shadow-lg shadow-amber-500/20',
  },
  // Утилиты
  comment: {
    name: 'Comment',
    icon: 'fas fa-sticky-note',
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    canvasColor: 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 text-yellow-700 dark:text-yellow-300 border border-dashed border-yellow-300 dark:border-yellow-700/50',
  },
};

/**
 * Получить название узла по типу
 * @param type - Тип узла
 * @returns Отображаемое название
 */
export function getNodeName(type: string): string {
  return nodeRegistry[type]?.name || type;
}

/**
 * Получить иконку узла по типу
 * @param type - Тип узла
 * @returns CSS-класс иконки
 */
export function getNodeIcon(type: string): string {
  return nodeRegistry[type]?.icon || 'fas fa-circle';
}

/**
 * Получить цвет узла для панели свойств
 * @param type - Тип узла
 * @returns CSS-классы цвета
 */
export function getNodeColor(type: string): string {
  return nodeRegistry[type]?.color || 'bg-slate-100 text-slate-600';
}

/**
 * Получить цвет узла для канваса
 * @param type - Тип узла
 * @returns CSS-классы цвета канваса
 */
export function getNodeCanvasColor(type: string): string {
  return nodeRegistry[type]?.canvasColor || nodeRegistry.message.canvasColor;
}
