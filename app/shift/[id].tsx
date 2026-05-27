import React from 'react';
import { View, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, Text, Card, Button, Badge, Avatar, Divider } from '@/components/ui';
import { useShifts } from '@/stores/shifts';
import { useAuth } from '@/stores/auth';
import { useProfile } from '@/stores/profile';
import { mockBusinesses, mockWorkers } from '@/lib/mockData';
import { colors, spacing, radius } from '@/constants/theme';
import { currency, dateLong, professionLabel } from '@/lib/format';
import { canBusinessAct } from '@/lib/permissions';

export default function ShiftDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const role = useAuth((s) => s.role);
  const userId = useAuth((s) => s.userId);
  const business = useProfile((s) => s.business);
  const shift = useShifts((s) => s.getById(id ?? ''));
  const applyToShift = useShifts((s) => s.applyToShift);
  const shortlist = useShifts((s) => s.shortlist);
  const hire = useShifts((s) => s.hire);

  if (!shift) {
    return (
      <Screen padded>
        <Header back title="Shift" />
        <Text tone="secondary">This shift no longer exists.</Text>
      </Screen>
    );
  }

  const biz = mockBusinesses.find((b) => b.id === shift.businessId);
  const applicants = shift.applicantIds
    .map((wid) => mockWorkers.find((w) => w.id === wid))
    .filter(Boolean) as typeof mockWorkers;

  const isBusiness = role === 'business';
  const gate = canBusinessAct(business);

  const apply = () => {
    if (!userId) return;
    applyToShift(shift.id, 'w_001');
    Alert.alert('Applied', 'Your application has been sent. The business will be in touch.');
  };

  const total = shift.hourlyRate * shift.hoursEstimate;

  return (
    <Screen padded={false}>
      <View style={{ paddingHorizontal: spacing.xl }}>
        <Header back title="Shift detail" />
      </View>
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: 160 }}>
        <Card variant="dark" padding="2xl" radius="xl">
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text variant="overline" tone="onDarkMuted">
              {professionLabel(shift.profession)}
            </Text>
            <Badge
              label={shift.status.replace('_', ' ').toUpperCase()}
              tone={shift.status === 'open' ? 'accent' : 'neutral'}
            />
          </View>
          <View style={{ height: spacing.md }} />
          <Text variant="h1" tone="onDark">{shift.title}</Text>
          <View style={{ height: spacing.lg }} />

          <View style={{ flexDirection: 'row', gap: spacing.xl }}>
            <View>
              <Text variant="caption" tone="onDarkMuted">RATE</Text>
              <Text variant="h2" tone="onDark">{currency(shift.hourlyRate)}/hr</Text>
            </View>
            <View>
              <Text variant="caption" tone="onDarkMuted">EST. PAY</Text>
              <Text variant="h2" tone="onDark">{currency(total)}</Text>
            </View>
            <View>
              <Text variant="caption" tone="onDarkMuted">HOURS</Text>
              <Text variant="h2" tone="onDark">{shift.hoursEstimate}h</Text>
            </View>
          </View>
        </Card>

        <View style={{ height: spacing.lg }} />

        <Card>
          <Row icon="time-outline" label="When" value={dateLong(shift.startsAt)} />
          <Divider vertical={spacing.md} />
          <Row icon="location-outline" label="Where" value={`${shift.location.suburb}, ${shift.location.postcode}`} />
          <Divider vertical={spacing.md} />
          <Row icon="business-outline" label="Hiring" value={biz?.companyName ?? ''} />
        </Card>

        <View style={{ height: spacing.lg }} />
        <Text variant="overline" tone="muted">DESCRIPTION</Text>
        <View style={{ height: spacing.sm }} />
        <Text variant="body" tone="secondary">{shift.description}</Text>

        {(shift.requiredLicences.length > 0 || shift.requiredQualifications.length > 0) && (
          <>
            <View style={{ height: spacing.lg }} />
            <Text variant="overline" tone="muted">REQUIREMENTS</Text>
            <View style={{ height: spacing.sm }} />
            <View style={styles.chipRow}>
              {[...shift.requiredLicences, ...shift.requiredQualifications].map((q) => (
                <View key={q} style={styles.chip}>
                  <Ionicons name="checkmark-circle" size={12} color={colors.accent} />
                  <Text variant="caption">{q}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={{ height: spacing.lg }} />
        <Card>
          <Text variant="overline" tone="muted">PLATFORM FEE</Text>
          <View style={{ height: spacing.sm }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text variant="small" tone="secondary">Business charged on hire</Text>
            <Text variant="smallMedium">{currency(shift.platformFeeBusiness)}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
            <Text variant="small" tone="secondary">Worker charged on accept</Text>
            <Text variant="smallMedium">{currency(shift.platformFeeWorker)}</Text>
          </View>
        </Card>

        {isBusiness && applicants.length > 0 && (
          <>
            <View style={{ height: spacing.xl }} />
            <Text variant="h3">Applicants ({applicants.length})</Text>
            <View style={{ height: spacing.md }} />
            {applicants.map((w) => (
              <Card key={w.id} style={{ marginBottom: spacing.md }}>
                <View style={{ flexDirection: 'row', gap: spacing.md, alignItems: 'center' }}>
                  <Avatar uri={w.photoUrl} name={w.fullName} size={48} />
                  <View style={{ flex: 1 }}>
                    <Text variant="bodyMedium">{w.fullName}</Text>
                    <Text variant="caption" tone="secondary">
                      ★ {w.rating.toFixed(1)} · {currency(w.hourlyRate)}/hr · {w.location.suburb}
                    </Text>
                  </View>
                </View>
                <View style={{ height: spacing.md }} />
                <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                  <Button
                    title="Shortlist"
                    variant="secondary"
                    size="sm"
                    onPress={() => {
                      if (!gate.allowed) return Alert.alert('Verification needed', gate.reason!);
                      shortlist(shift.id, w.id);
                    }}
                  />
                  <Button
                    title="Hire"
                    size="sm"
                    onPress={() => {
                      if (!gate.allowed) return Alert.alert('Verification needed', gate.reason!);
                      hire(shift.id, w.id);
                      Alert.alert('Hired', `${w.fullName} is hired. $4.99 platform fee charged.`);
                    }}
                  />
                </View>
              </Card>
            ))}
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {isBusiness ? (
          <Button
            title={gate.allowed ? 'Edit shift' : 'Verify ABN to edit'}
            variant="secondary"
            onPress={() => gate.allowed ? null : router.push('/(onboarding)/business')}
          />
        ) : (
          <Button title="Apply for this shift" onPress={apply} />
        )}
      </View>
    </Screen>
  );
}

const Row: React.FC<{ icon: any; label: string; value: string }> = ({ icon, label, value }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
    <View style={styles.iconWrap}>
      <Ionicons name={icon} size={18} color={colors.text} />
    </View>
    <View style={{ flex: 1 }}>
      <Text variant="caption" tone="muted">{label.toUpperCase()}</Text>
      <Text variant="bodyMedium">{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  iconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.accentSoft, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: spacing.xl, backgroundColor: colors.background,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
});
