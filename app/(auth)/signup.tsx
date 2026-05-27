import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Header, Text, Input, Button, Divider } from '@/components/ui';
import { useAuth } from '@/stores/auth';
import { spacing } from '@/constants/theme';

export default function SignUpScreen() {
  const router = useRouter();
  const role = useAuth((s) => s.role);
  const signIn = useAuth((s) => s.signIn);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email || password.length < 8 || !role) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    signIn({
      userId: `u_${Date.now()}`,
      role,
      email,
      onboarded: false,
    });
    setLoading(false);
    router.replace('/(onboarding)/start');
  };

  return (
    <Screen padded scroll>
      <Header back title="Create your account" subtitle={`Signing up as ${role ?? '—'}`} />
      <View style={{ height: spacing.xl }} />

      <View style={{ gap: spacing.lg }}>
        <Input
          label="Email"
          placeholder="you@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          leftIcon="mail-outline"
        />
        <Input
          label="Password"
          placeholder="At least 8 characters"
          secureTextEntry={!showPw}
          value={password}
          onChangeText={setPassword}
          leftIcon="lock-closed-outline"
          rightIcon={showPw ? 'eye-off-outline' : 'eye-outline'}
          onRightIconPress={() => setShowPw((v) => !v)}
          helper="Use 8+ characters with a number and a symbol."
        />
      </View>

      <View style={{ height: spacing['2xl'] }} />
      <Button title="Create account" loading={loading} onPress={submit} />

      <Divider />
      <Button
        title="Continue with Apple"
        variant="dark"
        onPress={submit}
      />
      <View style={{ height: spacing.md }} />
      <Button
        title="Continue with Google"
        variant="secondary"
        onPress={submit}
      />

      <View style={{ height: spacing['2xl'] }} />
      <Text variant="small" tone="muted" center>
        Already have an account?{' '}
        <Text
          variant="smallMedium"
          tone="accent"
          onPress={() => router.replace('/(auth)/login')}
        >
          Sign in
        </Text>
      </Text>
    </Screen>
  );
}
