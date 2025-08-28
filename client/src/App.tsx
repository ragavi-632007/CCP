import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { LanguageProvider } from "@/components/language-provider";
import { ProtectedRoute } from "./lib/protected-route";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ModulesPage from "@/pages/modules-page";
import ForumPage from "@/pages/forum-page";
import LiveDataPage from "@/pages/live-data-page";
import AdminDashboard from "@/pages/admin-dashboard";
import FeedbackPage from "@/pages/feedback-page";
import NotFound from "@/pages/not-found";
import "./lib/i18n";

function Router() {
  const location = window.location.pathname;
  return (
    <div className="min-h-screen flex flex-col">
      {location !== "/auth" && <Navbar />}
      <main className="flex-1">
        <Switch>
          <ProtectedRoute path="/" component={HomePage} />
          <ProtectedRoute path="/modules" component={ModulesPage} />
          <ProtectedRoute path="/forum" component={ForumPage} />
          <ProtectedRoute path="/live-data" component={LiveDataPage} />
          <ProtectedRoute path="/admin" component={AdminDashboard} />
          <ProtectedRoute path="/feedback" component={FeedbackPage} />
          <Route path="/auth" component={AuthPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <AuthProvider>
            <Toaster />
            <Router />
          </AuthProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
