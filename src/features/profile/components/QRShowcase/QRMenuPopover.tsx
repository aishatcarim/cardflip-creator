import { useState } from "react";
import { MoreVertical, Download, Copy, Palette, Check } from "lucide-react";
import { Button } from "@shared/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@shared/ui/popover";
import { Separator } from "@shared/ui/separator";
import { toast } from "@shared/hooks/use-toast";

interface QRMenuPopoverProps {
  qrCodeUrl: string;
  coloredQR: boolean;
  onColoredQRChange: (colored: boolean) => void;
  cardTitle: string;
}

export const QRMenuPopover = ({ qrCodeUrl, coloredQR, onColoredQRChange, cardTitle }: QRMenuPopoverProps) => {
  const [open, setOpen] = useState(false);

  const downloadQR = async () => {
    try {
      const svg = document.getElementById('qr-code-svg');
      if (!svg) return;

      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      img.onload = () => {
        canvas.width = 1200;
        canvas.height = 1200;
        
        // White background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw SVG
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Convert to PNG and download
        canvas.toBlob((blob) => {
          if (!blob) return;
          const pngUrl = URL.createObjectURL(blob);
          const downloadLink = document.createElement('a');
          downloadLink.download = `${cardTitle.replace(/\s+/g, '-')}-QR.png`;
          downloadLink.href = pngUrl;
          downloadLink.click();
          URL.revokeObjectURL(pngUrl);
          
          toast({
            title: "QR Code Downloaded",
            description: "Your QR code has been saved as PNG",
          });
        });
        
        URL.revokeObjectURL(url);
      };

      img.src = url;
      setOpen(false);
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download QR code",
        variant: "destructive",
      });
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(qrCodeUrl);
      toast({
        title: "Link Copied!",
        description: "Profile URL copied to clipboard",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-accent/10"
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="start">
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            className="justify-start gap-3 h-auto py-2.5"
            onClick={downloadQR}
          >
            <Download className="h-4 w-4" />
            <span className="text-sm">Download QR Code</span>
          </Button>
          
          <Button
            variant="ghost"
            className="justify-start gap-3 h-auto py-2.5"
            onClick={copyLink}
          >
            <Copy className="h-4 w-4" />
            <span className="text-sm">Copy Profile Link</span>
          </Button>

          <Separator className="my-1" />

          <div className="px-2 py-1.5">
            <p className="text-xs font-medium text-muted-foreground mb-2">QR Style</p>
            <div className="flex gap-2">
              <Button
                variant={coloredQR ? "default" : "outline"}
                size="sm"
                className="flex-1 gap-2"
                onClick={() => onColoredQRChange(true)}
              >
                <Palette className="h-3.5 w-3.5" />
                Colored
              </Button>
              <Button
                variant={!coloredQR ? "default" : "outline"}
                size="sm"
                className="flex-1 gap-2"
                onClick={() => onColoredQRChange(false)}
              >
                <Check className="h-3.5 w-3.5" />
                Mono
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
