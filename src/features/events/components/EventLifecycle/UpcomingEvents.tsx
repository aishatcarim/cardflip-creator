import { useState } from 'react';
import { Card } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { Checkbox } from '@shared/ui/checkbox';
import { Calendar, Clock, CheckCircle, Users, MapPin, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface UpcomingEvent {
  id: string;
  name: string;
  date: string;
  location: string;
  expectedAttendees: number;
  checklist: {
    id: string;
    task: string;
    completed: boolean;
  }[];
  daysUntil: number;
}

interface UpcomingEventsProps {
  events: UpcomingEvent[];
  onActivateEvent: (eventId: string) => void;
}

export const UpcomingEvents = ({ events, onActivateEvent }: UpcomingEventsProps) => {
  const navigate = useNavigate();

  const updateChecklistItem = (eventId: string, itemId: string, completed: boolean) => {
    // This would normally update the store
    console.log('Updating checklist:', eventId, itemId, completed);
  };

  const getDaysUntilText = (days: number) => {
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `${days} days`;
  };

  return (
    <div className="space-y-4">
      {events.map((event, index) => {
        const completedTasks = event.checklist.filter(item => item.completed).length;
        const totalTasks = event.checklist.length;
        const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

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
                    <Badge
                      variant={event.daysUntil <= 1 ? 'destructive' : event.daysUntil <= 3 ? 'secondary' : 'outline'}
                      className="gap-1"
                    >
                      <Clock className="h-3 w-3" />
                      {getDaysUntilText(event.daysUntil)}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {event.expectedAttendees} expected
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onActivateEvent(event.id)}
                    className="gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Activate Event Mode
                  </Button>
                </div>
              </div>

              {/* Pre-event Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground">Pre-Event Checklist</h4>
                  <span className="text-sm text-muted-foreground">
                    {completedTasks}/{totalTasks} completed
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Checklist Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {event.checklist.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={(checked) =>
                          updateChecklistItem(event.id, item.id, checked as boolean)
                        }
                      />
                      <span className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {item.task}
                      </span>
                      {item.completed && <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};
