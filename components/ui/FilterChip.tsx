/**
 * OhPass UI - FilterChip
 * 基于 Pencil 设计稿的筛选标签组件
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/components/design-system';

interface FilterChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export function FilterChip({
  label,
  active = false,
  onPress,
  style,
}: FilterChipProps) {
  const { colors, spacing } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: active ? colors.accentBlue : colors.bgTertiary,
          borderRadius: spacing.chip.borderRadius,
          height: spacing.chip.height,
          paddingHorizontal: spacing.chip.paddingHorizontal,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.label,
          {
            color: active ? colors.white : colors.textSecondary,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
});