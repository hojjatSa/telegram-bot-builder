/**
 * @fileoverview Setup blocked screen shown when ADMIN_API_KEY is missing
 * @module components/editor/setup/SetupBlockedScreen
 */

export function SetupBlockedScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <div className="max-w-lg text-center space-y-4">
        <h1 className="text-xl font-semibold text-foreground">
          Platform setup is incomplete
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Initial setup is completed through the operator panel. Set{' '}
          <code className="text-foreground">ADMIN_API_KEY</code> in the{' '}
          <code className="text-foreground">.env</code> file, restart the server and
          open <code className="text-foreground">/admin</code>.
        </p>
        <p className="text-xs text-muted-foreground">
          Generate a key with:{' '}
          <code className="text-foreground">openssl rand -hex 32</code>
        </p>
      </div>
    </div>
  );
}
