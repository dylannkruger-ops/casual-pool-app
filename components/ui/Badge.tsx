import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { Text } from './Text';

type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'dark';

interface Props {
  label: string;
  tone?: Tone;
  style?: ViewStyle;
}

const tones: Record<Tone, { bg: string; text: string }> = {
  neutral: { bg: colors.surfaceMuted, text: colors.text },
  accent: { bg: colors.accentSoft, text: colors.accentDeep },
  success: { bg: '#DBEFE2', text: '#125F37' },
  warning: { bg: '#F7E7C7', text: '#7A5212' },
  danger: { bg: '#F4D7D3', text: '#7A241B' },
  dark: { bg: colors.surfaceDark, text: colors.textOnDark },
};

export const Badge: React.FC<Props> = ({ label, tone = 'neutral', style }) => {
  const t = tones[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }, style]}>
      <Text style={[typography.caption, { color: t.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
});
