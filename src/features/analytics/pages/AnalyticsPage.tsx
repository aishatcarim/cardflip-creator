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
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAnalyticsData } from '../hooks/useAnalyticsData';
import { useEventData } from '@events/hooks/useEventData';
import { ContactsGrowthChart } from '../components/ContactsGrowthChart';
import { EventDistributionChart } from '../components/EventDistributionChart';
import { IndustryBreakdownChart } from '../components/IndustryBreakdownChart';
import { RecentActivityFeed } from '../components/RecentActivityFeed';
import { InsightsPanel } from '../components/InsightsPanel';
import { EventTimeline } from '@events/components/EventDetail/EventTimeline';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs';
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

  const contactsTrend = 12.5;
  const eventsTrend = 8.3;
  const industriesTrend = -2.1;
  const monthlyTrend = 15.7;

  const handleExportReport = () => {
    exportContactsCSV();
    toast.success('Report exported');
  };

  const handleViewTimeline = (event: EventData) => {
    setSelectedEvent(event);
    setTimelineOpen(true);
  };

  const dockItems = [
    { icon: <Home className="h-6 w-6" />, label: 'Profile', path: '/', onClick: () => navigate('/') },
    { icon: <Users className="h-6 w-6" />, label: 'Contacts', path: '/contacts', onClick: () => navigate('/contacts') },
    { icon: <Calendar className="h-6 w-6" />, label: 'Events', path: '/events', onClick: () => navigate('/events') },
    { icon: <BarChart3 className="h-6 w-6" />, label: 'Analytics', path: '/analytics', onClick: () => navigate('/analytics'), className: 'bg-accent/30' }
  ];

  if (totalContacts === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AppHeader />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold">Analytics</h1>
              <p className="text-sm text-muted-foreground mt-1">Track your networking performance</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center rounded-xl border border-border bg-card p-12">
            <BarChart3 className="h-10 w-10 text-muted-foreground mb-4 opacity-40" />
            <h2 className="text-lg font-medium mb-2">No data yet</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Start building your network to see insights and metrics.
            </p>
            <Button onClick={() => navigate('/contacts')} size="sm">Get Started</Button>
          </div>
        </main>
        {dockVisible && (isMobile ? <MobileTabBar items={dockItems} /> : (
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed bottom-4 left-0 right-0 z-50 pointer-events-none">
            <div className="pointer-events-auto"><Dock items={dockItems} activeItem={location.pathname} panelHeight={68} baseItemSize={50} magnification={70} /></div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      
      <main className="flex-1 container mx-auto px-4 py-6 pb-32 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Analytics</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Track your networking performance</p>
          </div>
          <Button onClick={handleExportReport} variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Contacts', value: totalContacts, trend: contactsTrend, icon: Users },
            { label: 'Events', value: uniqueEventsCount, trend: eventsTrend, icon: Calendar },
            { label: 'Industries', value: uniqueIndustriesCount, trend: industriesTrend, icon: Target },
            { label: 'This Month', value: thisMonthCount, trend: monthlyTrend, icon: TrendingUp },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{stat.label}</span>
                <stat.icon className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-semibold">{stat.value}</span>
                <span className={`text-xs ${stat.trend >= 0 ? 'text-emerald-600' : 'text-red-500'} flex items-center`}>
                  {stat.trend >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {Math.abs(stat.trend)}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
          <TabsList className="bg-muted/50 p-1 h-9">
            <TabsTrigger value="overview" className="text-xs px-3 h-7 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="insights" className="text-xs px-3 h-7 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Insights
            </TabsTrigger>
            <TabsTrigger value="events" className="text-xs px-3 h-7 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Events
              <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">{eventData.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-4">
            <ContactsGrowthChart data={growthData} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <EventDistributionChart data={eventStats} />
              <IndustryBreakdownChart data={industryStats} />
            </div>
            <RecentActivityFeed contacts={recentContacts} />
          </TabsContent>

          {/* Insights */}
          <TabsContent value="insights" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <InsightsPanel insights={insights} totalContacts={totalContacts} />
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-xl border border-border bg-card"
              >
                <div className="p-5 border-b border-border">
                  <span className="text-sm font-medium text-muted-foreground">Performance</span>
                </div>
                <div className="p-5 space-y-5">
                  {[
                    { label: 'Network Growth', value: contactsTrend, color: 'bg-primary' },
                    { label: 'Event Engagement', value: Math.round((uniqueEventsCount / Math.max(totalContacts, 1)) * 100), color: 'bg-violet-500' },
                    { label: 'Industry Diversity', value: Math.round((uniqueIndustriesCount / Math.max(totalContacts, 1)) * 100), color: 'bg-emerald-500' },
                  ].map((metric, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">{metric.label}</span>
                        <span className="text-sm font-medium">{metric.value}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full ${metric.color} rounded-full`} style={{ width: `${Math.min(metric.value * 2, 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Avg per event', value: Math.round(totalContacts / Math.max(uniqueEventsCount, 1)), icon: Users },
                { label: 'Avg per industry', value: Math.round(totalContacts / Math.max(uniqueIndustriesCount, 1)), icon: Target },
                { label: 'Daily avg (30d)', value: (thisMonthCount / 30).toFixed(1), icon: TrendingUp },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="rounded-xl border border-border bg-card p-5 text-center"
                >
                  <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-xl font-semibold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Events */}
          <TabsContent value="events" className="space-y-4">
            {eventData.length > 0 ? (
              <div className="space-y-2">
                {eventData.map((event, index) => {
                  const completionPercent = Math.round(event.completionRate);
                  return (
                    <motion.div
                      key={event.eventName}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => handleViewTimeline(event)}
                      className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors cursor-pointer group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-sm font-medium truncate">{event.eventName}</h3>
                          <span className="text-xs text-muted-foreground">
                            {new Date(event.mostRecentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {event.contactCount}
                          </span>
                          {event.followUpStats.done > 0 && (
                            <span className="flex items-center gap-1 text-emerald-600">
                              <CheckCircle2 className="h-3 w-3" />
                              {event.followUpStats.done} done
                            </span>
                          )}
                          {event.followUpStats.pending > 0 && (
                            <span className="text-amber-600">{event.followUpStats.pending} pending</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-20">
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full transition-all" 
                              style={{ width: `${completionPercent}%` }} 
                            />
                          </div>
                          <span className="text-[10px] text-muted-foreground mt-0.5 block text-right">{completionPercent}%</span>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card p-12 text-center">
                <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-40" />
                <h3 className="text-lg font-medium mb-2">No events tracked</h3>
                <p className="text-sm text-muted-foreground mb-6">Events will appear once you tag contacts with event names.</p>
                <Button onClick={() => navigate('/contacts')} size="sm">Add Contacts</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <EventTimeline event={selectedEvent} open={timelineOpen} onClose={() => setTimelineOpen(false)} />

      {dockVisible && (
        isMobile ? <MobileTabBar items={dockItems} /> : (
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3, delay: 0.2 }} className="fixed bottom-4 left-0 right-0 z-50 pointer-events-none">
            <div className="pointer-events-auto"><Dock items={dockItems} activeItem={location.pathname} panelHeight={68} baseItemSize={50} magnification={70} /></div>
          </motion.div>
        )
      )}

      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="fixed bottom-4 right-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setDockVisible(!dockVisible)} className="rounded-full shadow-lg bg-background/80 backdrop-blur-sm hover:bg-background">
          {dockVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;
