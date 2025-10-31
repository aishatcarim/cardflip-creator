import { useMemo } from 'react';
import { useNetworkContactsStore } from '@/store/networkContactsStore';

export interface EventData {
  eventName: string;
  contactCount: number;
  followUpStats: {
    pending: number;
    done: number;
    snoozed: number;
    none: number;
  };
  completionRate: number;
  mostRecentDate: string;
  contacts: ReturnType<typeof useNetworkContactsStore.getState>['contacts'];
}

export const useEventData = () => {
  const contacts = useNetworkContactsStore((state) => state.contacts);

  const eventData = useMemo(() => {
    const eventMap = new Map<string, EventData>();

    contacts.forEach((contact) => {
      const eventName = contact.event || 'Unspecified Event';
      
      if (!eventMap.has(eventName)) {
        eventMap.set(eventName, {
          eventName,
          contactCount: 0,
          followUpStats: {
            pending: 0,
            done: 0,
            snoozed: 0,
            none: 0
          },
          completionRate: 0,
          mostRecentDate: contact.taggedAt,
          contacts: []
        });
      }

      const eventInfo = eventMap.get(eventName)!;
      eventInfo.contactCount++;
      eventInfo.contacts.push(contact);

      // Update most recent date
      if (new Date(contact.taggedAt) > new Date(eventInfo.mostRecentDate)) {
        eventInfo.mostRecentDate = contact.taggedAt;
      }

      // Count follow-up statuses
      const status = contact.followUpStatus || 'none';
      eventInfo.followUpStats[status]++;
    });

    // Calculate completion rates and sort
    const events = Array.from(eventMap.values()).map((event) => {
      const totalWithFollowUp = event.contactCount - event.followUpStats.none;
      event.completionRate = totalWithFollowUp > 0 
        ? (event.followUpStats.done / totalWithFollowUp) * 100 
        : 0;
      return event;
    });

    // Sort by most recent date
    return events.sort((a, b) => 
      new Date(b.mostRecentDate).getTime() - new Date(a.mostRecentDate).getTime()
    );
  }, [contacts]);

  return eventData;
};
