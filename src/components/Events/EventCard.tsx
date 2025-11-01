import { motion } from 'framer-motion';
import { Calendar, Users, CheckCircle2, Clock, Moon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { EventData } from '@/hooks/useEventData';
import defaultBanner from '@/assets/event-banners/default-banner.jpg';

interface EventCardProps {
  event: EventData;
  onViewTimeline: () => void;
  index: number;
}

export const EventCard = ({ event, onViewTimeline, index }: EventCardProps) => {
  const getProgressColor = (rate: number) => {
    if (rate >= 80) return 'bg-green-500';
    if (rate >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const totalWithFollowUp = event.contactCount - event.followUpStats.none;
  const hasFollowUps = totalWithFollowUp > 0;

  // Get first 5 contacts for avatar display
  const displayContacts = event.contacts.slice(0, 5);
  const remainingCount = event.contactCount - 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, boxShadow: '0 20px 40px -15px rgba(0,0,0,0.15)' }}
    >
      <Card className="cursor-pointer hover:border-primary/50 transition-all overflow-hidden group">
        {/* Banner Image */}
        <div className="relative h-32 overflow-hidden">
          <motion.img
            src={event.bannerUrl || defaultBanner}
            alt={event.eventName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4">
            <h3 className="text-white font-bold text-lg line-clamp-2 drop-shadow-lg">
              {event.eventName}
            </h3>
          </div>
        </div>

        <CardContent className="pt-4 space-y-4">
          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(event.mostRecentDate), 'MMMM d, yyyy')}</span>
          </div>

          {/* Avatar Group */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {displayContacts.map((contact, idx) => {
                const initials = contact.contactName
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2);
                
                return (
                  <Avatar 
                    key={contact.id} 
                    className="h-9 w-9 border-2 border-background ring-2 ring-background"
                  >
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                );
              })}
              {remainingCount > 0 && (
                <Avatar className="h-9 w-9 border-2 border-background ring-2 ring-background">
                  <AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold">
                    +{remainingCount}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{event.contactCount}</span>
              <span className="text-muted-foreground">contacts</span>
            </div>
          </div>

          {/* Follow-up Stats */}
          {hasFollowUps ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Follow-up progress</span>
                <span className="font-semibold text-primary">{Math.round(event.completionRate)}%</span>
              </div>
              
              {/* Progress Bar */}
              <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${event.completionRate}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.3, ease: "easeOut" }}
                  className={`h-full ${getProgressColor(event.completionRate)} rounded-full`}
                />
              </div>

              {/* Status Breakdown */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex flex-col items-center gap-1 px-2 py-2 rounded-md bg-green-500/10">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                    <span className="font-bold text-green-600">{event.followUpStats.done}</span>
                  </div>
                  <span className="text-[10px] text-green-600 font-medium">Done</span>
                </div>
                <div className="flex flex-col items-center gap-1 px-2 py-2 rounded-md bg-yellow-500/10">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-yellow-500" />
                    <span className="font-bold text-yellow-600">{event.followUpStats.pending}</span>
                  </div>
                  <span className="text-[10px] text-yellow-600 font-medium">Pending</span>
                </div>
                <div className="flex flex-col items-center gap-1 px-2 py-2 rounded-md bg-blue-500/10">
                  <div className="flex items-center gap-1">
                    <Moon className="h-3.5 w-3.5 text-blue-500" />
                    <span className="font-bold text-blue-600">{event.followUpStats.snoozed}</span>
                  </div>
                  <span className="text-[10px] text-blue-600 font-medium">Snoozed</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground py-2 text-center bg-muted/30 rounded-md">
              No follow-ups tracked yet
            </div>
          )}

          {/* View Timeline Button */}
          <Button 
            onClick={onViewTimeline}
            variant="outline" 
            className="w-full mt-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          >
            View Timeline
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
