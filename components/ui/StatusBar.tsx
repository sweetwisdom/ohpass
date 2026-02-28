/**
 * OhPass UI - StatusBar
 * 基于 Pencil 设计稿的状态栏组件
 */

import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/components/design-system';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface StatusBarProps {
  showTime?: boolean;
  time?: string;
}

export function StatusBar({
  showTime = true,
  time,
}: StatusBarProps) {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  const currentTime = time || new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          height: spacing.statusBar.height + insets.top,
          paddingTop: insets.top + spacing.statusBar.paddingTop,
        },
      ]}
    >
      <View style={styles.left}>
        {showTime && (
          <Text
            style={[
              styles.time,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            {currentTime}
          </Text>
        )}
      </View>

      <View style={styles.right}>
        <Ionicons
          name="wifi"
          size={16}
          color={colors.textPrimary}
          style={styles.icon}
        />
        <Ionicons
          name="battery-full"
          size={22}
          color={colors.textPrimary}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  time: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'monospace',
  },
  icon: {
    marginRight: 2,
  },
});
