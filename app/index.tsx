import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen, Text, Button, Card } from '@/components/ui';
import { colors, spacing, radius } from '@/constants/theme';

export default function Landing() {
  const router = useRouter();

  return (
    <Screen background="default" padded>
      <View style={styles.brandRow}>
        <View style={styles.logoDot} />
        <Text variant="h3">Lucen AI</Text>
      </View>

      <View style={{ height: spacing['3xl'] }} />

      <Card variant="dark" padding="2xl" radius="xl" elevation="raised">
        <Text variant="overline" tone="onDarkMuted">
          Australia's casual workforce, on tap
        </Text>
        <View style={{ height: spacing.lg }} />
        <Text variant="display" tone="onDark">
          Find shifts.{'\n'}Hire faster.{'\n'}
          <Text variant="display" tone="onDarkMuted">
            $4.99 flat.
          </Text>
        </Text>

        <View style={{ height: spacing['2xl'] }} />

        <View style={styles.previewRow}>
          <LinearGradient
            colors={[colors.accent, colors.accentDeep]}
            style={styles.previewPill}
          >
            <Text variant="caption" tone="onDark">
              OPEN SHIFTS
            </Text>
            <Text variant="h2" tone="onDark">
              312
            </Text>
          </LinearGradient>
          <View style={[styles.previewPill, styles.previewLight]}>
            <Text variant="caption" tone="muted">
              VERIFIED WORKERS
            </Text>
            <Text variant="h2">2,847</Text>
          </View>
        </View>
      </Card>

      <View style={{ flex: 1 }} />

      <View style={{ gap: spacing.md }}>
        <Button
          title="Create an account"
          onPress={() => router.push('/(auth)/role')}
        />
        <Button
          title="Sign in"
          variant="secondary"
          onPress={() => router.push('/(auth)/login')}
        />
        <Text variant="caption" tone="muted" center style={{ marginTop: spacing.md }}>
          By continuing you agree to our Terms and Privacy Policy.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  logoDot: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: colors.accent,
  },
  previewRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  previewPill: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: radius.md,
    gap: 4,
  },
  previewLight: {
    backgroundColor: colors.surface,
  },
});
