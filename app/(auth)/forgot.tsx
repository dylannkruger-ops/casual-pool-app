import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Header, Text, Input, Button } from '@/components/ui';
import { spacing } from '@/constants/theme';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setSent(true);
    setLoading(false);
  };

  return (
    <Screen padded>
      <Header back title="Reset password" subtitle="We'll email you a reset link" />
      <View style={{ height: spacing.xl }} />

      {sent ? (
        <View style={{ gap: spacing.md }}>
          <Text variant="h3">Check your inbox</Text>
          <Text tone="secondary">
            If an account exists for {email}, we've sent a reset link. It expires in 30 minutes.
          </Text>
          <View style={{ height: spacing.xl }} />
          <Button title="Back to sign in" onPress={() => router.replace('/(auth)/login')} />
        </View>
      ) : (
        <>
          <Input
            label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            leftIcon="mail-outline"
          />
          <View style={{ height: spacing['2xl'] }} />
          <Button title="Send reset link" loading={loading} onPress={submit} />
        </>
      )}
    </Screen>
  );
}
