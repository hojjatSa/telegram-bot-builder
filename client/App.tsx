/**
 * @file App.tsx
 * @brief Main Telegram Bot Builder application component
 *
 * Handles application routing, lazy-loaded pages, Telegram authentication,
 * and global providers used throughout the app.
 */

import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "@/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/editor/header/utils/theme-provider";
import { ServerStatus } from "@/components/server-status";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { BotLogsProvider } from "./components/editor/bot/contexts/bot-logs-context";
import { ActiveTerminalsProvider } from "./components/editor/bot/contexts/ActiveTerminalsContext";
import { TerminalAutoRegister } from "./components/editor/bot/hooks/TerminalAutoRegister";
import { ProjectsChangedListener } from "@/components/projects-changed-listener";
import { SetupGuard } from "@/components/editor/setup";
import { NoProjectsScreen } from "@/components/editor/no-projects";
import { useTelegramAuth } from "@/components/editor/header/hooks/use-telegram-auth";
import { isGuest } from "@/types/telegram-user";
import { apiRequest } from "@/queryClient";

const Home = lazy(() => import("@/pages/home"));
const Editor = lazy(() => import("@/pages/editor"));
const TemplatesPage = lazy(() => import("@/components/editor/scenariy"));
const NotFound = lazy(() => import("@/pages/not-found"));
const AdminPanel = lazy(() => import("@/pages/admin"));

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-primary/20"></div>
          <Loader2 className="h-16 w-16 animate-spin text-primary absolute inset-0" />
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-lg font-medium text-foreground">Telegram Bot Builder</h3>
          <p className="text-sm text-muted-foreground">Loading interface...</p>

          <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Shows the empty-projects screen when the signed-in user has no active or archived projects.
 */
function ProjectsGuard({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, sessionReady } = useTelegramAuth();
  const isGuestUser = !user || isGuest(user);

  const isExcluded =
    location.startsWith('/templates') ||
    location.startsWith('/not-found');

  const userId = isGuestUser ? 'anon' : (user as { id: number }).id;
  const guardEnabled = sessionReady && !isGuestUser && !isExcluded;

  const { data: activeProjects = [], isLoading: isLoadingActive } = useQuery({
    queryKey: ['/api/projects/list', userId, 'active'],
    queryFn: () => apiRequest('GET', '/api/projects/list?archived=false'),
    enabled: guardEnabled,
  });

  const needArchivedCheck = guardEnabled && !isLoadingActive && activeProjects.length === 0;

  const { data: archivedProjects = [], isLoading: isLoadingArchived } = useQuery({
    queryKey: ['/api/projects/list', userId, 'archived'],
    queryFn: () => apiRequest('GET', '/api/projects/list?archived=true'),
    enabled: needArchivedCheck,
  });

  const isLoading = isLoadingActive || (needArchivedCheck && isLoadingArchived);

  if (!isExcluded && !isGuestUser && (!sessionReady || isLoading)) return null;

  const hasAnyProjects = activeProjects.length > 0 || archivedProjects.length > 0;
  const showNoProjects = sessionReady && !isLoading && !isGuestUser && !isExcluded && !hasAnyProjects;

  if (showNoProjects) return <NoProjectsScreen />;

  return <>{children}</>;
}

function Router() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Switch>
        <Route path="/admin/settings" component={AdminPanel} />
        <Route path="/admin/docs/:viewer" component={AdminPanel} />
        <Route path="/admin/docs" component={AdminPanel} />
        <Route path="/admin/schema/:tableName" component={AdminPanel} />
        <Route path="/admin/schema" component={AdminPanel} />
        <Route path="/admin/api-docs/:slug" component={AdminPanel} />
        <Route path="/admin/api-docs" component={AdminPanel} />
        <Route path="/admin/health" component={AdminPanel} />
        <Route path="/admin/openapi" component={AdminPanel} />
        <Route path="/admin/live-db" component={AdminPanel} />
        <Route path="/admin/users/:id" component={AdminPanel} />
        <Route path="/admin/users" component={AdminPanel} />
        <Route path="/admin/maintenance" component={AdminPanel} />
        <Route path="/admin" component={AdminPanel} />
        <Route>
          <SetupGuard>
            <TerminalAutoRegister />
            <ProjectsChangedListener />
            <ProjectsGuard>
              <Switch>
                <Route path="/projects" component={Home} />
                <Route path="/templates" component={TemplatesPage} />
                <Route path="/editor/:id" component={Editor} />
                <Route path="/projects/:id" component={Editor} />
                <Route path="/" component={Editor} />
                <Route component={NotFound} />
              </Switch>
            </ProjectsGuard>
          </SetupGuard>
        </Route>
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="telegram-bot-builder-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BotLogsProvider>
            <ActiveTerminalsProvider>
              <ServerStatus />
              <Toaster />
              <Router />
            </ActiveTerminalsProvider>
          </BotLogsProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
