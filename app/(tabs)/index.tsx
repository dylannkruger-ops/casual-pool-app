import React from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Text, Card, Avatar, Badge, StatTile, Button } from '@/components/ui';
import { useAuth } from '@/stores/auth';
import { useProfile } from '@/stores/profile';
import { useShifts } from '@/stores/shifts';
import { mockWorkers, mockNotifications } from '@/lib/mockData';
import { colors, spacing, radius } from '@/constants/theme';
import { currency, dateLong, professionLabel } from '@/lib/format';

export default function HomeScreen() {
  const router = useRouter();
  const role = useAuth((s) => s.role);
  const worker = useProfile((s) => s.worker);
  const business = useProfile((s) => s.business);
  const shifts = useShifts((s) => s.shifts);

  if (role === 'business') return <BusinessHome />;

  const name = worker?.fullName?.split(' ')[0] ?? 'there';
  const upcoming = shifts.filter((s) => s.status !== 'cancelled').slice(0, 3);
  const unread = mockNotifications.filter((n) => !n.read).length;

  return (
    <Screen scroll padded contentContainerStyle={{ paddingBottom: 120 }}>
      <View style={styles.topRow}>
        <View>
          <Text variant="small" tone="secondary">Good afternoon</Text>
          <Text variant="h1">{name}</Text>
        </View>
        <Pressable style={styles.bell}>
          <Ionicons name="notifications-outline" size={20} color={colors.text} />
          {unread > 0 && <View style={styles.bellDot} />}
        </Pressable>
      </View>

      <View style={{ height: spacing.lg }} />

      <Card variant="dark" padding="2xl" radius="xl" elevation="raised">
        <Text variant="overline" tone="onDarkMuted">This week</Text>
        <View style={{ height: spacing.md }} />
        <Text variant="display" tone="onDark">{currency(640)}</Text>
        <Text variant="small" tone="onDarkMuted">Estimated earnings · 2 shifts</Text>
        <View style={{ height: spacing.xl }} />
        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <View style={styles.miniDark}>
            <Text variant="caption" tone="onDarkMuted">SHIFTS</Text>
            <Text variant="h2" tone="onDark">2</Text>
          </View>
          <View style={styles.miniDark}>
            <Text variant="caption" tone="onDarkMuted">HOURS</Text>
            <Text variant="h2" tone="onDark">16</Text>
          </View>
          <View style={styles.miniDark}>
            <Text variant="caption" tone="onDarkMuted">RATING</Text>
            <Text variant="h2" tone="onDark">{worker?.rating?.toFixed(1) ?? '4.9'}</Text>
          </View>
        </View>
      </Card>

      <View style={{ height: spacing.xl }} />
      <View style={styles.sectionHead}>
        <Text variant="h3">Shifts near you</Text>
        <Pressable onPress={() => router.push('/(tabs)/discover')}>
          <Text variant="smallMedium" tone="accent">See all</Text>
        </Pressable>
      </View>

      {upcoming.map((s) => (
        <Pressable key={s.id} onPress={() => router.push(`/shift/${s.id}`)}>
          <Card style={styles.shiftCard}>
            <View style={styles.shiftHead}>
              <View>
                <Text variant="caption" tone="muted">
                  {professionLabel(s.profession).toUpperCase()}
                </Text>
                <Text variant="h3" style={{ marginTop: 2 }}>{s.title}</Text>
              </View>
              <Badge label={currency(s.hourlyRate) + '/hr'} tone="accent" />
            </View>
            <View style={{ height: spacing.md }} />
            <View style={styles.metaRow}>
              <Meta icon="time-outline" label={dateLong(s.startsAt)} />
              <Meta icon="location-outline" label={`${s.location.suburb}, ${s.location.postcode}`} />
            </View>
          </Card>
        </Pressable>
      ))}

      <View style={{ height: spacing.xl }} />
      <Text variant="h3">Trending hires</Text>
      <View style={{ height: spacing.md }} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.md }}>
        {mockWorkers.slice(0, 4).map((w) => (
          <Card key={w.id} style={styles.miniWorker} padding="lg">
            <Avatar uri={w.photoUrl} name={w.fullName} size={48} />
            <Text variant="smallMedium" style={{ marginTop: 8 }}>{w.fullName}</Text>
            <Text variant="caption" tone="muted">
              {professionLabel(w.professions[0])}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 }}>
              <Ionicons name="star" size={12} color={colors.accent} />
              <Text variant="caption">{w.rating.toFixed(1)}</Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    </Screen>
  );
}

function BusinessHome() {
  const router = useRouter();
  const business = useProfile((s) => s.business);
  const shifts = useShifts((s) => s.shifts);
  const name = business?.companyName ?? 'your business';

  return (
    <Screen scroll padded contentContainerStyle={{ paddingBottom: 120 }}>
      <View style={styles.topRow}>
        <View>
          <Text variant="small" tone="secondary">Welcome back</Text>
          <Text variant="h1">{name}</Text>
        </View>
        <Pressable style={styles.bell}>
          <Ionicons name="notifications-outline" size={20} color={colors.text} />
        </Pressable>
      </View>

      {!business?.abnVerified && (
        <Card style={{ marginTop: spacing.lg, borderWidth: 1, borderColor: colors.warning }}>
          <View style={{ flexDirection: 'row', gap: spacing.md, alignItems: 'center' }}>
            <Ionicons name="warning-outline" size={22} color={colors.warning} />
            <View style={{ flex: 1 }}>
              <Text variant="smallMedium">Verify ABN to unlock hiring</Text>
              <Text variant="small" tone="secondary">
                Posting shifts, messaging and shortlisting are locked until verified.
              </Text>
            </View>
            <Button title="Verify" size="sm" fullWidth={false} onPress={() => router.push('/(onboarding)/business')} />
          </View>
        </Card>
      )}

      <View style={{ height: spacing.lg }} />
      <View style={{ flexDirection: 'row', gap: spacing.md }}>
        <StatTile label="Open shifts" value="3" delta="+1 today" />
        <StatTile label="Spend MTD" value={currency(2340)} tone="dark" />
      </View>
      <View style={{ height: spacing.md }} />
      <View style={{ flexDirection: 'row', gap: spacing.md }}>
        <StatTile label="Hire speed" value="42 min" delta="-12% vs last mo" />
        <StatTile label="Repeat workers" value="9" />
      </View>

      <View style={{ height: spacing.xl }} />
      <View style={styles.sectionHead}>
        <Text variant="h3">Your shifts</Text>
        <Pressable onPress={() => router.push('/shift/new')}>
          <Text variant="smallMedium" tone="accent">+ New shift</Text>
        </Pressable>
      </View>

      {shifts.map((s) => (
        <Pressable key={s.id} onPress={() => router.push(`/shift/${s.id}`)}>
          <Card style={styles.shiftCard}>
            <View style={styles.shiftHead}>
              <View style={{ flex: 1 }}>
                <Text variant="caption" tone="muted">{professionLabel(s.profession).toUpperCase()}</Text>
                <Text variant="h3" style={{ marginTop: 2 }}>{s.title}</Text>
              </View>
              <Badge
                label={s.status.replace('_', ' ').toUpperCase()}
                tone={s.status === 'open' ? 'accent' : s.status === 'hired' ? 'success' : 'neutral'}
              />
            </View>
            <View style={{ height: spacing.md }} />
            <View style={styles.metaRow}>
              <Meta icon="people-outline" label={`${s.applicantIds.length} applicants`} />
              <Meta icon="time-outline" label={dateLong(s.startsAt)} />
            </View>
          </Card>
        </Pressable>
      ))}
    </Screen>
  );
}

const Meta = ({ icon, label }: { icon: any; label: string }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
    <Ionicons name={icon} size={14} color={colors.textSecondary} />
    <Text variant="caption" tone="secondary">{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: spacing.lg },
  bell: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border,
  },
  bellDot: { position: 'absolute', top: 10, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  shiftCard: { marginBottom: spacing.md },
  shiftHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  metaRow: { flexDirection: 'row', gap: spacing.lg, flexWrap: 'wrap' },
  miniDark: {
    flex: 1, padding: spacing.lg, borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: colors.borderOnDark,
  },
  miniWorker: { width: 160 },
});
