import { NetworkContact } from "@contacts/store/networkContactsStore";
import { Card } from "@shared/ui/card";
import { Button } from "@shared/ui/button";
import { Badge } from "@shared/ui/badge";
import { Flame, Clock, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ContactsPriorityQueueProps {
  contacts: NetworkContact[];
}

export const ContactsPriorityQueue = ({ contacts }: ContactsPriorityQueueProps) => {
  const navigate = useNavigate();

  const handleCardClick = (contactId: string) => {
    navigate(`/contacts/${contactId}`);
  };

  const getUrgencyIndicator = (contact: NetworkContact) => {
    const isOverdue = contact.followUpDueDate &&
                     new Date(contact.followUpDueDate) < new Date();

    if (isOverdue) {
      return {
        icon: <Flame className="h-4 w-4" />,
        label: "Overdue",
        variant: "destructive" as const,
        color: "text-destructive"
      };
    }

    const daysUntil = getDaysUntil(contact.followUpDueDate);
    if (daysUntil <= 3) {
      return {
        icon: <Clock className="h-4 w-4" />,
        label: "Due Soon",
        variant: "secondary" as const,
        color: "text-orange-500"
      };
    }

    const daysSince = getDaysSince(contact.taggedAt);
    if (daysSince <= 2) {
      return {
        icon: <Sparkles className="h-4 w-4" />,
        label: "New",
        variant: "default" as const,
        color: "text-blue-500"
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

  // Show only first 4 priority contacts to avoid overwhelming
  const displayContacts = contacts.slice(0, 4);

  return (
    <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
      {displayContacts.map((contact) => {
        const urgency = getUrgencyIndicator(contact);
        const daysSince = getDaysSince(contact.taggedAt);

        return (
          <Card
            key={contact.id}
          className="p-4 min-h-[220px] hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleCardClick(contact.id)}
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold truncate">{contact.contactName}</h3>
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

              {/* Context */}
              <div className="text-xs text-muted-foreground">
                <p>{contact.event}</p>
                <p>{daysSince} days ago</p>
              </div>

              {/* Action */}
              <Button
                className="w-full gap-2"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/contacts/${contact.id}?action=ai-followup`);
                }}
              >
                <Sparkles className="h-4 w-4" />
                AI Follow-Up
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
