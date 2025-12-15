import { useState } from "react";
import { Button } from "@shared/ui/button";
import { Settings } from "lucide-react";
import { SavedCardsList } from "../components/SavedCards/SavedCardsList";
import { DefaultsSheet } from "../components/SavedCards/DefaultsSheet";

const SavedCardsPage = () => {
  const [showHidden, setShowHidden] = useState(false);
  const [showDefaults, setShowDefaults] = useState(false);

  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-end mb-6">
          <div className="flex items-center gap-2">
            <Button
              variant={showHidden ? "secondary" : "outline"}
              onClick={() => setShowHidden(!showHidden)}
              size="sm"
            >
              {showHidden ? "Hide Hidden" : "Show Hidden"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDefaults(true)}
              className="gap-2"
              size="sm"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Default Settings</span>
            </Button>
          </div>
        </div>
        <SavedCardsList showHidden={showHidden} />
      </div>

      <DefaultsSheet open={showDefaults} onOpenChange={setShowDefaults} />
    </div>
  );
};

export { SavedCardsPage };
