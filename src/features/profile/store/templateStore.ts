import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CardTemplate, CardSide, CardElement } from '../types/cardElements';

// Built-in Classic Template (matches current CardFront/CardBack design)
const classicTemplate: CardTemplate = {
  id: 'classic',
  name: 'Classic Professional',
  description: 'Clean, professional layout with portrait image and company branding',
  isBuiltIn: true,
  category: 'professional',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  front: {
    backgroundColor: '#ffffff',
    elements: [
      {
        id: 'logo',
        type: 'image',
        x: 85,
        y: 3,
        width: 12,
        height: 8,
        rotation: 0,
        locked: false,
        zIndex: 10,
        dataBinding: '{{companyLogo}}',
        styles: { objectFit: 'contain' }
      },
      {
        id: 'name',
        type: 'text',
        x: 4,
        y: 3,
        width: 45,
        height: 15,
        rotation: 0,
        locked: false,
        zIndex: 10,
        dataBinding: '{{fullName}}',
        styles: { fontSize: 24, fontWeight: 'normal', color: '#000000' }
      },
      {
        id: 'role',
        type: 'text',
        x: 4,
        y: 18,
        width: 45,
        height: 5,
        rotation: 0,
        locked: false,
        zIndex: 10,
        dataBinding: '{{role}}',
        styles: { fontSize: 12, color: '#000000' }
      },
      {
        id: 'website',
        type: 'text',
        x: 4,
        y: 45,
        width: 10,
        height: 20,
        rotation: 0,
        locked: false,
        zIndex: 10,
        dataBinding: '{{companyWebsite}}',
        styles: { fontSize: 10, writingMode: 'vertical-rl', color: '#000000' }
      },
      {
        id: 'portrait',
        type: 'image',
        x: 50,
        y: 0,
        width: 50,
        height: 85,
        rotation: 0,
        locked: false,
        zIndex: 5,
        dataBinding: '{{profileImage}}',
        styles: { objectFit: 'cover', grayscale: true }
      },
      {
        id: 'footer',
        type: 'shape',
        x: 0,
        y: 88,
        width: 100,
        height: 12,
        rotation: 0,
        locked: false,
        zIndex: 8,
        styles: { backgroundColor: '#0ea5e9' }
      },
      {
        id: 'companyName',
        type: 'text',
        x: 0,
        y: 91,
        width: 100,
        height: 8,
        rotation: 0,
        locked: false,
        zIndex: 9,
        dataBinding: '{{companyName}}',
        styles: { fontSize: 14, textAlign: 'center', letterSpacing: 3, color: '#ffffff' }
      }
    ]
  },
  back: {
    backgroundColor: '#ffffff',
    elements: [
      {
        id: 'bio',
        type: 'text',
        x: 5,
        y: 5,
        width: 90,
        height: 20,
        rotation: 0,
        locked: false,
        zIndex: 10,
        dataBinding: '{{bio}}',
        styles: { fontSize: 14, lineHeight: 1.5, color: '#000000' }
      },
      {
        id: 'interestsLabel',
        type: 'text',
        x: 5,
        y: 28,
        width: 90,
        height: 5,
        rotation: 0,
        locked: false,
        zIndex: 10,
        content: 'INTERESTS',
        styles: { fontSize: 10, fontWeight: 'medium', opacity: 0.7, color: '#000000' }
      },
      {
        id: 'interests',
        type: 'text',
        x: 5,
        y: 34,
        width: 90,
        height: 10,
        rotation: 0,
        locked: false,
        zIndex: 10,
        dataBinding: '{{interests}}',
        styles: { fontSize: 12, color: '#000000' }
      },
      {
        id: 'email',
        type: 'text',
        x: 5,
        y: 48,
        width: 90,
        height: 5,
        rotation: 0,
        locked: false,
        zIndex: 10,
        dataBinding: '{{email}}',
        styles: { fontSize: 12, opacity: 0.7, color: '#000000' }
      },
      {
        id: 'phone',
        type: 'text',
        x: 5,
        y: 54,
        width: 90,
        height: 5,
        rotation: 0,
        locked: false,
        zIndex: 10,
        dataBinding: '{{phone}}',
        styles: { fontSize: 12, opacity: 0.7, color: '#000000' }
      },
      {
        id: 'cta',
        type: 'text',
        x: 5,
        y: 80,
        width: 90,
        height: 8,
        rotation: 0,
        locked: false,
        zIndex: 10,
        dataBinding: '{{ctaText}}',
        styles: { fontSize: 12, textAlign: 'center', fontWeight: 'medium', color: '#0ea5e9' }
      }
    ]
  }
};

// Modern Minimal Template
const minimalTemplate: CardTemplate = {
  id: 'minimal',
  name: 'Modern Minimal',
  description: 'Ultra-clean design with bold typography and generous whitespace',
  isBuiltIn: true,
  category: 'minimal',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  front: {
    backgroundColor: '#fafafa',
    elements: [
      {
        id: 'name',
        type: 'text',
        x: 8,
        y: 40,
        width: 84,
        height: 15,
        rotation: 0,
        locked: false,
        zIndex: 10,
        dataBinding: '{{fullName}}',
        styles: { fontSize: 32, fontWeight: 'bold', color: '#18181b' }
      },
      {
        id: 'role',
        type: 'text',
        x: 8,
        y: 56,
        width: 84,
        height: 8,
        rotation: 0,
        locked: false,
        zIndex: 10,
        dataBinding: '{{role}}',
        styles: { fontSize: 14, color: '#71717a' }
      },
      {
        id: 'accent',
        type: 'shape',
        x: 8,
        y: 68,
        width: 20,
        height: 1,
        rotation: 0,
        locked: false,
        zIndex: 10,
        styles: { backgroundColor: '#18181b' }
      }
    ]
  },
  back: {
    backgroundColor: '#18181b',
    elements: [
      {
        id: 'email',
        type: 'text',
        x: 8,
        y: 35,
        width: 84,
        height: 8,
        rotation: 0,
        locked: false,
        zIndex: 10,
        dataBinding: '{{email}}',
        styles: { fontSize: 14, color: '#fafafa' }
      },
      {
        id: 'phone',
        type: 'text',
        x: 8,
        y: 45,
        width: 84,
        height: 8,
        rotation: 0,
        locked: false,
        zIndex: 10,
        dataBinding: '{{phone}}',
        styles: { fontSize: 14, color: '#fafafa' }
      },
      {
        id: 'website',
        type: 'text',
        x: 8,
        y: 55,
        width: 84,
        height: 8,
        rotation: 0,
        locked: false,
        zIndex: 10,
        dataBinding: '{{companyWebsite}}',
        styles: { fontSize: 14, color: '#a1a1aa' }
      }
    ]
  }
};

// Creative Bold Template
const creativeTemplate: CardTemplate = {
  id: 'creative',
  name: 'Creative Bold',
  description: 'Eye-catching design with vibrant colors and dynamic layout',
  isBuiltIn: true,
  category: 'creative',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  front: {
    backgroundColor: '#7c3aed',
    elements: [
      {
        id: 'portrait',
        type: 'image',
        x: 0,
        y: 0,
        width: 100,
        height: 60,
        rotation: 0,
        locked: false,
        zIndex: 5,
        dataBinding: '{{profileImage}}',
        styles: { objectFit: 'cover' }
      },
      {
        id: 'overlay',
        type: 'shape',
        x: 0,
        y: 55,
        width: 100,
        height: 45,
        rotation: 0,
        locked: false,
        zIndex: 6,
        styles: { backgroundColor: '#7c3aed' }
      },
      {
        id: 'name',
        type: 'text',
        x: 8,
        y: 62,
        width: 84,
        height: 15,
        rotation: 0,
        locked: false,
        zIndex: 10,
        dataBinding: '{{fullName}}',
        styles: { fontSize: 28, fontWeight: 'bold', color: '#ffffff' }
      },
      {
        id: 'role',
        type: 'text',
        x: 8,
        y: 78,
        width: 84,
        height: 8,
        rotation: 0,
        locked: false,
        zIndex: 10,
        dataBinding: '{{role}}',
        styles: { fontSize: 14, color: '#e9d5ff' }
      },
      {
        id: 'company',
        type: 'text',
        x: 8,
        y: 88,
        width: 84,
        height: 6,
        rotation: 0,
        locked: false,
        zIndex: 10,
        dataBinding: '{{companyName}}',
        styles: { fontSize: 12, letterSpacing: 2, color: '#c4b5fd' }
      }
    ]
  },
  back: {
    backgroundColor: '#faf5ff',
    elements: [
      {
        id: 'bio',
        type: 'text',
        x: 8,
        y: 10,
        width: 84,
        height: 25,
        rotation: 0,
        locked: false,
        zIndex: 10,
        dataBinding: '{{bio}}',
        styles: { fontSize: 14, lineHeight: 1.6, color: '#581c87' }
      },
      {
        id: 'contactBar',
        type: 'shape',
        x: 0,
        y: 70,
        width: 100,
        height: 30,
        rotation: 0,
        locked: false,
        zIndex: 5,
        styles: { backgroundColor: '#7c3aed' }
      },
      {
        id: 'email',
        type: 'text',
        x: 8,
        y: 76,
        width: 84,
        height: 6,
        rotation: 0,
        locked: false,
        zIndex: 10,
        dataBinding: '{{email}}',
        styles: { fontSize: 12, color: '#ffffff' }
      },
      {
        id: 'phone',
        type: 'text',
        x: 8,
        y: 84,
        width: 84,
        height: 6,
        rotation: 0,
        locked: false,
        zIndex: 10,
        dataBinding: '{{phone}}',
        styles: { fontSize: 12, color: '#e9d5ff' }
      }
    ]
  }
};

// Executive Template
const executiveTemplate: CardTemplate = {
  id: 'executive',
  name: 'Executive',
  description: 'Sophisticated design for senior professionals and executives',
  isBuiltIn: true,
  category: 'professional',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  front: {
    backgroundColor: '#1f2937',
    elements: [
      {
        id: 'goldAccent',
        type: 'shape',
        x: 0,
        y: 0,
        width: 2,
        height: 100,
        rotation: 0,
        locked: false,
        zIndex: 10,
        styles: { backgroundColor: '#d4af37' }
      },
      {
        id: 'logo',
        type: 'image',
        x: 8,
        y: 8,
        width: 15,
        height: 10,
        rotation: 0,
        locked: false,
        zIndex: 10,
        dataBinding: '{{companyLogo}}',
        styles: { objectFit: 'contain' }
      },
      {
        id: 'name',
        type: 'text',
        x: 8,
        y: 45,
        width: 84,
        height: 12,
        rotation: 0,
        locked: false,
        zIndex: 10,
        dataBinding: '{{fullName}}',
        styles: { fontSize: 26, fontWeight: 'semibold', color: '#ffffff' }
      },
      {
        id: 'role',
        type: 'text',
        x: 8,
        y: 58,
        width: 84,
        height: 8,
        rotation: 0,
        locked: false,
        zIndex: 10,
        dataBinding: '{{role}}',
        styles: { fontSize: 13, color: '#d4af37', letterSpacing: 1 }
      },
      {
        id: 'company',
        type: 'text',
        x: 8,
        y: 85,
        width: 84,
        height: 8,
        rotation: 0,
        locked: false,
        zIndex: 10,
        dataBinding: '{{companyName}}',
        styles: { fontSize: 11, letterSpacing: 3, color: '#9ca3af' }
      }
    ]
  },
  back: {
    backgroundColor: '#ffffff',
    elements: [
      {
        id: 'goldAccent',
        type: 'shape',
        x: 98,
        y: 0,
        width: 2,
        height: 100,
        rotation: 0,
        locked: false,
        zIndex: 10,
        styles: { backgroundColor: '#d4af37' }
      },
      {
        id: 'bio',
        type: 'text',
        x: 8,
        y: 12,
        width: 84,
        height: 25,
        rotation: 0,
        locked: false,
        zIndex: 10,
        dataBinding: '{{bio}}',
        styles: { fontSize: 13, lineHeight: 1.7, color: '#374151' }
      },
      {
        id: 'divider',
        type: 'shape',
        x: 8,
        y: 45,
        width: 84,
        height: 0.5,
        rotation: 0,
        locked: false,
        zIndex: 10,
        styles: { backgroundColor: '#e5e7eb' }
      },
      {
        id: 'email',
        type: 'text',
        x: 8,
        y: 52,
        width: 84,
        height: 6,
        rotation: 0,
        locked: false,
        zIndex: 10,
        dataBinding: '{{email}}',
        styles: { fontSize: 12, color: '#6b7280' }
      },
      {
        id: 'phone',
        type: 'text',
        x: 8,
        y: 60,
        width: 84,
        height: 6,
        rotation: 0,
        locked: false,
        zIndex: 10,
        dataBinding: '{{phone}}',
        styles: { fontSize: 12, color: '#6b7280' }
      },
      {
        id: 'website',
        type: 'text',
        x: 8,
        y: 68,
        width: 84,
        height: 6,
        rotation: 0,
        locked: false,
        zIndex: 10,
        dataBinding: '{{companyWebsite}}',
        styles: { fontSize: 12, color: '#1f2937' }
      }
    ]
  }
};

// Blank template for custom designs
const blankTemplate: CardTemplate = {
  id: 'blank',
  name: 'Blank Canvas',
  description: 'Start from scratch and design your own card',
  isBuiltIn: true,
  category: 'custom',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  front: {
    backgroundColor: '#ffffff',
    elements: []
  },
  back: {
    backgroundColor: '#ffffff',
    elements: []
  }
};

const builtInTemplates: CardTemplate[] = [
  classicTemplate,
  minimalTemplate,
  creativeTemplate,
  executiveTemplate,
  blankTemplate
];

interface TemplateStore {
  templates: CardTemplate[];
  activeTemplateId: string | null;
  selectedTemplateId: string | null;
  
  // Actions
  setActiveTemplate: (id: string) => void;
  setSelectedTemplate: (id: string | null) => void;
  addTemplate: (template: Omit<CardTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTemplate: (id: string, updates: Partial<CardTemplate>) => void;
  duplicateTemplate: (id: string) => void;
  deleteTemplate: (id: string) => void;
  getTemplate: (id: string) => CardTemplate | undefined;
  getBuiltInTemplates: () => CardTemplate[];
  getCustomTemplates: () => CardTemplate[];
}

export const useTemplateStore = create<TemplateStore>()(
  persist(
    (set, get) => ({
      templates: builtInTemplates,
      activeTemplateId: 'classic',
      selectedTemplateId: null,

      setActiveTemplate: (id) => set({ activeTemplateId: id }),
      
      setSelectedTemplate: (id) => set({ selectedTemplateId: id }),

      addTemplate: (template) => {
        const newTemplate: CardTemplate = {
          ...template,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          templates: [...state.templates, newTemplate],
        }));
      },

      updateTemplate: (id, updates) =>
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id
              ? { ...t, ...updates, updatedAt: new Date().toISOString() }
              : t
          ),
        })),

      duplicateTemplate: (id) => {
        const template = get().templates.find((t) => t.id === id);
        if (template) {
          const duplicated: CardTemplate = {
            ...template,
            id: crypto.randomUUID(),
            name: `${template.name} (Copy)`,
            isBuiltIn: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          set((state) => ({
            templates: [...state.templates, duplicated],
          }));
        }
      },

      deleteTemplate: (id) => {
        const template = get().templates.find((t) => t.id === id);
        if (template && !template.isBuiltIn) {
          set((state) => ({
            templates: state.templates.filter((t) => t.id !== id),
            activeTemplateId:
              state.activeTemplateId === id ? 'classic' : state.activeTemplateId,
          }));
        }
      },

      getTemplate: (id) => get().templates.find((t) => t.id === id),
      
      getBuiltInTemplates: () => get().templates.filter((t) => t.isBuiltIn),
      
      getCustomTemplates: () => get().templates.filter((t) => !t.isBuiltIn),
    }),
    {
      name: 'template-storage',
    }
  )
);
