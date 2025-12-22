import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas as FabricCanvas, Rect, IText, FabricImage, FabricObject } from "fabric";
import { useTemplateStore } from "@profile/store/templateStore";
import { useCardStore } from "@profile/store/cardStore";
import { CardElement, resolveDataBinding, CardDataFields } from "@profile/types/cardElements";
import { ElementToolbar } from "./ElementToolbar";
import { PropertiesPanel } from "./PropertiesPanel";
import { Button } from "@shared/ui/button";
import { RotateCcw, FlipHorizontal2 } from "lucide-react";

interface CanvasEditorProps {
  side: 'front' | 'back';
  width?: number;
  height?: number;
}

export const CanvasEditor = ({ side, width = 400, height = 600 }: CanvasEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  
  const { activeTemplateId, getTemplate, updateTemplate } = useTemplateStore();
  const { cardData } = useCardStore();
  
  const template = activeTemplateId ? getTemplate(activeTemplateId) : null;
  const currentSide = template?.[side];

  // Convert cardData to CardDataFields format
  const dataFields: CardDataFields = {
    fullName: cardData.fullName,
    firstName: cardData.fullName.split(' ')[0] || '',
    lastName: cardData.fullName.split(' ').slice(1).join(' ') || '',
    role: cardData.role,
    companyName: cardData.companyName,
    companyWebsite: cardData.companyWebsite,
    companyLogo: cardData.companyLogo,
    profileImage: cardData.profileImage,
    tagline: cardData.tagline,
    bio: cardData.bio,
    email: cardData.email,
    phone: cardData.phone,
    interests: cardData.interests,
    ctaText: cardData.ctaText,
    quickLinks: cardData.quickLinks,
  };

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width,
      height,
      backgroundColor: currentSide?.backgroundColor || '#ffffff',
      selection: true,
      preserveObjectStacking: true,
    });

    canvas.on('selection:created', (e) => {
      setSelectedObject(e.selected?.[0] || null);
    });

    canvas.on('selection:updated', (e) => {
      setSelectedObject(e.selected?.[0] || null);
    });

    canvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });

    canvas.on('object:modified', () => {
      saveCanvasState(canvas);
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [width, height]);

  // Load template elements onto canvas
  useEffect(() => {
    if (!fabricCanvas || !currentSide) return;

    fabricCanvas.clear();
    fabricCanvas.backgroundColor = currentSide.backgroundColor;

    currentSide.elements.forEach((element) => {
      addElementToCanvas(element);
    });

    fabricCanvas.renderAll();
  }, [fabricCanvas, currentSide, activeTemplateId]);

  const addElementToCanvas = useCallback((element: CardElement) => {
    if (!fabricCanvas) return;

    const left = (element.x / 100) * width;
    const top = (element.y / 100) * height;
    const elemWidth = (element.width / 100) * width;
    const elemHeight = (element.height / 100) * height;

    let fabricObject: FabricObject | null = null;

    switch (element.type) {
      case 'text': {
        const content = element.dataBinding 
          ? resolveDataBinding(element.dataBinding, dataFields)
          : element.content || 'Text';
        
        fabricObject = new IText(content, {
          left,
          top,
          width: elemWidth,
          fontSize: element.styles.fontSize || 16,
          fontWeight: element.styles.fontWeight || 'normal',
          fontFamily: element.styles.fontFamily || 'Inter',
          fill: element.styles.color || '#000000',
          textAlign: element.styles.textAlign || 'left',
          opacity: element.styles.opacity ?? 1,
          angle: element.rotation,
        });
        break;
      }

      case 'shape': {
        fabricObject = new Rect({
          left,
          top,
          width: elemWidth,
          height: elemHeight,
          fill: element.styles.backgroundColor || '#cccccc',
          rx: element.styles.borderRadius || 0,
          ry: element.styles.borderRadius || 0,
          opacity: element.styles.opacity ?? 1,
          angle: element.rotation,
        });
        break;
      }

      case 'image': {
        const imageUrl = element.dataBinding 
          ? resolveDataBinding(element.dataBinding, dataFields)
          : element.content;
        
        if (imageUrl) {
          FabricImage.fromURL(imageUrl, {
            crossOrigin: 'anonymous',
          }).then((img) => {
            img.set({
              left,
              top,
              scaleX: elemWidth / (img.width || 1),
              scaleY: elemHeight / (img.height || 1),
              opacity: element.styles.opacity ?? 1,
              angle: element.rotation,
            });
            
            if (element.styles.grayscale) {
              // Apply grayscale filter
              img.filters = img.filters || [];
            }
            
            (img as any).elementId = element.id;
            fabricCanvas.add(img);
            fabricCanvas.renderAll();
          });
        } else {
          // Placeholder for empty image
          fabricObject = new Rect({
            left,
            top,
            width: elemWidth,
            height: elemHeight,
            fill: '#e5e7eb',
            rx: 4,
            ry: 4,
            opacity: 0.5,
          });
        }
        break;
      }
    }

    if (fabricObject) {
      (fabricObject as any).elementId = element.id;
      (fabricObject as any).elementType = element.type;
      (fabricObject as any).dataBinding = element.dataBinding;
      fabricCanvas.add(fabricObject);
    }
  }, [fabricCanvas, width, height, dataFields]);

  const saveCanvasState = (canvas: FabricCanvas) => {
    if (!template || !activeTemplateId) return;

    const objects = canvas.getObjects();
    const updatedElements: CardElement[] = objects.map((obj) => {
      const elemId = (obj as any).elementId || crypto.randomUUID();
      const elemType = (obj as any).elementType || 'shape';
      
      const textAlign = obj instanceof IText ? obj.textAlign : undefined;
      const validTextAlign = textAlign === 'left' || textAlign === 'center' || textAlign === 'right' 
        ? textAlign 
        : undefined;
      
      return {
        id: elemId,
        type: elemType,
        x: ((obj.left || 0) / width) * 100,
        y: ((obj.top || 0) / height) * 100,
        width: ((obj.getScaledWidth?.() || obj.width || 0) / width) * 100,
        height: ((obj.getScaledHeight?.() || obj.height || 0) / height) * 100,
        rotation: Number(obj.angle) || 0,
        locked: false,
        zIndex: objects.indexOf(obj),
        dataBinding: (obj as any).dataBinding,
        content: obj instanceof IText ? obj.text : undefined,
        styles: {
          color: obj instanceof IText ? (obj.fill as string) : undefined,
          backgroundColor: obj instanceof Rect ? (obj.fill as string) : undefined,
          fontSize: obj instanceof IText ? obj.fontSize : undefined,
          fontWeight: obj instanceof IText ? (obj.fontWeight as 'normal' | 'medium' | 'semibold' | 'bold') : undefined,
          textAlign: validTextAlign,
          opacity: obj.opacity ?? undefined,
          borderRadius: obj instanceof Rect ? (obj.rx ?? undefined) : undefined,
        },
      };
    });

    updateTemplate(activeTemplateId, {
      [side]: {
        ...currentSide,
        elements: updatedElements,
      },
    });
  };

  const handleAddText = () => {
    if (!fabricCanvas) return;
    
    const text = new IText('New Text', {
      left: width / 2 - 50,
      top: height / 2 - 20,
      fontSize: 20,
      fill: '#000000',
      fontFamily: 'Inter',
    });
    
    (text as any).elementId = crypto.randomUUID();
    (text as any).elementType = 'text';
    
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    fabricCanvas.renderAll();
    saveCanvasState(fabricCanvas);
  };

  const handleAddShape = () => {
    if (!fabricCanvas) return;
    
    const rect = new Rect({
      left: width / 2 - 50,
      top: height / 2 - 25,
      width: 100,
      height: 50,
      fill: '#0ea5e9',
      rx: 4,
      ry: 4,
    });
    
    (rect as any).elementId = crypto.randomUUID();
    (rect as any).elementType = 'shape';
    
    fabricCanvas.add(rect);
    fabricCanvas.setActiveObject(rect);
    fabricCanvas.renderAll();
    saveCanvasState(fabricCanvas);
  };

  const handleAddImage = (imageUrl: string) => {
    if (!fabricCanvas) return;
    
    FabricImage.fromURL(imageUrl, { crossOrigin: 'anonymous' }).then((img) => {
      const scale = Math.min(150 / (img.width || 150), 150 / (img.height || 150));
      img.set({
        left: width / 2 - 75,
        top: height / 2 - 75,
        scaleX: scale,
        scaleY: scale,
      });
      
      (img as any).elementId = crypto.randomUUID();
      (img as any).elementType = 'image';
      
      fabricCanvas.add(img);
      fabricCanvas.setActiveObject(img);
      fabricCanvas.renderAll();
      saveCanvasState(fabricCanvas);
    });
  };

  const handleDeleteSelected = () => {
    if (!fabricCanvas || !selectedObject) return;
    fabricCanvas.remove(selectedObject);
    setSelectedObject(null);
    fabricCanvas.renderAll();
    saveCanvasState(fabricCanvas);
  };

  const handleBringForward = () => {
    if (!fabricCanvas || !selectedObject) return;
    fabricCanvas.bringObjectForward(selectedObject);
    fabricCanvas.renderAll();
    saveCanvasState(fabricCanvas);
  };

  const handleSendBackward = () => {
    if (!fabricCanvas || !selectedObject) return;
    fabricCanvas.sendObjectBackwards(selectedObject);
    fabricCanvas.renderAll();
    saveCanvasState(fabricCanvas);
  };

  const handleResetCanvas = () => {
    if (!fabricCanvas || !currentSide) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = currentSide.backgroundColor;
    currentSide.elements.forEach((element) => {
      addElementToCanvas(element);
    });
    fabricCanvas.renderAll();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <ElementToolbar
        onAddText={handleAddText}
        onAddShape={handleAddShape}
        onAddImage={handleAddImage}
        onDelete={handleDeleteSelected}
        onBringForward={handleBringForward}
        onSendBackward={handleSendBackward}
        hasSelection={!!selectedObject}
      />

      {/* Canvas */}
      <div className="relative border border-border rounded-lg overflow-hidden shadow-lg bg-card">
        <canvas ref={canvasRef} className="block" />
        
        {/* Reset button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 bg-background/80 backdrop-blur-sm"
          onClick={handleResetCanvas}
          title="Reset to template"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Properties Panel */}
      {selectedObject && fabricCanvas && (
        <PropertiesPanel
          selectedObject={selectedObject}
          canvas={fabricCanvas}
          onUpdate={() => saveCanvasState(fabricCanvas)}
        />
      )}
    </div>
  );
};
