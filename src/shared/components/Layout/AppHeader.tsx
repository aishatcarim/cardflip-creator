import { Button } from "@shared/ui/button";
import { Moon, Sun, Bell } from "lucide-react";
import { useTheme } from "next-themes";
import { useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@shared/ui/tabs";

type HeaderTab = {
  value: string;
  label: string;
};

interface AppHeaderProps {
  tabs?: HeaderTab[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
  notificationCount?: number;
  highlightText?: string;
}

const getPageTitle = (path: string) => {
  switch (path) {
    case "/":
      return "Profile";
    case "/contacts":
      return "My Network";
    case "/events":
      return "Event Lifecycle";
    case "/analytics":
      return "Analytics Dashboard";
    default:
      return "CORA";
  }
};

const getPageDescription = (path: string) => {
  switch (path) {
    case "/":
      return "Present your professional story";
    case "/contacts":
      return "Manage your professional connections";
    case "/events":
      return "Plan events and win follow-ups";
    case "/analytics":
      return "Track your networking momentum";
    default:
      return "AI-powered networking assistant";
  }
};

export const AppHeader = ({
  tabs,
  activeTab,
  onTabChange,
  notificationCount,
  highlightText,
}: AppHeaderProps) => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  const pageDescription = getPageDescription(location.pathname);

  return (
    <header className="w-full border-b border-border bg-card/70 backdrop-blur-lg supports-[backdrop-filter]:bg-card/60 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 md:px-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl transform rotate-[-10deg] hover:rotate-0 transition-transform duration-300 bg-primary shadow-soft">
            <span className="text-3xl font-bold text-primary-foreground">C</span>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-muted-foreground">
              CORA
            </p>
            <div>
              <h1 className="text-lg font-semibold text-foreground">{pageTitle}</h1>
              <p className="text-xs text-muted-foreground">{pageDescription}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-[200px]">
          {tabs && (
            <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
              <div className="flex justify-center">
                <TabsList className="bg-[#F4F6FB] border border-[#E4E8F0] flex gap-2 rounded-full px-1 py-1 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
                  {tabs.map(tab => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="rounded-full px-4 py-1.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-foreground"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </Tabs>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-foreground transition hover:border-accent hover:text-accent"
          >
            <Bell className="h-5 w-5" />
            {notificationCount && notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white">
                {notificationCount}
              </span>
            )}
          </button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-lg transition-colors border "
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 transition-all" />
            ) : (
              <Moon className="h-4 w-4 transition-all" />
            )}
          </Button>

          <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/50 px-3 py-1 shadow-soft">
            <div className="flex h-10 w-10 items-center justify-center border rounded-2xl bg-[#E9F8F2] text-base font-semibold text-accent-foreground">
              J
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">Jessica Adams</p>
              <p className="text-[11px] text-muted-foreground">jessica@networkcopilot.app</p>
            </div>
          </div>

         
        </div>
      </div>

      {highlightText && (
        <div className="px-4 pb-3 md:px-6">
          <div className="rounded-2xl border border-border bg-background/80 px-4 py-3 shadow-soft">
            <p className="text-sm font-semibold text-foreground">{highlightText}</p>
          </div>
        </div>
      )}
    </header>
  );
};
