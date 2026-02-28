/**
 * OhPass UI - PasswordRow
 * 基于 Pencil 设计稿的密码行组件
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

interface PasswordRowProps {
  title: string;
  subtitle?: string;
  icon?: IconName;
  iconColor?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export function PasswordRow({
  title,
  subtitle,
  icon = 'globe',
  iconColor,
  onPress,
  style,
}: PasswordRowProps) {
  const { colors, spacing } = useTheme();

  const defaultIconColor = colors.accentBlue;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderRadius: spacing.card.borderRadius,
          paddingHorizontal: spacing.listItem.paddingHorizontal,
          height: spacing.listItem.heightLarge,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: iconColor || defaultIconColor,
            borderRadius: 10,
            width: spacing.iconContainer.xlarge,
            height: spacing.iconContainer.xlarge,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={colors.white}
        />
      </View>

      <View style={styles.info}>
        <Text
          style={[
            styles.title,
            {
              color: colors.textPrimary,
            },
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[
              styles.subtitle,
              {
                color: colors.textSecondary,
              },
            ]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </View>

      <Ionicons
        name="chevron-forward"
        size={16}
        color={colors.textTertiary}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 13,
  },
});
