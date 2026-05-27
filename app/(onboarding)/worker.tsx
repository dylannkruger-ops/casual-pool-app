import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, Text, Input, Button, Chip, Card, Avatar, Divider } from '@/components/ui';
import { useAuth } from '@/stores/auth';
import { useProfile } from '@/stores/profile';
import { colors, spacing } from '@/constants/theme';
import type { Profession, WorkerProfile } from '@/types';

const PROFESSIONS: { key: Profession; label: string }[] = [
  { key: 'barista', label: 'Barista' },
  { key: 'bartender', label: 'Bartender' },
  { key: 'hospitality_floor', label: 'Floor Staff' },
  { key: 'kitchen_hand', label: 'Kitchen Hand' },
  { key: 'chef_de_partie', label: 'Chef' },
  { key: 'event_staff', label: 'Event Staff' },
  { key: 'warehouse', label: 'Warehouse' },
  { key: 'forklift_operator', label: 'Forklift' },
  { key: 'construction_labourer', label: 'Construction' },
  { key: 'cleaner', label: 'Cleaner' },
  { key: 'retail_assistant', label: 'Retail' },
  { key: 'driver', label: 'Driver' },
  { key: 'security', label: 'Security' },
];

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;

export default function WorkerOnboarding() {
  const router = useRouter();
  const signed = useAuth();
  const setWorker = useProfile((s) => s.setWorker);

  const [step, setStep] = useState(0);
  const [fullName, setFullName] = useState('');
  const [photoUrl] = useState<string | undefined>();
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [hourlyRate, setHourlyRate] = useState('40');
  const [suburb, setSuburb] = useState('');
  const [postcode, setPostcode] = useState('');
  const [radius, setRadius] = useState('15');
  const [licences, setLicences] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [bio, setBio] = useState('');
  const [experienceYears, setExperienceYears] = useState('2');
  const [days, setDays] = useState<boolean[]>([true, true, true, true, true, false, false]);

  const toggleDay = (i: number) =>
    setDays((arr) => arr.map((v, idx) => (idx === i ? !v : v)));

  const toggleProfession = (k: Profession) =>
    setProfessions((arr) => (arr.includes(k) ? arr.filter((x) => x !== k) : [...arr, k]));

  const total = 4;
  const next = () => {
    if (step < total - 1) setStep(step + 1);
    else finish();
  };
  const back = () => (step === 0 ? router.back() : setStep(step - 1));

  const finish = () => {
    const profile: WorkerProfile = {
      id: signed.userId ?? `w_${Date.now()}`,
      userId: signed.userId ?? `u_${Date.now()}`,
      fullName,
      photoUrl,
      professions,
      hourlyRate: Number(hourlyRate) || 40,
      location: { suburb, postcode, state: 'NSW', country: 'AU' },
      workRadiusKm: Number(radius) || 15,
      licences: licences.split(',').map((s) => s.trim()).filter(Boolean),
      qualifications: qualifications.split(',').map((s) => s.trim()).filter(Boolean),
      availability: {
        monday: days[0], tuesday: days[1], wednesday: days[2], thursday: days[3],
        friday: days[4], saturday: days[5], sunday: days[6],
      },
      bio,
      experienceYears: Number(experienceYears) || 0,
      documents: [],
      rating: 0,
      reviewsCount: 0,
      shiftsCompleted: 0,
      repeatEmployers: 0,
      verified: false,
      createdAt: new Date().toISOString(),
    };
    setWorker(profile);
    signed.setOnboarded(true);
    router.replace('/(tabs)');
  };

  return (
    <Screen padded={false}>
      <View style={{ paddingHorizontal: spacing.xl }}>
        <Header back title="Worker profile" subtitle={`Step ${step + 1} of ${total}`} onBack={back} />
        <View style={styles.progress}>
          {Array.from({ length: total }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                { backgroundColor: i <= step ? colors.accent : colors.surfaceMuted },
              ]}
            />
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: 140 }}>
        {step === 0 && (
          <View style={{ gap: spacing.lg }}>
            <Text variant="h2">The basics</Text>
            <View style={styles.photoRow}>
              <Avatar size={84} name={fullName} uri={photoUrl} />
              <View style={{ flex: 1 }}>
                <Text variant="smallMedium">Profile photo</Text>
                <Text variant="small" tone="secondary">
                  A clear, friendly photo gets you hired 2× faster.
                </Text>
                <View style={{ height: 8 }} />
                <Button title="Upload photo" variant="secondary" size="sm" fullWidth={false} />
              </View>
            </View>
            <Input
              label="Full name"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Amelia Chen"
              leftIcon="person-outline"
            />
            <Input
              label="Short bio"
              value={bio}
              onChangeText={setBio}
              placeholder="What kind of work you do, your style, what makes you reliable."
              multiline
              numberOfLines={4}
              style={{ minHeight: 100 } as any}
            />
            <Input
              label="Years of experience"
              value={experienceYears}
              onChangeText={setExperienceYears}
              keyboardType="number-pad"
              leftIcon="time-outline"
            />
          </View>
        )}

        {step === 1 && (
          <View style={{ gap: spacing.lg }}>
            <Text variant="h2">Skills & rate</Text>
            <Text variant="small" tone="secondary">Pick the professions you're available for.</Text>
            <View style={styles.chips}>
              {PROFESSIONS.map((p) => (
                <Chip
                  key={p.key}
                  label={p.label}
                  selected={professions.includes(p.key)}
                  onPress={() => toggleProfession(p.key)}
                />
              ))}
            </View>
            <Divider />
            <Input
              label="Hourly rate (AUD)"
              value={hourlyRate}
              onChangeText={setHourlyRate}
              keyboardType="decimal-pad"
              leftIcon="cash-outline"
            />
            <Input
              label="Licences (comma separated)"
              value={licences}
              onChangeText={setLicences}
              placeholder="RSA NSW, Forklift LF, White Card"
              leftIcon="id-card-outline"
            />
            <Input
              label="Qualifications"
              value={qualifications}
              onChangeText={setQualifications}
              placeholder="Cert III Hospitality, Latte art"
              leftIcon="ribbon-outline"
            />
          </View>
        )}

        {step === 2 && (
          <View style={{ gap: spacing.lg }}>
            <Text variant="h2">Availability & location</Text>
            <Input
              label="Suburb"
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
            <Input
              label="Work radius (km)"
              value={radius}
              onChangeText={setRadius}
              keyboardType="number-pad"
              leftIcon="navigate-outline"
            />
            <Divider />
            <Text variant="smallMedium">Available days</Text>
            <View style={styles.daysRow}>
              {DAYS.map((d, i) => (
                <Pressable key={i} onPress={() => toggleDay(i)} style={[styles.day, days[i] && styles.dayOn]}>
                  <Text style={{ color: days[i] ? '#fff' : colors.text, fontWeight: '600' }}>{d}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={{ gap: spacing.lg }}>
            <Text variant="h2">Documents</Text>
            <Text variant="small" tone="secondary">
              Upload your IDs, licences and qualifications. Verified workers get priority placement.
            </Text>
            {['Photo ID', 'Driver licence', 'Work right / visa', 'Licences (RSA, Forklift, etc.)'].map((doc) => (
              <Card key={doc}>
                <View style={styles.docRow}>
                  <View style={styles.docIcon}>
                    <Ionicons name="document-text-outline" size={20} color={colors.text} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="smallMedium">{doc}</Text>
                    <Text variant="caption" tone="muted">PDF or image · max 10MB</Text>
                  </View>
                  <Button title="Upload" variant="secondary" size="sm" fullWidth={false} />
                </View>
              </Card>
            ))}
            <Text variant="caption" tone="muted" style={{ marginTop: spacing.md }}>
              You can skip and add these later from Profile → Documents.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button title={step === total - 1 ? 'Finish' : 'Continue'} onPress={next} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  progress: { flexDirection: 'row', gap: 6, marginTop: 4, marginBottom: spacing.md },
  progressDot: { flex: 1, height: 4, borderRadius: 2 },
  photoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between' },
  day: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center', justifyContent: 'center',
  },
  dayOn: { backgroundColor: colors.accent },
  docRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  docIcon: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center', justifyContent: 'center',
  },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: spacing.xl,
    backgroundColor: colors.background,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
});
