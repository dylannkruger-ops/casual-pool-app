import React, { useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Text, Card, Input, Chip, Avatar, Badge, Button } from '@/components/ui';
import { useAuth } from '@/stores/auth';
import { useShifts } from '@/stores/shifts';
import { mockWorkers } from '@/lib/mockData';
import { colors, spacing, radius } from '@/constants/theme';
import { currency, dateLong, professionLabel } from '@/lib/format';

const FILTERS = ['All', 'Barista', 'Bartender', 'Warehouse', 'Kitchen', 'Retail', 'Events'];

export default function DiscoverScreen() {
  const router = useRouter();
  const role = useAuth((s) => s.role);
  const isBusiness = role === 'business';
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'list' | 'map'>('list');

  const shifts = useShifts((s) => s.shifts);

  const filteredWorkers = useMemo(() => {
    const f = filter.toLowerCase();
    return mockWorkers.filter((w) => {
      const matchFilter =
        filter === 'All' ||
        w.professions.some((p) => professionLabel(p).toLowerCase().includes(f));
      const q = query.toLowerCase();
      const matchQuery =
        !q ||
        w.fullName.toLowerCase().includes(q) ||
        w.location.suburb.toLowerCase().includes(q);
      return matchFilter && matchQuery;
    });
  }, [filter, query]);

  const filteredShifts = useMemo(() => {
    const f = filter.toLowerCase();
    return shifts.filter((s) => {
      const matchFilter =
        filter === 'All' || professionLabel(s.profession).toLowerCase().includes(f);
      const q = query.toLowerCase();
      const matchQuery =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.location.suburb.toLowerCase().includes(q);
      return matchFilter && matchQuery;
    });
  }, [filter, query, shifts]);

  return (
    <Screen padded={false} contentContainerStyle={{ flex: 1 }}>
      <View style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.lg }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text variant="h1">{isBusiness ? 'Find workers' : 'Find shifts'}</Text>
          <View style={styles.toggle}>
            <Pressable
              onPress={() => setMode('list')}
              style={[styles.toggleBtn, mode === 'list' && styles.toggleOn]}
            >
              <Ionicons name="list" size={16} color={mode === 'list' ? '#fff' : colors.text} />
            </Pressable>
            <Pressable
              onPress={() => setMode('map')}
              style={[styles.toggleBtn, mode === 'map' && styles.toggleOn]}
            >
              <Ionicons name="map" size={16} color={mode === 'map' ? '#fff' : colors.text} />
            </Pressable>
          </View>
        </View>
        <View style={{ height: spacing.md }} />
        <Input
          placeholder={isBusiness ? 'Search by name, suburb…' : 'Search title, suburb…'}
          value={query}
          onChangeText={setQuery}
          leftIcon="search-outline"
        />
        <View style={{ height: spacing.md }} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {FILTERS.map((f) => (
            <Chip key={f} label={f} selected={filter === f} onPress={() => setFilter(f)} />
          ))}
        </ScrollView>
      </View>

      {mode === 'map' ? (
        <MapPlaceholder />
      ) : isBusiness ? (
        <FlatList
          data={filteredWorkers}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ padding: spacing.xl, paddingBottom: 120, gap: spacing.md }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: w }) => (
            <Pressable onPress={() => router.push(`/worker/${w.id}`)}>
              <Card>
                <View style={{ flexDirection: 'row', gap: spacing.md }}>
                  <Avatar uri={w.photoUrl} name={w.fullName} size={56} />
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text variant="h3">{w.fullName}</Text>
                      <Text variant="smallMedium" tone="accent">{currency(w.hourlyRate)}/hr</Text>
                    </View>
                    <Text variant="small" tone="secondary">
                      {w.professions.map(professionLabel).join(' · ')}
                    </Text>
                    <View style={styles.workerMeta}>
                      <View style={styles.tag}>
                        <Ionicons name="star" size={12} color={colors.accent} />
                        <Text variant="caption" tone="secondary">{w.rating.toFixed(1)} · {w.reviewsCount}</Text>
                      </View>
                      <View style={styles.tag}>
                        <Ionicons name="location-outline" size={12} color={colors.textMuted} />
                        <Text variant="caption" tone="secondary">{w.location.suburb}</Text>
                      </View>
                      {w.verified && (
                        <Badge label="VERIFIED" tone="success" />
                      )}
                    </View>
                  </View>
                </View>
              </Card>
            </Pressable>
          )}
        />
      ) : (
        <FlatList
          data={filteredShifts}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ padding: spacing.xl, paddingBottom: 120, gap: spacing.md }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: s }) => (
            <Pressable onPress={() => router.push(`/shift/${s.id}`)}>
              <Card>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1 }}>
                    <Text variant="caption" tone="muted">{professionLabel(s.profession).toUpperCase()}</Text>
                    <Text variant="h3" style={{ marginTop: 2 }}>{s.title}</Text>
                    <Text variant="small" tone="secondary" style={{ marginTop: 4 }}>
                      {s.location.suburb} · {dateLong(s.startsAt)}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text variant="h3" tone="accent">{currency(s.hourlyRate)}</Text>
                    <Text variant="caption" tone="muted">per hour</Text>
                  </View>
                </View>
              </Card>
            </Pressable>
          )}
        />
      )}
    </Screen>
  );
}

const MapPlaceholder = () => (
  <View style={{ flex: 1, padding: spacing.xl }}>
    <Card style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing['3xl'] }}>
      <Ionicons name="map-outline" size={48} color={colors.textMuted} />
      <View style={{ height: spacing.md }} />
      <Text variant="h3">Map view</Text>
      <Text variant="small" tone="secondary" center style={{ marginTop: 6 }}>
        Connect Google Maps in app.json and replace this view with{'\n'}
        a react-native-maps MapView seeded with shift/worker pins.
      </Text>
    </Card>
  </View>
);

const styles = StyleSheet.create({
  toggle: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill },
  toggleOn: { backgroundColor: colors.accent },
  workerMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.sm, flexWrap: 'wrap' },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
