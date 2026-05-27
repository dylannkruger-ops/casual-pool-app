import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Text, Card, Badge } from '@/components/ui';
import { useShifts } from '@/stores/shifts';
import { colors, spacing, radius } from '@/constants/theme';
import { professionLabel, time, currency } from '@/lib/format';
import { format, addDays, startOfWeek, isSameDay, parseISO } from 'date-fns';

export default function CalendarScreen() {
  const router = useRouter();
  const shifts = useShifts((s) => s.shifts);
  const [selected, setSelected] = useState(new Date());

  const weekStart = useMemo(() => startOfWeek(new Date(), { weekStartsOn: 1 }), []);
  const week = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  const dayShifts = shifts.filter((s) => isSameDay(parseISO(s.startsAt), selected));

  return (
    <Screen padded scroll contentContainerStyle={{ paddingBottom: 120 }}>
      <View style={{ marginTop: spacing.lg }}>
        <Text variant="small" tone="secondary">{format(selected, 'MMMM yyyy')}</Text>
        <Text variant="h1">Schedule</Text>
      </View>

      <View style={{ height: spacing.lg }} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
        {week.map((d) => {
          const active = isSameDay(d, selected);
          const has = shifts.some((s) => isSameDay(parseISO(s.startsAt), d));
          return (
            <Pressable
              key={d.toISOString()}
              onPress={() => setSelected(d)}
              style={[styles.day, active && styles.dayActive]}
            >
              <Text variant="caption" tone={active ? 'onDarkMuted' : 'muted'}>
                {format(d, 'EEE').toUpperCase()}
              </Text>
              <Text variant="h3" tone={active ? 'onDark' : 'default'}>
                {format(d, 'd')}
              </Text>
              {has && <View style={[styles.dot, { backgroundColor: active ? colors.accentSoft : colors.accent }]} />}
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={{ height: spacing.xl }} />
      <Text variant="h3">{format(selected, 'EEEE')}</Text>
      <View style={{ height: spacing.md }} />

      {dayShifts.length === 0 ? (
        <Card style={{ alignItems: 'center', padding: spacing['3xl'] }}>
          <Ionicons name="calendar-outline" size={36} color={colors.textMuted} />
          <View style={{ height: spacing.md }} />
          <Text variant="smallMedium">No shifts on this day</Text>
          <Text variant="small" tone="secondary" center style={{ marginTop: 4 }}>
            Tap a date with a dot, or browse the marketplace to add one.
          </Text>
        </Card>
      ) : (
        dayShifts.map((s) => (
          <Pressable key={s.id} onPress={() => router.push(`/shift/${s.id}`)}>
            <Card style={{ marginBottom: spacing.md }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <Text variant="caption" tone="muted">{professionLabel(s.profession).toUpperCase()}</Text>
                  <Text variant="h3" style={{ marginTop: 2 }}>{s.title}</Text>
                  <Text variant="small" tone="secondary" style={{ marginTop: 4 }}>
                    {time(s.startsAt)} – {time(s.endsAt)} · {s.location.suburb}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text variant="smallMedium" tone="accent">{currency(s.hourlyRate * s.hoursEstimate)}</Text>
                  <Badge
                    label={s.status.replace('_', ' ').toUpperCase()}
                    tone={s.status === 'hired' ? 'success' : 'neutral'}
                    style={{ marginTop: 6 }}
                  />
                </View>
              </View>
            </Card>
          </Pressable>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  day: {
    width: 56, paddingVertical: spacing.md, alignItems: 'center', borderRadius: radius.md,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, gap: 4,
  },
  dayActive: { backgroundColor: colors.surfaceDark, borderColor: colors.surfaceDark },
  dot: { width: 5, height: 5, borderRadius: 3, marginTop: 2 },
});
