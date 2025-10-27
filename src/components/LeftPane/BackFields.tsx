import { useCardStore } from "@/store/cardStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { useState } from "react";

export const BackFields = () => {
  const { cardData, updateCardData, addInterest, removeInterest } = useCardStore();
  const [newInterest, setNewInterest] = useState("");

  const handleAddInterest = () => {
    if (newInterest.trim()) {
      addInterest(newInterest.trim());
      setNewInterest("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4 text-foreground">Back Side</h2>
      </div>

      {/* Profile Details */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">Profile Details</h3>
        
        <div className="space-y-2">
          <Label htmlFor="bio">Bio / Summary</Label>
          <Textarea
            id="bio"
            value={cardData.bio}
            onChange={(e) => updateCardData({ bio: e.target.value })}
            placeholder="Share your story..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label>Interests / Industry Tags</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
              placeholder="Add an interest"
              className="flex-1"
            />
            <Button
              size="icon"
              variant="secondary"
              onClick={handleAddInterest}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {cardData.interests.map((interest, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {interest}
                <button
                  onClick={() => removeInterest(interest)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={cardData.email}
            onChange={(e) => updateCardData({ email: e.target.value })}
            placeholder="john@yourcompany.co"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={cardData.phone}
            onChange={(e) => updateCardData({ phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ctaText">CTA / Tagline</Label>
          <Input
            id="ctaText"
            value={cardData.ctaText}
            onChange={(e) => updateCardData({ ctaText: e.target.value })}
            placeholder="Let's connect!"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">Quick Links</h3>
        <div className="space-y-3">
          {cardData.quickLinks.map((link, index) => (
            <div key={index} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium">{link.label}</p>
                <p className="text-xs text-muted-foreground">{link.url}</p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => {
                  const newLinks = cardData.quickLinks.filter((_, i) => i !== index);
                  updateCardData({ quickLinks: newLinks });
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
