import { useCardStore } from "@/store/cardStore";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RotateCcw, Download, Upload } from "lucide-react";
import { toPng } from 'html-to-image';
import { toast } from "sonner";
import { useCallback, useState } from "react";

export const DesignControls = () => {
  const { cardData, updateCardData, resetCard } = useCardStore();
  const [profilePreview, setProfilePreview] = useState<string | null>(cardData.profileImage);
  const [logoPreview, setLogoPreview] = useState<string | null>(cardData.companyLogo);

  const handleFileUpload = useCallback((
    file: File,
    type: 'profile' | 'logo'
  ) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (type === 'profile') {
        setProfilePreview(result);
        updateCardData({ profileImage: result });
      } else {
        setLogoPreview(result);
        updateCardData({ companyLogo: result });
      }
    };
    reader.readAsDataURL(file);
  }, [updateCardData]);

  const handleExportPNG = async () => {
    const cardElement = document.querySelector('.card-preview-container');
    if (!cardElement) {
      toast.error("Card preview not found");
      return;
    }

    try {
      toast.loading("Exporting card...");
      const dataUrl = await toPng(cardElement as HTMLElement, {
        quality: 1,
        pixelRatio: 2,
      });
      
      const link = document.createElement('a');
      link.download = `${cardData.fullName.replace(/\s+/g, '-')}-card.png`;
      link.href = dataUrl;
      link.click();
      
      toast.success("Card exported successfully!");
    } catch (error) {
      console.error('Error exporting card:', error);
      toast.error("Failed to export card");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1 text-foreground">Images & Colors</h2>
        <p className="text-xs text-muted-foreground">Visual Design</p>
      </div>

      {/* Profile Image Upload */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">PROFILE IMAGE</h3>
        
        <div className="space-y-3">
          {profilePreview && (
            <div className="relative w-full h-32 rounded-lg overflow-hidden border border-border">
              <img
                src={profilePreview}
                alt="Profile preview"
                className={`w-full h-full object-cover ${cardData.grayscale ? 'grayscale' : ''}`}
              />
            </div>
          )}
          
          <Button
            variant="outline"
            className="w-full"
            onClick={() => document.getElementById('profile-upload')?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            {profilePreview ? 'Change Image' : 'Upload Image'}
          </Button>
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file, 'profile');
            }}
          />
          
          <div className="flex items-center justify-between">
            <Label htmlFor="grayscale">Grayscale</Label>
            <Switch
              id="grayscale"
              checked={cardData.grayscale}
              onCheckedChange={(checked) => updateCardData({ grayscale: checked })}
            />
          </div>
        </div>
      </div>

      {/* Company Logo Upload */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">COMPANY LOGO</h3>
        
        <div className="space-y-3">
          {logoPreview && (
            <div className="relative w-full h-20 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center p-2">
              <img
                src={logoPreview}
                alt="Logo preview"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}
          
          <Button
            variant="outline"
            className="w-full"
            onClick={() => document.getElementById('logo-upload')?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            {logoPreview ? 'Change Logo' : 'Upload Logo'}
          </Button>
          <input
            id="logo-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file, 'logo');
            }}
          />
          
          <div className="flex items-center justify-between">
            <Label htmlFor="showLogo">Show on Card</Label>
            <Switch
              id="showLogo"
              checked={cardData.showLogo}
              onCheckedChange={(checked) => updateCardData({ showLogo: checked })}
            />
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">COLORS</h3>
        
        <div className="space-y-2">
          <Label htmlFor="accentColor">Accent Color</Label>
          <div className="flex gap-2">
            <input
              id="accentColor"
              type="color"
              value={cardData.accentColor}
              onChange={(e) => updateCardData({ accentColor: e.target.value })}
              className="w-12 h-10 rounded border border-border cursor-pointer"
            />
            <input
              type="text"
              value={cardData.accentColor}
              onChange={(e) => updateCardData({ accentColor: e.target.value })}
              className="flex-1 px-3 py-2 bg-background border border-input rounded-md text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="backgroundColor">Background</Label>
          <div className="flex gap-2">
            <input
              id="backgroundColor"
              type="color"
              value={cardData.backgroundColor}
              onChange={(e) => updateCardData({ backgroundColor: e.target.value })}
              className="w-12 h-10 rounded border border-border cursor-pointer"
            />
            <input
              type="text"
              value={cardData.backgroundColor}
              onChange={(e) => updateCardData({ backgroundColor: e.target.value })}
              className="flex-1 px-3 py-2 bg-background border border-input rounded-md text-sm"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 pt-6 border-t border-border">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleExportPNG}
        >
          <Download className="w-4 h-4 mr-2" />
          Export as PNG
        </Button>

        <Button
          variant="outline"
          className="w-full"
          onClick={resetCard}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset Design
        </Button>
      </div>
    </div>
  );
};
