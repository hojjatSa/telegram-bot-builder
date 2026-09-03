/**
 * @fileoverview Application settings form in the admin panel
 * @module components/admin/settings/settings-form
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAdminSettings, useSaveAdminSettings } from '../hooks/use-admin-settings';
import { AuthModeBanner } from './auth-mode-banner';
import { BotfatherSteps } from './botfather-steps';
import { LoginModeField } from './login-mode-field';
import { TelegramFields } from './telegram-fields';
import { adminSettingsSchema, type AdminSettingsSchemaValues } from './settings-schema';

/**
 * Login and Telegram settings form.
 * @returns Settings form JSX
 */
export function SettingsForm() {
  const { toast } = useToast();
  const { data: settings, isLoading } = useAdminSettings();
  const saveMutation = useSaveAdminSettings();

  const form = useForm<AdminSettingsSchemaValues>({
    resolver: zodResolver(adminSettingsSchema),
    defaultValues: {
      loginMode: 'dev_login',
      clientId: '',
      clientSecret: '',
      botUsername: '',
      botToken: '',
    },
  });

  useEffect(() => {
    if (!settings) return;
    form.reset({
      loginMode: settings.auth.loginMode,
      clientId: settings.providers.telegram.clientId,
      botUsername: settings.providers.telegram.botUsername,
      clientSecret: '',
      botToken: '',
    });
  }, [settings, form]);

  const loginMode = form.watch('loginMode');

  const onSubmit = (values: AdminSettingsSchemaValues) => {
    saveMutation.mutate(values, {
      onSuccess: () => {
        form.setValue('clientSecret', '');
        form.setValue('botToken', '');
        toast({ title: 'Settings saved' });
      },
      onError: (error: Error & { error?: string }) => {
        toast({
          title: 'Failed to save settings',
          description: error.error || error.message,
          variant: 'destructive',
        });
      },
    });
  };

  if (isLoading || !settings) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AuthModeBanner settings={settings} />

      <div className="grid gap-6 lg:grid-cols-2 items-start">
        <div className="rounded-xl border border-border/60 p-5 bg-card">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <LoginModeField control={form.control} />
              <Separator />
              <TelegramFields
                control={form.control}
                widgetMode={loginMode === 'telegram_widget'}
                clientSecretConfigured={settings.providers.telegram.clientSecretConfigured}
                botTokenConfigured={settings.providers.telegram.botTokenConfigured}
              />
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Saving…' : 'Save'}
              </Button>
            </form>
          </Form>
        </div>

        <BotfatherSteps />
      </div>
    </div>
  );
}
