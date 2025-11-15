import { useState } from "react";
import { useSavedCardsStore, SavedCard } from "@profile/store/savedCardsStore";
import { useCardStore } from "@profile/store/cardStore";
import { Card, CardContent } from "@shared/ui/card";
import { Button } from "@shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu";
import { MoreVertical, Eye, Edit, Copy, EyeOff, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { MiniCard } from "./MiniCard";
import { ViewCardModal } from "./ViewCardModal";

interface SavedCardsListProps {
  showHidden: boolean;
}

export const SavedCardsList = ({ showHidden }: SavedCardsListProps) => {
  const { savedCards, deleteCard, hideCard } = useSavedCardsStore();
  const { loadCardData } = useCardStore();
  const navigate = useNavigate();
  const [viewingCard, setViewingCard] = useState<SavedCard | null>(null);

  const filteredCards = showHidden 
    ? savedCards 
    : savedCards.filter(card => !card.hidden);

  const handleView = (card: SavedCard) => {
    setViewingCard(card);
  };

  const handleEdit = (card: SavedCard) => {
    loadCardData(card.cardData, card.id);
    navigate("/");
  };

  const handleClone = (card: SavedCard) => {
    const clonedData = { ...card.cardData };
    const { loadCardDataForClone } = useCardStore.getState();
    loadCardDataForClone(clonedData, card.title);
    navigate("/");
    toast.success(`Cloning "${card.title}"`);
  };

  const handleHide = (card: SavedCard) => {
    hideCard(card.id, !card.hidden);
    toast.success(card.hidden ? "Card unhidden" : "Card hidden");
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Delete "${title}"? This action cannot be undone.`)) {
      deleteCard(id);
      toast.success("Card deleted");
    }
  };

  if (filteredCards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {showHidden ? "No saved cards yet" : "No visible cards"}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {showHidden ? "Save your first card from the editor" : "Toggle 'Show Hidden' to see hidden cards"}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCards.map((card) => (
          <Card key={card.id} className="relative group overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                {/* Card Preview */}
                <div className="p-4">
                  <MiniCard 
                    cardData={card.cardData}
                    onClick={() => handleView(card)}
                  />
                </div>

                {/* Menu Button */}
                <div className="absolute top-2 right-2 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(card)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(card)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleClone(card)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Clone
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleHide(card)}>
                        <EyeOff className="h-4 w-4 mr-2" />
                        {card.hidden ? "Unhide" : "Hide"}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(card.id, card.title)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Card Info Overlay - appears on hover */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/95 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-semibold text-sm truncate mb-1">{card.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {new Date(card.createdAt).toLocaleDateString()}
                  </p>
                  {card.event && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      📍 {card.event}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Modal */}
      {viewingCard && (
        <ViewCardModal
          open={!!viewingCard}
          onOpenChange={(open) => !open && setViewingCard(null)}
          cardData={viewingCard.cardData}
        />
      )}
    </>
  );
};
