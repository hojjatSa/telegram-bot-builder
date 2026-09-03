/**
 * @fileoverview Authentication screen shown to signed-out users
 * @module components/editor/auth/AuthScreen
 */

import { Bot } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AuthTelegramButton } from './AuthTelegramButton';
import { AuthDevForm } from './AuthDevForm';
import { useAuthScreen } from './hooks/use-auth-screen';
import { useAppConfig } from '@/hooks/use-app-config';

/**
 * Application authentication screen.
 * Shows Telegram ID login in dev mode and Telegram Login Widget in production mode.
 */
export function AuthScreen() {
  const { handleTelegramLogin, isLoading } = useAuthScreen();
  const { data: appConfig } = useAppConfig();

  const isDev = appConfig?.skipAuth ?? true;

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm mx-4 shadow-2xl border-border/50">
        <CardHeader className="items-center text-center space-y-3 pb-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20">
            <Bot className="h-8 w-8 text-primary" />
          </div>

          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold">BotCraft Studio</CardTitle>
            <CardDescription className="text-sm">
              Sign in with Telegram to get started
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          {isDev ? (
            <AuthDevForm />
          ) : (
            <AuthTelegramButton onClick={handleTelegramLogin} isLoading={isLoading} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
