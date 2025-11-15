import { NetworkContact } from "@contacts/store/networkContactsStore";
import { Card } from "@shared/ui/card";
import { Badge } from "@shared/ui/badge";
import { Calendar, MessageSquare, Star, Clock, CheckCircle, AlertTriangle } from "lucide-react";

interface ContactActivityProps {
  contact: NetworkContact;
}

export const ContactActivity = ({ contact }: ContactActivityProps) => {
  const getDaysSinceContact = () => {
    const taggedDate = new Date(contact.taggedAt);
    const now = new Date();
    return Math.floor((now.getTime() - taggedDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getFollowUpStatus = () => {
    if (!contact.followUpStatus || contact.followUpStatus === 'none') {
      return { label: 'No follow-up set', color: 'text-muted-foreground', icon: Clock };
    }

    switch (contact.followUpStatus) {
      case 'done':
        return { label: 'Follow-up completed', color: 'text-green-600', icon: CheckCircle };
      case 'pending':
        return { label: 'Follow-up pending', color: 'text-orange-600', icon: AlertTriangle };
      case 'snoozed':
        return { label: 'Follow-up snoozed', color: 'text-blue-600', icon: Clock };
      default:
        return { label: 'Unknown status', color: 'text-muted-foreground', icon: Clock };
    }
  };

  const status = getFollowUpStatus();
  const StatusIcon = status.icon;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Activity Summary</h3>

        {/* Last Contact */}
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <div className="p-2 bg-primary/10 rounded-full">
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Last Contact</p>
            <p className="text-xs text-muted-foreground">
              {getDaysSinceContact()} days ago
            </p>
          </div>
        </div>

        {/* Follow-up Status */}
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <div className={`p-2 rounded-full ${status.color.includes('green') ? 'bg-green-100' :
                                           status.color.includes('orange') ? 'bg-orange-100' :
                                           status.color.includes('blue') ? 'bg-blue-100' : 'bg-muted'}`}>
            <StatusIcon className={`h-4 w-4 ${status.color}`} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Follow-up Status</p>
            <p className={`text-xs ${status.color}`}>
              {status.label}
            </p>
            {contact.followUpDueDate && (
              <p className="text-xs text-muted-foreground mt-1">
                Due: {new Date(contact.followUpDueDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Notes Preview */}
        {contact.notes && (
          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="p-2 bg-purple-100 rounded-full">
              <MessageSquare className="h-4 w-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Meeting Notes</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-3">
                {contact.notes}
              </p>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-lg font-bold text-foreground">
              {contact.interests.length}
            </div>
            <div className="text-xs text-muted-foreground">Interests</div>
          </div>

          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-lg font-bold text-foreground">
              {getDaysSinceContact()}
            </div>
            <div className="text-xs text-muted-foreground">Days Since</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
