import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AppHeaderProps {
  showCardsTabs?: boolean;
  currentTab?: string;
  onTabChange?: (value: string) => void;
}

export const AppHeader = ({ showCardsTabs, currentTab, onTabChange }: AppHeaderProps) => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  return (
    <header className="flex-shrink-0 border-b border-border bg-card">
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        {/* Left: Logo and Title */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center">
            <span className="text-white font-bold text-sm">NC</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base md:text-lg font-semibold text-foreground">
              Networking Co-pilot
            </h1>
            <p className="text-xs text-muted-foreground hidden md:block">
              {location.pathname === "/" ? "QR Profile Showcase" : "Profile Card Builder"}
            </p>
          </div>
        </div>

        {/* Center: Cards Page Tabs (when on /cards) */}
        {showCardsTabs && (
          <div className="absolute left-1/2 -translate-x-1/2">
            <Tabs value={currentTab} onValueChange={onTabChange}>
              <TabsList className="bg-muted">
                <TabsTrigger value="builder" className="data-[state=active]:bg-background">
                  Builder
                </TabsTrigger>
                <TabsTrigger value="saved-cards" className="data-[state=active]:bg-background">
                  Saved Cards
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
          className="rounded-lg"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 md:h-5 md:w-5" />
          ) : (
            <Moon className="h-4 w-4 md:h-5 md:w-5" />
          )}
        </Button>
      </div>
    </header>
  );
};
