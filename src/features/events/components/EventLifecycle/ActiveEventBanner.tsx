import { useState, useEffect } from 'react';
import { Card } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { Progress } from '@shared/ui/progress';
import { Users, MapPin, Clock, Target, Zap, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ActiveEvent {
  id: string;
  name: string;
  location: string;
  startTime: string;
  endTime: string;
  attendees: number;
  goalContacts: number;
  currentContacts: number;
  timeRemaining: number; // in minutes
}

interface ActiveEventBannerProps {
  event: ActiveEvent | null;
  onDeactivate: () => void;
}

export const ActiveEventBanner = ({ event, onDeactivate }: ActiveEventBannerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(event?.timeRemaining || 0);

  useEffect(() => {
    if (!event) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [event]);

  if (!event) return null;

  const progress = (event.currentContacts / event.goalContacts) * 100;
  const hoursRemaining = Math.floor(timeRemaining / 60);
  const minutesRemaining = timeRemaining % 60;

  const formatTime = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.95 }}
        className="fixed top-20 left-4 right-4 z-40"
      >
        <Card className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white border-0 shadow-2xl">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">🎯 Event Mode Active</h3>
                  <p className="text-white/90">{event.name}</p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={onDeactivate}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {/* Time Remaining */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">Time Left</span>
                </div>
                <div className="text-lg font-bold">
                  {hoursRemaining}h {minutesRemaining}m
                </div>
              </div>

              {/* Current Attendees */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">Attendees</span>
                </div>
                <div className="text-lg font-bold">{event.attendees}</div>
              </div>

              {/* Contacts Progress */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Target className="h-4 w-4" />
                  <span className="text-sm font-medium">Contacts</span>
                </div>
                <div className="text-lg font-bold">
                  {event.currentContacts}/{event.goalContacts}
                </div>
              </div>

              {/* Location */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-medium">Location</span>
                </div>
                <div className="text-sm font-bold truncate">{event.location}</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Networking Goal Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3 bg-white/20" />
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                className="bg-white text-blue-600 hover:bg-white/90 gap-2"
              >
                <Users className="h-4 w-4" />
                Quick Tag Contact
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-white/30 text-white hover:bg-white/10 gap-2"
              >
                <Target className="h-4 w-4" />
                View Goals
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
