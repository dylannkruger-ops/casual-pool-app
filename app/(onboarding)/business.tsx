import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, Text, Input, Button, Card, Divider, Badge } from '@/components/ui';
import { useAuth } from '@/stores/auth';
import { useProfile } from '@/stores/profile';
import { colors, spacing } from '@/constants/theme';
import { formatAbn, verifyAbnMock } from '@/lib/abn';
import type { BusinessProfile } from '@/types';

export default function BusinessOnboarding() {
  const router = useRouter();
  const signed = useAuth();
  const setBusiness = useProfile((s) => s.setBusiness);

  const [step, setStep] = useState(0);
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [industry, setIndustry] = useState('');
  const [suburb, setSuburb] = useState('');
  const [postcode, setPostcode] = useState('');
  const [abn, setAbn] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [entityName, setEntityName] = useState<string | null>(null);

  const total = 3;
  const back = () => (step === 0 ? router.back() : setStep(step - 1));
  const next = () => (step < total - 1 ? setStep(step + 1) : finish());

  const runVerify = async () => {
    setVerifying(true);
    const res = await verifyAbnMock(abn);
    setVerified(res.valid);
    setEntityName(res.entityName ?? null);
    setVerifying(false);
  };

  const finish = () => {
    const profile: BusinessProfile = {
      id: signed.userId ?? `b_${Date.now()}`,
      userId: signed.userId ?? `u_${Date.now()}`,
      companyName,
      abn,
      abnVerified: verified,
      contactPerson,
      industry,
      location: { suburb, postcode, state: 'NSW', country: 'AU' },
      paymentSetup: true,
      rating: 0,
      reviewsCount: 0,
      createdAt: new Date().toISOString(),
    };
    setBusiness(profile);
    signed.setOnboarded(true);
    router.replace('/(tabs)');
  };

  return (
    <Screen padded={false}>
      <View style={{ paddingHorizontal: spacing.xl }}>
        <Header back title="Business setup" subtitle={`Step ${step + 1} of ${total}`} onBack={back} />
        <View style={styles.progress}>
          {Array.from({ length: total }).map((_, i) => (
            <View
              key={i}
              style={[styles.dot, { backgroundColor: i <= step ? colors.accent : colors.surfaceMuted }]}
            />
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: 140 }}>
        {step === 0 && (
          <View style={{ gap: spacing.lg }}>
            <Text variant="h2">Tell us about your business</Text>
            <Input
              label="Company name"
              value={companyName}
              onChangeText={setCompanyName}
              placeholder="Bowery & Vine"
              leftIcon="business-outline"
            />
            <Input
              label="Primary contact"
              value={contactPerson}
              onChangeText={setContactPerson}
              placeholder="Maya Donovan"
              leftIcon="person-outline"
            />
            <Input
              label="Industry"
              value={industry}
              onChangeText={setIndustry}
              placeholder="Hospitality, Logistics, Retail…"
              leftIcon="briefcase-outline"
            />
            <Input
              label="Business suburb"
              value={suburb}
              onChangeText={setSuburb}
              placeholder="Surry Hills"
              leftIcon="location-outline"
            />
            <Input
              label="Postcode"
              value={postcode}
              onChangeText={setPostcode}
              keyboardType="number-pad"
              placeholder="2010"
            />
          </View>
        )}

        {step === 1 && (
          <View style={{ gap: spacing.lg }}>
            <Text variant="h2">Verify your ABN</Text>
            <Card variant="dark" padding="2xl" radius="xl">
              <View style={{ flexDirection: 'row', gap: spacing.md, alignItems: 'center' }}>
                <Ionicons name="shield-checkmark" size={22} color={colors.accentSoft} />
                <Text variant="smallMedium" tone="onDark">
                  Required to post shifts, message workers and hire
                </Text>
              </View>
              <View style={{ height: spacing.md }} />
              <Text variant="small" tone="onDarkMuted">
                We check against the Australian Business Register. Verification is free and usually
                takes a few seconds.
              </Text>
            </Card>

            <Input
              label="ABN"
              value={abn}
              onChangeText={(v) => {
                setAbn(formatAbn(v));
                setVerified(false);
                setEntityName(null);
              }}
              placeholder="11 222 333 444"
              keyboardType="number-pad"
              leftIcon="id-card-outline"
              helper="11 digits, no spaces required"
            />

            {verified ? (
              <Card>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                  <View style={styles.verifiedDot}>
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="smallMedium">Verified</Text>
                    <Text variant="small" tone="secondary">{entityName}</Text>
                  </View>
                  <Badge label="ACTIVE" tone="success" />
                </View>
              </Card>
            ) : (
              <Button
                title={verifying ? 'Verifying…' : 'Verify ABN'}
                onPress={runVerify}
                loading={verifying}
                variant="secondary"
              />
            )}
          </View>
        )}

        {step === 2 && (
          <View style={{ gap: spacing.lg }}>
            <Text variant="h2">Payment setup</Text>
            <Text variant="small" tone="secondary">
              We collect a flat $4.99 platform fee from the business per hire, and $4.99 from the
              worker per shift accepted. Worker wages are settled outside the app, per your usual
              payroll.
            </Text>

            <Card variant="dark" padding="2xl">
              <Text variant="overline" tone="onDarkMuted">Per hire</Text>
              <Text variant="display" tone="onDark">$4.99</Text>
              <Divider onDark />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text tone="onDarkMuted" variant="small">Refunds</Text>
                <Text tone="onDark" variant="small">If worker cancels &lt; 24h</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                <Text tone="onDarkMuted" variant="small">Billing</Text>
                <Text tone="onDark" variant="small">Card on file</Text>
              </View>
            </Card>

            <Button title="Add card (demo)" variant="secondary" leftIcon={<Ionicons name="card-outline" size={18} color={colors.text} />} />
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={step === total - 1 ? 'Finish setup' : 'Continue'}
          onPress={next}
          disabled={step === 1 && !verified}
        />
        {step === 1 && !verified && (
          <Text variant="caption" tone="muted" center style={{ marginTop: 8 }}>
            Verify your ABN to continue
          </Text>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  progress: { flexDirection: 'row', gap: 6, marginTop: 4, marginBottom: spacing.md },
  dot: { flex: 1, height: 4, borderRadius: 2 },
  verifiedDot: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: colors.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: spacing.xl,
    backgroundColor: colors.background,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
});
