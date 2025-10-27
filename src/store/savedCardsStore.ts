import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CardData } from './cardStore';

export interface SavedCard {
  id: string;
  title: string;
  tags: string[];
  event: string;
  cardData: CardData;
  createdAt: string;
  hidden: boolean;
}

export interface DefaultCardData {
  front: Partial<CardData>;
  back: Partial<CardData>;
}

interface SavedCardsStore {
  savedCards: SavedCard[];
  defaults: DefaultCardData;
  saveCard: (card: Omit<SavedCard, 'id' | 'createdAt' | 'hidden'>) => void;
  updateCard: (id: string, updates: Partial<SavedCard>) => void;
  deleteCard: (id: string) => void;
  hideCard: (id: string, hidden: boolean) => void;
  updateDefaults: (defaults: DefaultCardData) => void;
  applyDefaults: (currentData: CardData) => CardData;
}

export const useSavedCardsStore = create<SavedCardsStore>()(
  persist(
    (set, get) => ({
      savedCards: [],
      defaults: {
        front: {},
        back: {},
      },

      saveCard: (card) => {
        const newCard: SavedCard = {
          ...card,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          hidden: false,
        };
        set((state) => ({
          savedCards: [newCard, ...state.savedCards],
        }));
      },

      updateCard: (id, updates) =>
        set((state) => ({
          savedCards: state.savedCards.map((card) =>
            card.id === id ? { ...card, ...updates } : card
          ),
        })),

      deleteCard: (id) =>
        set((state) => ({
          savedCards: state.savedCards.filter((card) => card.id !== id),
        })),

      hideCard: (id, hidden) =>
        set((state) => ({
          savedCards: state.savedCards.map((card) =>
            card.id === id ? { ...card, hidden } : card
          ),
        })),

      updateDefaults: (defaults) =>
        set({ defaults }),

      applyDefaults: (currentData) => {
        const { defaults } = get();
        return {
          ...currentData,
          ...defaults.front,
          ...defaults.back,
        };
      },
    }),
    {
      name: 'saved-cards-storage',
    }
  )
);
