import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, Text, Card, StatTile, Divider, Chip } from '@/components/ui';
import { useAuth } from '@/stores/auth';
import { colors, spacing, radius } from '@/constants/theme';
import { currency } from '@/lib/format';

type Range = 'week' | 'month' | 'year';

export default function Dashboard() {
  const role = useAuth((s) => s.role);
  const [range, setRange] = useState<Range>('week');
  const isBusiness = role === 'business';

  const data: Record<Range, any> = isBusiness
    ? {
        week:  { open: 3, filled: 9, hireSpeed: '42m', repeat: 4, spend: 2340 },
        month: { open: 7, filled: 38, hireSpeed: '38m', repeat: 12, spend: 9840 },
        year:  { open: 21, filled: 412, hireSpeed: '36m', repeat: 86, spend: 102450 },
      }
    : {
        week:  { shifts: 2, earnings: 640, hours: 16, repeat: 1 },
        month: { shifts: 9, earnings: 2880, hours: 72, repeat: 4 },
        year:  { shifts: 84, earnings: 26640, hours: 612, repeat: 18 },
      };
  const d = data[range];

  const bars = isBusiness
    ? [0.4, 0.7, 0.55, 0.85, 0.6, 0.3, 0.45]
    : [0.5, 0.3, 0.7, 0, 0.6, 0.8, 0.2];

  return (
    <Screen padded scroll contentContainerStyle={{ paddingBottom: spacing['4xl'] }}>
      <Header back title="Dashboard" subtitle={isBusiness ? 'Your hiring performance' : 'Your shift performance'} />

      <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
        {(['week', 'month', 'year'] as Range[]).map((r) => (
          <Chip
            key={r}
            label={r[0].toUpperCase() + r.slice(1)}
            selected={range === r}
            onPress={() => setRange(r)}
          />
        ))}
      </View>

      <View style={{ height: spacing.lg }} />

      {isBusiness ? (
        <>
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <StatTile label="Open shifts" value={String(d.open)} />
            <StatTile label="Filled" value={String(d.filled)} tone="dark" />
          </View>
          <View style={{ height: spacing.md }} />
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <StatTile label="Hire speed" value={d.hireSpeed} delta="median time-to-hire" />
            <StatTile label="Repeat workers" value={String(d.repeat)} />
          </View>
          <View style={{ height: spacing.md }} />
          <Card variant="dark" padding="2xl" radius="xl">
            <Text variant="overline" tone="onDarkMuted">SPEND</Text>
            <Text variant="display" tone="onDark">{currency(d.spend)}</Text>
            <Text variant="small" tone="onDarkMuted">Wages + platform fees</Text>
            <Divider onDark />
            <BarChart values={bars} onDark />
          </Card>
        </>
      ) : (
        <>
          <Card variant="dark" padding="2xl" radius="xl">
            <Text variant="overline" tone="onDarkMuted">ESTIMATED EARNINGS</Text>
            <Text variant="display" tone="onDark">{currency(d.earnings)}</Text>
            <Text variant="small" tone="onDarkMuted">After $4.99 platform fees</Text>
            <Divider onDark />
            <BarChart values={bars} onDark />
          </Card>
          <View style={{ height: spacing.md }} />
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <StatTile label="Shifts picked up" value={String(d.shifts)} />
            <StatTile label="Hours worked" value={`${d.hours}h`} />
          </View>
          <View style={{ height: spacing.md }} />
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <StatTile label="Repeat employers" value={String(d.repeat)} tone="accent" />
            <StatTile label="On-time rate" value="98%" />
          </View>
        </>
      )}

      <View style={{ height: spacing.xl }} />
      <Card>
        <Text variant="overline" tone="muted">QUICK INSIGHTS</Text>
        <View style={{ height: spacing.md }} />
        {[
          isBusiness ? 'You fill shifts 22% faster than other Hospitality businesses.' : 'You\'re in the top 10% for response time.',
          isBusiness ? '3 repeat workers hired this month — consider a saved roster.' : 'You\'ve worked with 4 employers more than once.',
          isBusiness ? 'Friday brunch shifts pay 8% above category average.' : 'Saturdays earn you 18% more than weekdays.',
        ].map((line, i) => (
          <View key={i} style={styles.insightRow}>
            <Ionicons name="sparkles" size={14} color={colors.accent} />
            <Text variant="small" tone="secondary" style={{ flex: 1 }}>{line}</Text>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const BarChart = ({ values, onDark }: { values: number[]; onDark?: boolean }) => (
  <View style={styles.chart}>
    {values.map((v, i) => (
      <View key={i} style={{ alignItems: 'center', flex: 1, gap: 4 }}>
        <View
          style={[
            styles.bar,
            {
              height: Math.max(8, v * 80),
              backgroundColor: onDark ? colors.accentSoft : colors.accent,
              opacity: v === 0 ? 0.2 : 1,
            },
          ]}
        />
        <Text variant="caption" tone={onDark ? 'onDarkMuted' : 'muted'}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
        </Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 100 },
  bar: { width: '70%', borderRadius: 4 },
  insightRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginVertical: 4 },
});
