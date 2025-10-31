import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, ArrowUpDown, CheckCircle2 } from 'lucide-react';
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
        <SheetContent side="right" className="w-full sm:max-w-2xl p-0">
          <SheetHeader className="p-6 pb-4 border-b">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <SheetTitle className="text-2xl">{event.eventName}</SheetTitle>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(event.mostRecentDate), 'MMMM d, yyyy')} • {event.contactCount} contacts
                </p>
                {totalWithFollowUp > 0 && (
                  <p className="text-sm font-medium">
                    {event.followUpStats.done} of {totalWithFollowUp} follow-ups completed
                  </p>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Filters and Sort */}
            <div className="flex gap-2 pt-4">
              <Select value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
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
                <SelectTrigger className="w-[140px]">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tagged">Recent First</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-200px)]">
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <p className="text-muted-foreground">
                      No contacts match your filters
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
