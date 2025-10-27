import { Button } from "@/components/ui/button";
import { RotateCw, Save } from "lucide-react";
import { useCardStore } from "@/store/cardStore";
import { useSavedCardsStore } from "@/store/savedCardsStore";
import { useState } from "react";
import { SaveCardDialog } from "@/components/SaveCardDialog";

export const CardActions = () => {
  const { toggleFlip, editingCardId } = useCardStore();
  const { savedCards } = useSavedCardsStore();
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const editingCard = editingCardId 
    ? savedCards.find(card => card.id === editingCardId)
    : null;

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="icon"
          onClick={toggleFlip}
          className="shadow-lg"
          title="Flip card"
        >
          <RotateCw className="h-4 w-4" />
        </Button>
        <Button
          variant="default"
          size="icon"
          onClick={() => setShowSaveDialog(true)}
          className="shadow-lg"
          title={editingCardId ? "Update card" : "Save card"}
        >
          <Save className="h-4 w-4" />
        </Button>
      </div>
      
      <SaveCardDialog 
        open={showSaveDialog} 
        onOpenChange={setShowSaveDialog}
        editingCard={editingCard ? {
          id: editingCard.id,
          title: editingCard.title,
          tags: editingCard.tags,
          event: editingCard.event
        } : null}
      />
    </>
  );
};
