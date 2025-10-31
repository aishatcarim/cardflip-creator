import { useState } from 'react';
import { AppHeader } from '@/components/Navigation/AppHeader';
import Dock from '@/components/Dock/Dock';
import { useNavigate } from 'react-router-dom';
import { Home, CreditCard, Users, BarChart3, Download, Calendar } from 'lucide-react';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { useEventData } from '@/hooks/useEventData';
import { StatsCard } from '@/components/Analytics/StatsCard';
import { ContactsGrowthChart } from '@/components/Analytics/ContactsGrowthChart';
import { EventDistributionChart } from '@/components/Analytics/EventDistributionChart';
import { IndustryBreakdownChart } from '@/components/Analytics/IndustryBreakdownChart';
import { RecentActivityFeed } from '@/components/Analytics/RecentActivityFeed';
import { InsightsPanel } from '@/components/Analytics/InsightsPanel';
import { EventCard } from '@/components/Events/EventCard';
import { EventTimeline } from '@/components/Events/EventTimeline';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNetworkContactsStore } from '@/store/networkContactsStore';
import { toast } from 'sonner';
import { EventData } from '@/hooks/useEventData';

const Analytics = () => {
  const navigate = useNavigate();
  const { exportContactsCSV } = useNetworkContactsStore();
  const [viewMode, setViewMode] = useState<'overview' | 'events'>('overview');
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [timelineOpen, setTimelineOpen] = useState(false);
  
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
      label: 'Home',
      onClick: () => navigate('/')
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      label: 'Cards',
      onClick: () => navigate('/cards')
    },
    {
      icon: <Users className="h-6 w-6" />,
      label: 'Contacts',
      onClick: () => navigate('/contacts')
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      label: 'Analytics',
      onClick: () => navigate('/analytics')
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

        <div className="fixed bottom-4 left-0 right-0 flex justify-center pointer-events-none z-50">
          <div className="pointer-events-auto">
            <Dock items={dockItems} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8 pb-32">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Track your networking journey and insights</p>
          </div>
          <div className="flex items-center gap-2">
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
            <Button onClick={handleExportReport} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {viewMode === 'overview' ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
            </div>

            {/* Growth Chart */}
            <div className="mb-8">
              <ContactsGrowthChart data={growthData} />
            </div>

            {/* Distribution Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <EventDistributionChart data={eventStats} />
              <IndustryBreakdownChart data={industryStats} />
            </div>

            {/* Insights and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RecentActivityFeed contacts={recentContacts} />
              </div>
              <div>
                <InsightsPanel insights={insights} totalContacts={totalContacts} />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Events View */}
            {eventData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventData.map((event, index) => (
                  <EventCard
                    key={event.eventName}
                    event={event}
                    index={index}
                    onViewTimeline={() => handleViewTimeline(event)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <Calendar className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h2 className="text-2xl font-semibold mb-2">No Events Tracked Yet</h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Events will appear here once you tag contacts with event names. Start organizing your networking!
                </p>
                <Button onClick={() => navigate('/contacts')} size="lg">
                  Add First Contact
                </Button>
              </div>
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

      <div className="fixed bottom-4 left-0 right-0 flex justify-center pointer-events-none z-50">
        <div className="pointer-events-auto">
          <Dock items={dockItems} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
