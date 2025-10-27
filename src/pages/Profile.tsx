import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, User, Calendar, BarChart3, Home, ChevronUp, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { SavedCardsList } from "@/components/Profile/SavedCardsList";
import { DefaultsSheet } from "@/components/Profile/DefaultsSheet";
import { motion, AnimatePresence } from "framer-motion";
import Dock from "@/components/Dock/Dock";

const Profile = () => {
  const navigate = useNavigate();
  const [showDefaults, setShowDefaults] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const [showDock, setShowDock] = useState(true);

  const dockItems = [
    { 
      icon: <Home size={20} />, 
      label: 'Builder', 
      onClick: () => navigate('/') 
    },
    { 
      icon: <Calendar size={20} />, 
      label: 'Events', 
      onClick: () => console.log('Events - Coming soon!') 
    },
    { 
      icon: <BarChart3 size={20} />, 
      label: 'Analytics', 
      onClick: () => console.log('Analytics - Coming soon!') 
    },
    { 
      icon: <Settings size={20} />, 
      label: 'Settings', 
      onClick: () => setShowDefaults(true) 
    },
  ];

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

      {/* Dock Navigation */}
      <AnimatePresence>
        {showDock && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none"
          >
            <div className="pointer-events-auto">
              <Dock 
                items={dockItems}
                panelHeight={68}
                baseItemSize={50}
                magnification={70}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dock Toggle Button */}
      <Button
        variant="secondary"
        size="icon"
        className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg h-12 w-12"
        onClick={() => setShowDock(!showDock)}
      >
        {showDock ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
      </Button>
    </div>
  );
};

export default Profile;
