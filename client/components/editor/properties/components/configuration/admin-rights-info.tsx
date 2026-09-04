/**
 * @fileoverview Информационная панель о правах администратора для admin_rights
 * 
 * Отображает информацию о функционале узла admin_rights:
 * описание, список возможностей, способы определения участника.
 * 
 * @module AdminRightsInfo
 */

import { Label } from '@/components/ui/label';

/**
 * Пропсы компонента AdminRightsInfo
 */
interface AdminRightsInfoProps {
  /** Заголовок секции (по умолчанию "Administrator Rights") */
  title?: string;
}

/**
 * Компонент информационной панели о правах администратора
 * 
 * Отображает:
 * - Описание функционала
 * - Список из 11 возможностей с иконками
 * - Информацию об автоматическом определении участника
 * 
 * @param {AdminRightsInfoProps} props - Пропсы компонента
 * @returns {JSX.Element} Информационная панель
 */
export function AdminRightsInfo({ title = 'Administrator Rights' }: AdminRightsInfoProps) {
  return (
    <div className="bg-gradient-to-br from-violet-50/50 to-purple-50/30 dark:from-violet-950/20 dark:to-purple-950/10 border border-violet-200/30 dark:border-violet-800/30 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center">
          <i className="fas fa-user-shield text-violet-600 dark:text-violet-400 text-xs"></i>
        </div>
        <Label className="text-sm font-semibold text-violet-900 dark:text-violet-100">{title}</Label>
      </div>

      <div className="space-y-3">
        <div className="text-sm text-violet-800 dark:text-violet-200">
          When calling the command, a message is automatically sent with 11 inline buttons showing the current administrator rights:
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-violet-600 dark:text-violet-400">• 🏷️ Profile change</div>
          <div className="text-violet-600 dark:text-violet-400">• 🗑️Deleting messages</div>
          <div className="text-violet-600 dark:text-violet-400">• 🚫 Blocking participants</div>
          <div className="text-violet-600 dark:text-violet-400">• 📨 Inviting participants</div>
          <div className="text-violet-600 dark:text-violet-400">• 📌 Pinning messages</div>
          <div className="text-violet-600 dark:text-violet-400">• 🎥 Video chat management</div>
          <div className="text-violet-600 dark:text-violet-400">• 📰 Publishing stories</div>
          <div className="text-violet-600 dark:text-violet-400">• ✏️ Editing stories</div>
          <div className="text-violet-600 dark:text-violet-400">• 🗑️Deleting stories</div>
          <div className="text-violet-600 dark:text-violet-400">• 🔒 Anonymity</div>
          <div className="text-violet-600 dark:text-violet-400">• 👑 Assigning administrators</div>
        </div>

        <div className="mt-3 p-3 bg-violet-100/50 dark:bg-violet-900/20 rounded-lg border border-violet-200 dark:border-violet-700">
          <div className="text-xs text-violet-700 dark:text-violet-300 font-medium mb-1">
            💡 Automatic participant detection:
          </div>
          <div className="text-xs text-violet-600 dark:text-violet-400">
            • When replying to a message, the rights of the person who sent the message<br />
            • When mentioned (@username) - rights of the mentioned user<br />
            • When adding an ID to a team, the rights of the specified member
          </div>
        </div>
      </div>
    </div>
  );
}
