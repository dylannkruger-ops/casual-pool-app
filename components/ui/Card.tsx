import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { colors, radius, shadows, spacing } from '@/constants/theme';

interface Props extends ViewProps {
  variant?: 'light' | 'dark' | 'flat';
  padding?: keyof typeof spacing | 'none';
  radius?: keyof typeof radius;
  elevation?: 'none' | 'card' | 'raised';
}

export const Card: React.FC<Props> = ({
  variant = 'light',
  padding = 'xl',
  radius: r = 'lg',
  elevation = 'card',
  style,
  children,
  ...rest
}) => {
  const pad = padding === 'none' ? 0 : spacing[padding];
  const elev =
    elevation === 'none' ? undefined : elevation === 'raised' ? shadows.raised : shadows.card;

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: variant === 'dark' ? colors.surfaceDark : colors.surface,
          padding: pad,
          borderRadius: radius[r],
        },
        elev,
        variant === 'flat' && { backgroundColor: colors.surfaceMuted },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
