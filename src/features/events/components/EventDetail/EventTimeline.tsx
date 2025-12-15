import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, ArrowUpDown, CheckCircle2, Calendar, Users, TrendingUp } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@shared/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select';
import { ScrollArea } from '@shared/ui/scroll-area';
import { EventData } from '@events/hooks/useEventData';
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
        <SheetContent side="right" className="w-full sm:max-w-xl p-0 overflow-hidden">
          {/* Banner Header */}
          <div className="relative h-36 overflow-hidden">
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
              className="absolute top-3 right-3 h-8 w-8 bg-black/30 hover:bg-black/50 text-white backdrop-blur-md border border-white/20 transition-all duration-200"
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Event Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <SheetTitle className="text-xl font-semibold mb-2 text-white drop-shadow-lg">
                  {event.eventName}
                </SheetTitle>
                <div className="flex items-center gap-3 text-xs text-white/90">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(event.mostRecentDate), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3 w-3" />
                    <span>{event.contactCount} contacts</span>
                  </div>
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
              className="px-4 py-4 border-b bg-muted/30"
            >
              <div className="grid grid-cols-4 gap-2">
                <div className="text-center p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="text-lg font-semibold text-primary">{Math.round(event.completionRate)}%</div>
                  <div className="text-[10px] text-muted-foreground">Progress</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="text-lg font-semibold text-emerald-600">{event.followUpStats.done}</div>
                  <div className="text-[10px] text-muted-foreground">Done</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="text-lg font-semibold text-amber-600">{event.followUpStats.pending}</div>
                  <div className="text-[10px] text-muted-foreground">Pending</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="text-lg font-semibold text-blue-600">{event.followUpStats.snoozed}</div>
                  <div className="text-[10px] text-muted-foreground">Snoozed</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Filters and Sort */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="px-4 py-3 border-b bg-background sticky top-0 z-10"
          >
            <div className="flex items-center gap-2">
              <Select value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
                <SelectTrigger className="h-8 text-xs flex-1">
                  <Filter className="h-3 w-3 mr-1.5 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="snoozed">Snoozed</SelectItem>
                  <SelectItem value="none">No Follow-up</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sort} onValueChange={(v) => setSort(v as SortType)}>
                <SelectTrigger className="h-8 text-xs flex-1">
                  <ArrowUpDown className="h-3 w-3 mr-1.5 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tagged">Recent</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground px-2">
                <span className="font-medium">{filteredAndSortedContacts.length}</span>
              </div>
            </div>
          </motion.div>

          <ScrollArea className="h-[calc(100vh-320px)]">
            <div className="p-4 space-y-2">
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
                    className="text-center py-12"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3">
                      <Users className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium mb-1">No contacts found</p>
                    <p className="text-xs text-muted-foreground">Try adjusting your filters</p>
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
