import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Moon, Sun, Eye, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useSavedCardsStore, SavedCard } from "@/store/savedCardsStore";
import { ViewCardModal } from "@/components/Profile/ViewCardModal";
import Dock from "@/components/Dock/Dock";
import { Calendar, BarChart3, Settings, ChevronUp, ChevronDown, LayoutGrid } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DefaultsSheet } from "@/components/Profile/DefaultsSheet";

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
              <p className="text-xs text-muted-foreground hidden md:block">QR Code Access</p>
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

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Card Selector */}
          <div className="flex justify-end mb-8">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:inline">Select Profile:</span>
              <Select value={selectedCardId} onValueChange={setSelectedCardId}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Choose a card" />
                </SelectTrigger>
                <SelectContent>
                  {visibleCards.map((card) => (
                    <SelectItem key={card.id} value={card.id}>
                      {card.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedCard ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* QR Code Display */}
              <Card className="p-8 md:p-12 bg-card border-border">
                <div className="flex flex-col items-center space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                      {selectedCard.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Scan to view digital profile card
                    </p>
                  </div>

                  {/* QR Code with Logo */}
                  <div className="relative p-8 bg-white rounded-2xl shadow-lg">
                    <QRCodeSVG
                      value={qrCodeUrl}
                      size={280}
                      level="H"
                      includeMargin={true}
                      fgColor={coloredQR ? "hsl(var(--accent))" : "#000000"}
                      bgColor="#ffffff"
                      imageSettings={{
                        src: "",
                        height: 50,
                        width: 50,
                        excavate: true,
                      }}
                    />
                    {/* App Logo in Center */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-lg bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-md border-4 border-white">
                      <span className="text-white font-bold text-lg">NC</span>
                    </div>
                  </div>

                  {/* QR Code Controls */}
                  <div className="flex items-center gap-3">
                    <Button
                      variant={coloredQR ? "default" : "outline"}
                      size="sm"
                      onClick={() => setColoredQR(true)}
                      className="gap-2"
                    >
                      <Palette className="h-4 w-4" />
                      Colored
                    </Button>
                    <Button
                      variant={!coloredQR ? "default" : "outline"}
                      size="sm"
                      onClick={() => setColoredQR(false)}
                      className="gap-2"
                    >
                      Grayscale
                    </Button>
                  </div>

                  {/* URL Display */}
                  <div className="w-full max-w-md p-3 bg-muted rounded-lg">
                    <p className="text-xs text-center text-muted-foreground font-mono break-all">
                      {qrCodeUrl}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Preview Button */}
              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={() => setShowPreview(true)}
                  className="gap-2"
                >
                  <Eye className="h-5 w-5" />
                  Preview Profile Card
                </Button>
              </div>
            </motion.div>
          ) : (
            <Card className="p-12 bg-card border-border">
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  No profile cards available. Create one in the Cards section.
                </p>
                <Button onClick={() => navigate('/cards')}>
                  Go to Cards
                </Button>
              </div>
            </Card>
          )}
        </div>
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
