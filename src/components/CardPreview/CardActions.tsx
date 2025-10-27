import { Button } from "@/components/ui/button";
import { RotateCw, Save } from "lucide-react";
import { useCardStore } from "@/store/cardStore";
import { useState } from "react";
import { SaveCardDialog } from "@/components/SaveCardDialog";

export const CardActions = () => {
  const { toggleFlip } = useCardStore();
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  return (
    <>
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <Button
          variant="secondary"
          size="icon"
          onClick={toggleFlip}
          className="shadow-lg"
        >
          <RotateCw className="h-4 w-4" />
        </Button>
        <Button
          variant="default"
          size="icon"
          onClick={() => setShowSaveDialog(true)}
          className="shadow-lg"
        >
          <Save className="h-4 w-4" />
        </Button>
      </div>
      
      <SaveCardDialog 
        open={showSaveDialog} 
        onOpenChange={setShowSaveDialog} 
      />
    </>
  );
};
