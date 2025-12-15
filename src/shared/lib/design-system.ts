// Design System - Consistent spacing, typography, and animations
// ────────────────────────────────────────────────────────────

// Spacing Scale (in rem units)
export const spacing = {
  xs: 0.5,   // 8px
  sm: 0.75,  // 12px
  md: 1,     // 16px
  lg: 1.5,   // 24px
  xl: 2,     // 32px
  '2xl': 3,  // 48px
  '3xl': 4,  // 64px
} as const;

// Typography Scale
export const typography = {
  // Font sizes
  'xs': 'text-xs',      // 12px
  'sm': 'text-sm',      // 14px
  'base': 'text-base',  // 16px
  'lg': 'text-lg',      // 18px
  'xl': 'text-xl',      // 20px
  '2xl': 'text-2xl',    // 24px
  '3xl': 'text-3xl',    // 30px
  '4xl': 'text-4xl',    // 36px

  // Font weights
  'weightNormal': 'font-normal',
  'weightMedium': 'font-medium',
  'weightSemibold': 'font-semibold',
  'weightBold': 'font-bold',

  // Line heights
  'leadingTight': 'leading-tight',
  'leadingNormal': 'leading-normal',
  'leadingRelaxed': 'leading-relaxed',
} as const;

// Color Tokens
export const colors = {
  // Semantic colors
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  accent: 'hsl(var(--accent))',
  destructive: 'hsl(var(--destructive))',
  muted: 'hsl(var(--muted))',

  // Status colors
  success: 'hsl(142 76% 36%)',   // green-600
  warning: 'hsl(38 92% 50%)',    // yellow-500
  error: 'hsl(0 84% 60%)',       // red-500
  info: 'hsl(217 91% 60%)',      // blue-500
} as const;

// Animation Variants (Framer Motion)
export const animations = {
  fadeIn: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  },

  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  },

  slideInRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.3 }
  },

  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.2 }
  },

  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }
} as const;

// Component Variants
export const componentVariants = {
  button: {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  },

  card: {
    default: "bg-card text-card-foreground shadow-sm border border-border rounded-lg",
    elevated: "bg-card text-card-foreground shadow-md border border-border rounded-lg",
    outline: "border-2 border-dashed border-border rounded-lg",
  },

  input: {
    default: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  }
} as const;

// Responsive Breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Mobile Detection Hook (can be used throughout app)
export const useIsMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

// Utility Classes
export const utilities = {
  // Focus styles
  focus: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",

  // Transition
  transition: "transition-colors duration-200",

  // Container
  container: "container mx-auto px-4 sm:px-6 lg:px-8",

  // Flex utilities
  flexCenter: "flex items-center justify-center",
  flexBetween: "flex items-center justify-between",
  flexStart: "flex items-center justify-start",

  // Text utilities
  textMuted: "text-muted-foreground",
  textSecondary: "text-secondary-foreground",
} as const;
