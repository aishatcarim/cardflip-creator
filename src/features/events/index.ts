// Events Feature Public API
// ────────────────────────────────────────────────────────────

// Pages
export { default as EventsPage } from './pages/EventsPage';
export { default as EventDetailPage } from './pages/EventDetailPage';

// Hooks
export { useEventsStore } from './store/eventsStore';
export { useEventData } from './hooks/useEventData';

// Types
export type { 
  Event, 
  EventData 
} from './store/eventsStore';

