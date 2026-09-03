/**
 * @fileoverview Application settings page
 * @module components/admin/pages/admin-settings
 */

import { SettingsForm } from '../settings/settings-form';

export function AdminSettingsPage() {
  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Application Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure Telegram Login, Mini App access and authentication options
        </p>
      </div>
      <SettingsForm />
    </div>
  );
}
