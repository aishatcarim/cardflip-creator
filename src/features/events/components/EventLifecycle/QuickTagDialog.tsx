import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/ui/dialog';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import { Textarea } from '@shared/ui/textarea';
import { Badge } from '@shared/ui/badge';
import { User, Mail, Phone, Building2, Briefcase, Tag, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@lib/utils';

interface QuickTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventName: string;
  onSave: (contact: {
    contactName: string;
    email?: string;
    phone?: string;
    company?: string;
    title?: string;
    notes: string;
    interests: string[];
  }) => void;
}

const QUICK_INTERESTS = [
  'AI/ML', 'SaaS', 'FinTech', 'HealthTech', 'E-commerce',
  'Cloud', 'DevOps', 'Product', 'Marketing', 'Sales',
  'Engineering', 'Design', 'Data', 'Security', 'Blockchain'
];

export const QuickTagDialog = ({
  open,
  onOpenChange,
  eventName,
  onSave,
}: QuickTagDialogProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [isMinimal, setIsMinimal] = useState(true);

  const handleToggleInterest = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSave = () => {
    if (!name.trim()) return;
    
    onSave({
      contactName: name.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      company: company.trim() || undefined,
      title: title.trim() || undefined,
      notes: notes.trim(),
      interests,
    });

    // Reset form
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setTitle('');
    setNotes('');
    setInterests([]);
    setIsMinimal(true);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            Quick Tag Contact
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Add a contact from <span className="font-medium text-foreground">{eventName}</span>
          </p>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Name - Always visible */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter contact name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11"
              autoFocus
            />
          </div>

          {/* Toggle for more fields */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full justify-center gap-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsMinimal(!isMinimal)}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {isMinimal ? 'Add more details' : 'Show less'}
          </Button>

          <AnimatePresence>
            {!isMinimal && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-hidden"
              >
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                {/* Company & Title Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="company" className="flex items-center gap-2 text-sm font-medium">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      Company
                    </Label>
                    <Input
                      id="company"
                      placeholder="Company name"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title" className="flex items-center gap-2 text-sm font-medium">
                      <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                      Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="Job title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                </div>

                {/* Interests */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                    Interests
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_INTERESTS.map((interest) => (
                      <Badge
                        key={interest}
                        variant={interests.includes(interest) ? "default" : "outline"}
                        className={cn(
                          "cursor-pointer transition-all text-xs",
                          interests.includes(interest) 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-accent hover:text-accent-foreground"
                        )}
                        onClick={() => handleToggleInterest(interest)}
                      >
                        {interest}
                        {interests.includes(interest) && (
                          <X className="h-3 w-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-medium">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Quick notes about this contact..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleSave}
              disabled={!name.trim()}
            >
              Save Contact
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
