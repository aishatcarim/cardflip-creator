import { useCardStore } from "@profile/store/cardStore";
import { Label } from "@shared/ui/label";
import { Input } from "@shared/ui/input";
import { Textarea } from "@shared/ui/textarea";
import { Button } from "@shared/ui/button";
import { Badge } from "@shared/ui/badge";
import { Plus, X } from "lucide-react";
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
        <h2 className="text-lg font-semibold mb-1 text-foreground">Text Content</h2>
        <p className="text-xs text-muted-foreground">Back Side</p>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">Bio / Summary</Label>
        <Textarea
          id="bio"
          value={cardData.bio}
          onChange={(e) => updateCardData({ bio: e.target.value })}
          placeholder="Passionate about creating meaningful connections..."
          rows={4}
        />
      </div>

      {/* Interests */}
      <div className="space-y-3">
        <Label>Interests / Tags</Label>
        <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border border-input rounded-md bg-background">
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
        <div className="flex gap-2">
          <Input
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            placeholder="Add interest"
            onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
          />
          <Button
            size="icon"
            variant="outline"
            onClick={handleAddInterest}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">CONTACT</h3>
        
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
      </div>

      {/* CTA */}
      <div className="space-y-2">
        <Label htmlFor="ctaText">Call to Action</Label>
        <Input
          id="ctaText"
          value={cardData.ctaText}
          onChange={(e) => updateCardData({ ctaText: e.target.value })}
          placeholder="Let's connect!"
        />
      </div>
    </div>
  );
};
