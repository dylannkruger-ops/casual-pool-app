import React from 'react';
import { View, StyleSheet, ScrollView, ViewStyle, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors, spacing } from '@/constants/theme';

interface Props {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  background?: 'default' | 'dark' | 'white';
  contentContainerStyle?: ViewStyle;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

export const Screen: React.FC<Props> = ({
  children,
  scroll,
  padded = true,
  background = 'default',
  contentContainerStyle,
  edges = ['top', 'left', 'right'],
}) => {
  const bg =
    background === 'dark'
      ? colors.surfaceDark
      : background === 'white'
      ? colors.surface
      : colors.background;

  const Content = scroll ? ScrollView : View;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={edges}>
      <StatusBar style={background === 'dark' ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <Content
          style={styles.flex}
          contentContainerStyle={[
            scroll && { flexGrow: 1 },
            padded && { paddingHorizontal: spacing.xl, paddingBottom: spacing['3xl'] },
            contentContainerStyle,
          ]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </Content>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
});
