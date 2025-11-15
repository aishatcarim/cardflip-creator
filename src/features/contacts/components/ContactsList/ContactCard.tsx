import { motion } from "framer-motion";
import { NetworkContact } from "../../../store/networkContactsStore";
import { Card } from "@shared/ui/card";
import { Button } from "@shared/ui/button";
import { Edit, Trash2, Download } from "lucide-react";
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

export const ContactCard = ({ contact, index, onEdit, onDelete, onExport }: ContactCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
        >
          <div className="space-y-3">
            {/* Contact Name */}
            <h3 className="font-bold text-lg text-foreground truncate">
              {contact.contactName}
            </h3>

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

            {/* Tagged Date */}
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(contact.taggedAt), {
                addSuffix: true,
              })}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-1 pt-2 border-t border-border/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(contact)}
                className="flex-1"
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onExport(contact.id)}
                className="flex-1"
              >
                <Download className="h-3 w-3 mr-1" />
                vCard
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
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
