import React from 'react';
import { View } from 'react-native';
import { colors, spacing } from '@/constants/theme';

export const Divider: React.FC<{ vertical?: number; onDark?: boolean }> = ({
  vertical = spacing.lg,
  onDark,
}) => (
  <View
    style={{
      height: 1,
      marginVertical: vertical,
      backgroundColor: onDark ? colors.borderOnDark : colors.border,
    }}
  />
);
