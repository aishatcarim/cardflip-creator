import { useRef } from "react";
import { Button } from "@shared/ui/button";
import { Separator } from "@shared/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@shared/ui/tooltip";
import {
  Type,
  Square,
  Image,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
} from "lucide-react";

interface ElementToolbarProps {
  onAddText: () => void;
  onAddShape: () => void;
  onAddImage: (imageUrl: string) => void;
  onDelete: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  hasSelection: boolean;
}

export const ElementToolbar = ({
  onAddText,
  onAddShape,
  onAddImage,
  onDelete,
  onBringForward,
  onSendBackward,
  hasSelection,
}: ElementToolbarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        onAddImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 p-2 bg-card border border-border rounded-lg">
        {/* Add Elements */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onAddText} className="h-9 w-9">
                <Type className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Text</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onAddShape} className="h-9 w-9">
                <Square className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Shape</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                className="h-9 w-9"
              >
                <Image className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Image</TooltipContent>
          </Tooltip>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        <Separator orientation="vertical" className="h-6 mx-2" />

        {/* Layer Controls */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onBringForward}
                disabled={!hasSelection}
                className="h-9 w-9"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bring Forward</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onSendBackward}
                disabled={!hasSelection}
                className="h-9 w-9"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send Backward</TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-6 mx-2" />

        {/* Delete */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              disabled={!hasSelection}
              className="h-9 w-9 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete Selected</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
