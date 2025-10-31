import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, ArrowUpDown, CheckCircle2, Calendar, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EventData } from '@/hooks/useEventData';
import { TimelineContactCard } from './TimelineContactCard';
import { useNetworkContactsStore } from '@/store/networkContactsStore';
import { format, addDays } from 'date-fns';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import defaultBanner from '@/assets/event-banners/default-banner.jpg';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface EventTimelineProps {
  event: EventData | null;
  open: boolean;
  onClose: () => void;
}

type FilterType = 'all' | 'pending' | 'done' | 'snoozed' | 'none';
type SortType = 'tagged' | 'name' | 'dueDate';

export const EventTimeline = ({ event, open, onClose }: EventTimelineProps) => {
  const navigate = useNavigate();
  const { updateFollowUpStatus, snoozeContact } = useNetworkContactsStore();
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('tagged');
  const [snoozeContactId, setSnoozeContactId] = useState<string | null>(null);

  const filteredAndSortedContacts = useMemo(() => {
    if (!event) return [];

    let filtered = event.contacts;

    // Apply filter
    if (filter !== 'all') {
      filtered = filtered.filter(c => (c.followUpStatus || 'none') === filter);
    }

    // Apply sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sort) {
        case 'name':
          return a.contactName.localeCompare(b.contactName);
        case 'dueDate':
          if (!a.followUpDueDate && !b.followUpDueDate) return 0;
          if (!a.followUpDueDate) return 1;
          if (!b.followUpDueDate) return -1;
          return new Date(a.followUpDueDate).getTime() - new Date(b.followUpDueDate).getTime();
        case 'tagged':
        default:
          return new Date(b.taggedAt).getTime() - new Date(a.taggedAt).getTime();
      }
    });

    return sorted;
  }, [event, filter, sort]);

  const handleMarkDone = (contactId: string) => {
    updateFollowUpStatus(contactId, 'done');
    toast.success('Follow-up marked as done!', {
      icon: <CheckCircle2 className="h-4 w-4" />
    });
  };

  const handleSnoozeClick = (contactId: string) => {
    setSnoozeContactId(contactId);
  };

  const handleSnoozeConfirm = (days: number) => {
    if (snoozeContactId) {
      const snoozeUntil = addDays(new Date(), days).toISOString();
      snoozeContact(snoozeContactId, snoozeUntil);
      toast.success(`Follow-up snoozed for ${days} day${days > 1 ? 's' : ''}!`);
      setSnoozeContactId(null);
    }
  };

  const handleViewDetails = (contactId: string) => {
    navigate('/contacts', { state: { highlightContactId: contactId } });
    onClose();
  };

  if (!event) return null;

  const totalWithFollowUp = event.contactCount - event.followUpStats.none;

  return (
    <>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="right" className="w-full sm:max-w-3xl p-0">
          {/* Banner Header */}
          <div className="relative h-48 overflow-hidden">
            <motion.img
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              src={event.bannerUrl || defaultBanner}
              alt={event.eventName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            {/* Close Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm"
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Event Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <SheetTitle className="text-3xl font-bold mb-2 text-white">
                  {event.eventName}
                </SheetTitle>
                <div className="flex flex-wrap items-center gap-4 text-sm text-white/90">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(event.mostRecentDate), 'MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{event.contactCount} contacts</span>
                  </div>
                  {totalWithFollowUp > 0 && (
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>{event.followUpStats.done} / {totalWithFollowUp} completed</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Stats Cards */}
          {totalWithFollowUp > 0 && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="px-6 pt-6 pb-4 border-b bg-muted/30"
            >
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-background rounded-lg p-3 text-center border">
                  <div className="text-2xl font-bold text-primary">
                    {Math.round(event.completionRate)}%
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Progress</div>
                </div>
                <div className="bg-background rounded-lg p-3 text-center border">
                  <div className="text-2xl font-bold text-green-500">
                    {event.followUpStats.done}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Done</div>
                </div>
                <div className="bg-background rounded-lg p-3 text-center border">
                  <div className="text-2xl font-bold text-yellow-500">
                    {event.followUpStats.pending}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Pending</div>
                </div>
                <div className="bg-background rounded-lg p-3 text-center border">
                  <div className="text-2xl font-bold text-blue-500">
                    {event.followUpStats.snoozed}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Snoozed</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Filters and Sort */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="px-6 py-4 border-b bg-background/50 backdrop-blur-sm sticky top-0 z-10"
          >
            <div className="flex gap-2">
              <Select value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Contacts</SelectItem>
                  <SelectItem value="pending">⏳ Pending</SelectItem>
                  <SelectItem value="done">✓ Done</SelectItem>
                  <SelectItem value="snoozed">😴 Snoozed</SelectItem>
                  <SelectItem value="none">− No Follow-up</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sort} onValueChange={(v) => setSort(v as SortType)}>
                <SelectTrigger className="w-[160px]">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tagged">📅 Recent First</SelectItem>
                  <SelectItem value="name">🔤 Name</SelectItem>
                  <SelectItem value="dueDate">⏰ Due Date</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="ml-auto text-sm text-muted-foreground flex items-center">
                {filteredAndSortedContacts.length} {filteredAndSortedContacts.length === 1 ? 'contact' : 'contacts'}
              </div>
            </div>
          </motion.div>

          <ScrollArea className="h-[calc(100vh-400px)]">
            <div className="p-6 space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredAndSortedContacts.length > 0 ? (
                  filteredAndSortedContacts.map((contact, index) => (
                    <TimelineContactCard
                      key={contact.id}
                      contact={contact}
                      index={index}
                      onMarkDone={() => handleMarkDone(contact.id)}
                      onSnooze={() => handleSnoozeClick(contact.id)}
                      onViewDetails={() => handleViewDetails(contact.id)}
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                      <Users className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-lg font-medium mb-1">No contacts found</p>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your filters
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Snooze Dialog */}
      <AlertDialog open={!!snoozeContactId} onOpenChange={() => setSnoozeContactId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Snooze Follow-up</AlertDialogTitle>
            <AlertDialogDescription>
              How long would you like to snooze this follow-up?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid grid-cols-2 gap-2 py-4">
            <Button variant="outline" onClick={() => handleSnoozeConfirm(1)}>
              1 Day
            </Button>
            <Button variant="outline" onClick={() => handleSnoozeConfirm(3)}>
              3 Days
            </Button>
            <Button variant="outline" onClick={() => handleSnoozeConfirm(7)}>
              1 Week
            </Button>
            <Button variant="outline" onClick={() => handleSnoozeConfirm(14)}>
              2 Weeks
            </Button>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
