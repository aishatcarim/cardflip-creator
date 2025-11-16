import { useState } from 'react';
import { AppHeader } from '@shared/components';
import { Dock } from '@shared/components';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, CreditCard, Users, BarChart3, Download, Calendar, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAnalyticsData } from '../hooks/useAnalyticsData';
import { useEventData } from '@events/hooks/useEventData';
import { StatsCard } from '../components/StatsCard';
import { ContactsGrowthChart } from '../components/ContactsGrowthChart';
import { EventDistributionChart } from '../components/EventDistributionChart';
import { IndustryBreakdownChart } from '../components/IndustryBreakdownChart';
import { RecentActivityFeed } from '../components/RecentActivityFeed';
import { InsightsPanel } from '../components/InsightsPanel';
import { EventCard } from '@events/components/EventsDashboard/EventCard';
import { EventTimeline } from '@events/components/EventDetail/EventTimeline';
import { Button } from '@shared/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@shared/ui/tabs';
import { useNetworkContactsStore } from '@contacts/store/networkContactsStore';
import { toast } from 'sonner';
import { EventData } from '@events/hooks/useEventData';

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { exportContactsCSV } = useNetworkContactsStore();
  const [viewMode, setViewMode] = useState<'overview' | 'events'>('overview');
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [dockVisible, setDockVisible] = useState(true);
  
  const {
    totalContacts,
    eventStats,
    industryStats,
    growthData,
    recentContacts,
    insights,
    thisMonthCount,
    uniqueEventsCount,
    uniqueIndustriesCount
  } = useAnalyticsData();

  const eventData = useEventData();

  const handleExportReport = () => {
    exportContactsCSV();
    toast.success('Analytics report exported successfully!');
  };

  const handleViewTimeline = (event: EventData) => {
    setSelectedEvent(event);
    setTimelineOpen(true);
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
      onClick: () => navigate('/events')
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      label: 'Analytics',
      path: '/analytics',
      onClick: () => navigate('/analytics'),
      className: 'bg-accent/30'
    }
  ];

  if (totalContacts === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AppHeader />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Track your networking journey and insights</p>
            </div>
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'overview' | 'events')}>
              <TabsList>
                <TabsTrigger value="overview">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="events">
                  <Calendar className="h-4 w-4 mr-2" />
                  Events
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <BarChart3 className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Analytics Data Yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Start tagging contacts to see your networking insights, growth charts, and performance metrics!
            </p>
            <Button onClick={() => navigate('/contacts')} size="lg">
              Get Started
            </Button>
          </div>
        </main>

        {dockVisible && (
          <div className="fixed bottom-4 left-0 right-0 flex justify-center pointer-events-none z-50">
            <div className="pointer-events-auto">
              <Dock items={dockItems} activeItem={location.pathname} />
            </div>
          </div>
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
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8 pb-32">
        {/* Enhanced Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-card via-card to-muted/30 rounded-2xl border shadow-lg p-8 mb-8"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Analytics Dashboard
                  </h1>
                  <p className="text-muted-foreground text-lg">Track your networking journey and insights</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'overview' | 'events')} className="bg-background/50 rounded-lg p-1">
                <TabsList className="bg-transparent">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="events" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    Events
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button 
                onClick={handleExportReport} 
                variant="outline" 
                className="gap-2 bg-background hover:bg-accent shadow-sm"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </motion.div>

        {viewMode === 'overview' ? (
          <>
            {/* Stats Cards */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              <StatsCard
                title="Total Contacts"
                value={totalContacts}
                icon={Users}
                index={0}
              />
              <StatsCard
                title="Events Attended"
                value={uniqueEventsCount}
                subtitle="Unique events"
                icon={BarChart3}
                index={1}
              />
              <StatsCard
                title="Industries"
                value={uniqueIndustriesCount}
                subtitle="Unique industries"
                icon={BarChart3}
                index={2}
              />
              <StatsCard
                title="This Month"
                value={thisMonthCount}
                subtitle="New contacts"
                icon={Users}
                index={3}
              />
            </motion.div>

            {/* Growth Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <ContactsGrowthChart data={growthData} />
            </motion.div>

            {/* Distribution Charts */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
            >
              <EventDistributionChart data={eventStats} />
              <IndustryBreakdownChart data={industryStats} />
            </motion.div>

            {/* Insights and Recent Activity */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2">
                <RecentActivityFeed contacts={recentContacts} />
              </div>
              <div>
                <InsightsPanel insights={insights} totalContacts={totalContacts} />
              </div>
            </motion.div>
          </>
        ) : (
          <>
            {/* Events View */}
            {eventData.length > 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {eventData.map((event, index) => (
                  <EventCard
                    key={event.eventName}
                    event={event}
                    index={index}
                    onViewTimeline={() => handleViewTimeline(event)}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center justify-center min-h-[500px] text-center bg-gradient-to-br from-card to-muted/30 rounded-2xl border p-12"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-6"
                >
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/20">
                    <Calendar className="h-12 w-12 text-primary" />
                  </div>
                </motion.div>
                <h2 className="text-3xl font-bold mb-3">No Events Tracked Yet</h2>
                <p className="text-muted-foreground mb-8 max-w-md text-lg">
                  Events will appear here once you tag contacts with event names. Start organizing your networking!
                </p>
                <Button onClick={() => navigate('/contacts')} size="lg" className="shadow-lg">
                  Add First Contact
                </Button>
              </motion.div>
            )}
          </>
        )}
      </main>

      {/* Event Timeline Sheet */}
      <EventTimeline
        event={selectedEvent}
        open={timelineOpen}
        onClose={() => setTimelineOpen(false)}
      />

      {dockVisible && (
        <div className="fixed bottom-4 left-0 right-0 flex justify-center pointer-events-none z-50">
          <div className="pointer-events-auto">
            <Dock items={dockItems} />
          </div>
        </div>
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

export default AnalyticsPage;
