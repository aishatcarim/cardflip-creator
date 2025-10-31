import { useState } from 'react';
import { AppHeader } from '@/components/Navigation/AppHeader';
import Dock from '@/components/Dock/Dock';
import { useNavigate } from 'react-router-dom';
import { Home, CreditCard, Users, BarChart3, Calendar, Download, Eye, EyeOff } from 'lucide-react';
import { useEventData } from '@/hooks/useEventData';
import { EventCard } from '@/components/Events/EventCard';
import { EventTimeline } from '@/components/Events/EventTimeline';
import { Button } from '@/components/ui/button';
import { useNetworkContactsStore } from '@/store/networkContactsStore';
import { toast } from 'sonner';
import { EventData } from '@/hooks/useEventData';
import { motion } from 'framer-motion';

const Events = () => {
  const navigate = useNavigate();
  const { exportContactsCSV } = useNetworkContactsStore();
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [dockVisible, setDockVisible] = useState(true);
  
  const eventData = useEventData();

  const handleExportReport = () => {
    exportContactsCSV();
    toast.success('Events report exported successfully!');
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
      icon: <Calendar className="h-6 w-6" />,
      label: 'Events',
      onClick: () => navigate('/events'),
      className: 'bg-accent/30'
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      label: 'Analytics',
      onClick: () => navigate('/analytics')
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8 pb-32">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Event Dashboard</h1>
            <p className="text-muted-foreground">Manage your networking events and follow-ups</p>
          </div>
          <Button onClick={handleExportReport} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

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
      </main>

      {/* Event Timeline Sheet */}
      <EventTimeline
        event={selectedEvent}
        open={timelineOpen}
        onClose={() => setTimelineOpen(false)}
      />

      {/* Dock Navigation */}
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

export default Events;
