import { useState } from "react";
import { motion } from "framer-motion";
import { useTemplateStore } from "@profile/store/templateStore";
import { CardTemplate } from "@profile/types/cardElements";
import { Card, CardContent } from "@shared/ui/card";
import { Button } from "@shared/ui/button";
import { Badge } from "@shared/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/ui/tabs";
import { 
  Check, 
  Copy, 
  Trash2, 
  Sparkles, 
  Briefcase, 
  Minimize2, 
  Palette,
  Plus
} from "lucide-react";
import { toast } from "sonner";

interface TemplateGridProps {
  onSelect?: (template: CardTemplate) => void;
  showActions?: boolean;
}

const categoryIcons = {
  professional: Briefcase,
  creative: Palette,
  minimal: Minimize2,
  custom: Sparkles,
};

const categoryLabels = {
  professional: 'Professional',
  creative: 'Creative',
  minimal: 'Minimal',
  custom: 'Custom',
};

export const TemplateGrid = ({ onSelect, showActions = true }: TemplateGridProps) => {
  const { 
    templates, 
    activeTemplateId, 
    selectedTemplateId,
    setActiveTemplate,
    setSelectedTemplate,
    duplicateTemplate, 
    deleteTemplate,
    getBuiltInTemplates,
    getCustomTemplates
  } = useTemplateStore();

  const builtInTemplates = getBuiltInTemplates();
  const customTemplates = getCustomTemplates();

  const handleSelect = (template: CardTemplate) => {
    setSelectedTemplate(template.id);
    onSelect?.(template);
  };

  const handleUseTemplate = (template: CardTemplate) => {
    setActiveTemplate(template.id);
    toast.success(`Now using "${template.name}" template`);
  };

  const handleDuplicate = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    duplicateTemplate(id);
    toast.success("Template duplicated");
  };

  const handleDelete = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (confirm(`Delete "${name}"? This cannot be undone.`)) {
      deleteTemplate(id);
      toast.success("Template deleted");
    }
  };

  const TemplateCard = ({ template }: { template: CardTemplate }) => {
    const isActive = activeTemplateId === template.id;
    const isSelected = selectedTemplateId === template.id;
    const CategoryIcon = categoryIcons[template.category];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <Card
          className={`relative cursor-pointer overflow-hidden transition-all duration-200 group ${
            isSelected 
              ? 'ring-2 ring-primary shadow-lg' 
              : 'hover:shadow-md border-border'
          } ${isActive ? 'bg-primary/5' : 'bg-card'}`}
          onClick={() => handleSelect(template)}
        >
          <CardContent className="p-0">
            {/* Template Preview */}
            <div className="relative aspect-[3/4] overflow-hidden">
              <TemplatePreview template={template} />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUseTemplate(template);
                  }}
                  className="gap-1"
                >
                  <Check className="h-3 w-3" />
                  Use
                </Button>
                {showActions && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => handleDuplicate(e, template.id)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                )}
                {showActions && !template.isBuiltIn && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    onClick={(e) => handleDelete(e, template.id, template.name)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </div>

            {/* Template Info */}
            <div className="p-3 border-t border-border">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-medium text-sm truncate text-foreground">
                    {template.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                    {template.description}
                  </p>
                </div>
                <Badge variant="secondary" className="shrink-0 gap-1 text-xs">
                  <CategoryIcon className="h-3 w-3" />
                  {categoryLabels[template.category]}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="builtin">Built-in</TabsTrigger>
          <TabsTrigger value="custom" className="gap-1">
            My Templates
            {customTemplates.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {customTemplates.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {templates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="builtin">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {builtInTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom">
          {customTemplates.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-lg">
              <Sparkles className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <h3 className="font-medium text-foreground mb-1">No custom templates yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Duplicate a built-in template or create one from scratch
              </p>
              <Button variant="outline" size="sm" className="gap-1">
                <Plus className="h-3 w-3" />
                Create Template
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {customTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Mini preview component for templates
const TemplatePreview = ({ template }: { template: CardTemplate }) => {
  const { front } = template;
  
  return (
    <div 
      className="w-full h-full"
      style={{ backgroundColor: front.backgroundColor }}
    >
      {/* Render elements as simplified preview */}
      <div className="relative w-full h-full overflow-hidden">
        {front.elements.map((element) => (
          <div
            key={element.id}
            className="absolute"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              width: `${element.width}%`,
              height: `${element.height}%`,
              transform: `rotate(${element.rotation}deg)`,
              zIndex: element.zIndex,
            }}
          >
            {element.type === 'text' && (
              <div
                className="w-full h-full flex items-start"
                style={{
                  color: element.styles.color,
                  fontSize: `${(element.styles.fontSize || 12) * 0.4}px`,
                  fontWeight: element.styles.fontWeight,
                  textAlign: element.styles.textAlign,
                  opacity: element.styles.opacity,
                  letterSpacing: element.styles.letterSpacing ? `${element.styles.letterSpacing * 0.3}px` : undefined,
                  writingMode: element.styles.writingMode,
                }}
              >
                {element.dataBinding?.replace(/\{\{|\}\}/g, '') || element.content || ''}
              </div>
            )}
            {element.type === 'shape' && (
              <div
                className="w-full h-full"
                style={{
                  backgroundColor: element.styles.backgroundColor,
                  borderRadius: element.styles.borderRadius,
                  opacity: element.styles.opacity,
                }}
              />
            )}
            {element.type === 'image' && (
              <div 
                className="w-full h-full bg-muted/50 flex items-center justify-center"
                style={{ opacity: element.styles.opacity }}
              >
                <div className="w-1/2 h-1/2 bg-muted rounded" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
