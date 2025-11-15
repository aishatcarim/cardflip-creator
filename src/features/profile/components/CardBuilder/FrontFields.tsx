import { useCardStore } from "@profile/store/cardStore";
import { Label } from "@shared/ui/label";
import { Input } from "@shared/ui/input";
import { Button } from "@shared/ui/button";

export const FrontFields = () => {
  const { cardData, updateCardData } = useCardStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1 text-foreground">Text Content</h2>
        <p className="text-xs text-muted-foreground">Front Side</p>
      </div>

      {/* Personal Info */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">PERSONAL</h3>
        
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={cardData.fullName}
            onChange={(e) => updateCardData({ fullName: e.target.value })}
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role / Title</Label>
          <Input
            id="role"
            value={cardData.role}
            onChange={(e) => updateCardData({ role: e.target.value })}
            placeholder="Founder / Director"
          />
        </div>
      </div>

      {/* Company Info */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">COMPANY</h3>
        
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            value={cardData.companyName}
            onChange={(e) => updateCardData({ companyName: e.target.value })}
            placeholder="YOURCOMPANY"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyWebsite">Website</Label>
          <Input
            id="companyWebsite"
            value={cardData.companyWebsite}
            onChange={(e) => updateCardData({ companyWebsite: e.target.value })}
            placeholder="www.yourcompany.co"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline (Optional)</Label>
          <Input
            id="tagline"
            value={cardData.tagline}
            onChange={(e) => updateCardData({ tagline: e.target.value })}
            placeholder="Your company tagline"
          />
        </div>
      </div>

      {/* Layout Options */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">LAYOUT</h3>
        
        <div className="space-y-2">
          <Label>Portrait Position</Label>
          <div className="flex gap-2">
            <Button
              variant={cardData.portraitOrientation === 'left' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => updateCardData({ portraitOrientation: 'left' })}
            >
              Left
            </Button>
            <Button
              variant={cardData.portraitOrientation === 'right' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => updateCardData({ portraitOrientation: 'right' })}
            >
              Right
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
