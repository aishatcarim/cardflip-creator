import { useCardStore } from "@/store/cardStore";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RotateCcw, Download } from "lucide-react";
import { toPng } from 'html-to-image';
import { toast } from "sonner";

export const DesignControls = () => {
  const { cardData, updateCardData, resetCard } = useCardStore();

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
        <h2 className="text-lg font-semibold mb-4 text-foreground">Design Controls</h2>
      </div>

      {/* Colors */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">Colors</h3>
        
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
          <Label htmlFor="backgroundColor">Background Color</Label>
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

      {/* Info */}
      <div className="pt-6 border-t border-border">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Tip: Click the Flip button to switch between front and back views. All changes update in real-time.
        </p>
      </div>
    </div>
  );
};
