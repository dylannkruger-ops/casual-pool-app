import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, Text, Avatar } from '@/components/ui';
import { useMessaging } from '@/stores/messaging';
import { useAuth } from '@/stores/auth';
import { mockBusinesses, mockWorkers } from '@/lib/mockData';
import { colors, spacing, radius } from '@/constants/theme';
import { time } from '@/lib/format';

export default function MessageThread() {
  const { threadId } = useLocalSearchParams<{ threadId: string }>();
  const userId = useAuth((s) => s.userId);
  const role = useAuth((s) => s.role);
  const threads = useMessaging((s) => s.threads);
  const messages = useMessaging((s) => s.messagesByThread[threadId ?? ''] ?? []);
  const sendMessage = useMessaging((s) => s.sendMessage);
  const markRead = useMessaging((s) => s.markRead);

  const thread = threads.find((t) => t.id === threadId);
  const [text, setText] = useState('');

  useEffect(() => {
    if (threadId) markRead(threadId);
  }, [threadId]);

  const otherName = role === 'business'
    ? mockWorkers.find((w) => w.id === thread?.workerId)?.fullName
    : mockBusinesses.find((b) => b.id === thread?.businessId)?.companyName;

  const otherPhoto = role === 'business'
    ? mockWorkers.find((w) => w.id === thread?.workerId)?.photoUrl
    : undefined;

  const send = () => {
    if (!text.trim() || !threadId || !userId) return;
    sendMessage(threadId, userId, text.trim());
    setText('');
  };

  return (
    <Screen padded={false}>
      <View style={{ paddingHorizontal: spacing.xl }}>
        <Header
          back
          title={otherName ?? 'Conversation'}
          subtitle="Replies usually within an hour"
          right={
            <Pressable hitSlop={8} style={styles.callBtn}>
              <Ionicons name="call-outline" size={18} color={colors.text} />
            </Pressable>
          }
        />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.lg, gap: 10 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((m) => {
            const mine = m.senderId === userId;
            return (
              <View key={m.id} style={[styles.row, mine ? styles.rowMine : styles.rowTheirs]}>
                {!mine && <Avatar uri={otherPhoto} name={otherName} size={28} />}
                <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
                  <Text style={{ color: mine ? '#fff' : colors.text }}>{m.body}</Text>
                  <Text variant="caption" style={{ color: mine ? 'rgba(255,255,255,0.6)' : colors.textMuted, marginTop: 4 }}>
                    {time(m.sentAt)}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.composer}>
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="Type a message"
              placeholderTextColor={colors.textMuted}
              value={text}
              onChangeText={setText}
              style={styles.input}
              multiline
            />
          </View>
          <Pressable onPress={send} style={styles.sendBtn}>
            <Ionicons name="arrow-up" size={18} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  rowMine: { justifyContent: 'flex-end' },
  rowTheirs: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '78%', padding: spacing.md, borderRadius: 18 },
  bubbleMine: { backgroundColor: colors.accent, borderBottomRightRadius: 4 },
  bubbleTheirs: { backgroundColor: colors.surface, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: colors.border },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  inputWrap: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    maxHeight: 120,
  },
  input: { paddingVertical: 10, color: colors.text, fontSize: 15 },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  callBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border,
  },
});
