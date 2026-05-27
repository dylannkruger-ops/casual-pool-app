import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, Text, Input, Button, Chip, Card } from '@/components/ui';
import { useProfile } from '@/stores/profile';
import { useShifts } from '@/stores/shifts';
import { canBusinessAct } from '@/lib/permissions';
import { colors, spacing } from '@/constants/theme';
import type { Profession, Shift } from '@/types';

const PROFS: { key: Profession; label: string }[] = [
  { key: 'barista', label: 'Barista' },
  { key: 'bartender', label: 'Bartender' },
  { key: 'hospitality_floor', label: 'Floor' },
  { key: 'kitchen_hand', label: 'Kitchen' },
  { key: 'event_staff', label: 'Events' },
  { key: 'warehouse', label: 'Warehouse' },
  { key: 'retail_assistant', label: 'Retail' },
  { key: 'cleaner', label: 'Cleaning' },
];

export default function NewShift() {
  const router = useRouter();
  const business = useProfile((s) => s.business);
  const addShift = useShifts((s) => s.addShift);
  const gate = canBusinessAct(business);

  const [title, setTitle] = useState('');
  const [profession, setProfession] = useState<Profession>('barista');
  const [description, setDescription] = useState('');
  const [rate, setRate] = useState('40');
  const [hours, setHours] = useState('6');
  const [start, setStart] = useState('Tomorrow 7:00am');
  const [suburb, setSuburb] = useState(business?.location.suburb ?? '');

  const submit = () => {
    if (!gate.allowed) return Alert.alert('Verification needed', gate.reason!);
    if (!business) return;
    const now = new Date();
    const startsAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); startsAt.setHours(7, 0, 0, 0);
    const endsAt = new Date(startsAt.getTime() + Number(hours) * 60 * 60 * 1000);
    const shift: Shift = {
      id: `s_${Date.now()}`,
      businessId: business.id,
      title,
      profession,
      description,
      location: { ...business.location, suburb },
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      hourlyRate: Number(rate),
      hoursEstimate: Number(hours),
      requiredLicences: [],
      requiredQualifications: [],
      status: 'open',
      applicantIds: [],
      shortlistIds: [],
      platformFeeBusiness: 4.99,
      platformFeeWorker: 4.99,
      createdAt: new Date().toISOString(),
    };
    addShift(shift);
    router.replace(`/shift/${shift.id}`);
  };

  return (
    <Screen padded={false}>
      <View style={{ paddingHorizontal: spacing.xl }}>
        <Header back title="Post a shift" subtitle="60 seconds to publish" />
      </View>

      {!gate.allowed && (
        <View style={{ paddingHorizontal: spacing.xl }}>
          <Card style={{ borderWidth: 1, borderColor: colors.warning, marginTop: spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <Ionicons name="warning-outline" size={22} color={colors.warning} />
              <View style={{ flex: 1 }}>
                <Text variant="smallMedium">ABN verification required</Text>
                <Text variant="small" tone="secondary">{gate.reason}</Text>
              </View>
              <Button title="Verify" size="sm" fullWidth={false} onPress={() => router.push('/(onboarding)/business')} />
            </View>
          </Card>
        </View>
      )}

      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: 140, gap: spacing.lg }}>
        <Input
          label="Shift title"
          value={title}
          onChangeText={setTitle}
          placeholder="Weekend brunch barista"
          leftIcon="document-text-outline"
        />
        <View>
          <Text variant="smallMedium" tone="secondary" style={{ marginBottom: 6 }}>Role</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {PROFS.map((p) => (
              <Chip
                key={p.key}
                label={p.label}
                selected={profession === p.key}
                onPress={() => setProfession(p.key)}
              />
            ))}
          </View>
        </View>
        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Service flow, dress code, anything important the worker should know."
          multiline
          style={{ minHeight: 110 } as any}
        />
        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <Input
            containerStyle={{ flex: 1 }}
            label="Hourly rate"
            value={rate}
            onChangeText={setRate}
            keyboardType="decimal-pad"
            leftIcon="cash-outline"
          />
          <Input
            containerStyle={{ flex: 1 }}
            label="Hours"
            value={hours}
            onChangeText={setHours}
            keyboardType="number-pad"
            leftIcon="time-outline"
          />
        </View>
        <Input
          label="Start"
          value={start}
          onChangeText={setStart}
          leftIcon="calendar-outline"
          helper="In production, replace with a date/time picker"
        />
        <Input
          label="Suburb"
          value={suburb}
          onChangeText={setSuburb}
          leftIcon="location-outline"
        />
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Post shift · $4.99 on hire" onPress={submit} disabled={!gate.allowed} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: spacing.xl, backgroundColor: colors.background,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
});
