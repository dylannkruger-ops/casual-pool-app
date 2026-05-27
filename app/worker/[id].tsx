import React from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, Text, Card, Avatar, Badge, Button, Divider } from '@/components/ui';
import { mockWorkers } from '@/lib/mockData';
import { colors, spacing } from '@/constants/theme';
import { currency, professionLabel } from '@/lib/format';
import { useProfile } from '@/stores/profile';
import { canBusinessAct } from '@/lib/permissions';

export default function WorkerDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const business = useProfile((s) => s.business);
  const w = mockWorkers.find((m) => m.id === id);
  const gate = canBusinessAct(business);

  if (!w) {
    return (
      <Screen padded>
        <Header back title="Worker" />
        <Text tone="secondary">Worker not found.</Text>
      </Screen>
    );
  }

  const message = () => {
    if (!gate.allowed) return Alert.alert('Verification needed', gate.reason!);
    router.push('/messages/t_001');
  };

  const shortlist = () => {
    if (!gate.allowed) return Alert.alert('Verification needed', gate.reason!);
    Alert.alert('Shortlisted', `${w.fullName} added to your shortlist.`);
  };

  return (
    <Screen padded={false}>
      <View style={{ paddingHorizontal: spacing.xl }}>
        <Header back />
      </View>
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: 140 }}>
        <Card variant="dark" padding="2xl" radius="xl" elevation="raised">
          <View style={{ alignItems: 'center' }}>
            <Avatar uri={w.photoUrl} name={w.fullName} size={88} ring />
            <View style={{ height: spacing.md }} />
            <Text variant="h2" tone="onDark">{w.fullName}</Text>
            <Text variant="small" tone="onDarkMuted">
              {w.professions.map(professionLabel).join(' · ')}
            </Text>
            <View style={{ flexDirection: 'row', gap: 6, marginTop: spacing.md }}>
              {w.verified && <Badge label="VERIFIED" tone="success" />}
              <Badge label={`${currency(w.hourlyRate)}/hr`} tone="accent" />
            </View>
            <View style={{ flexDirection: 'row', marginTop: spacing.xl, gap: spacing.xl }}>
              <Stat label="RATING" value={w.rating.toFixed(1)} />
              <Stat label="SHIFTS" value={`${w.shiftsCompleted}`} />
              <Stat label="REPEAT" value={`${w.repeatEmployers}`} />
            </View>
          </View>
        </Card>

        <View style={{ height: spacing.lg }} />
        <Card>
          <Text variant="overline" tone="muted">ABOUT</Text>
          <View style={{ height: spacing.sm }} />
          <Text variant="body" tone="secondary">{w.bio}</Text>
        </Card>

        <View style={{ height: spacing.md }} />
        <Card>
          <Text variant="overline" tone="muted">LICENCES & QUALIFICATIONS</Text>
          <View style={{ height: spacing.sm }} />
          <View style={styles.chips}>
            {[...w.licences, ...w.qualifications].map((q) => (
              <View key={q} style={styles.chip}>
                <Ionicons name="ribbon" size={12} color={colors.accent} />
                <Text variant="caption">{q}</Text>
              </View>
            ))}
          </View>
        </Card>

        <View style={{ height: spacing.md }} />
        <Card>
          <Text variant="overline" tone="muted">AVAILABILITY</Text>
          <View style={{ height: spacing.sm }} />
          <View style={{ flexDirection: 'row', gap: 4 }}>
            {(['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const).map((d, i) => {
              const days = [
                w.availability.monday, w.availability.tuesday, w.availability.wednesday,
                w.availability.thursday, w.availability.friday, w.availability.saturday, w.availability.sunday,
              ];
              return (
                <View
                  key={i}
                  style={[styles.day, { backgroundColor: days[i] ? colors.accent : colors.surfaceMuted }]}
                >
                  <Text style={{ color: days[i] ? '#fff' : colors.text, fontWeight: '600' }}>{d}</Text>
                </View>
              );
            })}
          </View>
          <Divider />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text variant="small" tone="secondary">Work radius</Text>
            <Text variant="smallMedium">{w.workRadiusKm} km from {w.location.suburb}</Text>
          </View>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <Button title="Message" variant="secondary" onPress={message} />
          <Button title="Shortlist" onPress={shortlist} />
        </View>
      </View>
    </Screen>
  );
}

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={{ alignItems: 'center' }}>
    <Text variant="caption" tone="onDarkMuted">{label}</Text>
    <Text variant="h2" tone="onDark">{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.accentSoft, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  day: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: spacing.xl, backgroundColor: colors.background,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
});
