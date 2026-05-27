import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { colors, typography } from '@/constants/theme';
import { Text } from './Text';

interface Props {
  uri?: string | null;
  name?: string;
  size?: number;
  ring?: boolean;
}

export const Avatar: React.FC<Props> = ({ uri, name, size = 44, ring }) => {
  const initials = (name ?? '')
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <View
      style={[
        styles.wrap,
        { width: size, height: size, borderRadius: size / 2 },
        ring && styles.ring,
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
        />
      ) : (
        <View style={[styles.fallback, { width: size, height: size, borderRadius: size / 2 }]}>
          <Text
            style={[
              typography.smallMedium,
              { color: colors.text, fontSize: size * 0.36 },
            ]}
          >
            {initials || '·'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden' },
  ring: {
    borderWidth: 2,
    borderColor: colors.surface,
  },
  fallback: {
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
