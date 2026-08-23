/**
 * @fileoverview Страница настроек приложения
 * @module components/admin/pages/admin-settings
 */

import { SettingsForm } from '../settings/settings-form';

/**
 * Страница настроек входа и Telegram OIDC
 * @returns JSX элемент страницы настроек
 */
export function AdminSettingsPage() {
  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Настройки приложения</h1>
        <p className="text-muted-foreground mt-1">
          Telegram Login, Mini App и будущие способы входа
        </p>
      </div>
      <SettingsForm />
    </div>
  );
}
