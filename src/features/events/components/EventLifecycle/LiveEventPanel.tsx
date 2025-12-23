import { useState, useEffect } from 'react';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { Progress } from '@shared/ui/progress';
import { 
  Users, 
  MapPin, 
  Clock, 
  Target, 
  Sparkles, 
  QrCode, 
  Calendar, 
  Plus,
  CheckCircle2,
  Timer,
  TrendingUp,
  X,
  Play,
  UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@lib/utils';
import { Card } from '@shared/ui/card';
import conferenceDefault from '@/assets/event-banners/conference-default.jpg';
import { QuickTagDialog } from './QuickTagDialog';
import { ScheduleFollowUpDialog } from './ScheduleFollowUpDialog';
import { useNetworkContactsStore } from '@/features/contacts/store/networkContactsStore';

interface ActiveEvent {
  id: string;
  name: string;
  location: string;
  bannerUrl?: string;
  startTime: string;
  endTime: string;
  attendees: number;
  goalContacts: number;
  currentContacts: number;
  timeRemaining: number;
}

interface UpcomingEvent {
  id: string;
  name: string;
  date: string;
  location: string;
  expectedAttendees: number;
  daysUntil: number;
  bannerUrl?: string;
}

interface LiveEventPanelProps {
  activeEvent: ActiveEvent | null;
  upcomingEvents: UpcomingEvent[];
  onActivateEvent: (eventId: string) => void;
  onDeactivateEvent: () => void;
  onAddContact: () => void;
}

export const LiveEventPanel = ({
  activeEvent,
  upcomingEvents,
  onActivateEvent,
  onDeactivateEvent,
  onAddContact,
}: LiveEventPanelProps) => {
  const [contactCount, setContactCount] = useState(activeEvent?.currentContacts || 0);
  const [timeRemaining, setTimeRemaining] = useState(activeEvent?.timeRemaining || 0);
  const [showQuickNote, setShowQuickNote] = useState(false);
  const [quickNote, setQuickNote] = useState('');
  const [showQuickTagDialog, setShowQuickTagDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [sessionContacts, setSessionContacts] = useState<Array<{ name: string; time: string }>>([]);

  const { addContact, bulkUpdateFollowUpStatus, contacts } = useNetworkContactsStore();

  useEffect(() => {
    if (activeEvent) {
      setContactCount(activeEvent.currentContacts);
      setTimeRemaining(activeEvent.timeRemaining);
    }
  }, [activeEvent]);

  useEffect(() => {
    if (!activeEvent || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 60000);

    return () => clearInterval(interval);
  }, [activeEvent, timeRemaining]);

  const handleQuickTag = () => {
    setShowQuickTagDialog(true);
  };

  const handleSaveContact = (contactData: {
    contactName: string;
    email?: string;
    phone?: string;
    company?: string;
    title?: string;
    notes: string;
    interests: string[];
  }) => {
    if (!activeEvent) return;

    addContact({
      profileCardId: '',
      contactName: contactData.contactName,
      email: contactData.email,
      phone: contactData.phone,
      company: contactData.company,
      title: contactData.title,
      event: activeEvent.name,
      eventTags: [activeEvent.name],
      industry: contactData.interests[0] || 'General',
      interests: contactData.interests,
      notes: contactData.notes,
      isQuickTag: true,
      followUpStatus: 'pending',
      followUpDueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });

    setContactCount(prev => prev + 1);
    setSessionContacts(prev => [
      { name: contactData.contactName, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ...prev.slice(0, 4),
    ]);

    toast.success('Contact added!', {
      description: `${contactData.contactName} saved to your network`,
      icon: <UserPlus className="h-4 w-4" />,
    });
    onAddContact();
  };

  const handleSaveNote = () => {
    if (quickNote.trim()) {
      toast.success('Note saved!', {
        description: 'Context added to current event',
      });
      setQuickNote('');
      setShowQuickNote(false);
    }
  };

  const handleScheduleFollowUp = (data: {
    date: Date;
    time: string;
    reminder: string;
    notes: string;
  }) => {
    if (!activeEvent) return;

    // Get contacts from this event that need follow-up
    const eventContacts = contacts.filter(
      c => c.event === activeEvent.name && c.followUpStatus === 'pending'
    );

    if (eventContacts.length > 0) {
      bulkUpdateFollowUpStatus(
        eventContacts.map(c => c.id),
        'pending'
      );
    }

    toast.success('Follow-up scheduled!', {
      description: `Reminder set for ${data.date.toLocaleDateString()} at ${data.time}`,
      icon: <Calendar className="h-4 w-4" />,
    });
  };

  const formatTime = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const goalProgress = activeEvent 
    ? Math.min(100, Math.round((contactCount / activeEvent.goalContacts) * 100))
    : 0;

  if (!activeEvent) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        {/* Empty State Header */}
        <div className="text-center py-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4"
          >
            <Sparkles className="h-10 w-10 text-muted-foreground" />
          </motion.div>
          <h2 className="text-2xl font-bold text-foreground mb-2">No Active Event</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Activate Event Mode when you arrive at your networking event to start tracking contacts and progress.
          </p>
        </div>

        {/* Ready to Activate */}
        {upcomingEvents.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide text-center">
              Ready to Activate
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {upcomingEvents.slice(0, 4).map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Card className="group overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-200 cursor-pointer">
                    <div className="relative h-24 overflow-hidden">
                      <img
                        src={event.bannerUrl || conferenceDefault}
                        alt={event.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-2 left-3 right-3">
                        <p className="text-white font-semibold text-sm line-clamp-1">{event.name}</p>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className="absolute top-2 right-2 bg-background/90 text-xs"
                      >
                        {event.daysUntil === 0 ? 'Today' : `${event.daysUntil}d`}
                      </Badge>
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate max-w-[120px]">{event.location}</span>
                      </div>
                      <Button
                        size="sm"
                        className="h-7 px-3 text-xs gap-1.5"
                        onClick={() => onActivateEvent(event.id)}
                      >
                        <Play className="h-3 w-3" />
                        Start
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Main Event Card */}
      <Card className="overflow-hidden border-primary/20 shadow-xl">
        {/* Banner */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={activeEvent.bannerUrl || conferenceDefault}
            alt={activeEvent.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
          
          {/* Live Badge */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-4 left-4"
          >
            <Badge className="bg-red-500 text-white border-0 gap-1.5 px-3 py-1 shadow-lg">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              LIVE NOW
            </Badge>
          </motion.div>

          {/* End Event Button */}
          <Button
            size="sm"
            variant="secondary"
            onClick={onDeactivateEvent}
            className="absolute top-4 right-4 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background gap-1.5"
          >
            <X className="h-3.5 w-3.5" />
            End Event
          </Button>

          {/* Event Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1 drop-shadow-lg">
              {activeEvent.name}
            </h2>
            <div className="flex items-center gap-4 text-white/90 text-sm">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {activeEvent.location}
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {activeEvent.attendees} attendees
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {/* Contacts Made */}
            <motion.div
              key={contactCount}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-center p-4 rounded-xl bg-primary/5 border border-primary/10"
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <p className="text-3xl md:text-4xl font-bold text-foreground">{contactCount}</p>
              <p className="text-xs text-muted-foreground mt-1">Contacts Made</p>
            </motion.div>

            {/* Goal */}
            <div className="text-center p-4 rounded-xl bg-muted/30">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Target className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-3xl md:text-4xl font-bold text-foreground">{activeEvent.goalContacts}</p>
              <p className="text-xs text-muted-foreground mt-1">Goal</p>
            </div>

            {/* Time Remaining */}
            <div className="text-center p-4 rounded-xl bg-muted/30">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Timer className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-3xl md:text-4xl font-bold text-foreground">{formatTime(timeRemaining)}</p>
              <p className="text-xs text-muted-foreground mt-1">Time Left</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Networking Goal</span>
              <span className={cn(
                "font-semibold",
                goalProgress >= 100 ? "text-green-500" : "text-foreground"
              )}>
                {goalProgress}%
              </span>
            </div>
            <Progress 
              value={goalProgress} 
              className={cn(
                "h-3",
                goalProgress >= 100 && "[&>div]:bg-green-500"
              )}
            />
            {goalProgress >= 100 && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-green-600 flex items-center gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4" />
                Goal achieved! Keep networking!
              </motion.p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              size="lg"
              className="h-16 gap-3 text-left justify-start"
              onClick={handleQuickTag}
            >
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">Quick Tag</div>
                <div className="text-xs opacity-80">Add new contact</div>
              </div>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="h-16 gap-3 text-left justify-start"
              onClick={() => setShowQuickNote(!showQuickNote)}
            >
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <div className="font-semibold">Quick Note</div>
                <div className="text-xs text-muted-foreground">Remember context</div>
              </div>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="h-16 gap-3 text-left justify-start"
              onClick={() => setShowScheduleDialog(true)}
            >
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <div className="font-semibold">Schedule</div>
                <div className="text-xs text-muted-foreground">Plan follow-up</div>
              </div>
            </Button>
          </div>

          {/* Quick Note Input */}
          <AnimatePresence>
            {showQuickNote && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-3">
                  <textarea
                    value={quickNote}
                    onChange={(e) => setQuickNote(e.target.value)}
                    placeholder="Add a quick note about the event or a contact..."
                    className="w-full h-20 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowQuickNote(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveNote}
                      disabled={!quickNote.trim()}
                    >
                      Save Note
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

      {/* Tips Section */}
      <Card className="p-4 bg-accent/5 border-accent/10">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="h-4 w-4 text-accent-foreground" />
          </div>
          <div>
            <p className="font-medium text-sm text-foreground">Pro Tip</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Aim to have meaningful 3-5 minute conversations. Quality connections lead to better follow-up rates.
            </p>
          </div>
        </div>
      </Card>

      {/* Recent Session Contacts */}
      {sessionContacts.length > 0 && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-primary" />
            Recent Contacts
          </h3>
          <div className="space-y-2">
            {sessionContacts.map((contact, index) => (
              <motion.div
                key={`${contact.name}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30"
              >
                <span className="text-sm font-medium text-foreground">{contact.name}</span>
                <span className="text-xs text-muted-foreground">{contact.time}</span>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Tag Dialog */}
      <QuickTagDialog
        open={showQuickTagDialog}
        onOpenChange={setShowQuickTagDialog}
        eventName={activeEvent?.name || ''}
        onSave={handleSaveContact}
      />

      {/* Schedule Follow-up Dialog */}
      <ScheduleFollowUpDialog
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
        eventName={activeEvent?.name || ''}
        contactCount={contactCount}
        onSchedule={handleScheduleFollowUp}
      />
    </motion.div>
  );
};
