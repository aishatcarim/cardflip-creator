import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { SavedCardsList } from "@/components/Profile/SavedCardsList";
import { DefaultsSheet } from "@/components/Profile/DefaultsSheet";

const Profile = () => {
  const navigate = useNavigate();
  const [showDefaults, setShowDefaults] = useState(false);
  const [showHidden, setShowHidden] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">Saved Cards</h1>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Manage your profile card versions
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-12 sm:ml-0">
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
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <SavedCardsList showHidden={showHidden} />
      </main>

      {/* Defaults Sheet */}
      <DefaultsSheet open={showDefaults} onOpenChange={setShowDefaults} />
    </div>
  );
};

export default Profile;
