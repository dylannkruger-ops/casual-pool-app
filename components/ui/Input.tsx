import React, { useState } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  Pressable,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { Text } from './Text';

interface Props extends Omit<TextInputProps, 'style'> {
  label?: string;
  helper?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<Props> = ({
  label,
  helper,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  onFocus,
  onBlur,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrap, containerStyle]}>
      {label && (
        <Text variant="smallMedium" tone="secondary" style={styles.label}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputWrap,
          focused && styles.focused,
          !!error && styles.error,
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={18}
            color={colors.textMuted}
            style={styles.iconL}
          />
        )}
        <TextInput
          {...rest}
          placeholderTextColor={colors.textMuted}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[styles.input, typography.body]}
        />
        {rightIcon && (
          <Pressable onPress={onRightIconPress} hitSlop={8} style={styles.iconR}>
            <Ionicons name={rightIcon} size={18} color={colors.textSecondary} />
          </Pressable>
        )}
      </View>
      {(helper || error) && (
        <Text
          variant="caption"
          tone={error ? 'danger' : 'muted'}
          style={styles.helper}
        >
          {error || helper}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  label: { marginLeft: 4 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    minHeight: 52,
  },
  focused: {
    borderColor: colors.accent,
    backgroundColor: colors.surface,
  },
  error: {
    borderColor: colors.danger,
  },
  input: {
    flex: 1,
    color: colors.text,
    paddingVertical: 14,
  },
  iconL: { marginRight: spacing.sm },
  iconR: { marginLeft: spacing.sm, padding: 4 },
  helper: { marginLeft: 4 },
});
