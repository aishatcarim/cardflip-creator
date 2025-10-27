import { useCardStore } from "@/store/cardStore";
import { FlipAnimation } from "@/components/CardPreview/FlipAnimation";
import { CardActions } from "@/components/CardPreview/CardActions";
import { FrontFields } from "@/components/LeftPane/FrontFields";
import { BackFields } from "@/components/LeftPane/BackFields";
import { DesignControls } from "@/components/RightPane/DesignControls";
import { Button } from "@/components/ui/button";
import { BookmarkCheck, Moon, Sun, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Index = () => {
  const { cardData } = useCardStore();
  const { isFlipped } = cardData;
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

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
          
          <div className="flex items-center gap-2 md:gap-3">
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
            
            <Button
              size="sm"
              onClick={() => navigate("/profile")}
              className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
            >
              <BookmarkCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Saved Cards</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
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
        <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto relative">
          <div className="flex justify-end mb-4">
            <CardActions />
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4 md:space-y-6">
              <div className="card-preview-container">
                <FlipAnimation />
              </div>
              
              <div className="text-center">
                <p className="text-xs md:text-sm text-muted-foreground">
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
    </div>
  );
};

export default Index;
