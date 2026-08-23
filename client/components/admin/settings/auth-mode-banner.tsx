/**
 * @fileoverview Баннер текущего режима входа на странице настроек
 * @module components/admin/settings/auth-mode-banner
 */

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { AdminAppSettings } from '../types';

/**
 * Пропсы компонента AuthModeBanner
 */
interface AuthModeBannerProps {
  /** Текущие настройки приложения */
  settings: AdminAppSettings;
}

/**
 * Информационный баннер о текущем способе входа
 * @param props - Свойства компонента
 * @returns JSX элемент баннера или null
 */
export function AuthModeBanner({ settings }: AuthModeBannerProps) {
  const { loginMode } = settings.auth;

  if (loginMode === 'dev_login') {
    return (
      <Alert>
        <AlertTitle>Сейчас: dev-login</AlertTitle>
        <AlertDescription>
          Вход по Telegram ID, виджет и поля BotFather не нужны. Перед деплоем и ссылкой для друзей
          выберите ниже «Telegram Login Widget» и заполните данные бота.
        </AlertDescription>
      </Alert>
    );
  }

  if (settings.configured) {
    return (
      <Alert className="border-green-500/40 bg-green-500/10">
        <AlertTitle>Сейчас: Telegram Login Widget</AlertTitle>
        <AlertDescription>Вход через кнопку Telegram на сайте.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-amber-500/40 bg-amber-500/10">
      <AlertTitle>Нужна настройка Telegram Login</AlertTitle>
      <AlertDescription>
        Заполните данные BotFather ниже. Или переключите на dev-login для локальной работы без виджета.
      </AlertDescription>
    </Alert>
  );
}
