import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSavedCardsStore } from "@/store/savedCardsStore";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface DefaultsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DefaultsSheet = ({ open, onOpenChange }: DefaultsSheetProps) => {
  const { defaults, updateDefaults } = useSavedCardsStore();
  
  const [frontDefaults, setFrontDefaults] = useState({
    role: defaults.front.role || "",
    companyName: defaults.front.companyName || "",
    companyWebsite: defaults.front.companyWebsite || "",
    tagline: defaults.front.tagline || "",
  });

  const [backDefaults, setBackDefaults] = useState({
    bio: defaults.back.bio || "",
    email: defaults.back.email || "",
    phone: defaults.back.phone || "",
    ctaText: defaults.back.ctaText || "",
  });

  useEffect(() => {
    if (open) {
      setFrontDefaults({
        role: defaults.front.role || "",
        companyName: defaults.front.companyName || "",
        companyWebsite: defaults.front.companyWebsite || "",
        tagline: defaults.front.tagline || "",
      });
      setBackDefaults({
        bio: defaults.back.bio || "",
        email: defaults.back.email || "",
        phone: defaults.back.phone || "",
        ctaText: defaults.back.ctaText || "",
      });
    }
  }, [open, defaults]);

  const handleSave = () => {
    updateDefaults({
      front: frontDefaults,
      back: backDefaults,
    });
    toast.success("Default settings saved");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Default Profile Information</SheetTitle>
          <SheetDescription>
            Set default values that will be pre-filled in all new cards
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="front" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="front">Front Side</TabsTrigger>
            <TabsTrigger value="back">Back Side</TabsTrigger>
          </TabsList>

          <TabsContent value="front" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="default-role">Default Role</Label>
              <Input
                id="default-role"
                value={frontDefaults.role}
                onChange={(e) => setFrontDefaults({ ...frontDefaults, role: e.target.value })}
                placeholder="e.g., Founder / Director"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-company">Company Name</Label>
              <Input
                id="default-company"
                value={frontDefaults.companyName}
                onChange={(e) => setFrontDefaults({ ...frontDefaults, companyName: e.target.value })}
                placeholder="e.g., YOURCOMPANY"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-website">Company Website</Label>
              <Input
                id="default-website"
                value={frontDefaults.companyWebsite}
                onChange={(e) => setFrontDefaults({ ...frontDefaults, companyWebsite: e.target.value })}
                placeholder="e.g., www.yourcompany.co"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-tagline">Tagline</Label>
              <Input
                id="default-tagline"
                value={frontDefaults.tagline}
                onChange={(e) => setFrontDefaults({ ...frontDefaults, tagline: e.target.value })}
                placeholder="e.g., Innovation at its finest"
              />
            </div>
          </TabsContent>

          <TabsContent value="back" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="default-bio">Bio</Label>
              <Input
                id="default-bio"
                value={backDefaults.bio}
                onChange={(e) => setBackDefaults({ ...backDefaults, bio: e.target.value })}
                placeholder="Your default bio"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-email">Email</Label>
              <Input
                id="default-email"
                type="email"
                value={backDefaults.email}
                onChange={(e) => setBackDefaults({ ...backDefaults, email: e.target.value })}
                placeholder="email@company.co"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-phone">Phone</Label>
              <Input
                id="default-phone"
                value={backDefaults.phone}
                onChange={(e) => setBackDefaults({ ...backDefaults, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-cta">CTA Text</Label>
              <Input
                id="default-cta"
                value={backDefaults.ctaText}
                onChange={(e) => setBackDefaults({ ...backDefaults, ctaText: e.target.value })}
                placeholder="e.g., Let's connect!"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1">
            Save Defaults
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
