import React from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Text, Card, Avatar, Button, Badge, StatTile, Divider } from '@/components/ui';
import { useAuth } from '@/stores/auth';
import { useProfile } from '@/stores/profile';
import { colors, spacing } from '@/constants/theme';
import { currency, professionLabel } from '@/lib/format';

export default function ProfileScreen() {
  const router = useRouter();
  const role = useAuth((s) => s.role);
  const signOut = useAuth((s) => s.signOut);
  const worker = useProfile((s) => s.worker);
  const business = useProfile((s) => s.business);
  const clearProfile = useProfile((s) => s.clear);

  const onLogout = () => {
    clearProfile();
    signOut();
    router.replace('/');
  };

  if (role === 'business') return <BusinessProfile onLogout={onLogout} />;

  return (
    <Screen padded scroll contentContainerStyle={{ paddingBottom: 120 }}>
      <View style={{ marginTop: spacing.lg, alignItems: 'center' }}>
        <Avatar uri={worker?.photoUrl} name={worker?.fullName} size={88} ring />
        <View style={{ height: spacing.md }} />
        <Text variant="h2">{worker?.fullName ?? 'Your name'}</Text>
        <Text variant="small" tone="secondary">
          {worker?.professions.map(professionLabel).join(' · ') ?? 'Add your professions'}
        </Text>
        <View style={{ flexDirection: 'row', gap: 6, marginTop: spacing.md }}>
          {worker?.verified && <Badge label="VERIFIED" tone="success" />}
          <Badge label={`${currency(worker?.hourlyRate ?? 0)}/hr`} tone="accent" />
          <Badge label={`${worker?.workRadiusKm ?? 0} km radius`} />
        </View>
      </View>

      <View style={{ height: spacing.xl }} />
      <View style={{ flexDirection: 'row', gap: spacing.md }}>
        <StatTile label="Shifts" value={`${worker?.shiftsCompleted ?? 0}`} />
        <StatTile label="Rating" value={(worker?.rating ?? 0).toFixed(1)} tone="dark" />
        <StatTile label="Repeat" value={`${worker?.repeatEmployers ?? 0}`} />
      </View>

      <View style={{ height: spacing.xl }} />
      <Section title="About">
        <Text variant="body" tone="secondary">{worker?.bio ?? 'Add a short bio to help businesses understand who you are.'}</Text>
      </Section>

      <Section title="Licences & qualifications">
        <View style={styles.chipRow}>
          {(worker?.licences ?? []).concat(worker?.qualifications ?? []).map((q) => (
            <View key={q} style={styles.chip}>
              <Ionicons name="ribbon" size={12} color={colors.accent} />
              <Text variant="caption" style={{ color: colors.text }}>{q}</Text>
            </View>
          ))}
        </View>
      </Section>

      <Section title="Documents">
        <Row icon="document-text-outline" label="ID & work rights" value="2 uploaded" />
        <Divider vertical={spacing.md} />
        <Row icon="ribbon-outline" label="Licences" value={`${worker?.licences.length ?? 0} on file`} />
      </Section>

      <Section title="Settings">
        <Row icon="bar-chart-outline" label="Dashboard" onPress={() => router.push('/dashboard')} />
        <Divider vertical={spacing.md} />
        <Row icon="card-outline" label="Payouts" value="Connect bank" onPress={() => {}} />
        <Divider vertical={spacing.md} />
        <Row icon="notifications-outline" label="Notifications" value="On" onPress={() => {}} />
        <Divider vertical={spacing.md} />
        <Row icon="shield-outline" label="Trust & safety" onPress={() => {}} />
        <Divider vertical={spacing.md} />
        <Row icon="log-out-outline" label="Sign out" onPress={onLogout} />
      </Section>
    </Screen>
  );
}

const BusinessProfile = ({ onLogout }: { onLogout: () => void }) => {
  const router = useRouter();
  const business = useProfile((s) => s.business);
  return (
    <Screen padded scroll contentContainerStyle={{ paddingBottom: 120 }}>
      <View style={{ marginTop: spacing.lg, alignItems: 'center' }}>
        <View style={styles.logo}>
          <Ionicons name="business" size={28} color={colors.text} />
        </View>
        <View style={{ height: spacing.md }} />
        <Text variant="h2">{business?.companyName ?? 'Your company'}</Text>
        <Text variant="small" tone="secondary">{business?.industry ?? 'Industry'}</Text>
        <View style={{ flexDirection: 'row', gap: 6, marginTop: spacing.md }}>
          {business?.abnVerified && <Badge label="ABN VERIFIED" tone="success" />}
          {business?.paymentSetup && <Badge label="PAYMENTS ON" tone="accent" />}
        </View>
      </View>

      <View style={{ height: spacing.xl }} />
      <Section title="Business details">
        <Row icon="id-card-outline" label="ABN" value={business?.abn ?? '—'} />
        <Divider vertical={spacing.md} />
        <Row icon="person-outline" label="Contact" value={business?.contactPerson ?? '—'} />
        <Divider vertical={spacing.md} />
        <Row icon="location-outline" label="Location" value={`${business?.location.suburb}, ${business?.location.postcode}`} />
      </Section>

      <Section title="Settings">
        <Row icon="bar-chart-outline" label="Dashboard" onPress={() => router.push('/dashboard')} />
        <Divider vertical={spacing.md} />
        <Row icon="card-outline" label="Billing" value="Card on file" onPress={() => {}} />
        <Divider vertical={spacing.md} />
        <Row icon="people-outline" label="Team members" value="1" onPress={() => {}} />
        <Divider vertical={spacing.md} />
        <Row icon="log-out-outline" label="Sign out" onPress={onLogout} />
      </Section>
    </Screen>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <View style={{ marginBottom: spacing.lg }}>
    <Text variant="overline" tone="muted" style={{ marginBottom: spacing.sm }}>{title}</Text>
    <Card>{children}</Card>
  </View>
);

const Row: React.FC<{ icon: any; label: string; value?: string; onPress?: () => void }> = ({
  icon, label, value, onPress,
}) => {
  const Wrap: any = onPress ? Pressable : View;
  return (
    <Wrap onPress={onPress} style={styles.row}>
      <Ionicons name={icon} size={18} color={colors.text} />
      <Text variant="bodyMedium" style={{ flex: 1 }}>{label}</Text>
      {value && <Text variant="small" tone="secondary">{value}</Text>}
      {onPress && <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />}
    </Wrap>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  logo: { width: 88, height: 88, borderRadius: 24, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.surfaceMuted, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
});
