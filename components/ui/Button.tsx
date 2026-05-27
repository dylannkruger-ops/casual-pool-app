import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  View,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { Text } from './Text';

type Variant = 'primary' | 'dark' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface Props extends Omit<PressableProps, 'style' | 'children'> {
  title: string;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
}

export const Button: React.FC<Props> = ({
  title,
  variant = 'primary',
  size = 'md',
  fullWidth = true,
  loading,
  disabled,
  leftIcon,
  rightIcon,
  style,
  ...rest
}) => {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        sizes[size],
        variants[variant].container,
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
      {...rest}
    >
      <View style={styles.content}>
        {leftIcon && <View style={styles.iconL}>{leftIcon}</View>}
        {loading ? (
          <ActivityIndicator color={variants[variant].text} />
        ) : (
          <Text
            style={[typography.bodyMedium, { color: variants[variant].text }]}
          >
            {title}
          </Text>
        )}
        {rightIcon && <View style={styles.iconR}>{rightIcon}</View>}
      </View>
    </Pressable>
  );
};

const variants = {
  primary: {
    container: { backgroundColor: colors.accent },
    text: '#FFFFFF',
  },
  dark: {
    container: { backgroundColor: colors.surfaceDark },
    text: colors.textOnDark,
  },
  secondary: {
    container: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.borderStrong,
    },
    text: colors.text,
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    text: colors.text,
  },
  danger: {
    container: { backgroundColor: colors.danger },
    text: '#FFFFFF',
  },
} as const;

const sizes: Record<Size, ViewStyle> = {
  sm: { height: 40, paddingHorizontal: spacing.lg, borderRadius: radius.sm },
  md: { height: 52, paddingHorizontal: spacing.xl, borderRadius: radius.md },
  lg: { height: 60, paddingHorizontal: spacing['2xl'], borderRadius: radius.lg },
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  fullWidth: { alignSelf: 'stretch' },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.45 },
  iconL: { marginRight: 2 },
  iconR: { marginLeft: 2 },
});
