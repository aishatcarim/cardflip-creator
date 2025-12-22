import { useState, useEffect } from "react";
import { Canvas as FabricCanvas, FabricObject, IText, Rect } from "fabric";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { Slider } from "@shared/ui/slider";
import { Button } from "@shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@shared/ui/collapsible";
import { ChevronDown, Palette, Type, Move, RotateCw } from "lucide-react";

interface PropertiesPanelProps {
  selectedObject: FabricObject;
  canvas: FabricCanvas;
  onUpdate: () => void;
}

export const PropertiesPanel = ({
  selectedObject,
  canvas,
  onUpdate,
}: PropertiesPanelProps) => {
  const [isOpen, setIsOpen] = useState(true);
  
  const isText = selectedObject instanceof IText;
  const isShape = selectedObject instanceof Rect;

  const updateObject = (updates: Partial<FabricObject>) => {
    selectedObject.set(updates);
    canvas.renderAll();
    onUpdate();
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between p-3 h-auto"
          >
            <span className="font-medium text-sm">Properties</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="p-4 pt-0 space-y-4">
            {/* Position & Size */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Move className="h-3 w-3" />
                <span>Position & Size</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">X</Label>
                  <Input
                    type="number"
                    value={Math.round(selectedObject.left || 0)}
                    onChange={(e) => updateObject({ left: Number(e.target.value) })}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Y</Label>
                  <Input
                    type="number"
                    value={Math.round(selectedObject.top || 0)}
                    onChange={(e) => updateObject({ top: Number(e.target.value) })}
                    className="h-8 text-sm"
                  />
                </div>
              </div>

              {isShape && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Width</Label>
                    <Input
                      type="number"
                      value={Math.round((selectedObject as Rect).width || 0)}
                      onChange={(e) => updateObject({ width: Number(e.target.value) } as any)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Height</Label>
                    <Input
                      type="number"
                      value={Math.round((selectedObject as Rect).height || 0)}
                      onChange={(e) => updateObject({ height: Number(e.target.value) } as any)}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Rotation */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <RotateCw className="h-3 w-3" />
                <span>Rotation</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Slider
                  value={[selectedObject.angle || 0]}
                  onValueChange={([value]) => updateObject({ angle: value })}
                  min={0}
                  max={360}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground w-10 text-right">
                  {Math.round(selectedObject.angle || 0)}°
                </span>
              </div>
            </div>

            {/* Text Properties */}
            {isText && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Type className="h-3 w-3" />
                  <span>Text</span>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Font Size</Label>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[(selectedObject as IText).fontSize || 16]}
                      onValueChange={([value]) => updateObject({ fontSize: value } as any)}
                      min={8}
                      max={72}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground w-8 text-right">
                      {(selectedObject as IText).fontSize}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Font Weight</Label>
                  <Select
                    value={(selectedObject as IText).fontWeight?.toString() || 'normal'}
                    onValueChange={(value) => updateObject({ fontWeight: value } as any)}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="semibold">Semibold</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Text Align</Label>
                  <Select
                    value={(selectedObject as IText).textAlign || 'left'}
                    onValueChange={(value) => updateObject({ textAlign: value } as any)}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Color Properties */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Palette className="h-3 w-3" />
                <span>Color</span>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">{isText ? 'Text Color' : 'Fill Color'}</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={(selectedObject.fill as string) || '#000000'}
                    onChange={(e) => updateObject({ fill: e.target.value })}
                    className="w-8 h-8 rounded border border-border cursor-pointer"
                  />
                  <Input
                    value={(selectedObject.fill as string) || '#000000'}
                    onChange={(e) => updateObject({ fill: e.target.value })}
                    className="h-8 text-sm flex-1"
                  />
                </div>
              </div>

              {/* Opacity */}
              <div className="space-y-1.5">
                <Label className="text-xs">Opacity</Label>
                <div className="flex items-center gap-3">
                  <Slider
                    value={[(selectedObject.opacity || 1) * 100]}
                    onValueChange={([value]) => updateObject({ opacity: value / 100 })}
                    min={0}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground w-10 text-right">
                    {Math.round((selectedObject.opacity || 1) * 100)}%
                  </span>
                </div>
              </div>

              {/* Border Radius for shapes */}
              {isShape && (
                <div className="space-y-1.5">
                  <Label className="text-xs">Border Radius</Label>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[(selectedObject as Rect).rx || 0]}
                      onValueChange={([value]) => {
                        (selectedObject as Rect).set({ rx: value, ry: value });
                        canvas.renderAll();
                        onUpdate();
                      }}
                      min={0}
                      max={50}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground w-8 text-right">
                      {(selectedObject as Rect).rx || 0}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
