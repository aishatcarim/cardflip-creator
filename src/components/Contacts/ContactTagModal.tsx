import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNetworkContactsStore } from "@/store/networkContactsStore";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface ContactTagModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileCardId: string;
  defaultEvent?: string;
  onSuccess?: () => void;
  editContact?: {
    id: string;
    contactName: string;
    event: string;
    industry: string;
    interests: string[];
    notes: string;
    email?: string;
    phone?: string;
    company?: string;
    isQuickTag: boolean;
  } | null;
}

const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Marketing",
  "Sales",
  "Design",
  "Engineering",
  "Consulting",
  "Real Estate",
  "Legal",
  "Media",
  "Other",
];

const INTERESTS = [
  "AI/ML",
  "Web3",
  "SaaS",
  "Mobile Apps",
  "E-commerce",
  "Fintech",
  "EdTech",
  "HealthTech",
  "Sustainability",
  "Investing",
  "Entrepreneurship",
  "Public Speaking",
];

export const ContactTagModal = ({
  open,
  onOpenChange,
  profileCardId,
  defaultEvent,
  onSuccess,
  editContact,
}: ContactTagModalProps) => {
  const { addContact, updateContact, settings } = useNetworkContactsStore();
  const [showSuccess, setShowSuccess] = useState(false);

  const [quickTag, setQuickTag] = useState({
    contactName: "",
    event: defaultEvent || settings.defaultEvent || "",
    notes: "",
  });

  const [fullTag, setFullTag] = useState({
    contactName: "",
    event: defaultEvent || settings.defaultEvent || "",
    industry: "",
    interests: [] as string[],
    email: "",
    phone: "",
    company: "",
    notes: "",
  });

  const [activeTab, setActiveTab] = useState(
    settings.defaultToQuickTag ? "quick" : "full"
  );

  // Load edit data if provided
  useEffect(() => {
    if (editContact) {
      setQuickTag({
        contactName: editContact.contactName,
        event: editContact.event,
        notes: editContact.notes,
      });
      setFullTag({
        contactName: editContact.contactName,
        event: editContact.event,
        industry: editContact.industry,
        interests: editContact.interests,
        email: editContact.email || "",
        phone: editContact.phone || "",
        company: editContact.company || "",
        notes: editContact.notes,
      });
      setActiveTab(editContact.isQuickTag ? "quick" : "full");
    }
  }, [editContact]);

  // Auto-save draft to localStorage
  useEffect(() => {
    if (open && !editContact) {
      const timer = setTimeout(() => {
        localStorage.setItem(
          "contact-tag-draft",
          JSON.stringify({ quickTag, fullTag, activeTab })
        );
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [quickTag, fullTag, activeTab, open, editContact]);

  // Load draft on open
  useEffect(() => {
    if (open && !editContact) {
      const draft = localStorage.getItem("contact-tag-draft");
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          setQuickTag(parsed.quickTag);
          setFullTag(parsed.fullTag);
          setActiveTab(parsed.activeTab);
        } catch (e) {
          console.error("Failed to parse draft", e);
        }
      }
    }
  }, [open, editContact]);

  const handleQuickSave = () => {
    if (!quickTag.contactName.trim()) {
      toast.error("Contact name is required");
      return;
    }
    if (!quickTag.event.trim()) {
      toast.error("Event name is required");
      return;
    }

    if (editContact) {
      updateContact(editContact.id, {
        contactName: quickTag.contactName.trim(),
        event: quickTag.event.trim(),
        notes: quickTag.notes.trim(),
        isQuickTag: true,
      });
      toast.success("Contact updated successfully");
    } else {
      addContact({
        profileCardId,
        contactName: quickTag.contactName.trim(),
        event: quickTag.event.trim(),
        industry: "",
        interests: [],
        notes: quickTag.notes.trim(),
        isQuickTag: true,
      });
      localStorage.removeItem("contact-tag-draft");
    }

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onOpenChange(false);
      resetForm();
      onSuccess?.();
    }, 1500);
  };

  const handleFullSave = () => {
    if (!fullTag.contactName.trim()) {
      toast.error("Contact name is required");
      return;
    }
    if (!fullTag.event.trim()) {
      toast.error("Event name is required");
      return;
    }
    if (!fullTag.industry) {
      toast.error("Industry is required");
      return;
    }

    // Validate email if provided
    if (fullTag.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fullTag.email)) {
      toast.error("Invalid email format");
      return;
    }

    if (editContact) {
      updateContact(editContact.id, {
        contactName: fullTag.contactName.trim(),
        event: fullTag.event.trim(),
        industry: fullTag.industry,
        interests: fullTag.interests,
        email: fullTag.email.trim() || undefined,
        phone: fullTag.phone.trim() || undefined,
        company: fullTag.company.trim() || undefined,
        notes: fullTag.notes.trim(),
        isQuickTag: false,
      });
      toast.success("Contact updated successfully");
    } else {
      addContact({
        profileCardId,
        contactName: fullTag.contactName.trim(),
        event: fullTag.event.trim(),
        industry: fullTag.industry,
        interests: fullTag.interests,
        email: fullTag.email.trim() || undefined,
        phone: fullTag.phone.trim() || undefined,
        company: fullTag.company.trim() || undefined,
        notes: fullTag.notes.trim(),
        isQuickTag: false,
      });
      localStorage.removeItem("contact-tag-draft");
    }

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onOpenChange(false);
      resetForm();
      onSuccess?.();
    }, 1500);
  };

  const resetForm = () => {
    setQuickTag({
      contactName: "",
      event: defaultEvent || settings.defaultEvent || "",
      notes: "",
    });
    setFullTag({
      contactName: "",
      event: defaultEvent || settings.defaultEvent || "",
      industry: "",
      interests: [],
      email: "",
      phone: "",
      company: "",
      notes: "",
    });
  };

  const toggleInterest = (interest: string) => {
    setFullTag((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        {showSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-4"
            >
              <Check className="w-10 h-10 text-primary-foreground" />
            </motion.div>
            <h3 className="text-2xl font-bold text-foreground">
              {editContact ? "Updated!" : "Contact Saved!"}
            </h3>
            <p className="text-muted-foreground mt-2">
              {editContact
                ? "Contact has been updated"
                : "Added to your network"}
            </p>
          </motion.div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>
                {editContact ? "Edit Contact" : "Tag New Contact"}
              </DialogTitle>
              <DialogDescription>
                {editContact
                  ? "Update contact information"
                  : "Save this person's information to your network"}
              </DialogDescription>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="quick">Quick Tag</TabsTrigger>
                <TabsTrigger value="full">Full Details</TabsTrigger>
              </TabsList>

              <TabsContent value="quick" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="quick-name">
                    Contact Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="quick-name"
                    value={quickTag.contactName}
                    onChange={(e) =>
                      setQuickTag({ ...quickTag, contactName: e.target.value })
                    }
                    placeholder="John Doe"
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quick-event">
                    Event/Occasion <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="quick-event"
                    value={quickTag.event}
                    onChange={(e) =>
                      setQuickTag({ ...quickTag, event: e.target.value })
                    }
                    placeholder="Tech Conference 2025"
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quick-notes">Quick Notes (Optional)</Label>
                  <Textarea
                    id="quick-notes"
                    value={quickTag.notes}
                    onChange={(e) =>
                      setQuickTag({ ...quickTag, notes: e.target.value })
                    }
                    placeholder="Key points from our conversation..."
                    rows={3}
                    maxLength={1000}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleQuickSave} className="flex-1">
                    {editContact ? "Update Contact" : "Save Contact"}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="full" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="full-name">
                    Contact Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="full-name"
                    value={fullTag.contactName}
                    onChange={(e) =>
                      setFullTag({ ...fullTag, contactName: e.target.value })
                    }
                    placeholder="John Doe"
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full-event">
                    Event/Occasion <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="full-event"
                    value={fullTag.event}
                    onChange={(e) =>
                      setFullTag({ ...fullTag, event: e.target.value })
                    }
                    placeholder="Tech Conference 2025"
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">
                    Industry <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={fullTag.industry}
                    onValueChange={(value) =>
                      setFullTag({ ...fullTag, industry: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Interests (Optional)</Label>
                  <div className="flex flex-wrap gap-2">
                    {INTERESTS.map((interest) => (
                      <Button
                        key={interest}
                        type="button"
                        variant={
                          fullTag.interests.includes(interest)
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => toggleInterest(interest)}
                        className="text-xs"
                      >
                        {interest}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={fullTag.email}
                    onChange={(e) =>
                      setFullTag({ ...fullTag, email: e.target.value })
                    }
                    placeholder="john@example.com"
                    maxLength={255}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    value={fullTag.phone}
                    onChange={(e) =>
                      setFullTag({ ...fullTag, phone: e.target.value })
                    }
                    placeholder="+1 (555) 123-4567"
                    maxLength={50}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company (Optional)</Label>
                  <Input
                    id="company"
                    value={fullTag.company}
                    onChange={(e) =>
                      setFullTag({ ...fullTag, company: e.target.value })
                    }
                    placeholder="Acme Corp"
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full-notes">Detailed Notes (Optional)</Label>
                  <Textarea
                    id="full-notes"
                    value={fullTag.notes}
                    onChange={(e) =>
                      setFullTag({ ...fullTag, notes: e.target.value })
                    }
                    placeholder="Conversation highlights, follow-up items..."
                    rows={4}
                    maxLength={1000}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleFullSave} className="flex-1">
                    {editContact ? "Update Contact" : "Save Contact"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
