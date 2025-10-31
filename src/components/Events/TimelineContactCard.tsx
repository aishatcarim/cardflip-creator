import { motion } from 'framer-motion';
import { Mail, Phone, ExternalLink, Briefcase, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { NetworkContact } from '@/store/networkContactsStore';
import { FollowUpStatusBadge } from './FollowUpStatusBadge';
import { format } from 'date-fns';

interface TimelineContactCardProps {
  contact: NetworkContact;
  onMarkDone: () => void;
  onSnooze: () => void;
  onViewDetails: () => void;
  index: number;
}

export const TimelineContactCard = ({ 
  contact, 
  onMarkDone, 
  onSnooze, 
  onViewDetails,
  index 
}: TimelineContactCardProps) => {
  const initials = contact.contactName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.03 }}
    >
      <Card className="hover:border-primary/50 hover:shadow-md transition-all duration-300 group">
        <CardContent className="p-5">
          <div className="flex gap-4">
            {/* Avatar */}
            <Avatar className="h-14 w-14 flex-shrink-0 ring-2 ring-background group-hover:ring-primary/20 transition-all">
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-2">
              {/* Name & Title */}
              <div>
                <h3 className="font-semibold text-base truncate">{contact.contactName}</h3>
                {(contact.title || contact.company) && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1 truncate">
                    <Briefcase className="h-3 w-3 flex-shrink-0" />
                    {contact.title && <span>{contact.title}</span>}
                    {contact.title && contact.company && <span>•</span>}
                    {contact.company && <span>{contact.company}</span>}
                  </p>
                )}
              </div>

              {/* Contact Info */}
              <div className="flex flex-wrap gap-2 text-xs">
                {contact.email && (
                  <a 
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Mail className="h-3 w-3" />
                    <span className="truncate max-w-[150px]">{contact.email}</span>
                  </a>
                )}
                {contact.phone && (
                  <a 
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Phone className="h-3 w-3" />
                    <span>{contact.phone}</span>
                  </a>
                )}
              </div>

              {/* Status Badge & Date */}
              <div className="flex items-center justify-between gap-2">
                <FollowUpStatusBadge
                  status={contact.followUpStatus}
                  dueDate={contact.followUpDueDate}
                  completedDate={contact.followUpDate}
                  snoozedUntil={contact.snoozedUntil}
                />
                <span className="text-xs text-muted-foreground">
                  Tagged {format(new Date(contact.taggedAt), 'MMM d')}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                {contact.followUpStatus !== 'done' && (
                  <Button 
                    onClick={onMarkDone}
                    size="sm" 
                    variant="outline"
                    className="flex-1 hover:bg-green-500/10 hover:text-green-600 hover:border-green-500/50 transition-colors"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                    Mark Done
                  </Button>
                )}
                {contact.followUpStatus !== 'snoozed' && contact.followUpStatus !== 'done' && (
                  <Button 
                    onClick={onSnooze}
                    size="sm" 
                    variant="outline"
                    className="flex-1 hover:bg-blue-500/10 hover:text-blue-600 hover:border-blue-500/50 transition-colors"
                  >
                    Snooze
                  </Button>
                )}
                <Button 
                  onClick={onViewDetails}
                  size="sm" 
                  variant="ghost"
                  className="hover:bg-primary/10"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
