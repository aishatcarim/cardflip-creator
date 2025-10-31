import { useCardStore } from "@/store/cardStore";
import { FlipAnimation } from "@/components/CardPreview/FlipAnimation";
import { CardActions } from "@/components/CardPreview/CardActions";
import { FrontFields } from "@/components/LeftPane/FrontFields";
import { BackFields } from "@/components/LeftPane/BackFields";
import { DesignControls } from "@/components/RightPane/DesignControls";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Settings, LayoutGrid, QrCode, Users, BarChart3, Calendar, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Dock from "@/components/Dock/Dock";
import { SavedCardsList } from "@/components/Profile/SavedCardsList";
import { DefaultsSheet } from "@/components/Profile/DefaultsSheet";
import { AppHeader } from "@/components/Navigation/AppHeader";
import { useNavigate } from "react-router-dom";

const Cards = () => {
  const { cardData } = useCardStore();
  const { isFlipped } = cardData;
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const [showDefaults, setShowDefaults] = useState(false);
  const [currentTab, setCurrentTab] = useState("builder");
  const [dockVisible, setDockVisible] = useState(true);
  const navigate = useNavigate();

  const dockItems = [
    { 
      icon: <QrCode size={20} />, 
      label: 'QR Showcase', 
      onClick: () => navigate('/')
    },
    { 
      icon: <LayoutGrid size={20} />, 
      label: 'Card Builder', 
      onClick: () => navigate('/cards'),
      className: 'bg-accent/30'
    },
    { 
      icon: <Users size={20} />, 
      label: 'Contacts', 
      onClick: () => navigate('/contacts')
    },
    { 
      icon: <Calendar size={20} />, 
      label: 'Events', 
      onClick: () => navigate('/events')
    },
    { 
      icon: <BarChart3 size={20} />, 
      label: 'Analytics', 
      onClick: () => navigate('/analytics')
    },
  ];

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header with centered tabs */}
      <AppHeader 
        showCardsTabs 
        currentTab={currentTab}
        onTabChange={setCurrentTab}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Builder View */}
        {currentTab === "builder" && (
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
        )}

        {/* Saved Cards View */}
        {currentTab === "saved-cards" && (
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
        )}
      </div>

      {/* Defaults Sheet */}
      <DefaultsSheet open={showDefaults} onOpenChange={setShowDefaults} />

      {/* Dock Navigation */}
      {dockVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="fixed bottom-4 left-0 right-0 z-50 pointer-events-none"
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

      {/* Dock Visibility Toggle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => setDockVisible(!dockVisible)}
          className="rounded-full shadow-lg bg-background/80 backdrop-blur-sm hover:bg-background"
        >
          {dockVisible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </motion.div>
    </div>
  );
};

export default Cards;
