import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, ArrowUpDown, CheckCircle2, Calendar, Users, TrendingUp } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@shared/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select';
import { ScrollArea } from '@shared/ui/scroll-area';
import { EventData } from '../../../hooks/useEventData';
import { TimelineContactCard } from './TimelineContactCard';
import { useNetworkContactsStore } from '@contacts/store/networkContactsStore';
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
} from '@shared/ui/alert-dialog';

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
        <SheetContent side="right" className="w-full sm:max-w-4xl p-0 overflow-hidden">
          {/* Banner Header */}
          <div className="relative h-56 overflow-hidden">
            <motion.img
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              src={event.bannerUrl || defaultBanner}
              alt={event.eventName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            
            {/* Close Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white backdrop-blur-md border border-white/20 transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Event Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <SheetTitle className="text-4xl font-bold mb-3 text-white drop-shadow-lg">
                  {event.eventName}
                </SheetTitle>
                <div className="flex flex-wrap items-center gap-6 text-sm text-white/95 drop-shadow-md">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(event.mostRecentDate), 'MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Users className="h-4 w-4" />
                    <span>{event.contactCount} {event.contactCount === 1 ? 'contact' : 'contacts'}</span>
                  </div>
                  {totalWithFollowUp > 0 && (
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
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
              className="px-8 pt-6 pb-5 border-b bg-gradient-to-br from-muted/30 to-background"
            >
              <div className="grid grid-cols-4 gap-4">
                <motion.div 
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 text-center border border-primary/20 shadow-sm hover:shadow-md transition-shadow cursor-default"
                >
                  <div className="text-3xl font-bold text-primary mb-1">
                    {Math.round(event.completionRate)}%
                  </div>
                  <div className="text-xs font-medium text-muted-foreground">Progress</div>
                </motion.div>
                <motion.div 
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl p-4 text-center border border-green-500/20 shadow-sm hover:shadow-md transition-shadow cursor-default"
                >
                  <div className="text-3xl font-bold text-green-600 dark:text-green-500 mb-1">
                    {event.followUpStats.done}
                  </div>
                  <div className="text-xs font-medium text-muted-foreground">Done</div>
                </motion.div>
                <motion.div 
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 rounded-xl p-4 text-center border border-yellow-500/20 shadow-sm hover:shadow-md transition-shadow cursor-default"
                >
                  <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-500 mb-1">
                    {event.followUpStats.pending}
                  </div>
                  <div className="text-xs font-medium text-muted-foreground">Pending</div>
                </motion.div>
                <motion.div 
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl p-4 text-center border border-blue-500/20 shadow-sm hover:shadow-md transition-shadow cursor-default"
                >
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-500 mb-1">
                    {event.followUpStats.snoozed}
                  </div>
                  <div className="text-xs font-medium text-muted-foreground">Snoozed</div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Filters and Sort */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="px-8 py-5 border-b bg-background/95 backdrop-blur-md sticky top-0 z-10 shadow-sm"
          >
            <div className="flex flex-wrap gap-3">
              <Select value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
                <SelectTrigger className="w-[180px] bg-background hover:bg-accent transition-colors">
                  <Filter className="h-4 w-4 mr-2 text-primary" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">✨ All Contacts</SelectItem>
                  <SelectItem value="pending">⏳ Pending</SelectItem>
                  <SelectItem value="done">✅ Done</SelectItem>
                  <SelectItem value="snoozed">💤 Snoozed</SelectItem>
                  <SelectItem value="none">➖ No Follow-up</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sort} onValueChange={(v) => setSort(v as SortType)}>
                <SelectTrigger className="w-[180px] bg-background hover:bg-accent transition-colors">
                  <ArrowUpDown className="h-4 w-4 mr-2 text-primary" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tagged">📅 Most Recent</SelectItem>
                  <SelectItem value="name">🔤 Alphabetical</SelectItem>
                  <SelectItem value="dueDate">⏰ Due Date</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="ml-auto flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {filteredAndSortedContacts.length} {filteredAndSortedContacts.length === 1 ? 'contact' : 'contacts'}
                </span>
              </div>
            </div>
          </motion.div>

          <ScrollArea className="h-[calc(100vh-450px)]">
            <div className="p-8 space-y-4">
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
                    transition={{ duration: 0.3 }}
                    className="text-center py-20"
                  >
                    <motion.div 
                      className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-muted to-muted/50 mb-5 shadow-lg"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Users className="h-10 w-10 text-muted-foreground" />
                    </motion.div>
                    <p className="text-xl font-semibold mb-2">No contacts found</p>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                      Try adjusting your filters to see more contacts from this event
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
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl flex items-center gap-2">
              💤 Snooze Follow-up
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Choose how long to snooze this follow-up reminder
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid grid-cols-2 gap-3 py-6">
            <Button 
              variant="outline" 
              onClick={() => handleSnoozeConfirm(1)}
              className="h-auto py-4 flex flex-col gap-1 hover:bg-primary/10 hover:border-primary transition-all"
            >
              <span className="text-lg font-semibold">1 Day</span>
              <span className="text-xs text-muted-foreground">Until tomorrow</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleSnoozeConfirm(3)}
              className="h-auto py-4 flex flex-col gap-1 hover:bg-primary/10 hover:border-primary transition-all"
            >
              <span className="text-lg font-semibold">3 Days</span>
              <span className="text-xs text-muted-foreground">Short break</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleSnoozeConfirm(7)}
              className="h-auto py-4 flex flex-col gap-1 hover:bg-primary/10 hover:border-primary transition-all"
            >
              <span className="text-lg font-semibold">1 Week</span>
              <span className="text-xs text-muted-foreground">Next week</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleSnoozeConfirm(14)}
              className="h-auto py-4 flex flex-col gap-1 hover:bg-primary/10 hover:border-primary transition-all"
            >
              <span className="text-lg font-semibold">2 Weeks</span>
              <span className="text-xs text-muted-foreground">Later date</span>
            </Button>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-accent">Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
