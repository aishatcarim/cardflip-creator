import { Button } from "@shared/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@shared/ui/tabs";

interface AppHeaderProps {
  showCardsTabs?: boolean;
  currentTab?: string;
  onTabChange?: (value: string) => void;
}

export const AppHeader = ({ showCardsTabs, currentTab, onTabChange }: AppHeaderProps) => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  const isProfilePage = location.pathname === '/';

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Profile';
      case '/contacts':
        return 'My Network';
      case '/events':
        return 'Event Lifecycle';
      case '/analytics':
        return 'Analytics Dashboard';
      default:
        return 'Networking Co-pilot';
    }
  };

  const getPageDescription = () => {
    switch (location.pathname) {
      case '/':
        return 'Present your professional profile';
      case '/contacts':
        return 'Manage your professional connections';
      case '/events':
        return 'Plan, attend, and follow up on events';
      case '/analytics':
        return 'Track your networking performance';
      default:
        return 'AI-powered networking assistant';
    }
  };

  return (
    <header className="flex-shrink-0 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        {/* Left: Logo and Title */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-sm">
            <span className="text-primary-foreground font-bold text-sm">NC</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base md:text-lg font-semibold text-foreground">
              {getPageTitle()}
            </h1>
            <p className="text-xs text-muted-foreground hidden md:block">
              {getPageDescription()}
            </p>
          </div>
        </div>

        {/* Center: Profile Page Tabs (when on /) */}
        {isProfilePage && showCardsTabs && (
          <div className="absolute left-1/2 -translate-x-1/2">
            <Tabs value={currentTab} onValueChange={onTabChange}>
              <TabsList className="bg-muted/50 backdrop-blur">
                <TabsTrigger
                  value="present"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  Present Mode
                </TabsTrigger>
                <TabsTrigger
                  value="edit"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  Edit Cards
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}

        {/* Right: Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-lg hover:bg-accent/50 transition-colors"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 md:h-5 md:w-5 transition-all" />
          ) : (
            <Moon className="h-4 w-4 md:h-5 md:w-5 transition-all" />
          )}
        </Button>
      </div>
    </header>
  );
};
