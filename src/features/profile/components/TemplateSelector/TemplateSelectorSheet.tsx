import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@shared/ui/sheet";
import { TemplateGrid } from "./TemplateGrid";
import { CardTemplate } from "@profile/types/cardElements";

interface TemplateSelectorSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect?: (template: CardTemplate) => void;
}

export const TemplateSelectorSheet = ({ 
  open, 
  onOpenChange,
  onSelect 
}: TemplateSelectorSheetProps) => {
  const handleSelect = (template: CardTemplate) => {
    onSelect?.(template);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] overflow-hidden">
        <SheetHeader className="pb-4 border-b border-border">
          <SheetTitle>Choose a Template</SheetTitle>
          <SheetDescription>
            Select a template to start with, or create your own from scratch
          </SheetDescription>
        </SheetHeader>
        <div className="overflow-y-auto h-[calc(100%-80px)] py-6">
          <TemplateGrid onSelect={handleSelect} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
