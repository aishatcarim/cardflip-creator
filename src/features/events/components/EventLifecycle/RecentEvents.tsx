import { useState } from 'react';
import { Card } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { Progress } from '@shared/ui/progress';
import { Calendar, Users, TrendingUp, MessageSquare, Mail, Target, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface RecentEvent {
  id: string;
  name: string;
  date: string;
  location: string;
  attendees: number;
  contactsCollected: number;
  followUpsSent: number;
  followUpsResponded: number;
  goalProgress: number;
  daysSince: number;
}

interface RecentEventsProps {
  events: RecentEvent[];
  onSendFollowUps: (eventId: string) => void;
}

export const RecentEvents = ({ events, onSendFollowUps }: RecentEventsProps) => {
  const navigate = useNavigate();

  const getFollowUpRate = (sent: number, responded: number) => {
    return sent > 0 ? Math.round((responded / sent) * 100) : 0;
  };

  const getDaysSinceText = (days: number) => {
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  return (
    <div className="space-y-4">
      {events.map((event, index) => {
        const followUpRate = getFollowUpRate(event.followUpsSent, event.followUpsResponded);
        const goalProgress = (event.contactsCollected / (event.attendees * 0.3)) * 100; // Assuming 30% goal

        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-foreground">{event.name}</h3>
                    <Badge variant="outline" className="gap-1">
                      <Calendar className="h-3 w-3" />
                      {getDaysSinceText(event.daysSince)}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {event.attendees} attendees
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/events/${event.id}/analytics`)}
                  >
                    View Analytics
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onSendFollowUps(event.id)}
                    className="gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Send Follow-ups
                  </Button>
                </div>
              </div>

              {/* Post-event Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                {/* Contacts Collected */}
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">Contacts Collected</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{event.contactsCollected}</div>
                  <div className="text-sm text-muted-foreground">
                    {Math.round((event.contactsCollected / event.attendees) * 100)}% of attendees
                  </div>
                </div>

                {/* Follow-up Performance */}
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <MessageSquare className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Follow-up Rate</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{followUpRate}%</div>
                  <div className="text-sm text-muted-foreground">
                    {event.followUpsResponded}/{event.followUpsSent} responses
                  </div>
                </div>

                {/* Goal Achievement */}
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-purple-500" />
                    <span className="font-medium">Goal Progress</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">{Math.round(goalProgress)}%</div>
                  <div className="text-sm text-muted-foreground">
                    Networking target
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Overall Event Success</span>
                  <span>{Math.round((goalProgress + followUpRate) / 2)}%</span>
                </div>
                <Progress value={(goalProgress + followUpRate) / 2} className="h-2" />
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  View Detailed Analytics
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Mail className="h-4 w-4" />
                  Bulk Follow-up Email
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Mark Event Complete
                </Button>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};
