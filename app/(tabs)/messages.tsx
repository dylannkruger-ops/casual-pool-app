import React from 'react';
import { View, FlatList, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Text, Avatar, Header } from '@/components/ui';
import { useMessaging } from '@/stores/messaging';
import { useAuth } from '@/stores/auth';
import { colors, spacing } from '@/constants/theme';
import { fromNow } from '@/lib/format';
import { mockWorkers, mockBusinesses } from '@/lib/mockData';

export default function MessagesScreen() {
  const router = useRouter();
  const threads = useMessaging((s) => s.threads);
  const role = useAuth((s) => s.role);

  return (
    <Screen padded scroll={false} contentContainerStyle={{ flex: 1 }}>
      <Header title="Messages" subtitle="Stay in touch with workers and businesses" />

      <FlatList
        data={threads}
        keyExtractor={(t) => t.id}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item: t }) => {
          const other =
            role === 'business'
              ? mockWorkers.find((w) => w.id === t.workerId)
              : mockBusinesses.find((b) => b.id === t.businessId);
          const name = role === 'business'
            ? mockWorkers.find((w) => w.id === t.workerId)?.fullName ?? 'Worker'
            : mockBusinesses.find((b) => b.id === t.businessId)?.companyName ?? 'Business';
          const photo = role === 'business'
            ? mockWorkers.find((w) => w.id === t.workerId)?.photoUrl
            : undefined;

          return (
            <Pressable onPress={() => router.push(`/messages/${t.id}`)} style={styles.row}>
              <Avatar uri={photo} name={name} size={48} />
              <View style={{ flex: 1 }}>
                <View style={styles.rowHead}>
                  <Text variant="bodyMedium">{name}</Text>
                  <Text variant="caption" tone="muted">{fromNow(t.lastMessageAt)}</Text>
                </View>
                <Text
                  variant="small"
                  tone={t.unreadCount > 0 ? 'default' : 'secondary'}
                  numberOfLines={1}
                  style={{ marginTop: 2 }}
                >
                  {t.lastMessagePreview}
                </Text>
              </View>
              {t.unreadCount > 0 && (
                <View style={styles.unread}>
                  <Text variant="caption" style={{ color: '#fff' }}>{t.unreadCount}</Text>
                </View>
              )}
            </Pressable>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  rowHead: { flexDirection: 'row', justifyContent: 'space-between' },
  sep: { height: 1, backgroundColor: colors.border },
  unread: {
    minWidth: 22, height: 22, borderRadius: 11, backgroundColor: colors.accent,
    paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center',
  },
});
