import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Header, Text, Button, Card } from '@/components/ui';
import { useAuth } from '@/stores/auth';
import { spacing, colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function OnboardingStart() {
  const router = useRouter();
  const role = useAuth((s) => s.role);

  const isWorker = role === 'worker';
  const steps = isWorker
    ? ['Profile basics', 'Skills & rate', 'Availability', 'Documents']
    : ['Company details', 'Verify ABN', 'Payment setup'];

  return (
    <Screen padded>
      <Header title={isWorker ? 'Set up your worker profile' : 'Set up your business'} subtitle="Takes about 3 minutes" />
      <View style={{ height: spacing.xl }} />

      <Card variant="dark" padding="2xl" radius="xl">
        <Text variant="overline" tone="onDarkMuted">What's next</Text>
        <View style={{ height: spacing.md }} />
        {steps.map((step, i) => (
          <View key={step} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginVertical: 8 }}>
            <View style={{
              width: 28, height: 28, borderRadius: 14,
              backgroundColor: colors.accent,
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Text style={{ color: '#fff', fontWeight: '600' }}>{i + 1}</Text>
            </View>
            <Text tone="onDark" variant="bodyMedium">{step}</Text>
          </View>
        ))}
      </Card>

      <View style={{ height: spacing.lg }} />
      <Card>
        <View style={{ flexDirection: 'row', gap: spacing.md, alignItems: 'center' }}>
          <Ionicons name="shield-checkmark" size={22} color={colors.accent} />
          <View style={{ flex: 1 }}>
            <Text variant="smallMedium">Trust & safety</Text>
            <Text variant="small" tone="secondary">
              {isWorker
                ? 'Verified workers get hired 3× faster.'
                : 'ABN verification unlocks posting, messaging and hiring.'}
            </Text>
          </View>
        </View>
      </Card>

      <View style={{ flex: 1 }} />
      <Button
        title="Get started"
        onPress={() =>
          router.push(isWorker ? '/(onboarding)/worker' : '/(onboarding)/business')
        }
      />
    </Screen>
  );
}
