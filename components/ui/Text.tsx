import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { colors, typography } from '@/constants/theme';

type Variant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'bodyMedium'
  | 'small'
  | 'smallMedium'
  | 'caption'
  | 'overline';

type Tone = 'default' | 'secondary' | 'muted' | 'onDark' | 'onDarkMuted' | 'accent' | 'danger';

interface Props extends TextProps {
  variant?: Variant;
  tone?: Tone;
  center?: boolean;
}

const toneMap: Record<Tone, string> = {
  default: colors.text,
  secondary: colors.textSecondary,
  muted: colors.textMuted,
  onDark: colors.textOnDark,
  onDarkMuted: colors.textOnDarkMuted,
  accent: colors.accent,
  danger: colors.danger,
};

export const Text: React.FC<Props> = ({
  variant = 'body',
  tone = 'default',
  center,
  style,
  children,
  ...rest
}) => {
  return (
    <RNText
      style={[
        typography[variant] as any,
        { color: toneMap[tone] },
        center && styles.center,
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  center: { textAlign: 'center' },
});
