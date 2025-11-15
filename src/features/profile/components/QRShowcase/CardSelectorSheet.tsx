import { User } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@shared/ui/sheet";
import { Button } from "@shared/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@shared/ui/avatar";
import { SavedCard } from "../../../store/savedCardsStore";
import { Badge } from "@shared/ui/badge";
import { ScrollArea } from "@shared/ui/scroll-area";

interface CardSelectorSheetProps {
  selectedCard: SavedCard | undefined;
  visibleCards: SavedCard[];
  onSelectCard: (cardId: string) => void;
}

export const CardSelectorSheet = ({ selectedCard, visibleCards, onSelectCard }: CardSelectorSheetProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-accent/10"
        >
          {selectedCard?.cardData.profileImage ? (
            <Avatar className="h-8 w-8">
              <AvatarImage src={selectedCard.cardData.profileImage} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-96">
        <SheetHeader>
          <SheetTitle>Select Profile Card</SheetTitle>
          <SheetDescription>
            Choose which profile to display
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] mt-6 pr-4">
          <div className="space-y-3">
            {visibleCards.map((card) => (
              <Button
                key={card.id}
                variant={selectedCard?.id === card.id ? "default" : "outline"}
                className="w-full justify-start h-auto p-4 gap-4"
                onClick={() => onSelectCard(card.id)}
              >
                <Avatar className="h-12 w-12 flex-shrink-0">
                  <AvatarImage src={card.cardData.profileImage || undefined} />
                  <AvatarFallback>
                    {card.cardData.fullName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left space-y-1">
                  <p className="font-semibold text-base">{card.title}</p>
                  <p className="text-xs opacity-80">
                    {card.cardData.fullName || "No name"}
                  </p>
                  {card.event && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      {card.event}
                    </Badge>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
