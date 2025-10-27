import { useCardStore } from "@/store/cardStore";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RotateCcw, Download, Upload, Sparkles } from "lucide-react";
import { toPng } from 'html-to-image';
import { toast } from "sonner";
import { useCallback, useState } from "react";
import { removeBackground, loadImage, dataURLtoBlob } from "@/lib/backgroundRemoval";

export const DesignControls = () => {
  const { cardData, updateCardData, resetCard } = useCardStore();
  const [profilePreview, setProfilePreview] = useState<string | null>(cardData.profileImage);
  const [logoPreview, setLogoPreview] = useState<string | null>(cardData.companyLogo);
  const [isRemovingBackground, setIsRemovingBackground] = useState(false);

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

  const handleRemoveBackground = async () => {
    if (!profilePreview) {
      toast.error("No profile image to process");
      return;
    }

    setIsRemovingBackground(true);
    const toastId = toast.loading("Removing background... This may take a moment.");

    try {
      // Convert data URL to blob
      const blob = dataURLtoBlob(profilePreview);
      
      // Load image
      const image = await loadImage(blob);
      
      // Remove background
      const resultBlob = await removeBackground(image);
      
      // Convert blob to data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfilePreview(result);
        updateCardData({ profileImage: result });
        toast.success("Background removed successfully!", { id: toastId });
        setIsRemovingBackground(false);
      };
      reader.readAsDataURL(resultBlob);
    } catch (error) {
      console.error('Error removing background:', error);
      toast.error("Failed to remove background. Please try again.", { id: toastId });
      setIsRemovingBackground(false);
    }
  };

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
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => document.getElementById('profile-upload')?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              {profilePreview ? 'Change' : 'Upload'}
            </Button>
            {profilePreview && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleRemoveBackground}
                disabled={isRemovingBackground}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isRemovingBackground ? 'Processing...' : 'Remove BG'}
              </Button>
            )}
          </div>
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

      {/* Layout Adjustments */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">LAYOUT ADJUSTMENTS</h3>
        
        <Tabs defaultValue="area" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="area">Area</TabsTrigger>
            <TabsTrigger value="image">Image</TabsTrigger>
            <TabsTrigger value="band">Band</TabsTrigger>
          </TabsList>
          
          <TabsContent value="area" className="space-y-3">
            <Label>Image Area Size</Label>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Width</span>
                <span className="font-mono">{cardData.imageWidth}%</span>
              </div>
              <Slider
                value={[cardData.imageWidth]}
                onValueChange={([value]) => updateCardData({ imageWidth: value })}
                min={30}
                max={70}
                step={5}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Height</span>
                <span className="font-mono">{cardData.imageHeight}%</span>
              </div>
              <Slider
                value={[cardData.imageHeight]}
                onValueChange={([value]) => updateCardData({ imageHeight: value })}
                min={60}
                max={90}
                step={5}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="image" className="space-y-3">
            <Label>Image Adjustment</Label>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Zoom</span>
                <span className="font-mono">{cardData.imageScale.toFixed(2)}x</span>
              </div>
              <Slider
                value={[cardData.imageScale]}
                onValueChange={([value]) => updateCardData({ imageScale: value })}
                min={0.5}
                max={2}
                step={0.1}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Position X</span>
                <span className="font-mono">{cardData.imagePositionX > 0 ? '+' : ''}{cardData.imagePositionX}</span>
              </div>
              <Slider
                value={[cardData.imagePositionX]}
                onValueChange={([value]) => updateCardData({ imagePositionX: value })}
                min={-50}
                max={50}
                step={5}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Position Y</span>
                <span className="font-mono">{cardData.imagePositionY > 0 ? '+' : ''}{cardData.imagePositionY}</span>
              </div>
              <Slider
                value={[cardData.imagePositionY]}
                onValueChange={([value]) => updateCardData({ imagePositionY: value })}
                min={-50}
                max={50}
                step={5}
              />
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs"
              onClick={() => updateCardData({
                imageScale: 1,
                imagePositionX: 0,
                imagePositionY: 0
              })}
            >
              Reset Image Adjustment
            </Button>
          </TabsContent>
          
          <TabsContent value="band" className="space-y-3">
            <Label>Company Band Size</Label>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Height</span>
                <span className="font-mono">{cardData.bandHeight.toFixed(1)}x</span>
              </div>
              <Slider
                value={[cardData.bandHeight]}
                onValueChange={([value]) => updateCardData({ bandHeight: value })}
                min={0.5}
                max={3}
                step={0.25}
              />
            </div>
          </TabsContent>
        </Tabs>
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

        <div className="space-y-2">
          <Label htmlFor="brandColor">Brand Color</Label>
          <div className="flex gap-2">
            <input
              id="brandColor"
              type="color"
              value={cardData.brandColor}
              onChange={(e) => updateCardData({ brandColor: e.target.value })}
              className="w-12 h-10 rounded border border-border cursor-pointer"
            />
            <input
              type="text"
              value={cardData.brandColor}
              onChange={(e) => updateCardData({ brandColor: e.target.value })}
              className="flex-1 px-3 py-2 bg-background border border-input rounded-md text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="textColor">Text Color</Label>
          <div className="flex gap-2">
            <input
              id="textColor"
              type="color"
              value={cardData.textColor}
              onChange={(e) => updateCardData({ textColor: e.target.value })}
              className="w-12 h-10 rounded border border-border cursor-pointer"
            />
            <input
              type="text"
              value={cardData.textColor}
              onChange={(e) => updateCardData({ textColor: e.target.value })}
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
