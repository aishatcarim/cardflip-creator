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
  CheckCircle2,
  Briefcase,
  Activity,
  Flame,
  ChevronRight,
  Clock
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
import { Card } from '@shared/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs';
import { Progress } from '@shared/ui/progress';
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="rounded-full bg-primary/10 p-6 mb-6">
              <BarChart3 className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No Data Yet</h2>
            <p className="text-muted-foreground max-w-md mb-6">
              Start building your network to see insights and metrics.
            </p>
            <Button onClick={() => navigate('/contacts')} size="lg" className="gap-2">
              <Users className="h-5 w-5" />
              Get Started
            </Button>
          </motion.div>
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
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>

        {/* Hero Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {[
            { 
              label: "Total Contacts", 
              value: totalContacts, 
              icon: Users, 
              color: "text-primary",
              bgColor: "bg-primary/10",
              subtitle: `+${contactsTrend}% growth`
            },
            { 
              label: "Events Tracked", 
              value: uniqueEventsCount, 
              icon: Calendar, 
              color: "text-blue-500",
              bgColor: "bg-blue-500/10",
              subtitle: `+${eventsTrend}% this month`
            },
            { 
              label: "Industries", 
              value: uniqueIndustriesCount, 
              icon: Briefcase, 
              color: "text-purple-500",
              bgColor: "bg-purple-500/10",
              subtitle: "Diverse network"
            },
            { 
              label: "This Month", 
              value: thisMonthCount, 
              icon: TrendingUp, 
              color: "text-green-500",
              bgColor: "bg-green-500/10",
              subtitle: "New connections"
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 sm:p-5 border-border/50 hover:border-border transition-all hover:shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
                  </div>
                </div>
                <p className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
                <p className="text-xs text-muted-foreground/70 mt-0.5">{stat.subtitle}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
          <TabsList className="bg-muted/50 p-1 h-10">
            <TabsTrigger value="overview" className="text-sm px-4 h-8 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="insights" className="text-sm px-4 h-8 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Insights
            </TabsTrigger>
            <TabsTrigger value="events" className="text-sm px-4 h-8 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Events
              <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-xs">{eventData.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <ContactsGrowthChart data={growthData} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <EventDistributionChart data={eventStats} />
              <IndustryBreakdownChart data={industryStats} />
            </div>
            <RecentActivityFeed contacts={recentContacts} />
          </TabsContent>

          {/* Insights */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
              <InsightsPanel insights={insights} totalContacts={totalContacts} />
              
              <Card className="border-border/50 overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-border/50 bg-gradient-to-r from-purple-500/5 to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <Activity className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Performance Metrics</h3>
                      <p className="text-sm text-muted-foreground">Track your networking efficiency</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 sm:p-5 space-y-5">
                  {[
                    { label: 'Network Growth', value: contactsTrend, color: 'bg-primary' },
                    { label: 'Event Engagement', value: Math.round((uniqueEventsCount / Math.max(totalContacts, 1)) * 100), color: 'bg-blue-500' },
                    { label: 'Industry Diversity', value: Math.round((uniqueIndustriesCount / Math.max(totalContacts, 1)) * 100), color: 'bg-purple-500' },
                  ].map((metric) => (
                    <div key={metric.label}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">{metric.label}</span>
                        <span className="text-sm font-medium">{metric.value}%</span>
                      </div>
                      <Progress value={Math.min(metric.value * 2, 100)} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Avg per event', value: Math.round(totalContacts / Math.max(uniqueEventsCount, 1)), icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
                { label: 'Avg per industry', value: Math.round(totalContacts / Math.max(uniqueIndustriesCount, 1)), icon: Target, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
                { label: 'Daily avg (30d)', value: (thisMonthCount / 30).toFixed(1), icon: Flame, color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <Card className="p-5 text-center border-border/50 hover:border-border transition-all hover:shadow-sm">
                    <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center mx-auto mb-4`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Events */}
          <TabsContent value="events" className="space-y-4">
            {eventData.length > 0 ? (
              <div className="space-y-3">
                {eventData.map((event, index) => {
                  const completionPercent = Math.round(event.completionRate);
                  return (
                    <motion.div
                      key={event.eventName}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                    >
                      <Card
                        onClick={() => handleViewTimeline(event)}
                        className="p-4 sm:p-5 border-border/50 hover:border-border transition-all cursor-pointer group hover:shadow-sm"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 rounded-lg bg-blue-500/10 shrink-0">
                            <Calendar className="h-5 w-5 text-blue-500" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1.5">
                              <h3 className="font-medium truncate">{event.eventName}</h3>
                              <span className="text-xs text-muted-foreground shrink-0">
                                {new Date(event.mostRecentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1.5">
                                <Users className="h-3.5 w-3.5" />
                                {event.contactCount} contacts
                              </span>
                              {event.followUpStats.done > 0 && (
                                <span className="flex items-center gap-1.5 text-green-600">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  {event.followUpStats.done} done
                                </span>
                              )}
                              {event.followUpStats.pending > 0 && (
                                <span className="flex items-center gap-1.5 text-amber-600">
                                  <Clock className="h-3.5 w-3.5" />
                                  {event.followUpStats.pending} pending
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 shrink-0">
                            <div className="w-24 hidden sm:block">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-muted-foreground">Progress</span>
                                <span className="text-xs font-medium">{completionPercent}%</span>
                              </div>
                              <Progress value={completionPercent} className="h-1.5" />
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="rounded-full bg-blue-500/10 p-6 mb-6">
                  <Calendar className="h-12 w-12 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">No Events Tracked</h2>
                <p className="text-muted-foreground max-w-md mb-6">
                  Events will appear once you tag contacts with event names.
                </p>
                <Button onClick={() => navigate('/contacts')} size="lg" className="gap-2">
                  <Users className="h-5 w-5" />
                  Add Contacts
                </Button>
              </motion.div>
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
