import { motion } from 'framer-motion';
import { Calendar, Users, CheckCircle2, Clock, Moon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { EventData } from '@/hooks/useEventData';

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.2)' }}
    >
      <Card className="cursor-pointer hover:border-primary/50 transition-all">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-start justify-between">
            <span className="line-clamp-2">{event.eventName}</span>
            <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {format(new Date(event.mostRecentDate), 'MMM d, yyyy')}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Contact Count */}
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{event.contactCount} contacts</span>
          </div>

          {/* Follow-up Stats */}
          {hasFollowUps ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Follow-up progress</span>
                <span className="font-semibold">{Math.round(event.completionRate)}%</span>
              </div>
              
              {/* Progress Bar */}
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${event.completionRate}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                  className={`h-full ${getProgressColor(event.completionRate)}`}
                />
              </div>

              {/* Status Breakdown */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  <span>{event.followUpStats.done} done</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-yellow-500" />
                  <span>{event.followUpStats.pending} pending</span>
                </div>
                <div className="flex items-center gap-1">
                  <Moon className="h-3 w-3 text-blue-500" />
                  <span>{event.followUpStats.snoozed} snoozed</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground py-2">
              No follow-ups tracked yet
            </div>
          )}

          {/* View Timeline Button */}
          <Button 
            onClick={onViewTimeline}
            variant="outline" 
            className="w-full mt-2"
          >
            View Timeline
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
