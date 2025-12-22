import { useState } from "react";
import { useTemplateStore } from "@profile/store/templateStore";
import { CardTemplate } from "@profile/types/cardElements";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/dialog";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { Textarea } from "@shared/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/select";
import { toast } from "sonner";
import { Save } from "lucide-react";

interface SaveTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SaveTemplateDialog = ({ open, onOpenChange }: SaveTemplateDialogProps) => {
  const { activeTemplateId, getTemplate, addTemplate, updateTemplate } = useTemplateStore();
  const activeTemplate = activeTemplateId ? getTemplate(activeTemplateId) : null;
  
  const [name, setName] = useState(activeTemplate?.name || '');
  const [description, setDescription] = useState(activeTemplate?.description || '');
  const [category, setCategory] = useState<CardTemplate['category']>(activeTemplate?.category || 'custom');
  const [saveMode, setSaveMode] = useState<'new' | 'update'>('new');

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Please enter a template name");
      return;
    }

    if (!activeTemplate) {
      toast.error("No active template to save");
      return;
    }

    if (saveMode === 'update' && activeTemplateId && !activeTemplate.isBuiltIn) {
      // Update existing custom template
      updateTemplate(activeTemplateId, {
        name: name.trim(),
        description: description.trim(),
        category,
      });
      toast.success(`Template "${name}" updated`);
    } else {
      // Create new template
      addTemplate({
        name: name.trim(),
        description: description.trim(),
        category,
        isBuiltIn: false,
        front: activeTemplate.front,
        back: activeTemplate.back,
      });
      toast.success(`Template "${name}" saved`);
    }

    onOpenChange(false);
  };

  const canUpdate = activeTemplate && !activeTemplate.isBuiltIn;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Save Template
          </DialogTitle>
          <DialogDescription>
            Save your current card design as a reusable template
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {canUpdate && (
            <div className="space-y-2">
              <Label>Save Mode</Label>
              <Select value={saveMode} onValueChange={(v) => setSaveMode(v as 'new' | 'update')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Save as new template</SelectItem>
                  <SelectItem value="update">Update "{activeTemplate.name}"</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Custom Card"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description of your template..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as CardTemplate['category'])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            {saveMode === 'update' && canUpdate ? 'Update' : 'Save'} Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
