/**
 * @fileoverview Пошаговая инструкция BotFather со снимками экрана
 * @module components/admin/settings/botfather-steps
 */

/** Один шаг инструкции */
interface InstructionStep {
  /** Номер шага */
  num: number;
  /** Текст шага (может содержать HTML) */
  html: string;
}

/** Шаги инструкции */
const STEPS: InstructionStep[] = [
  { num: 1, html: 'Открой мини-приложение @BotFather в Telegram' },
  { num: 2, html: 'My Bots → выбери нужного бота' },
  { num: 3, html: 'Нажми Login Widget (см. снимок ниже)' },
  { num: 4, html: 'Нажми «Switch to OpenID Connect Login» (см. снимок ниже)' },
  { num: 5, html: 'В диалоге подтверждения нажми Confirm (см. снимок ниже)' },
  {
    num: 6,
    html: 'Добавь Redirect URI и Trusted Origin — URL сайта. Для npm run dev можно пропустить (см. снимок ниже)',
  },
  {
    num: 7,
    html: 'Скопируй Client ID и Client Secret — отдельные поля OIDC, не bot token (см. снимок ниже)',
  },
  { num: 8, html: 'Bot Username — имя бота без @ (или подставится из Bot Token)' },
  {
    num: 9,
    html: 'Bot Token — через /token в @BotFather. Только для автовхода внутри Telegram Mini App (initData). Для виджета в браузере не нужен.',
  },
];

/** Снимки после указанных шагов */
const SHOTS_AFTER_STEP: Record<number, { src: string; alt: string }> = {
  3: { src: '/assets/images/botfather-login-widget.png', alt: 'Login Widget в меню BotFather' },
  4: { src: '/assets/images/botfather-switch-to-oidc.png', alt: 'Switch to OpenID Connect Login' },
  5: { src: '/assets/images/botfather-confirm-oidc.png', alt: 'Подтверждение OIDC' },
  6: { src: '/assets/images/botfather-redirect-uris.png', alt: 'Redirect URIs и Trusted Origins' },
  7: { src: '/assets/images/botfather-client-id-secret.png', alt: 'Client ID и Client Secret' },
};

/**
 * Блок пошаговой инструкции получения данных в BotFather
 * @returns JSX элемент инструкции
 */
export function BotfatherSteps() {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 p-5">
      <h3 className="text-base font-semibold mb-4">Как получить данные в BotFather</h3>
      <div className="space-y-4">
        {STEPS.map((step) => {
          const shot = SHOTS_AFTER_STEP[step.num];
          return (
            <div key={step.num}>
              <div className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full border border-primary text-primary text-xs font-bold flex items-center justify-center">
                  {step.num}
                </span>
                <p
                  className="text-sm text-muted-foreground leading-relaxed flex-1"
                  dangerouslySetInnerHTML={{ __html: step.html }}
                />
              </div>
              {shot && (
                <figure className="mt-2 ml-9">
                  <img
                    src={shot.src}
                    alt={shot.alt}
                    loading="lazy"
                    className="w-full rounded-lg border border-border/60 bg-background"
                  />
                </figure>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
        <strong className="text-foreground">Вход в браузере:</strong> Client ID + Client Secret (OIDC, id_token).{' '}
        <strong className="text-foreground">Внутри Telegram Mini App:</strong> Bot Token (initData).
        Client Secret и Bot Token — разные значения.
      </p>
      <p className="text-xs mt-2">
        <a
          href="https://core.telegram.org/bots/telegram-login"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          core.telegram.org/bots/telegram-login
        </a>
      </p>
    </div>
  );
}
