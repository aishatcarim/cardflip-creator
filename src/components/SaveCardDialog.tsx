import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useCardStore } from "@/store/cardStore";
import { useSavedCardsStore } from "@/store/savedCardsStore";
import { toast } from "sonner";

interface SaveCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCard?: { id: string; title: string; tags: string[]; event: string } | null;
}

export const SaveCardDialog = ({ open, onOpenChange, editingCard }: SaveCardDialogProps) => {
  const { cardData, editingCardId, resetCard } = useCardStore();
  const { saveCard, updateCard } = useSavedCardsStore();
  
  const generateTitle = () => {
    const date = new Date().toLocaleDateString();
    return `${cardData.fullName} - ${date}`;
  };

  const [title, setTitle] = useState(generateTitle());
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [event, setEvent] = useState("");

  // Update form when editing card changes
  useEffect(() => {
    if (open) {
      if (editingCard) {
        setTitle(editingCard.title);
        setTags(editingCard.tags);
        setEvent(editingCard.event);
      } else {
        setTitle(generateTitle());
        setTags([]);
        setEvent("");
      }
    }
  }, [open, editingCard]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    if (editingCardId || editingCard) {
      // Update existing card
      updateCard(editingCardId || editingCard!.id, {
        title,
        tags,
        event,
        cardData,
      });
      toast.success("Card updated successfully!");
      resetCard();
    } else {
      // Save new card
      saveCard({
        title,
        tags,
        event,
        cardData,
      });
      toast.success("Card saved successfully!");
    }
    
    onOpenChange(false);
    
    // Reset form
    setTitle(generateTitle());
    setTags([]);
    setTagInput("");
    setEvent("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingCardId || editingCard ? "Update Profile Card" : "Save Profile Card"}
          </DialogTitle>
          <DialogDescription>
            Add details to organize and identify this card version
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Card title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event">Event</Label>
            <Input
              id="event"
              value={event}
              onChange={(e) => setEvent(e.target.value)}
              placeholder="e.g., Tech Conference 2025"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add tags"
              />
              <Button type="button" onClick={handleAddTag} variant="secondary">
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {editingCardId || editingCard ? "Update Card" : "Save Card"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
