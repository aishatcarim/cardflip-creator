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
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Saved Cards</h1>
                <p className="text-sm text-muted-foreground">
                  Manage your profile card versions
                </p>
              </div>
            </div>
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
              >
                <Settings className="h-4 w-4" />
                Default Settings
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
