import { useState, useMemo } from 'react';
import { AppHeader } from '@shared/components';
import { Dock } from '@shared/components';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, CreditCard, Users, BarChart3, Calendar, Download, Eye, EyeOff, Plus, Sparkles, Play } from 'lucide-react';
import { useEventData } from '../hooks/useEventData';
import { UpcomingEvents } from '../components/EventLifecycle/UpcomingEvents';
import { ActiveEventBanner } from '../components/EventLifecycle/ActiveEventBanner';
import { RecentEvents } from '../components/EventLifecycle/RecentEvents';
import { EventInsights } from '../components/EventLifecycle/EventInsights';
import { EmptyState } from '@shared/components';
import { Button } from '@shared/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs';
import { MobileTabBar } from '@shared/components';
import { useIsMobile } from '@shared/hooks';
import { useNetworkContactsStore } from '@contacts/store/networkContactsStore';
import { useEventsStore } from '../store/eventsStore';
import { toast } from 'sonner';
import { EventData } from '../hooks/useEventData';
import { motion } from 'framer-motion';
import { AddEventDialog } from '../components/EventActions/AddEventDialog';

const EventsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { exportContactsCSV } = useNetworkContactsStore();
  const { events } = useEventsStore();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [dockVisible, setDockVisible] = useState(true);
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [activeEvent, setActiveEvent] = useState<any>(null); // Active event mode

  const eventData = useEventData();

  // Mock data for Event Lifecycle - in real app this would come from store
  const mockUpcomingEvents = useMemo(() => [
    {
      id: '1',
      name: 'Tech Startup Meetup',
      date: '2025-11-20T18:00:00Z',
      location: 'Downtown Conference Center',
      expectedAttendees: 150,
      daysUntil: 2,
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
      date: '2025-11-25T19:30:00Z',
      location: 'Riverside Hotel Ballroom',
      expectedAttendees: 200,
      daysUntil: 7,
      checklist: [
        { id: '1', task: 'Update LinkedIn profile', completed: true },
        { id: '2', task: 'Prepare elevator pitch', completed: false },
        { id: '3', task: 'Research keynote speakers', completed: true },
      ]
    }
  ], []);

  const mockRecentEvents = useMemo(() => [
    {
      id: '3',
      name: 'Developer Conference 2025',
      date: '2025-11-10T09:00:00Z',
      location: 'Convention Center',
      attendees: 500,
      contactsCollected: 45,
      followUpsSent: 35,
      followUpsResponded: 12,
      goalProgress: 75,
      daysSince: 5
    },
    {
      id: '4',
      name: 'Startup Pitch Night',
      date: '2025-11-05T18:00:00Z',
      location: 'Innovation Hub',
      attendees: 120,
      contactsCollected: 28,
      followUpsSent: 22,
      followUpsResponded: 8,
      goalProgress: 85,
      daysSince: 10
    }
  ], []);

  // Event Lifecycle categorization
  const categorizedEvents = useMemo(() => {
    const now = new Date();
    const upcoming: any[] = [];
    const active: any = null; // Only one active at a time
    const recent: any[] = [];

    eventData.forEach(event => {
      const eventDate = new Date(event.eventDate);
      const daysDiff = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (activeEvent && activeEvent.id === event.id) {
        // Currently active
      } else if (daysDiff > 0 && daysDiff <= 30) {
        upcoming.push({
          ...event,
          daysUntil: daysDiff,
          checklist: [] // Would come from store
        });
      } else if (daysDiff < 0 && daysDiff >= -30) {
        recent.push({
          ...event,
          daysSince: Math.abs(daysDiff),
          contactsCollected: Math.floor(Math.random() * 50) + 10, // Mock data
          followUpsSent: Math.floor(Math.random() * 40) + 5,
          followUpsResponded: Math.floor(Math.random() * 15) + 2,
          goalProgress: Math.floor(Math.random() * 40) + 60,
        });
      }
    });

    return { upcoming, active, recent };
  }, [eventData, activeEvent]);

  const handleExportReport = () => {
    exportContactsCSV();
    toast.success('Events report exported successfully!');
  };

  const handleActivateEvent = (eventId: string) => {
    const event = mockUpcomingEvents.find(e => e.id === eventId);
    if (event) {
      setActiveEvent({
        id: event.id,
        name: event.name,
        location: event.location,
        startTime: event.date,
        endTime: new Date(new Date(event.date).getTime() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours later
        attendees: event.expectedAttendees,
        goalContacts: Math.floor(event.expectedAttendees * 0.3), // 30% goal
        currentContacts: 0,
        timeRemaining: 180 // 3 hours in minutes
      });
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
      <ActiveEventBanner
        event={activeEvent}
        onDeactivate={handleDeactivateEvent}
      />

      <main className="flex-1 container mx-auto px-4 py-6 pb-32 space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Event Lifecycle</h1>
            <p className="text-muted-foreground mt-1">
              Plan, attend, and follow up on your networking events
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setAddEventOpen(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Plan Event
            </Button>
            <Button
              onClick={handleExportReport}
              variant="outline"
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Event Insights Dashboard */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <EventInsights
            totalEvents={eventData.length + mockUpcomingEvents.length + mockRecentEvents.length}
            upcomingEvents={mockUpcomingEvents.length}
            recentEvents={mockRecentEvents.length}
            avgAttendees={Math.round((150 + 200 + 500 + 120) / 4)}
            avgContactsPerEvent={Math.round((45 + 28) / 2)}
            followUpRate={Math.round((12 + 8) / (35 + 22) * 100)}
            networkingGoalProgress={68}
          />
        </motion.section>

        {/* Event Lifecycle Tabs */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming" className="gap-2">
                <Calendar className="h-4 w-4" />
                Upcoming ({mockUpcomingEvents.length})
              </TabsTrigger>
              <TabsTrigger value="active" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Active {activeEvent && '🎯'}
              </TabsTrigger>
              <TabsTrigger value="recent" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Recent ({mockRecentEvents.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-6">
              {mockUpcomingEvents.length > 0 ? (
                <UpcomingEvents
                  events={mockUpcomingEvents}
                  onActivateEvent={handleActivateEvent}
                />
              ) : (
                <EmptyState
                  icon="📅"
                  title="No Upcoming Events"
                  description="Plan your next networking event to start building connections and tracking your progress."
                  action={
                    <Button onClick={() => setAddEventOpen(true)} size="lg" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Plan Your First Event
                    </Button>
                  }
                />
              )}
            </TabsContent>

            <TabsContent value="active" className="mt-6">
              {activeEvent ? (
                <div className="space-y-6">
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Sparkles className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Event Mode Active!
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      You're currently attending <strong>{activeEvent.name}</strong>.
                      The banner above shows your progress and quick actions.
                    </p>
                  </div>

                  {/* Quick Actions During Event */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button className="h-24 gap-3" size="lg">
                      <Users className="h-6 w-6" />
                      <div className="text-left">
                        <div className="font-semibold">Quick Tag</div>
                        <div className="text-sm opacity-90">Scan QR code</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="h-24 gap-3" size="lg">
                      <Sparkles className="h-6 w-6" />
                      <div className="text-left">
                        <div className="font-semibold">AI Note</div>
                        <div className="text-sm opacity-90">Remember context</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="h-24 gap-3" size="lg">
                      <Calendar className="h-6 w-6" />
                      <div className="text-left">
                        <div className="font-semibold">Schedule</div>
                        <div className="text-sm opacity-90">Plan follow-up</div>
                      </div>
                    </Button>
                  </div>
                </div>
              ) : (
                <EmptyState
                  icon="⏸️"
                  title="No Active Events"
                  description="Activate Event Mode when you arrive at your next networking event to track progress and get quick actions."
                  action={
                    mockUpcomingEvents.length > 0 ? (
                      <div className="space-y-3">
                        <p className="text-sm font-medium">Ready to activate:</p>
                        {mockUpcomingEvents.slice(0, 2).map(event => (
                          <Button
                            key={event.id}
                            variant="outline"
                            onClick={() => handleActivateEvent(event.id)}
                            className="gap-2"
                          >
                            <Play className="h-4 w-4" />
                            Activate {event.name}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <Button onClick={() => setAddEventOpen(true)} variant="outline" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Plan Event
                      </Button>
                    )
                  }
                />
              )}
            </TabsContent>

            <TabsContent value="recent" className="mt-6">
              {mockRecentEvents.length > 0 ? (
                <RecentEvents
                  events={mockRecentEvents}
                  onSendFollowUps={handleSendFollowUps}
                />
              ) : (
                <EmptyState
                  icon="📊"
                  title="No Recent Events"
                  description="Your completed events and follow-up analytics will appear here."
                  action={
                    <Button onClick={() => setActiveTab('upcoming')} variant="outline">
                      Plan Your Next Event
                    </Button>
                  }
                />
              )}
            </TabsContent>
          </Tabs>
        </motion.section>
      </main>

      {/* Add Event Dialog */}
      <AddEventDialog open={addEventOpen} onOpenChange={setAddEventOpen} />

      {/* Adaptive Navigation */}
      {dockVisible && (
        isMobile ? (
          <MobileTabBar items={dockItems} />
        ) : (
          <div className="fixed bottom-4 left-0 right-0 flex justify-center pointer-events-none z-50">
            <div className="pointer-events-auto">
              <Dock items={dockItems} activeItem={location.pathname} />
            </div>
          </div>
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
