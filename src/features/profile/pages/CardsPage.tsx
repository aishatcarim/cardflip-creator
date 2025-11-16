import { useCardStore } from "../store/cardStore";
import { FlipAnimation } from "../components/CardPreview/FlipAnimation";
import { CardActions } from "../components/CardPreview/CardActions";
import { FrontFields } from "../components/CardBuilder/FrontFields";
import { BackFields } from "../components/CardBuilder/BackFields";
import { DesignControls } from "../components/CardBuilder/DesignControls";
import { Button } from "@shared/ui/button";
import { ChevronLeft, ChevronRight, Settings, LayoutGrid, QrCode, Users, BarChart3, Calendar, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { SavedCardsList } from "../components/SavedCards/SavedCardsList";
import { DefaultsSheet } from "../components/SavedCards/DefaultsSheet";
import { useNavigate } from "react-router-dom";

const CardsPage = () => {
  const { cardData } = useCardStore();
  const { isFlipped } = cardData;
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const [showDefaults, setShowDefaults] = useState(false);
  const [currentTab, setCurrentTab] = useState("builder");
  const navigate = useNavigate();


  return (
    <div className="h-full flex flex-col bg-background">

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

    </div>
  );
};

export { CardsPage };
