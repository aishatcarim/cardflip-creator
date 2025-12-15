import { useState } from 'react';
import { AppHeader } from '@shared/components';
import { Dock } from '@shared/components';
import { MobileTabBar } from '@shared/components';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  BarChart3, 
  Download, 
  Calendar, 
  Eye, 
  EyeOff,
  TrendingUp,
  Target,
  Award,
  Zap,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAnalyticsData } from '../hooks/useAnalyticsData';
import { useEventData } from '@events/hooks/useEventData';
import { StatsCard } from '../components/StatsCard';
import { ContactsGrowthChart } from '../components/ContactsGrowthChart';
import { EventDistributionChart } from '../components/EventDistributionChart';
import { IndustryBreakdownChart } from '../components/IndustryBreakdownChart';
import { RecentActivityFeed } from '../components/RecentActivityFeed';
import { InsightsPanel } from '../components/InsightsPanel';
import { EventTimeline } from '@events/components/EventDetail/EventTimeline';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs';
import { Card } from '@shared/ui/card';
import { useNetworkContactsStore } from '@contacts/store/networkContactsStore';
import { useIsMobile } from '@shared/hooks';
import { toast } from 'sonner';
import { EventData } from '@events/hooks/useEventData';

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { exportContactsCSV } = useNetworkContactsStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'events'>('overview');
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

  // Calculate trend percentages (mock data - would come from real comparison)
  const contactsTrend = 12.5; // +12.5% vs last month
  const eventsTrend = 8.3;
  const industriesTrend = -2.1;
  const monthlyTrend = 15.7;

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

  // Empty State
  if (totalContacts === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AppHeader />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Analytics</h1>
              <p className="text-muted-foreground mt-1">Track your networking performance</p>
            </div>
            <Button variant="outline" className="gap-2 rounded-full">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center min-h-[500px] text-center rounded-2xl border border-border bg-card p-12">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <BarChart3 className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No Data Yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Start building your network to see insights, charts, and performance metrics.
            </p>
            <Button onClick={() => navigate('/contacts')} className="gap-2 rounded-full">
              Get Started
            </Button>
          </div>
        </main>

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
            {dockVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      
      <main className="flex-1 container mx-auto px-4 py-6 pb-32 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground mt-1">Track your networking performance</p>
          </div>
          <Button 
            onClick={handleExportReport} 
            variant="outline" 
            className="gap-2 rounded-full"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Contacts</p>
                <p className="text-3xl font-bold">{totalContacts}</p>
              </div>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex items-center gap-1 text-sm">
              {contactsTrend >= 0 ? (
                <>
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-green-500 font-medium">+{contactsTrend}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                  <span className="text-red-500 font-medium">{contactsTrend}%</span>
                </>
              )}
              <span className="text-muted-foreground ml-1">vs last month</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Events</p>
                <p className="text-3xl font-bold">{uniqueEventsCount}</p>
              </div>
              <Calendar className="h-5 w-5 text-purple-500" />
            </div>
            <div className="flex items-center gap-1 text-sm">
              {eventsTrend >= 0 ? (
                <>
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-green-500 font-medium">+{eventsTrend}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                  <span className="text-red-500 font-medium">{eventsTrend}%</span>
                </>
              )}
              <span className="text-muted-foreground ml-1">vs last month</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Industries</p>
                <p className="text-3xl font-bold">{uniqueIndustriesCount}</p>
              </div>
              <Target className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="flex items-center gap-1 text-sm">
              {industriesTrend >= 0 ? (
                <>
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-green-500 font-medium">+{industriesTrend}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                  <span className="text-red-500 font-medium">{industriesTrend}%</span>
                </>
              )}
              <span className="text-muted-foreground ml-1">vs last month</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">This Month</p>
                <p className="text-3xl font-bold">{thisMonthCount}</p>
              </div>
              <TrendingUp className="h-5 w-5 text-orange-500" />
            </div>
            <div className="flex items-center gap-1 text-sm">
              {monthlyTrend >= 0 ? (
                <>
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-green-500 font-medium">+{monthlyTrend}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                  <span className="text-red-500 font-medium">{monthlyTrend}%</span>
                </>
              )}
              <span className="text-muted-foreground ml-1">vs last month</span>
            </div>
          </motion.div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
          <TabsList className="bg-muted/50 p-1 rounded-full">
            <TabsTrigger
              value="overview"
              className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="insights"
              className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Zap className="h-4 w-4 mr-2" />
              Insights
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Events
              <Badge variant="secondary" className="ml-2 rounded-full h-5 min-w-5 px-1.5">
                {eventData.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Growth Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ContactsGrowthChart data={growthData} />
            </motion.div>

            {/* Distribution Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <EventDistributionChart data={eventStats} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <IndustryBreakdownChart data={industryStats} />
              </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <RecentActivityFeed contacts={recentContacts} />
            </motion.div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Insights Panel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <InsightsPanel insights={insights} totalContacts={totalContacts} />
              </motion.div>

              {/* Performance Metrics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Award className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Performance Metrics</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Network Growth Rate</span>
                      <span className="text-sm font-semibold">
                        {contactsTrend >= 0 ? '+' : ''}{contactsTrend}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                        style={{ width: `${Math.min(Math.abs(contactsTrend) * 5, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Event Engagement</span>
                      <span className="text-sm font-semibold">
                        {Math.round((uniqueEventsCount / Math.max(totalContacts, 1)) * 100)}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                        style={{ width: `${Math.min((uniqueEventsCount / Math.max(totalContacts, 1)) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Industry Diversity</span>
                      <span className="text-sm font-semibold">
                        {Math.round((uniqueIndustriesCount / Math.max(totalContacts, 1)) * 100)}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                        style={{ width: `${Math.min((uniqueIndustriesCount / Math.max(totalContacts, 1)) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Monthly Activity</span>
                      <span className="text-sm font-semibold">
                        {Math.round((thisMonthCount / Math.max(totalContacts, 1)) * 100)}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                        style={{ width: `${Math.min((thisMonthCount / Math.max(totalContacts, 1)) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Keep up the momentum!</p>
                      <p className="text-sm text-muted-foreground">
                        You're building a diverse network across multiple industries and events.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Additional Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                  <p className="text-2xl font-bold mb-1">
                    {Math.round(totalContacts / Math.max(uniqueEventsCount, 1))}
                  </p>
                  <p className="text-sm text-muted-foreground">Avg contacts per event</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-3">
                    <Target className="h-6 w-6 text-purple-500" />
                  </div>
                  <p className="text-2xl font-bold mb-1">
                    {Math.round(totalContacts / Math.max(uniqueIndustriesCount, 1))}
                  </p>
                  <p className="text-sm text-muted-foreground">Avg contacts per industry</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-emerald-500" />
                  </div>
                  <p className="text-2xl font-bold mb-1">
                    {Math.round((thisMonthCount / 30) * 10) / 10}
                  </p>
                  <p className="text-sm text-muted-foreground">Contacts per day (30d avg)</p>
                </div>
              </motion.div>
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            {eventData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventData.map((event, index) => (
                  <motion.div
                    key={event.eventName}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleViewTimeline(event)}
                  >
                    <div className="h-32 bg-gradient-to-br from-violet-500 to-purple-600 relative">
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-lg font-bold text-white truncate">
                          {event.eventName}
                        </h3>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-2xl font-bold">{event.contactCount}</p>
                          <p className="text-xs text-muted-foreground">Contacts</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">
                            {new Date(event.mostRecentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                          <p className="text-xs text-muted-foreground">Date</p>
                        </div>
                      </div>

                      <Button variant="outline" className="w-full gap-2 rounded-full" size="sm">
                        View Details
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-card p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                  <Calendar className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Events Tracked</h3>
                <p className="text-muted-foreground mb-6">
                  Events will appear here once you tag contacts with event names.
                </p>
                <Button onClick={() => navigate('/contacts')} className="gap-2 rounded-full">
                  Add Contacts
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Event Timeline Modal */}
      <EventTimeline
        event={selectedEvent}
        open={timelineOpen}
        onClose={() => setTimelineOpen(false)}
      />

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
          {dockVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;