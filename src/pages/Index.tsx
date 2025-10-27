import { useCardStore } from "@/store/cardStore";
import { FlipAnimation } from "@/components/CardPreview/FlipAnimation";
import { FrontFields } from "@/components/LeftPane/FrontFields";
import { BackFields } from "@/components/LeftPane/BackFields";
import { DesignControls } from "@/components/RightPane/DesignControls";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Index = () => {
  const { cardData, toggleFlip } = useCardStore();
  const { isFlipped } = cardData;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-light text-foreground">
            Networking <span className="font-semibold">Co-pilot</span>
          </h1>
          <p className="text-sm text-muted-foreground">Profile Card Builder</p>
        </div>
      </header>

      {/* Main Layout */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Pane - Content Editor */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-lg border border-border p-6 sticky top-8 max-h-[calc(100vh-8rem)] overflow-y-auto">
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
          <div className="lg:col-span-6">
            <div className="flex flex-col items-center justify-center min-h-[600px] space-y-8">
              <div className="card-preview-container">
                <FlipAnimation />
              </div>
              
              <Button
                size="lg"
                onClick={toggleFlip}
                className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-soft"
              >
                <RotateCw className="w-5 h-5 mr-2" />
                Flip Card
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Currently viewing: <span className="font-medium text-foreground">
                    {isFlipped ? 'Back Side' : 'Front Side'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Pane - Design Controls */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-lg border border-border p-6 sticky top-8 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <DesignControls />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
