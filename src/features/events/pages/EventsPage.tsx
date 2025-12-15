import { useState, useMemo } from 'react';
import { AppHeader } from '@shared/components';
import { Dock } from '@shared/components';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, BarChart3, Calendar, Download, Eye, EyeOff, Plus, Sparkles, Play, Clock, TrendingUp, CheckCircle2, AlertCircle, MapPin, ChevronRight, ImageIcon } from 'lucide-react';
import { useEventData } from '../hooks/useEventData';
import { EmptyState } from '@shared/components';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { Progress } from '@shared/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs';
import { MobileTabBar } from '@shared/components';
import { useIsMobile } from '@shared/hooks';
import { useNetworkContactsStore } from '@contacts/store/networkContactsStore';
import { useEventsStore } from '../store/eventsStore';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { AddEventDialog } from '../components/EventActions/AddEventDialog';
import conferenceDefault from '@/assets/event-banners/conference-default.jpg';
import meetupDefault from '@/assets/event-banners/meetup-default.jpg';
import workshopDefault from '@/assets/event-banners/workshop-default.jpg';

type EventTab = "upcoming" | "live" | "past";

const EventsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { exportContactsCSV } = useNetworkContactsStore();
  const { events } = useEventsStore();
  const [activeTab, setActiveTab] = useState<EventTab>('upcoming');
  const [dockVisible, setDockVisible] = useState(true);
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [activeEvent, setActiveEvent] = useState<any>(null);

  const eventData = useEventData();

  // Mock data for Event Lifecycle with banner images
  const mockUpcomingEvents = useMemo(() => [
    {
      id: '1',
      name: 'Tech Startup Meetup',
      date: '2025-12-20T18:00:00Z',
      location: 'Downtown Conference Center',
      expectedAttendees: 150,
      daysUntil: 5,
      bannerUrl: conferenceDefault,
      checklist: [
        { id: '1', task: 'Prepare business cards', completed: true },
        { id: '2', task: 'Research attending companies', completed: false },
        { id: '3', task: 'Set networking goals (10 contacts)', completed: true },
        { id: '4', task: 'Charge phone/camera', completed: false },
        { id: '5', task: 'Plan follow-up email template', completed: true },
      ]
    },
    {
      id: '2',
      name: 'Industry Networking Mixer',
      date: '2025-12-25T19:30:00Z',
      location: 'Riverside Hotel Ballroom',
      expectedAttendees: 200,
      daysUntil: 10,
      bannerUrl: meetupDefault,
      checklist: [
        { id: '1', task: 'Update LinkedIn profile', completed: true },
        { id: '2', task: 'Prepare elevator pitch', completed: false },
        { id: '3', task: 'Research keynote speakers', completed: true },
      ]
    },
    {
      id: '3',
      name: 'AI & Machine Learning Summit',
      date: '2026-01-05T09:00:00Z',
      location: 'Tech Hub Innovation Center',
      expectedAttendees: 300,
      daysUntil: 21,
      bannerUrl: workshopDefault,
      checklist: [
        { id: '1', task: 'Review speaker agenda', completed: false },
        { id: '2', task: 'Book hotel accommodation', completed: true },
        { id: '3', task: 'Prepare questions for Q&A', completed: false },
      ]
    }
  ], []);

  const mockRecentEvents = useMemo(() => [
    {
      id: '4',
      name: 'Developer Conference 2025',
      date: '2025-12-10T09:00:00Z',
      location: 'Convention Center',
      attendees: 500,
      contactsCollected: 45,
      followUpsSent: 35,
      followUpsResponded: 12,
      goalProgress: 75,
      daysSince: 5,
      bannerUrl: conferenceDefault
    },
    {
      id: '5',
      name: 'Startup Pitch Night',
      date: '2025-12-05T18:00:00Z',
      location: 'Innovation Hub',
      attendees: 120,
      contactsCollected: 28,
      followUpsSent: 22,
      followUpsResponded: 8,
      goalProgress: 85,
      daysSince: 10,
      bannerUrl: meetupDefault
    },
    {
      id: '6',
      name: 'Product Design Workshop',
      date: '2025-11-28T14:00:00Z',
      location: 'Design Studio Central',
      attendees: 80,
      contactsCollected: 18,
      followUpsSent: 18,
      followUpsResponded: 11,
      goalProgress: 95,
      daysSince: 18,
      bannerUrl: workshopDefault
    }
  ], []);

  const handleExportReport = () => {
    exportContactsCSV();
    toast.success('Events report exported successfully!');
  };

  const handleActivateEvent = (eventId: string) => {
    const event = mockUpcomingEvents.find(e => e.id === eventId);
    if (event) {
      setActiveEvent({
        ...event,
        startTime: event.date,
        endTime: new Date(new Date(event.date).getTime() + 3 * 60 * 60 * 1000).toISOString(),
        attendees: event.expectedAttendees,
        goalContacts: Math.floor(event.expectedAttendees * 0.3),
        currentContacts: 0,
        timeRemaining: 180
      });
      setActiveTab('live');
      toast.success(`Event Mode activated for ${event.name}!`);
    }
  };

  const handleDeactivateEvent = () => {
    setActiveEvent(null);
    toast.success('Event Mode deactivated');
  };

  const handleSendFollowUps = (eventId: string) => {
    const event = mockRecentEvents.find(e => e.id === eventId);
    if (event) {
      toast.success(`Follow-up emails sent for ${event.name}`);
    }
  };

  const totalContacts = mockRecentEvents.reduce((sum, e) => sum + e.contactsCollected, 0);
  const avgContactsPerEvent = Math.round(totalContacts / mockRecentEvents.length);
  const totalFollowUps = mockRecentEvents.reduce((sum, e) => sum + e.followUpsSent, 0);
  const totalResponses = mockRecentEvents.reduce((sum, e) => sum + e.followUpsResponded, 0);
  const responseRate = Math.round((totalResponses / totalFollowUps) * 100);

  const dockItems = [
    {
      icon: <Home className="h-6 w-6" />,
      label: 'Profile',
      path: '/',
      onClick: () => navigate('/')
    },
    {
      icon: <Users className="h-6 w-6" />,
      label: 'Contacts',
      path: '/contacts',
      onClick: () => navigate('/contacts')
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      label: 'Events',
      path: '/events',
      onClick: () => navigate('/events'),
      className: 'bg-accent/30'
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      label: 'Analytics',
      path: '/analytics',
      onClick: () => navigate('/analytics')
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />

      {/* Active Event Banner */}
      <AnimatePresence>
        {activeEvent && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-primary text-primary-foreground overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                    <span className="font-semibold text-sm">LIVE</span>
                  </div>
                  <div>
                    <p className="font-bold text-lg">{activeEvent.name}</p>
                    <p className="text-sm opacity-90">{activeEvent.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold">{activeEvent.currentContacts}/{activeEvent.goalContacts}</p>
                    <p className="text-xs opacity-90">Contacts</p>
                  </div>
                  <Button
                    onClick={handleDeactivateEvent}
                    variant="secondary"
                    size="sm"
                    className="rounded-full"
                  >
                    End Event
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 container mx-auto px-4 py-6 pb-32 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Events</h1>
            <p className="text-muted-foreground mt-1">
              Plan, attend, and follow up on networking events
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setAddEventOpen(true)}
              className="gap-2 rounded-full"
            >
              <Plus className="h-4 w-4" />
              New Event
            </Button>
            <Button
              onClick={handleExportReport}
              variant="outline"
              className="gap-2 rounded-full"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Events</p>
                <p className="text-3xl font-bold">{mockUpcomingEvents.length + mockRecentEvents.length}</p>
              </div>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Contacts</p>
                <p className="text-3xl font-bold">{avgContactsPerEvent}</p>
              </div>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Response Rate</p>
                <p className="text-3xl font-bold">{responseRate}%</p>
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Next Event</p>
                <p className="text-3xl font-bold">{mockUpcomingEvents[0]?.daysUntil}d</p>
              </div>
              <Clock className="h-5 w-5 text-purple-500" />
            </div>
          </motion.div>
        </div>

        {/* Event Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as EventTab)} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="bg-muted/50 p-1 rounded-full">
              <TabsTrigger
                value="upcoming"
                className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Upcoming
                <Badge variant="outline" className="ml-2 rounded-full h-5 min-w-5 px-1.5">
                  {mockUpcomingEvents.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="live"
                className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Live
                {activeEvent && (
                  <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                )}
              </TabsTrigger>
              <TabsTrigger
                value="past"
                className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Past
                <Badge variant="outline" className="ml-2 rounded-full h-5 min-w-5 px-1.5">
                  {mockRecentEvents.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Upcoming Events */}
          <TabsContent value="upcoming" className="space-y-6">
            {mockUpcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mockUpcomingEvents.map((event, index) => {
                  const completedTasks = event.checklist.filter(c => c.completed).length;
                  const totalTasks = event.checklist.length;
                  const progress = Math.round((completedTasks / totalTasks) * 100);

                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                      className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300"
                    >
                      {/* Banner with Image */}
                      <div className="relative h-36 overflow-hidden">
                        <img 
                          src={event.bannerUrl} 
                          alt={event.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <Badge className="absolute top-3 right-3 bg-background/90 text-foreground border-0 shadow-sm">
                          <Clock className="h-3 w-3 mr-1" />
                          {event.daysUntil}d
                        </Badge>
                        <div className="absolute bottom-3 left-4 right-4">
                          <h3 className="text-lg font-semibold text-white drop-shadow-md line-clamp-1">{event.name}</h3>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5" />
                              <span className="truncate max-w-[180px]">{event.location}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <Users className="h-3.5 w-3.5" />
                              <span>{event.expectedAttendees} attendees</span>
                            </div>
                          </div>
                        </div>

                        {/* Checklist Progress */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Preparation</span>
                            <span className="font-medium text-foreground">{completedTasks}/{totalTasks}</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full transition-all duration-500" 
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-1">
                          <Button
                            onClick={() => handleActivateEvent(event.id)}
                            size="sm"
                            className="flex-1 gap-1.5 h-9"
                            disabled={event.daysUntil > 1}
                          >
                            <Play className="h-3.5 w-3.5" />
                            {event.daysUntil > 1 ? 'Not Ready' : 'Start'}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-9 px-3"
                            onClick={() => navigate(`/events/${event.id}`, { state: { event } })}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={<Calendar className="h-12 w-12 text-muted-foreground" />}
                title="No Upcoming Events"
                description="Plan your next networking event to start building connections."
                action={
                  <Button onClick={() => setAddEventOpen(true)} className="gap-2 rounded-full">
                    <Plus className="h-4 w-4" />
                    Plan Event
                  </Button>
                }
              />
            )}
          </TabsContent>

          {/* Live Event */}
          <TabsContent value="live" className="space-y-6">
            {activeEvent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Event Card */}
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="h-48 relative overflow-hidden">
                    <img 
                      src={activeEvent.bannerUrl || conferenceDefault} 
                      alt={activeEvent.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                          <span className="text-sm font-semibold tracking-wide">LIVE NOW</span>
                        </div>
                        <h2 className="text-3xl font-bold drop-shadow-lg">{activeEvent.name}</h2>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="grid grid-cols-3 gap-6 mb-6">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-foreground">{activeEvent.currentContacts}</p>
                        <p className="text-sm text-muted-foreground mt-1">Contacts Made</p>
                      </div>
                      <div className="text-center">
                        <p className="text-4xl font-bold text-foreground">{activeEvent.goalContacts}</p>
                        <p className="text-sm text-muted-foreground mt-1">Goal</p>
                      </div>
                      <div className="text-center">
                        <p className="text-4xl font-bold text-foreground">{Math.round((activeEvent.currentContacts / activeEvent.goalContacts) * 100)}%</p>
                        <p className="text-sm text-muted-foreground mt-1">Progress</p>
                      </div>
                    </div>

                    <Progress
                      value={(activeEvent.currentContacts / activeEvent.goalContacts) * 100}
                      className="h-3 mb-6"
                    />

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button className="h-20 gap-3" size="lg">
                        <Users className="h-6 w-6" />
                        <div className="text-left">
                          <div className="font-semibold">Quick Tag</div>
                          <div className="text-xs opacity-90">Scan QR code</div>
                        </div>
                      </Button>
                      <Button variant="outline" className="h-20 gap-3" size="lg">
                        <Sparkles className="h-6 w-6" />
                        <div className="text-left">
                          <div className="font-semibold">AI Note</div>
                          <div className="text-xs opacity-90">Remember context</div>
                        </div>
                      </Button>
                      <Button variant="outline" className="h-20 gap-3" size="lg">
                        <Calendar className="h-6 w-6" />
                        <div className="text-left">
                          <div className="font-semibold">Schedule</div>
                          <div className="text-xs opacity-90">Plan follow-up</div>
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <EmptyState
                icon={<Sparkles className="h-12 w-12 text-muted-foreground" />}
                title="No Active Events"
                description="Activate Event Mode when you arrive at your networking event."
                action={
                  mockUpcomingEvents.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-sm font-medium mb-4">Ready to activate:</p>
                      <div className="flex flex-col gap-2">
                        {mockUpcomingEvents.slice(0, 2).map(event => (
                          <Button
                            key={event.id}
                            variant="outline"
                            onClick={() => handleActivateEvent(event.id)}
                            className="gap-2 rounded-full"
                          >
                            <Play className="h-4 w-4" />
                            {event.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )
                }
              />
            )}
          </TabsContent>

          {/* Past Events */}
          <TabsContent value="past" className="space-y-6">
            {mockRecentEvents.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mockRecentEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300"
                  >
                    {/* Banner with Image */}
                    <div className="relative h-36 overflow-hidden">
                      <img 
                        src={event.bannerUrl} 
                        alt={event.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <Badge className="absolute top-3 right-3 bg-background/90 text-foreground border-0 shadow-sm">
                        {event.daysSince}d ago
                      </Badge>
                      <div className="absolute bottom-3 left-4 right-4">
                        <h3 className="text-lg font-semibold text-white drop-shadow-md line-clamp-1">{event.name}</h3>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-4">
                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-2 rounded-lg bg-muted/50">
                          <p className="text-lg font-bold">{event.contactsCollected}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Contacts</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-muted/50">
                          <p className="text-lg font-bold">{event.followUpsSent}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Follow-ups</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-muted/50">
                          <p className="text-lg font-bold">{Math.round((event.followUpsResponded / event.followUpsSent) * 100)}%</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Response</p>
                        </div>
                      </div>

                      {/* Goal Progress */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            {event.goalProgress >= 80 ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                              <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                            )}
                            <span className="text-muted-foreground">Goal progress</span>
                          </div>
                          <span className="font-medium">{event.goalProgress}%</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${event.goalProgress >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${event.goalProgress}%` }}
                          />
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full h-9 gap-1.5"
                        onClick={() => handleSendFollowUps(event.id)}
                      >
                        View Details
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<BarChart3 className="h-12 w-12 text-muted-foreground" />}
                title="No Past Events"
                description="Your completed events and analytics will appear here."
                action={
                  <Button onClick={() => setActiveTab('upcoming')} variant="outline" className="rounded-full">
                    View Upcoming Events
                  </Button>
                }
              />
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Add Event Dialog */}
      <AddEventDialog open={addEventOpen} onOpenChange={setAddEventOpen} />

      {/* Adaptive Navigation */}
      {dockVisible && (
        isMobile ? (
          <MobileTabBar items={dockItems} />
        ) : (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="fixed bottom-4 left-0 right-0 z-50 pointer-events-none"
          >
            <div className="pointer-events-auto">
              <Dock
                items={dockItems}
                activeItem={location.pathname}
                panelHeight={68}
                baseItemSize={50}
                magnification={70}
              />
            </div>
          </motion.div>
        )
      )}

      {/* Dock Visibility Toggle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => setDockVisible(!dockVisible)}
          className="rounded-full shadow-lg bg-background/80 backdrop-blur-sm hover:bg-background"
        >
          {dockVisible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </motion.div>
    </div>
  );
};

export default EventsPage;