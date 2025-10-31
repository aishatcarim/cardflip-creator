import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Event {
  id: string;
  name: string;
  description?: string;
  date: string;
  location?: string;
  imageUrl?: string;
  createdAt: string;
}

interface EventsState {
  events: Event[];
  addEvent: (event: Omit<Event, 'id' | 'createdAt'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  getEventById: (id: string) => Event | undefined;
}

// Mock events for demonstration
const mockEvents: Event[] = [
  {
    id: 'event-mock-1',
    name: 'Tech Summit 2024',
    description: 'Annual technology conference featuring the latest innovations in AI, cloud computing, and software development.',
    date: '2024-03-15',
    location: 'San Francisco Convention Center',
    imageUrl: '/src/assets/event-banners/conference-default.jpg',
    createdAt: '2024-03-01T10:00:00.000Z',
  },
  {
    id: 'event-mock-2',
    name: 'Startup Networking Mixer',
    description: 'Connect with founders, investors, and innovators in the startup ecosystem.',
    date: '2024-04-20',
    location: 'Silicon Valley Hub',
    imageUrl: '/src/assets/event-banners/meetup-default.jpg',
    createdAt: '2024-04-01T10:00:00.000Z',
  },
];

export const useEventsStore = create<EventsState>()(
  persist(
    (set, get) => ({
      events: mockEvents,
      
      addEvent: (event) => {
        const newEvent: Event = {
          ...event,
          id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          events: [...state.events, newEvent],
        }));
      },
      
      updateEvent: (id, eventUpdate) => {
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id ? { ...event, ...eventUpdate } : event
          ),
        }));
      },
      
      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
        }));
      },
      
      getEventById: (id) => {
        return get().events.find((event) => event.id === id);
      },
    }),
    {
      name: 'events-storage',
    }
  )
);
