import { motion } from "framer-motion";
import { NetworkContact } from "@contacts/store/networkContactsStore";
import { Card } from "@shared/ui/card";
import { Button } from "@shared/ui/button";
import { Badge } from "@shared/ui/badge";
import { Edit, Trash2, Download, Flame, Clock, Sparkles, Sparkles as AIFollowUp, Mail, Linkedin } from "lucide-react";
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

// Generate consistent color from event name
const getEventColor = (event: string) => {
  const colors = [
    "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800",
    "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800",
    "bg-purple-50 border-purple-200 dark:bg-purple-950/30 dark:border-purple-800",
    "bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800",
    "bg-pink-50 border-pink-200 dark:bg-pink-950/30 dark:border-pink-800",
    "bg-cyan-50 border-cyan-200 dark:bg-cyan-950/30 dark:border-cyan-800",
  ];
  
  let hash = 0;
  for (let i = 0; i < event.length; i++) {
    hash = event.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const getEventTextColor = (event: string) => {
  const colors = [
    "text-blue-700 dark:text-blue-300",
    "text-green-700 dark:text-green-300",
    "text-purple-700 dark:text-purple-300",
    "text-orange-700 dark:text-orange-300",
    "text-pink-700 dark:text-pink-300",
    "text-cyan-700 dark:text-cyan-300",
  ];
  
  let hash = 0;
  for (let i = 0; i < event.length; i++) {
    hash = event.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// Get urgency indicator for contact
const getUrgencyIndicator = (contact: NetworkContact) => {
  const isOverdue = contact.followUpDueDate &&
                   new Date(contact.followUpDueDate) < new Date();

  if (isOverdue) {
    return {
      icon: <Flame className="h-3 w-3" />,
      label: "Overdue",
      variant: "destructive" as const
    };
  }

  const daysUntil = getDaysUntil(contact.followUpDueDate);
  if (daysUntil <= 3) {
    return {
      icon: <Clock className="h-3 w-3" />,
      label: "Due Soon",
      variant: "warning" as const
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
  const daysSince = getDaysSince(contact.taggedAt);

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on buttons
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
        transition={{ delay: index * 0.05, duration: 0.3 }}
      >
        <Card
          className={`p-4 h-full hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer ${getEventColor(
            contact.event
          )}`}
          onClick={handleCardClick}
        >
          <div className="space-y-3">
            {/* Header with Status Badge */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-foreground truncate">
                  {contact.contactName}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  {contact.company}
                </p>
              </div>
              {urgency && (
                <Badge variant={urgency.variant} className="gap-1">
                  {urgency.icon}
                  {urgency.label}
                </Badge>
              )}
            </div>

            {/* Event Badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${getEventTextColor(
                  contact.event
                )} bg-background/50`}
              >
                📅 {contact.event}
              </span>
            </div>

            {/* Industry */}
            {contact.industry && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <span>💼</span>
                {contact.industry}
              </p>
            )}

            {/* Company */}
            {contact.company && (
              <p className="text-sm text-muted-foreground">
                🏢 {contact.company}
              </p>
            )}

            {/* Interests */}
            {contact.interests.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {contact.interests.slice(0, 3).map((interest) => (
                  <span
                    key={interest}
                    className="text-xs px-2 py-0.5 rounded bg-background/60 text-muted-foreground"
                  >
                    {interest}
                  </span>
                ))}
                {contact.interests.length > 3 && (
                  <span className="text-xs px-2 py-0.5 rounded bg-background/60 text-muted-foreground">
                    +{contact.interests.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Notes Preview */}
            {contact.notes && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {contact.notes}
              </p>
            )}

            {/* Context & Date */}
            <div className="text-xs text-muted-foreground">
              <p>{contact.event} • {daysSince} days ago</p>
              {contact.notes && (
                <p className="line-clamp-2 mt-1 italic">
                  "{contact.notes.substring(0, 60)}{contact.notes.length > 60 ? '...' : ''}"
                </p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 pt-3 border-t border-border/50">
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/contacts/${contact.id}?action=ai-followup`);
                }}
                className="gap-1 flex-1"
              >
                <AIFollowUp className="h-3 w-3" />
                AI Follow-Up
              </Button>

              {contact.email && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `mailto:${contact.email}`;
                  }}
                  className="gap-1"
                >
                  <Mail className="h-3 w-3" />
                </Button>
              )}

              {contact.quickLinks?.find(link => link.icon === 'Linkedin') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    const linkedin = contact.quickLinks.find(link => link.icon === 'Linkedin');
                    if (linkedin) window.open(linkedin.url, '_blank');
                  }}
                  className="gap-1"
                >
                  <Linkedin className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Secondary Actions */}
            <div className="flex items-center gap-1 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(contact);
                }}
                className="flex-1"
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onExport(contact.id);
                }}
                className="flex-1"
              >
                <Download className="h-3 w-3 mr-1" />
                Export
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteDialog(true);
                }}
                className="flex-1 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
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
