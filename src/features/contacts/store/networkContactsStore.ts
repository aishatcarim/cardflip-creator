import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface NetworkContact {
  id: string;
  profileCardId: string;
  contactName: string;
  event: string;
  industry: string;
  interests: string[];
  notes: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
  taggedAt: string;
  isQuickTag: boolean;
  metadata?: Record<string, any>;
  followUpStatus?: 'pending' | 'done' | 'snoozed' | 'none';
  followUpDate?: string;
  followUpDueDate?: string;
  snoozedUntil?: string;
  followUpNotes?: string;
}

export interface ContactsSettings {
  autoShowTagModal: boolean;
  defaultToQuickTag: boolean;
  defaultEvent: string;
}

interface NetworkContactsStore {
  contacts: NetworkContact[];
  settings: ContactsSettings;
  addContact: (contact: Omit<NetworkContact, 'id' | 'taggedAt'>) => void;
  updateContact: (id: string, updates: Partial<NetworkContact>) => void;
  deleteContact: (id: string) => void;
  deleteMultipleContacts: (ids: string[]) => void;
  getContactsByCard: (cardId: string) => NetworkContact[];
  getContactsByEvent: (event: string) => NetworkContact[];
  searchContacts: (query: string) => NetworkContact[];
  updateSettings: (settings: Partial<ContactsSettings>) => void;
  exportContactsCSV: () => void;
  exportContactVCard: (contactId: string) => void;
  exportMultipleVCards: (contactIds: string[]) => void;
  updateFollowUpStatus: (contactId: string, status: NetworkContact['followUpStatus'], date?: string) => void;
  snoozeContact: (contactId: string, untilDate: string) => void;
  bulkUpdateFollowUpStatus: (contactIds: string[], status: NetworkContact['followUpStatus']) => void;
}

// Mock contacts for demonstration
const mockContacts: NetworkContact[] = [
  {
    id: 'contact-mock-1',
    profileCardId: '',
    contactName: 'Sarah Johnson',
    email: 'sarah.johnson@techcorp.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Solutions',
    title: 'Senior Product Manager',
    event: 'Tech Summit 2024',
    industry: 'Technology',
    interests: ['AI', 'Product Management', 'SaaS'],
    notes: 'Interested in our AI solutions. Follow up about partnership opportunities.',
    taggedAt: '2024-03-15T14:30:00.000Z',
    isQuickTag: false,
    followUpStatus: 'pending',
    followUpDueDate: '2024-03-22',
  },
  {
    id: 'contact-mock-2',
    profileCardId: '',
    contactName: 'Michael Chen',
    email: 'mchen@innovate.io',
    phone: '+1 (555) 234-5678',
    company: 'Innovate.io',
    title: 'CTO',
    event: 'Tech Summit 2024',
    industry: 'Technology',
    interests: ['Cloud Infrastructure', 'DevOps', 'Scaling'],
    notes: 'Looking for cloud infrastructure partners. Discussed potential collaboration.',
    taggedAt: '2024-03-15T15:45:00.000Z',
    isQuickTag: false,
    followUpStatus: 'done',
    followUpDate: '2024-03-18T10:00:00.000Z',
  },
  {
    id: 'contact-mock-3',
    profileCardId: '',
    contactName: 'Emily Rodriguez',
    email: 'emily.r@datastream.com',
    phone: '+1 (555) 345-6789',
    company: 'DataStream Analytics',
    title: 'VP of Engineering',
    event: 'Tech Summit 2024',
    industry: 'Data Analytics',
    interests: ['Big Data', 'Machine Learning', 'Analytics'],
    notes: 'Impressed by our data processing capabilities. Wants a demo.',
    taggedAt: '2024-03-15T16:20:00.000Z',
    isQuickTag: false,
    followUpStatus: 'snoozed',
    snoozedUntil: '2024-03-25',
  },
  {
    id: 'contact-mock-4',
    profileCardId: '',
    contactName: 'David Kim',
    email: 'david@startuphub.com',
    company: 'StartupHub',
    title: 'Founder & CEO',
    event: 'Startup Networking Mixer',
    industry: 'Startups',
    interests: ['Entrepreneurship', 'Funding', 'Mentorship'],
    notes: 'Early stage founder seeking mentorship and investment connections.',
    taggedAt: '2024-04-20T18:15:00.000Z',
    isQuickTag: true,
    followUpStatus: 'pending',
    followUpDueDate: '2024-04-27',
  },
  {
    id: 'contact-mock-5',
    profileCardId: '',
    contactName: 'Jessica Martinez',
    email: 'jmartinez@venturecap.com',
    phone: '+1 (555) 456-7890',
    company: 'VentureCap Partners',
    title: 'Investment Partner',
    event: 'Startup Networking Mixer',
    industry: 'Venture Capital',
    interests: ['AI/ML', 'Series A', 'Tech Investments'],
    notes: 'Interested in Series A opportunities in AI/ML space.',
    taggedAt: '2024-04-20T19:30:00.000Z',
    isQuickTag: false,
    followUpStatus: 'done',
    followUpDate: '2024-04-22T14:00:00.000Z',
  },
];

export const useNetworkContactsStore = create<NetworkContactsStore>()(
  persist(
    (set, get) => ({
      contacts: mockContacts,
      settings: {
        autoShowTagModal: false,
        defaultToQuickTag: true,
        defaultEvent: '',
      },

      addContact: (contact) => {
        const newContact: NetworkContact = {
          ...contact,
          id: crypto.randomUUID(),
          taggedAt: new Date().toISOString(),
        };
        set((state) => ({
          contacts: [newContact, ...state.contacts],
        }));
      },

      updateContact: (id, updates) =>
        set((state) => ({
          contacts: state.contacts.map((contact) =>
            contact.id === id ? { ...contact, ...updates } : contact
          ),
        })),

      deleteContact: (id) =>
        set((state) => ({
          contacts: state.contacts.filter((contact) => contact.id !== id),
        })),

      deleteMultipleContacts: (ids) =>
        set((state) => ({
          contacts: state.contacts.filter((contact) => !ids.includes(contact.id)),
        })),

      getContactsByCard: (cardId) => {
        return get().contacts.filter((contact) => contact.profileCardId === cardId);
      },

      getContactsByEvent: (event) => {
        return get().contacts.filter((contact) => contact.event === event);
      },

      searchContacts: (query) => {
        const lowerQuery = query.toLowerCase();
        return get().contacts.filter(
          (contact) =>
            contact.contactName.toLowerCase().includes(lowerQuery) ||
            contact.notes.toLowerCase().includes(lowerQuery) ||
            contact.event.toLowerCase().includes(lowerQuery) ||
            contact.industry.toLowerCase().includes(lowerQuery) ||
            contact.company?.toLowerCase().includes(lowerQuery) ||
            contact.email?.toLowerCase().includes(lowerQuery)
        );
      },

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      exportContactsCSV: () => {
        const { contacts } = get();
        const headers = [
          'Name',
          'Event',
          'Industry',
          'Email',
          'Phone',
          'Company',
          'Interests',
          'Notes',
          'Tagged Date',
        ];
        const rows = contacts.map((c) => [
          c.contactName,
          c.event,
          c.industry,
          c.email || '',
          c.phone || '',
          c.company || '',
          c.interests.join(', '),
          c.notes,
          new Date(c.taggedAt).toLocaleDateString(),
        ]);

        const csvContent = [headers, ...rows]
          .map((row) => row.map((cell) => `"${cell}"`).join(','))
          .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `network-contacts-${Date.now()}.csv`;
        link.click();
        URL.revokeObjectURL(url);
      },

      exportContactVCard: (contactId) => {
        const contact = get().contacts.find((c) => c.id === contactId);
        if (!contact) return;

        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${contact.contactName}
EMAIL:${contact.email || ''}
TEL:${contact.phone || ''}
ORG:${contact.company || ''}
TITLE:${contact.industry}
NOTE:Event: ${contact.event}\\nNotes: ${contact.notes}
END:VCARD`;

        const blob = new Blob([vcard], { type: 'text/vcard' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${contact.contactName.replace(/\s/g, '-')}.vcf`;
        link.click();
        URL.revokeObjectURL(url);
      },

      exportMultipleVCards: (contactIds) => {
        const { contacts } = get();
        const selectedContacts = contacts.filter((c) => contactIds.includes(c.id));

        selectedContacts.forEach((contact) => {
          get().exportContactVCard(contact.id);
        });
      },

      updateFollowUpStatus: (contactId, status, date) => {
        set((state) => ({
          contacts: state.contacts.map((contact) =>
            contact.id === contactId
              ? {
                  ...contact,
                  followUpStatus: status,
                  followUpDate: status === 'done' ? (date || new Date().toISOString()) : contact.followUpDate,
                  snoozedUntil: status === 'snoozed' ? undefined : contact.snoozedUntil
                }
              : contact
          )
        }));
      },

      snoozeContact: (contactId, untilDate) => {
        set((state) => ({
          contacts: state.contacts.map((contact) =>
            contact.id === contactId
              ? {
                  ...contact,
                  followUpStatus: 'snoozed',
                  snoozedUntil: untilDate
                }
              : contact
          )
        }));
      },

      bulkUpdateFollowUpStatus: (contactIds, status) => {
        const date = status === 'done' ? new Date().toISOString() : undefined;
        set((state) => ({
          contacts: state.contacts.map((contact) =>
            contactIds.includes(contact.id)
              ? {
                  ...contact,
                  followUpStatus: status,
                  followUpDate: date,
                  snoozedUntil: status === 'snoozed' ? contact.snoozedUntil : undefined
                }
              : contact
          )
        }));
      }
    }),
    {
      name: 'network-contacts-storage',
    }
  )
);
