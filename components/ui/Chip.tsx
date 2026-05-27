import React from 'react';
import { Pressable, View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { Text } from './Text';

interface Props {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  variant?: 'default' | 'dark' | 'accent';
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export const Chip: React.FC<Props> = ({
  label,
  selected,
  onPress,
  variant = 'default',
  style,
  icon,
}) => {
  const isPressable = !!onPress;
  const Wrap: any = isPressable ? Pressable : View;

  return (
    <Wrap
      onPress={onPress}
      style={({ pressed }: any) => [
        styles.base,
        variant === 'default' && styles.default,
        variant === 'dark' && styles.dark,
        variant === 'accent' && styles.accent,
        selected && styles.selected,
        pressed && styles.pressed,
        style,
      ]}
    >
      {icon}
      <Text
        style={[
          typography.smallMedium,
          {
            color:
              variant === 'dark'
                ? colors.textOnDark
                : selected
                ? colors.accent
                : variant === 'accent'
                ? colors.accent
                : colors.text,
          },
        ]}
      >
        {label}
      </Text>
    </Wrap>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  default: {
    backgroundColor: colors.surfaceMuted,
    borderColor: 'transparent',
  },
  dark: {
    backgroundColor: colors.surfaceDarkAlt,
    borderColor: colors.borderOnDark,
  },
  accent: {
    backgroundColor: colors.accentSoft,
    borderColor: 'transparent',
  },
  selected: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  pressed: { opacity: 0.7 },
});
