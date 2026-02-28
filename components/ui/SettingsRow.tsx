/**
 * OhPass UI - SettingsRow
 * 基于 Pencil 设计稿的设置行组件
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/components/design-system';

type IconName = keyof typeof Ionicons.glyphMap;

interface SettingsRowProps {
  label: string;
  icon?: IconName;
  iconColor?: string;
  showChevron?: boolean;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  style?: ViewStyle;
}

export function SettingsRow({
  label,
  icon,
  iconColor,
  showChevron = true,
  onPress,
  rightElement,
  style,
}: SettingsRowProps) {
  const { colors, spacing } = useTheme();

  const content = (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderRadius: spacing.card.borderRadius,
          paddingHorizontal: spacing.listItem.paddingHorizontal,
          height: spacing.listItem.height,
        },
        style,
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={20}
          color={iconColor || colors.accentBlue}
        />
      )}

      <Text
        style={[
          styles.label,
          {
            color: colors.textPrimary,
            flex: 1,
          },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>

      {rightElement || (
        showChevron && (
          <Ionicons
            name="chevron-forward"
            size={16}
            color={colors.textTertiary}
          />
        )
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    fontSize: 16,
  },
});
