import { useCardStore } from "@/store/cardStore";
import { FlipAnimation } from "@/components/CardPreview/FlipAnimation";
import { CardActions } from "@/components/CardPreview/CardActions";
import { FrontFields } from "@/components/LeftPane/FrontFields";
import { BackFields } from "@/components/LeftPane/BackFields";
import { DesignControls } from "@/components/RightPane/DesignControls";
import { Button } from "@/components/ui/button";
import { BookmarkCheck, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { cardData } = useCardStore();
  const { isFlipped } = cardData;
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center">
              <span className="text-white font-bold text-sm">NC</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                Networking Co-pilot
              </h1>
              <p className="text-xs text-muted-foreground">Profile Card Builder</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-lg"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            
            <Button
              size="default"
              onClick={() => navigate("/profile")}
              className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
            >
              <BookmarkCheck className="w-4 h-4" />
              Saved Cards
            </Button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane - Text Editor */}
        <div className="w-80 flex-shrink-0 border-r border-border bg-card overflow-y-auto">
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

        {/* Center - Preview */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto relative">
          <div className="flex flex-col items-center space-y-6">
            <div className="card-preview-container relative">
              <FlipAnimation />
              <CardActions />
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

        {/* Right Pane - Images & Colors */}
        <div className="w-80 flex-shrink-0 border-l border-border bg-card overflow-y-auto">
          <div className="p-6">
            <DesignControls />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
