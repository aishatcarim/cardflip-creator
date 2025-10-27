import { useSavedCardsStore } from "@/store/savedCardsStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export const SavedCardsList = () => {
  const { savedCards, deleteCard } = useSavedCardsStore();

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Delete "${title}"?`)) {
      deleteCard(id);
      toast.success("Card deleted");
    }
  };

  if (savedCards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No saved cards yet</p>
        <p className="text-sm text-muted-foreground mt-2">
          Save your first card from the editor
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {savedCards.map((card) => (
        <Card key={card.id} className="relative group">
          <CardHeader>
            <CardTitle className="text-lg">{card.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(card.createdAt), "MMM dd, yyyy 'at' h:mm a")}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Card Preview Info */}
            <div className="text-sm">
              <p className="font-medium">{card.cardData.fullName}</p>
              <p className="text-muted-foreground">{card.cardData.role}</p>
              <p className="text-muted-foreground">{card.cardData.companyName}</p>
            </div>

            {/* Event */}
            {card.event && (
              <div className="text-sm">
                <span className="font-medium">Event: </span>
                <span className="text-muted-foreground">{card.event}</span>
              </div>
            )}

            {/* Tags */}
            {card.tags.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Tag className="h-3 w-3" />
                  <span>Tags</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {card.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Delete Button */}
            <Button
              variant="destructive"
              size="sm"
              className="w-full mt-4"
              onClick={() => handleDelete(card.id, card.title)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
