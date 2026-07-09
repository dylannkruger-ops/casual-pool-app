import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, Text, Button, Card } from '@/components/ui';
import { useAuth } from '@/stores/auth';
import { colors, spacing, radius } from '@/constants/theme';

export default function RoleScreen() {
  const router = useRouter();
  const setRole = useAuth((s) => s.setRole);
  const [role, setLocal] = useState<'worker' | 'business' | null>(null);

  const next = () => {
    if (!role) return;
    setRole(role);
    router.push('/(auth)/signup');
  };

  return (
    <Screen padded>
      <Header back title="Join Lucen AI" subtitle="How will you use the app?" />
      <View style={{ height: spacing.lg }} />

      <RoleCard
        title="I'm a Casual Worker"
        body="Find shifts that match your skills, rate and schedule. Get paid quickly."
        icon="person"
        bullets={['Browse open shifts', 'One-tap apply', 'Build a verified profile']}
        selected={role === 'worker'}
        onPress={() => setLocal('worker')}
      />
      <View style={{ height: spacing.md }} />
      <RoleCard
        title="I'm a Business"
        body="Post a shift, shortlist verified casuals nearby and hire in minutes."
        icon="briefcase"
        bullets={['Post shifts in 60 seconds', 'See ABN-verified candidates', 'Manage scheduling']}
        selected={role === 'business'}
        onPress={() => setLocal('business')}
      />

      <View style={{ flex: 1 }} />
      <Button title="Continue" disabled={!role} onPress={next} />
    </Screen>
  );
}

const RoleCard = ({
  title,
  body,
  bullets,
  icon,
  selected,
  onPress,
}: {
  title: string;
  body: string;
  bullets: string[];
  icon: any;
  selected: boolean;
  onPress: () => void;
}) => (
  <Pressable onPress={onPress}>
    <Card
      variant={selected ? 'dark' : 'light'}
      padding="2xl"
      style={[styles.card, selected && styles.cardSelected]}
    >
      <View style={styles.head}>
        <View
          style={[
            styles.icon,
            { backgroundColor: selected ? 'rgba(255,255,255,0.10)' : colors.surfaceMuted },
          ]}
        >
          <Ionicons
            name={icon}
            size={20}
            color={selected ? colors.textOnDark : colors.text}
          />
        </View>
        {selected && (
          <View style={styles.check}>
            <Ionicons name="checkmark" size={14} color="#fff" />
          </View>
        )}
      </View>
      <View style={{ height: spacing.lg }} />
      <Text variant="h2" tone={selected ? 'onDark' : 'default'}>
        {title}
      </Text>
      <Text
        variant="small"
        tone={selected ? 'onDarkMuted' : 'secondary'}
        style={{ marginTop: 6 }}
      >
        {body}
      </Text>
      <View style={{ height: spacing.lg }} />
      {bullets.map((b) => (
        <View key={b} style={styles.bullet}>
          <Ionicons
            name="checkmark-circle"
            size={16}
            color={selected ? colors.accentSoft : colors.accent}
          />
          <Text variant="small" tone={selected ? 'onDarkMuted' : 'secondary'}>
            {b}
          </Text>
        </View>
      ))}
    </Card>
  </Pressable>
);

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderColor: 'transparent' },
  cardSelected: { borderColor: colors.accent },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  icon: {
    width: 40, height: 40, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center',
  },
  check: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: colors.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  bullet: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 6 },
});
