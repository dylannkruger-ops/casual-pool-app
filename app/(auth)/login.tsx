import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Header, Text, Input, Button } from '@/components/ui';
import { useAuth } from '@/stores/auth';
import { useProfile } from '@/stores/profile';
import { spacing } from '@/constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('demo@casualpool.app');
  const [password, setPassword] = useState('demo1234');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const signIn = useAuth((s) => s.signIn);
  const loadDemoBusiness = useProfile((s) => s.loadDemoBusiness);
  const loadDemoWorker = useProfile((s) => s.loadDemoWorker);

  const enter = async (asRole: 'worker' | 'business') => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    if (asRole === 'business') loadDemoBusiness();
    else loadDemoWorker();
    signIn({
      userId: asRole === 'business' ? 'u_b_001' : 'u_w_001',
      role: asRole,
      email,
      onboarded: true,
    });
    setLoading(false);
    router.replace('/(tabs)');
  };

  return (
    <Screen padded>
      <Header back title="Welcome back" subtitle="Sign in to continue" />
      <View style={{ height: spacing.xl }} />

      <View style={{ gap: spacing.lg }}>
        <Input
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          leftIcon="mail-outline"
        />
        <Input
          label="Password"
          secureTextEntry={!showPw}
          value={password}
          onChangeText={setPassword}
          leftIcon="lock-closed-outline"
          rightIcon={showPw ? 'eye-off-outline' : 'eye-outline'}
          onRightIconPress={() => setShowPw((v) => !v)}
        />
        <Text
          variant="smallMedium"
          tone="accent"
          onPress={() => router.push('/(auth)/forgot')}
          style={{ alignSelf: 'flex-end' }}
        >
          Forgot password?
        </Text>
      </View>

      <View style={{ flex: 1 }} />

      <Button title="Sign in as Worker (demo)" onPress={() => enter('worker')} loading={loading} />
      <View style={{ height: spacing.md }} />
      <Button title="Sign in as Business (demo)" variant="dark" onPress={() => enter('business')} />

      <View style={{ height: spacing.xl }} />
      <Text variant="small" tone="muted" center>
        New here?{' '}
        <Text
          variant="smallMedium"
          tone="accent"
          onPress={() => router.replace('/(auth)/role')}
        >
          Create an account
        </Text>
      </Text>
    </Screen>
  );
}
