import { useMemo } from 'react';
import { useNetworkContactsStore } from '@contacts/store/networkContactsStore';
import { useEventsStore } from '@events/store/eventsStore';

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
  bannerUrl?: string;
}

export const useEventData = () => {
  const contacts = useNetworkContactsStore((state) => state.contacts);
  const events = useEventsStore((state) => state.events);

  const eventData = useMemo(() => {
    const eventMap = new Map<string, EventData>();

    contacts.forEach((contact) => {
      const eventName = contact.event || 'Unspecified Event';
      
      if (!eventMap.has(eventName)) {
        // Find matching event in events store to get banner
        const matchingEvent = events.find(e => e.name === eventName);
        
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
          contacts: [],
          bannerUrl: matchingEvent?.imageUrl
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
    const eventsList = Array.from(eventMap.values()).map((event) => {
      const totalWithFollowUp = event.contactCount - event.followUpStats.none;
      event.completionRate = totalWithFollowUp > 0 
        ? (event.followUpStats.done / totalWithFollowUp) * 100 
        : 0;
      return event;
    });

    // Sort by most recent date
    return eventsList.sort((a, b) => 
      new Date(b.mostRecentDate).getTime() - new Date(a.mostRecentDate).getTime()
    );
  }, [contacts, events]);

  return eventData;
};
