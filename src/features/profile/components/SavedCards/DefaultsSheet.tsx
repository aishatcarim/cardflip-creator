import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@shared/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/ui/tabs";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { Button } from "@shared/ui/button";
import { Switch } from "@shared/ui/switch";
import { useSavedCardsStore } from "@profile/store/savedCardsStore";
import { useNetworkContactsStore } from "@contacts/store/networkContactsStore";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface DefaultsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DefaultsSheet = ({ open, onOpenChange }: DefaultsSheetProps) => {
  const { defaults, updateDefaults } = useSavedCardsStore();
  const { settings: networkSettings, updateSettings: updateNetworkSettings } = useNetworkContactsStore();
  
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

  const [networkDefaults, setNetworkDefaults] = useState({
    autoShowTagModal: networkSettings.autoShowTagModal,
    defaultToQuickTag: networkSettings.defaultToQuickTag,
    defaultEvent: networkSettings.defaultEvent,
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
      setNetworkDefaults({
        autoShowTagModal: networkSettings.autoShowTagModal,
        defaultToQuickTag: networkSettings.defaultToQuickTag,
        defaultEvent: networkSettings.defaultEvent,
      });
    }
  }, [open, defaults, networkSettings]);

  const handleSave = () => {
    updateDefaults({
      front: frontDefaults,
      back: backDefaults,
    });
    updateNetworkSettings(networkDefaults);
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="front">Front</TabsTrigger>
            <TabsTrigger value="back">Back</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
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

          <TabsContent value="network" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-show-tag">Auto-show tag modal</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically show the contact tagging modal when someone scans your QR code
                  </p>
                </div>
                <Switch
                  id="auto-show-tag"
                  checked={networkDefaults.autoShowTagModal}
                  onCheckedChange={(checked) =>
                    setNetworkDefaults({ ...networkDefaults, autoShowTagModal: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="default-quick-tag">Default to Quick Tag</Label>
                  <p className="text-xs text-muted-foreground">
                    Use simplified quick tag mode by default instead of full details form
                  </p>
                </div>
                <Switch
                  id="default-quick-tag"
                  checked={networkDefaults.defaultToQuickTag}
                  onCheckedChange={(checked) =>
                    setNetworkDefaults({ ...networkDefaults, defaultToQuickTag: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-event">Default Event Name</Label>
                <Input
                  id="default-event"
                  value={networkDefaults.defaultEvent}
                  onChange={(e) =>
                    setNetworkDefaults({ ...networkDefaults, defaultEvent: e.target.value })
                  }
                  placeholder="e.g., Tech Conference 2025"
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground">
                  Pre-fill this event name when tagging new contacts
                </p>
              </div>
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
