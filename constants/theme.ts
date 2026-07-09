/**
 * Lucen AI — Design System
 *
 * Warm, premium, iOS-native feel.
 * Light neutral background, white cards, dark feature panels,
 * restrained teal/green accent.
 */

export const colors = {
  // Surfaces
  background: '#F4F1EC',      // warm off-white
  surface: '#FFFFFF',         // cards
  surfaceMuted: '#EDE9E2',    // chips, inputs at rest
  surfaceDark: '#171717',     // premium feature panels
  surfaceDarkAlt: '#222020',  // raised dark elements

  // Text
  text: '#141413',
  textSecondary: '#5C5A55',
  textMuted: '#8A8780',
  textOnDark: '#F5F2EC',
  textOnDarkMuted: '#A8A49B',

  // Accent
  accent: '#0F7B6C',          // teal/green, premium
  accentSoft: '#D6EAE5',
  accentDeep: '#0A5A4F',

  // Status
  success: '#1F8A55',
  warning: '#C9821A',
  danger: '#B83A2E',
  info: '#3863A0',

  // Lines
  border: 'rgba(20, 20, 19, 0.08)',
  borderStrong: 'rgba(20, 20, 19, 0.16)',
  borderOnDark: 'rgba(255, 255, 255, 0.08)',

  // Overlays
  shadow: 'rgba(20, 20, 19, 0.08)',
  shadowStrong: 'rgba(20, 20, 19, 0.16)',
};

export const radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 56,
};

export const typography = {
  // Display
  display: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '700' as const,
    letterSpacing: -0.6,
  },
  h1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700' as const,
    letterSpacing: -0.4,
  },
  h2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
  },
  h3: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
  bodyMedium: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500' as const,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  smallMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
    letterSpacing: 0.2,
  },
  overline: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600' as const,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
  },
};

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  raised: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 20,
    elevation: 6,
  },
};

export type Theme = {
  colors: typeof colors;
  radius: typeof radius;
  spacing: typeof spacing;
  typography: typeof typography;
  shadows: typeof shadows;
};

export const theme: Theme = { colors, radius, spacing, typography, shadows };
