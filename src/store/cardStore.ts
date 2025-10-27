import { create } from 'zustand';

export interface CardData {
  // Front side
  fullName: string;
  role: string;
  profileImage: string | null;
  grayscale: boolean;
  companyName: string;
  companyWebsite: string;
  companyLogo: string | null;
  tagline: string;
  showLogo: boolean;
  portraitOrientation: 'left' | 'right';
  
  // Back side
  bio: string;
  interests: string[];
  email: string;
  phone: string;
  quickLinks: Array<{ label: string; url: string; icon: string }>;
  ctaText: string;
  
  // Design
  accentColor: string;
  backgroundColor: string;
  brandColor: string;
  textColor: string;
  backgroundImage: string | null;
  fontFamily: string;
  fontSize: number;
  shadowDepth: number;
  frontLayoutStyle: 'left' | 'right' | 'centered';
  backLayoutStyle: 'simple' | 'extended' | 'minimal';
  
  // Image controls
  imageWidth: number;
  imageHeight: number;
  imageScale: number;
  imagePositionX: number;
  imagePositionY: number;
  
  // Band controls
  bandHeight: number;
  
  // UI State
  isFlipped: boolean;
}

interface CardStore {
  cardData: CardData;
  updateCardData: (updates: Partial<CardData>) => void;
  toggleFlip: () => void;
  resetCard: () => void;
  addInterest: (interest: string) => void;
  removeInterest: (interest: string) => void;
  addQuickLink: (link: { label: string; url: string; icon: string }) => void;
  removeQuickLink: (index: number) => void;
}

const defaultCardData: CardData = {
  fullName: 'John Doe',
  role: 'Founder / Director',
  profileImage: null,
  grayscale: true,
  companyName: 'YOURCOMPANY',
  companyWebsite: 'www.yourcompany.co',
  companyLogo: null,
  tagline: '',
  showLogo: true,
  portraitOrientation: 'left',
  
  bio: 'Passionate about creating meaningful connections and driving innovation in business.',
  interests: ['Innovation', 'Networking', 'Technology'],
  email: 'john@yourcompany.co',
  phone: '+1 (555) 123-4567',
  quickLinks: [
    { label: 'LinkedIn', url: 'linkedin.com/in/johndoe', icon: 'Linkedin' },
    { label: 'Twitter', url: 'twitter.com/johndoe', icon: 'Twitter' },
  ],
  ctaText: 'Let\'s connect!',
  
  accentColor: '#0ea5e9',
  backgroundColor: '#ffffff',
  brandColor: '#0ea5e9',
  textColor: '#000000',
  backgroundImage: null,
  fontFamily: 'Inter',
  fontSize: 1,
  shadowDepth: 0.5,
  frontLayoutStyle: 'left',
  backLayoutStyle: 'simple',
  
  imageWidth: 50,
  imageHeight: 75,
  imageScale: 1,
  imagePositionX: 0,
  imagePositionY: 0,
  
  bandHeight: 1,
  
  isFlipped: false,
};

export const useCardStore = create<CardStore>((set) => ({
  cardData: defaultCardData,
  
  updateCardData: (updates) =>
    set((state) => ({
      cardData: { ...state.cardData, ...updates },
    })),
  
  toggleFlip: () =>
    set((state) => ({
      cardData: { ...state.cardData, isFlipped: !state.cardData.isFlipped },
    })),
  
  resetCard: () =>
    set({ cardData: defaultCardData }),
  
  addInterest: (interest) =>
    set((state) => ({
      cardData: {
        ...state.cardData,
        interests: [...state.cardData.interests, interest],
      },
    })),
  
  removeInterest: (interest) =>
    set((state) => ({
      cardData: {
        ...state.cardData,
        interests: state.cardData.interests.filter((i) => i !== interest),
      },
    })),
  
  addQuickLink: (link) =>
    set((state) => ({
      cardData: {
        ...state.cardData,
        quickLinks: [...state.cardData.quickLinks, link],
      },
    })),
  
  removeQuickLink: (index) =>
    set((state) => ({
      cardData: {
        ...state.cardData,
        quickLinks: state.cardData.quickLinks.filter((_, i) => i !== index),
      },
    })),
}));
