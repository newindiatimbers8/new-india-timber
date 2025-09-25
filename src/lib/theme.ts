import { type Config } from 'tailwindcss';

export interface ColorPalette {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
    card: string;
    popover: string;
    destructive: string;
    success: string;
    warning: string;
    info: string;
    timber: ColorPalette;
  };
  typography: {
    fontFamily: {
      sans: string[];
      serif: string[];
      mono: string[];
      heading: string[];
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
      '5xl': string;
      '6xl': string;
    };
    fontWeight: {
      thin: string;
      light: string;
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
      extrabold: string;
      black: string;
    };
    lineHeight: {
      none: string;
      tight: string;
      snug: string;
      normal: string;
      relaxed: string;
      loose: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    inner: string;
    none: string;
  };
  animations: {
    duration: {
      fast: string;
      normal: string;
      slow: string;
      slower: string;
    };
    easing: {
      easeIn: string;
      easeOut: string;
      easeInOut: string;
      linear: string;
    };
  };
}

/**
 * Modern Timber Craft Commerce Hub Theme Configuration
 * Based on shadcn/ui design system with timber industry colors
 */
export const timberTheme: ThemeConfig = {
  colors: {
    primary: 'hsl(25, 45%, 55%)', // Timber brown
    secondary: 'hsl(45, 25%, 85%)', // Light cream
    accent: 'hsl(15, 65%, 65%)', // Warm orange
    background: 'hsl(45, 35%, 95%)', // Very light cream
    foreground: 'hsl(25, 35%, 25%)', // Dark brown
    muted: 'hsl(45, 15%, 90%)', // Muted cream
    border: 'hsl(45, 20%, 80%)', // Light border
    card: 'hsl(0, 0%, 100%)', // Pure white
    popover: 'hsl(0, 0%, 100%)', // Pure white
    destructive: 'hsl(0, 84%, 60%)', // Red
    success: 'hsl(142, 76%, 36%)', // Green
    warning: 'hsl(38, 92%, 50%)', // Orange
    info: 'hsl(221, 83%, 53%)', // Blue
    timber: {
      50: '#faf8f5',
      100: '#f5f1eb',
      200: '#ece4d6',
      300: '#ddd1b5',
      400: '#c8b68a',
      500: '#b49b63',
      600: '#a48253',
      700: '#8a6b46',
      800: '#73583d',
      900: '#5f4a36',
      950: '#33251d',
    },
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      serif: ['Playfair Display', 'Georgia', 'serif'],
      mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      heading: ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
    },
    fontWeight: {
      thin: '100',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: 'none',
  },
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      slower: '700ms',
    },
    easing: {
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      linear: 'linear',
    },
  },
};

/**
 * CSS Custom Properties for the Timber Theme
 * These variables will be used in the CSS for consistent theming
 */
export const cssVariables = `
  :root {
    /* Base Colors */
    --background: ${timberTheme.colors.background};
    --foreground: ${timberTheme.colors.foreground};

    /* Primary Colors */
    --primary: ${timberTheme.colors.primary};
    --primary-foreground: hsl(0, 0%, 100%);
    --primary-light: hsl(25, 35%, 65%);
    --primary-dark: hsl(25, 55%, 45%);

    /* Secondary Colors */
    --secondary: ${timberTheme.colors.secondary};
    --secondary-foreground: ${timberTheme.colors.foreground};
    --secondary-light: hsl(45, 20%, 90%);
    --secondary-dark: hsl(45, 30%, 75%);

    /* Accent Colors */
    --accent: ${timberTheme.colors.accent};
    --accent-foreground: hsl(0, 0%, 100%);

    /* UI Colors */
    --muted: ${timberTheme.colors.muted};
    --muted-foreground: hsl(25, 15%, 45%);
    --border: ${timberTheme.colors.border};
    --input: ${timberTheme.colors.border};
    --ring: ${timberTheme.colors.primary};

    /* Surface Colors */
    --card: ${timberTheme.colors.card};
    --card-foreground: ${timberTheme.colors.foreground};
    --popover: ${timberTheme.colors.popover};
    --popover-foreground: ${timberTheme.colors.foreground};

    /* Status Colors */
    --destructive: ${timberTheme.colors.destructive};
    --destructive-foreground: hsl(0, 0%, 100%);
    --success: ${timberTheme.colors.success};
    --success-foreground: hsl(0, 0%, 100%);
    --warning: ${timberTheme.colors.warning};
    --warning-foreground: hsl(0, 0%, 100%);
    --info: ${timberTheme.colors.info};
    --info-foreground: hsl(0, 0%, 100%);

    /* Timber Brand Colors */
    --timber-50: ${timberTheme.colors.timber[50]};
    --timber-100: ${timberTheme.colors.timber[100]};
    --timber-200: ${timberTheme.colors.timber[200]};
    --timber-300: ${timberTheme.colors.timber[300]};
    --timber-400: ${timberTheme.colors.timber[400]};
    --timber-500: ${timberTheme.colors.timber[500]};
    --timber-600: ${timberTheme.colors.timber[600]};
    --timber-700: ${timberTheme.colors.timber[700]};
    --timber-800: ${timberTheme.colors.timber[800]};
    --timber-900: ${timberTheme.colors.timber[900]};
    --timber-950: ${timberTheme.colors.timber[950]};

    /* Typography */
    --font-sans: ${timberTheme.typography.fontFamily.sans.join(', ')};
    --font-serif: ${timberTheme.typography.fontFamily.serif.join(', ')};
    --font-mono: ${timberTheme.typography.fontFamily.mono.join(', ')};
    --font-heading: ${timberTheme.typography.fontFamily.heading.join(', ')};

    /* Spacing */
    --spacing-xs: ${timberTheme.spacing.xs};
    --spacing-sm: ${timberTheme.spacing.sm};
    --spacing-md: ${timberTheme.spacing.md};
    --spacing-lg: ${timberTheme.spacing.lg};
    --spacing-xl: ${timberTheme.spacing.xl};
    --spacing-2xl: ${timberTheme.spacing['2xl']};
    --spacing-3xl: ${timberTheme.spacing['3xl']};
    --spacing-4xl: ${timberTheme.spacing['4xl']};

    /* Border Radius */
    --radius: ${timberTheme.borderRadius.md};
    --radius-sm: ${timberTheme.borderRadius.sm};
    --radius-lg: ${timberTheme.borderRadius.lg};
    --radius-xl: ${timberTheme.borderRadius.xl};
    --radius-2xl: ${timberTheme.borderRadius['2xl']};
    --radius-3xl: ${timberTheme.borderRadius['3xl']};
    --radius-full: ${timberTheme.borderRadius.full};

    /* Shadows */
    --shadow-sm: ${timberTheme.shadows.sm};
    --shadow-md: ${timberTheme.shadows.md};
    --shadow-lg: ${timberTheme.shadows.lg};
    --shadow-xl: ${timberTheme.shadows.xl};
    --shadow-2xl: ${timberTheme.shadows['2xl']};
    --shadow-inner: ${timberTheme.shadows.inner};
  }

  .dark {
    --background: hsl(25, 25%, 10%);
    --foreground: hsl(45, 35%, 95%);
    --primary: hsl(25, 55%, 65%);
    --primary-foreground: hsl(25, 35%, 15%);
    --secondary: hsl(25, 15%, 20%);
    --secondary-foreground: hsl(45, 35%, 85%);
    --muted: hsl(25, 15%, 15%);
    --muted-foreground: hsl(25, 10%, 60%);
    --border: hsl(25, 15%, 25%);
    --card: hsl(25, 20%, 15%);
    --card-foreground: hsl(45, 35%, 95%);
    --popover: hsl(25, 20%, 15%);
    --popover-foreground: hsl(45, 35%, 95%);
  }
`;

/**
 * Utility function to get theme color by name
 */
export function getThemeColor(colorName: keyof Omit<ThemeConfig['colors'], 'timber'>): string;
export function getThemeColor(colorName: 'timber', shade?: keyof ColorPalette): string;
export function getThemeColor(colorName: keyof ThemeConfig['colors'], shade?: keyof ColorPalette): string {
  if (colorName === 'timber' && shade) {
    return timberTheme.colors.timber[shade];
  }
  const color = timberTheme.colors[colorName as keyof ThemeConfig['colors']];
  return typeof color === 'string' ? color : color[500]; // Default to 500 shade for ColorPalette
}

/**
 * Utility function to get typography value by name
 */
export function getTypographyValue(
  category: keyof ThemeConfig['typography'],
  key: string
): string {
  const typographyCategory = timberTheme.typography[category];
  if (category === 'fontFamily') {
    return (typographyCategory as any)[key];
  }
  return (typographyCategory as any)[key];
}

/**
 * Utility function to get spacing value by name
 */
export function getSpacingValue(key: keyof ThemeConfig['spacing']): string {
  return timberTheme.spacing[key];
}

/**
 * Utility function to get shadow value by name
 */
export function getShadowValue(key: keyof ThemeConfig['shadows']): string {
  return timberTheme.shadows[key];
}

/**
 * Utility function to get animation value by name
 */
export function getAnimationValue(
  category: keyof ThemeConfig['animations'],
  key: string
): string {
  const animationCategory = timberTheme.animations[category];
  return (animationCategory as any)[key];
}
