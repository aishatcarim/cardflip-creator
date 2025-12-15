import { motion } from "framer-motion";
import { NetworkContact } from "@contacts/store/networkContactsStore";
import { Card } from "@shared/ui/card";
import { Button } from "@shared/ui/button";
import { Badge } from "@shared/ui/badge";
import { Avatar, AvatarFallback } from "@shared/ui/avatar";
import { Edit, Trash2, Download, Clock, Sparkles, Mail, Building2, Briefcase, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@shared/ui/alert-dialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ContactCardProps {
  contact: NetworkContact;
  index: number;
  onEdit: (contact: NetworkContact) => void;
  onDelete: (id: string) => void;
  onExport: (id: string) => void;
}

// Get initials from name
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Generate consistent color from name
const getAvatarColor = (name: string) => {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-cyan-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// Get urgency indicator for contact
const getUrgencyIndicator = (contact: NetworkContact) => {
  const isOverdue = contact.followUpDueDate &&
                   new Date(contact.followUpDueDate) < new Date();

  if (isOverdue) {
    return {
      icon: <Clock className="h-3 w-3" />,
      label: "Overdue",
      variant: "destructive" as const
    };
  }

  const daysUntil = getDaysUntil(contact.followUpDueDate);
  if (daysUntil <= 3 && daysUntil >= 0) {
    return {
      icon: <Clock className="h-3 w-3" />,
      label: "Due Soon",
      variant: "secondary" as const
    };
  }

  const daysSince = getDaysSince(contact.taggedAt);
  if (daysSince <= 2) {
    return {
      icon: <Sparkles className="h-3 w-3" />,
      label: "New",
      variant: "default" as const
    };
  }

  return null;
};

const getDaysSince = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
};

const getDaysUntil = (dateString?: string) => {
  if (!dateString) return Infinity;
  const date = new Date(dateString);
  const now = new Date();
  return Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

export const ContactCard = ({ contact, index, onEdit, onDelete, onExport }: ContactCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const navigate = useNavigate();

  const urgency = getUrgencyIndicator(contact);
  const eventTags = contact.eventTags || [contact.event];

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    navigate(`/contacts/${contact.id}`);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03, duration: 0.2 }}
        className="h-full"
      >
        <Card
          className="group relative overflow-hidden border border-border/50 bg-card hover:border-border hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col"
          onClick={handleCardClick}
        >
          {/* Status indicator line */}
          {urgency && (
            <div className={`absolute top-0 left-0 right-0 h-1 ${
              urgency.variant === 'destructive' ? 'bg-destructive' :
              urgency.variant === 'secondary' ? 'bg-amber-500' : 'bg-primary'
            }`} />
          )}

          <div className="p-4 sm:p-5 flex flex-col flex-1 min-h-[280px]">
            {/* Header */}
            <div className="flex items-start gap-3 sm:gap-4">
              <Avatar className={`h-10 w-10 sm:h-12 sm:w-12 shrink-0 ${getAvatarColor(contact.contactName)}`}>
                <AvatarFallback className="text-white font-semibold">
                  {getInitials(contact.contactName)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      {contact.contactName}
                    </h3>
                    {contact.title && (
                      <p className="text-sm text-muted-foreground truncate">
                        {contact.title}
                      </p>
                    )}
                  </div>
                  {urgency && (
                    <Badge variant={urgency.variant} className="gap-1 shrink-0">
                      {urgency.icon}
                      <span className="hidden sm:inline">{urgency.label}</span>
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Details - Fixed height section */}
            <div className="space-y-2 mt-4 flex-1">
              {contact.company && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4 shrink-0" />
                  <span className="truncate">{contact.company}</span>
                </div>
              )}
              
              {contact.industry && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4 shrink-0" />
                  <span className="truncate">{contact.industry}</span>
                </div>
              )}

              {/* Event Tags */}
              <div className="pt-2">
                <div className="flex flex-wrap gap-1.5">
                  {eventTags.slice(0, 2).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs font-normal bg-muted/50 max-w-[120px] truncate"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {eventTags.length > 2 && (
                    <Badge variant="outline" className="text-xs font-normal">
                      +{eventTags.length - 2}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Interests */}
              {contact.interests.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {contact.interests.slice(0, 2).map((interest) => (
                    <span
                      key={interest}
                      className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary truncate max-w-[100px]"
                    >
                      {interest}
                    </span>
                  ))}
                  {contact.interests.length > 2 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      +{contact.interests.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Notes Preview - truncated to 2 lines */}
            {contact.notes && (
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 italic mt-2">
                "{contact.notes}"
              </p>
            )}

            {/* Footer - Always at bottom */}
            <div className="flex items-center justify-between pt-3 mt-auto border-t border-border/50">
              <span className="text-xs text-muted-foreground">
                Added {formatDistanceToNow(new Date(contact.taggedAt), { addSuffix: true })}
              </span>
              
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {contact.email && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `mailto:${contact.email}`;
                    }}
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(contact);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    onExport(contact.id);
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteDialog(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contact?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {contact.contactName}? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(contact.id);
                setShowDeleteDialog(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};