import { useCardStore } from "@/store/cardStore";
import { FlipAnimation } from "@/components/CardPreview/FlipAnimation";
import { CardActions } from "@/components/CardPreview/CardActions";
import { FrontFields } from "@/components/LeftPane/FrontFields";
import { BackFields } from "@/components/LeftPane/BackFields";
import { DesignControls } from "@/components/RightPane/DesignControls";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Moon, Sun, ChevronLeft, ChevronRight, Calendar, BarChart3, Settings, ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useState } from "react";
import Dock from "@/components/Dock/Dock";
import { SavedCardsList } from "@/components/Profile/SavedCardsList";
import { DefaultsSheet } from "@/components/Profile/DefaultsSheet";

const Index = () => {
  const { cardData } = useCardStore();
  const { isFlipped } = cardData;
  const { theme, setTheme } = useTheme();
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [showDock, setShowDock] = useState(true);
  const [showHidden, setShowHidden] = useState(false);
  const [showDefaults, setShowDefaults] = useState(false);

  const dockItems = [
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
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-border bg-card">
        <div className="flex items-center justify-between px-4 md:px-6 py-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center">
              <span className="text-white font-bold text-sm">NC</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base md:text-lg font-semibold text-foreground">
                Networking Co-pilot
              </h1>
              <p className="text-xs text-muted-foreground hidden md:block">Profile Card Builder</p>
            </div>
          </div>
          
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

      {/* Tabs Navigation */}
      <Tabs defaultValue="builder" className="flex-1 flex flex-col overflow-hidden">
        <div className="flex justify-center border-b border-border bg-card px-4">
          <TabsList className="bg-transparent">
            <TabsTrigger value="builder">Builder</TabsTrigger>
            <TabsTrigger value="saved-cards">Saved Cards</TabsTrigger>
          </TabsList>
        </div>

        {/* Builder Tab */}
        <TabsContent value="builder" className="flex-1 flex overflow-hidden m-0 data-[state=inactive]:hidden">
          <div className="flex-1 flex overflow-hidden relative">
        {/* Left Pane - Text Editor */}
        <motion.div
          initial={false}
          animate={{ 
            width: leftCollapsed ? 0 : 320,
            marginLeft: leftCollapsed ? -320 : 0 
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-shrink-0 border-r border-border bg-card overflow-hidden hidden md:block relative"
        >
          {/* Left Panel Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 h-6 w-6 hover:bg-muted"
            onClick={() => setLeftCollapsed(!leftCollapsed)}
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>

          <div className="w-80 h-full overflow-y-auto">
            <div className="p-6">
              <AnimatePresence mode="wait">
                {!isFlipped ? (
                  <motion.div
                    key="front"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FrontFields />
                  </motion.div>
                ) : (
                  <motion.div
                    key="back"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <BackFields />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Left Panel Expand Button (when collapsed) */}
        {leftCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-2 z-10 h-6 w-6 hover:bg-muted hidden md:flex"
            onClick={() => setLeftCollapsed(false)}
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        )}

        {/* Center - Preview */}
        <div className="flex-1 flex flex-col p-8 overflow-y-auto relative">
          <div className="flex justify-end mb-4">
            <CardActions />
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-6">
              <div className="card-preview-container">
                <FlipAnimation />
              </div>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Currently viewing: <span className="font-medium text-foreground">
                    {isFlipped ? 'Back Side' : 'Front Side'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel Expand Button (when collapsed) */}
        {rightCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 z-10 h-6 w-6 hover:bg-muted hidden md:flex"
            onClick={() => setRightCollapsed(false)}
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>
        )}

        {/* Right Pane - Images & Colors */}
        <motion.div
          initial={false}
          animate={{ 
            width: rightCollapsed ? 0 : 320,
            marginRight: rightCollapsed ? -320 : 0 
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-shrink-0 border-l border-border bg-card overflow-hidden hidden md:block relative"
        >
          {/* Right Panel Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 left-2 z-10 h-6 w-6 hover:bg-muted"
            onClick={() => setRightCollapsed(!rightCollapsed)}
          >
            <ChevronRight className="h-3 w-3" />
          </Button>

          <div className="w-80 h-full overflow-y-auto">
            <div className="p-6">
              <DesignControls />
            </div>
          </div>
        </motion.div>
          </div>
        </TabsContent>

        {/* Saved Cards Tab */}
        <TabsContent value="saved-cards" className="flex-1 overflow-hidden m-0 data-[state=inactive]:hidden">
          <div className="h-full overflow-y-auto">
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
          </div>
        </TabsContent>
      </Tabs>

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

export default Index;
