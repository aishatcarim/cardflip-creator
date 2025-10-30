import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Eye, ChevronUp, ChevronDown, LayoutGrid, Calendar, BarChart3, Settings } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useSavedCardsStore } from "@/store/savedCardsStore";
import { ViewCardModal } from "@/components/Profile/ViewCardModal";
import Dock from "@/components/Dock/Dock";
import { useNavigate } from "react-router-dom";
import { DefaultsSheet } from "@/components/Profile/DefaultsSheet";
import { QRMenuPopover } from "@/components/QR/QRMenuPopover";
import { CardSelectorSheet } from "@/components/QR/CardSelectorSheet";

const Index = () => {
  const { theme, setTheme } = useTheme();
  const { savedCards } = useSavedCardsStore();
  const navigate = useNavigate();
  const [selectedCardId, setSelectedCardId] = useState<string>("");
  const [coloredQR, setColoredQR] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [showDock, setShowDock] = useState(true);
  const [showDefaults, setShowDefaults] = useState(false);

  // Get visible cards (not hidden)
  const visibleCards = savedCards.filter(card => !card.hidden);

  // Set default card on load
  useEffect(() => {
    if (visibleCards.length > 0 && !selectedCardId) {
      setSelectedCardId(visibleCards[0].id);
    }
  }, [visibleCards, selectedCardId]);

  const selectedCard = savedCards.find(card => card.id === selectedCardId);
  const qrCodeUrl = selectedCard 
    ? `${window.location.origin}/profile/${selectedCard.id}`
    : "";

  const dockItems = [
    { 
      icon: <LayoutGrid size={20} />, 
      label: 'Cards', 
      onClick: () => navigate('/cards')
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
    <div className="h-screen flex flex-col relative overflow-hidden">
      {/* Animated Background Gradient */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: [
            "radial-gradient(ellipse at 50% 40%, hsl(var(--accent)/0.08) 0%, transparent 60%)",
            "radial-gradient(ellipse at 50% 40%, hsl(var(--accent)/0.12) 0%, transparent 60%)",
            "radial-gradient(ellipse at 50% 40%, hsl(var(--accent)/0.08) 0%, transparent 60%)",
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Minimal Header */}
      <header className="flex-shrink-0 px-4 py-3 flex items-center justify-between">
        <QRMenuPopover
          qrCodeUrl={qrCodeUrl}
          coloredQR={coloredQR}
          onColoredQRChange={setColoredQR}
          cardTitle={selectedCard?.title || "Profile"}
        />
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full hover:bg-accent/10"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          
          <CardSelectorSheet
            selectedCard={selectedCard}
            visibleCards={visibleCards}
            onSelectCard={setSelectedCardId}
          />
        </div>
      </header>

      {/* Main Content - Centered QR Display */}
      <div className="flex-1 flex items-center justify-center px-4 pb-20">
        {selectedCard ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="flex flex-col items-center space-y-6 md:space-y-8 max-w-md w-full"
          >
            {/* Profile Info */}
            <div className="text-center space-y-2">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl font-bold text-foreground"
              >
                {selectedCard.cardData.fullName || selectedCard.title}
              </motion.h1>
              {selectedCard.cardData.role && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-base md:text-lg text-muted-foreground"
                >
                  {selectedCard.cardData.role}
                </motion.p>
              )}
            </div>

            {/* QR Code with Enhanced Styling */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
              }}
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 15,
                delay: 0.3 
              }}
              className="relative"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-accent/10 blur-3xl rounded-full scale-110" />
              
              {/* QR Container with Pulse */}
              <motion.div
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative p-6 md:p-8 bg-white dark:bg-white rounded-3xl shadow-2xl hover:shadow-accent/20 transition-shadow duration-300"
              >
                <QRCodeSVG
                  id="qr-code-svg"
                  value={qrCodeUrl}
                  size={300}
                  level="H"
                  includeMargin={true}
                  fgColor={coloredQR ? "hsl(var(--accent))" : "#000000"}
                  bgColor="transparent"
                  className="w-full h-auto"
                />
                
                {/* Center Logo */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-lg border-4 border-white">
                  <span className="text-white font-bold text-xl md:text-2xl">NC</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Instruction Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-sm md:text-base text-muted-foreground max-w-xs"
            >
              Point your camera at the QR code to view my digital profile
            </motion.p>

            {/* Preview Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                size="lg"
                onClick={() => setShowPreview(true)}
                className="gap-2 rounded-full shadow-lg hover:shadow-xl transition-shadow"
              >
                <Eye className="h-5 w-5" />
                Preview Profile Card
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-4 max-w-md"
          >
            <p className="text-muted-foreground text-lg">
              No profile cards available
            </p>
            <p className="text-sm text-muted-foreground">
              Create your first profile card to generate a QR code
            </p>
            <Button onClick={() => navigate('/cards')} size="lg" className="mt-4">
              <LayoutGrid className="h-5 w-5 mr-2" />
              Create Profile Card
            </Button>
          </motion.div>
        )}
      </div>

      {/* Preview Modal */}
      {selectedCard && (
        <ViewCardModal
          open={showPreview}
          onOpenChange={setShowPreview}
          cardData={selectedCard.cardData}
        />
      )}

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
