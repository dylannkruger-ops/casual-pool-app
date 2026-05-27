import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';
import { Text } from './Text';

interface Props {
  label: string;
  value: string;
  delta?: string;
  tone?: 'light' | 'dark' | 'accent';
}

export const StatTile: React.FC<Props> = ({ label, value, delta, tone = 'light' }) => {
  const bg =
    tone === 'dark' ? colors.surfaceDark : tone === 'accent' ? colors.accent : colors.surface;
  const labelTone = tone === 'light' ? 'secondary' : 'onDarkMuted';
  const valueTone = tone === 'light' ? 'default' : 'onDark';

  return (
    <View style={[styles.tile, { backgroundColor: bg }]}>
      <Text variant="caption" tone={labelTone as any}>
        {label.toUpperCase()}
      </Text>
      <Text variant="h1" tone={valueTone as any} style={styles.value}>
        {value}
      </Text>
      {delta && (
        <Text variant="caption" tone={tone === 'light' ? 'accent' : 'onDarkMuted'}>
          {delta}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    padding: spacing.xl,
    borderRadius: radius.lg,
    gap: 6,
  },
  value: { marginTop: 4 },
});
