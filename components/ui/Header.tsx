import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing } from '@/constants/theme';
import { Text } from './Text';

interface Props {
  title?: string;
  subtitle?: string;
  back?: boolean;
  right?: React.ReactNode;
  onBack?: () => void;
  tone?: 'light' | 'dark';
}

export const Header: React.FC<Props> = ({
  title,
  subtitle,
  back,
  right,
  onBack,
  tone = 'light',
}) => {
  const router = useRouter();

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {back && (
          <Pressable
            onPress={() => (onBack ? onBack() : router.back())}
            hitSlop={10}
            style={[styles.iconBtn, tone === 'dark' && styles.iconBtnDark]}
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color={tone === 'dark' ? colors.textOnDark : colors.text}
            />
          </Pressable>
        )}
        <View style={{ flex: 1 }}>
          {title && (
            <Text
              variant="h2"
              tone={tone === 'dark' ? 'onDark' : 'default'}
            >
              {title}
            </Text>
          )}
          {subtitle && (
            <Text
              variant="small"
              tone={tone === 'dark' ? 'onDarkMuted' : 'secondary'}
              style={{ marginTop: 2 }}
            >
              {subtitle}
            </Text>
          )}
        </View>
        {right}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconBtnDark: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.10)',
  },
});
