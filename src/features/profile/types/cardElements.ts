// Card Element System Types

export type ElementType = 'text' | 'image' | 'shape' | 'qr' | 'icon';

export interface ElementStyles {
  color?: string;
  backgroundColor?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  fontFamily?: string;
  textAlign?: 'left' | 'center' | 'right';
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  opacity?: number;
  letterSpacing?: number;
  lineHeight?: number;
  writingMode?: 'horizontal-tb' | 'vertical-rl';
  grayscale?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill';
}

export interface CardElement {
  id: string;
  type: ElementType;
  x: number;           // percentage (0-100)
  y: number;           // percentage (0-100)
  width: number;       // percentage (0-100)
  height: number;      // percentage (0-100)
  rotation: number;    // degrees
  locked: boolean;
  zIndex: number;
  dataBinding?: string; // e.g., "{{fullName}}", "{{companyLogo}}"
  content?: string;     // static content if no data binding
  styles: ElementStyles;
}

export interface CardSide {
  backgroundColor: string;
  backgroundImage?: string;
  elements: CardElement[];
}

export interface CardTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  isBuiltIn: boolean;
  category: 'professional' | 'creative' | 'minimal' | 'custom';
  front: CardSide;
  back: CardSide;
  createdAt: string;
  updatedAt: string;
}

// Data fields available for binding
export interface CardDataFields {
  fullName: string;
  firstName: string;
  lastName: string;
  role: string;
  companyName: string;
  companyWebsite: string;
  companyLogo: string | null;
  profileImage: string | null;
  tagline: string;
  bio: string;
  email: string;
  phone: string;
  interests: string[];
  ctaText: string;
  quickLinks: Array<{ label: string; url: string; icon: string }>;
}

// Helper to extract data binding value
export const resolveDataBinding = (
  binding: string | undefined,
  data: CardDataFields
): string => {
  if (!binding) return '';
  const match = binding.match(/\{\{(\w+)\}\}/);
  if (!match) return binding;
  const key = match[1] as keyof CardDataFields;
  const value = data[key];
  if (Array.isArray(value)) return value.join(', ');
  return value?.toString() || '';
};
