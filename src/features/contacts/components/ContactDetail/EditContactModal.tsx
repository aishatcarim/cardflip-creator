import { useState, useEffect } from 'react';
import { NetworkContact, useNetworkContactsStore } from '@contacts/store/networkContactsStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/ui/dialog';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import { Textarea } from '@shared/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select';
import { toast } from '@shared/hooks/use-toast';
import { User, Building, Briefcase, Mail, Phone, FileText, Tag } from 'lucide-react';

interface EditContactModalProps {
  contact: NetworkContact;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Marketing',
  'Consulting',
  'Real Estate',
  'Manufacturing',
  'Retail',
  'Media',
  'Legal',
  'Other'
];

export const EditContactModal = ({ contact, open, onOpenChange }: EditContactModalProps) => {
  const { updateContact } = useNetworkContactsStore();
  
  const [formData, setFormData] = useState({
    contactName: contact.contactName,
    company: contact.company || '',
    title: contact.title || '',
    email: contact.email || '',
    phone: contact.phone || '',
    industry: contact.industry,
    interests: contact.interests.join(', '),
    notes: contact.notes
  });

  // Reset form when contact changes
  useEffect(() => {
    setFormData({
      contactName: contact.contactName,
      company: contact.company || '',
      title: contact.title || '',
      email: contact.email || '',
      phone: contact.phone || '',
      industry: contact.industry,
      interests: contact.interests.join(', '),
      notes: contact.notes
    });
  }, [contact]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.contactName.trim()) {
      toast({
        title: "Error",
        description: "Contact name is required",
        variant: "destructive"
      });
      return;
    }

    // Parse interests from comma-separated string
    const interests = formData.interests
      .split(',')
      .map(i => i.trim())
      .filter(i => i.length > 0);

    updateContact(contact.id, {
      contactName: formData.contactName.trim(),
      company: formData.company.trim() || undefined,
      title: formData.title.trim() || undefined,
      email: formData.email.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      industry: formData.industry,
      interests,
      notes: formData.notes.trim()
    });

    toast({
      title: "Contact updated",
      description: `${formData.contactName} has been updated successfully.`
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Edit Contact
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="contactName" className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              Name *
            </Label>
            <Input
              id="contactName"
              value={formData.contactName}
              onChange={(e) => handleInputChange('contactName', e.target.value)}
              placeholder="Contact name"
              maxLength={100}
              required
            />
          </div>

          {/* Company & Title Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="company" className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                Company
              </Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Company name"
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Job title"
                maxLength={100}
              />
            </div>
          </div>

          {/* Email & Phone Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="email@example.com"
                maxLength={255}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 000-0000"
                maxLength={20}
              />
            </div>
          </div>

          {/* Industry */}
          <div className="space-y-2">
            <Label htmlFor="industry" className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              Industry
            </Label>
            <Select
              value={formData.industry}
              onValueChange={(value) => handleInputChange('industry', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <Label htmlFor="interests" className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              Interests
            </Label>
            <Input
              id="interests"
              value={formData.interests}
              onChange={(e) => handleInputChange('interests', e.target.value)}
              placeholder="AI, Startups, Investing (comma-separated)"
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground">Separate multiple interests with commas</p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Notes
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Meeting notes, conversation topics, follow-up items..."
              rows={3}
              maxLength={1000}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
