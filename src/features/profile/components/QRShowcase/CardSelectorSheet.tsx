import { useState } from "react";
import { ChevronDown, Check, User } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@shared/ui/popover";
import { Button } from "@shared/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@shared/ui/avatar";
import { SavedCard } from "@profile/store/savedCardsStore";
import { Badge } from "@shared/ui/badge";
import { ScrollArea } from "@shared/ui/scroll-area";
import { cn } from "@lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface CardSelectorSheetProps {
  selectedCard: SavedCard | undefined;
  visibleCards: SavedCard[];
  onSelectCard: (cardId: string) => void;
}

export const CardSelectorSheet = ({ selectedCard, visibleCards, onSelectCard }: CardSelectorSheetProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (cardId: string) => {
    onSelectCard(cardId);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-12 px-3 gap-3 rounded-full bg-background/80 backdrop-blur-md border-border/50 hover:bg-background/90 hover:border-border shadow-lg transition-all duration-200"
        >
          {selectedCard?.cardData.profileImage ? (
            <Avatar className="h-8 w-8 ring-2 ring-accent/20">
              <AvatarImage src={selectedCard.cardData.profileImage} />
              <AvatarFallback className="bg-accent/10 text-accent">
                {selectedCard.cardData.fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center ring-2 ring-accent/20">
              <User className="h-4 w-4 text-accent" />
            </div>
          )}
          <div className="hidden sm:flex flex-col items-start text-left">
            <span className="text-sm font-medium text-foreground leading-tight">
              {selectedCard?.title || "Select Card"}
            </span>
            {selectedCard?.cardData.role && (
              <span className="text-xs text-muted-foreground leading-tight">
                {selectedCard.cardData.role}
              </span>
            )}
          </div>
          <ChevronDown className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )} />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0 rounded-2xl overflow-hidden border-border/50 shadow-xl bg-background/95 backdrop-blur-xl"
        align="end"
        sideOffset={8}
      >
        <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
          <h4 className="font-semibold text-sm text-foreground">Profile Cards</h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            {visibleCards.length} card{visibleCards.length !== 1 ? 's' : ''} available
          </p>
        </div>
        <ScrollArea className="max-h-80">
          <div className="p-2">
            <AnimatePresence>
              {visibleCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.15 }}
                >
                  <button
                    onClick={() => handleSelect(card.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-150 group",
                      selectedCard?.id === card.id
                        ? "bg-accent/10 ring-1 ring-accent/30"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <Avatar className={cn(
                      "h-11 w-11 flex-shrink-0 transition-transform duration-150",
                      selectedCard?.id === card.id 
                        ? "ring-2 ring-accent" 
                        : "ring-1 ring-border/50 group-hover:ring-accent/50"
                    )}>
                      <AvatarImage src={card.cardData.profileImage || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-accent/20 to-accent/5 text-accent font-medium">
                        {card.cardData.fullName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 text-left">
                      <p className={cn(
                        "font-medium text-sm truncate transition-colors",
                        selectedCard?.id === card.id ? "text-accent" : "text-foreground"
                      )}>
                        {card.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {card.cardData.fullName || "No name set"}
                      </p>
                      {card.event && (
                        <Badge 
                          variant="secondary" 
                          className="text-[10px] px-1.5 py-0 h-4 mt-1.5 bg-muted/80"
                        >
                          {card.event}
                        </Badge>
                      )}
                    </div>
                    <div className={cn(
                      "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-150",
                      selectedCard?.id === card.id 
                        ? "bg-accent text-accent-foreground scale-100" 
                        : "bg-transparent scale-0"
                    )}>
                      <Check className="h-3 w-3" />
                    </div>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {visibleCards.length === 0 && (
              <div className="py-8 text-center">
                <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No cards available</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Create a profile card first</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
