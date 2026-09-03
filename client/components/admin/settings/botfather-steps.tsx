/**
 * @fileoverview Step-by-step BotFather setup guide with screenshots
 * @module components/admin/settings/botfather-steps
 */

interface InstructionStep {
  num: number;
  html: string;
}

const STEPS: InstructionStep[] = [
  { num: 1, html: 'Open the @BotFather mini app in Telegram' },
  { num: 2, html: 'Go to My Bots and select the bot you want to use' },
  { num: 3, html: 'Choose Login Widget (see the screenshot below)' },
  { num: 4, html: 'Choose “Switch to OpenID Connect Login” (see the screenshot below)' },
  { num: 5, html: 'Confirm the change in the confirmation dialog' },
  {
    num: 6,
    html: 'Add your site URL as both Redirect URI and Trusted Origin. You can skip this for local npm run dev.',
  },
  {
    num: 7,
    html: 'Copy the Client ID and Client Secret. These are OIDC credentials and are not the bot token.',
  },
  { num: 8, html: 'Bot Username is the bot username without @. It can also be derived from the Bot Token.' },
  {
    num: 9,
    html: 'Bot Token is available through /token in @BotFather. It is only needed for automatic login inside a Telegram Mini App (initData), not for browser login.',
  },
];

const SHOTS_AFTER_STEP: Record<number, { src: string; alt: string }> = {
  3: { src: '/assets/images/botfather-login-widget.png', alt: 'Login Widget in BotFather' },
  4: { src: '/assets/images/botfather-switch-to-oidc.png', alt: 'Switch to OpenID Connect Login' },
  5: { src: '/assets/images/botfather-confirm-oidc.png', alt: 'OIDC confirmation dialog' },
  6: { src: '/assets/images/botfather-redirect-uris.png', alt: 'Redirect URIs and Trusted Origins' },
  7: { src: '/assets/images/botfather-client-id-secret.png', alt: 'Client ID and Client Secret' },
};

export function BotfatherSteps() {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 p-5">
      <h3 className="text-base font-semibold mb-4">How to get the credentials from BotFather</h3>
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
        <strong className="text-foreground">Browser login:</strong> Client ID + Client Secret (OIDC, id_token).{' '}
        <strong className="text-foreground">Inside Telegram Mini App:</strong> Bot Token (initData). Client Secret and Bot Token are different values.
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
