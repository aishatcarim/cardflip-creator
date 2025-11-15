// Contacts Feature Public API
// ────────────────────────────────────────────────────────────

// Pages
export { default as ContactsPage } from './pages/ContactsPage';
export { default as ContactDetailPage } from './pages/ContactDetailPage';

// Hooks
export { useNetworkContactsStore } from './store/networkContactsStore';

// Types
export type {
  NetworkContact,
  ContactsSettings
} from './store/networkContactsStore';

// Components (if needed by other features)
export { ContactCard } from './components/ContactsList/ContactCard';

