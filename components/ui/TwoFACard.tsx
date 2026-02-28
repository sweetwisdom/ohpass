/**
 * OhPass UI - TwoFACard
 * 基于 Pencil 设计稿的 2FA 卡片组件
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

interface TwoFACardProps {
  serviceName: string;
  code: string;
  icon?: IconName;
  iconColor?: string;
  timeRemaining?: number;
  onPress?: () => void;
  style?: ViewStyle;
}

export function TwoFACard({
  serviceName,
  code,
  icon = 'shield',
  iconColor,
  timeRemaining = 30,
  onPress,
  style,
}: TwoFACardProps) {
  const { colors, spacing } = useTheme();

  const defaultIconColor = '#5856D6';

  // 格式化验证码，每3位加空格
  const formattedCode = code.replace(/(\d{3})(\d{3})/, '$1 $2');

  // 计算剩余时间的圆环进度
  const progress = timeRemaining / 30;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderRadius: spacing.card.borderRadius,
          paddingHorizontal: spacing.listItem.paddingHorizontal,
          height: spacing.listItem.heightXLarge,
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
        <Ionicons name={icon} size={20} color={colors.white} />
      </View>

      <View style={styles.info}>
        <Text
          style={[
            styles.serviceName,
            {
              color: colors.textPrimary,
            },
          ]}
          numberOfLines={1}
        >
          {serviceName}
        </Text>
        <Text
          style={[
            styles.code,
            {
              color: colors.accentBlue,
            },
          ]}
        >
          {formattedCode}
        </Text>
      </View>

      <View style={styles.timerWrap}>
        <View
          style={[
            styles.ring,
            {
              width: 32,
              height: 32,
              borderRadius: 16,
              borderWidth: 3,
              borderColor: colors.accentBlue,
            },
          ]}
        />
        <Text
          style={[
            styles.time,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          {timeRemaining}s
        </Text>
      </View>
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
  serviceName: {
    fontSize: 14,
    fontWeight: '500',
  },
  code: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 4,
    fontFamily: 'monospace',
  },
  timerWrap: {
    alignItems: 'center',
    gap: 2,
  },
  ring: {
    position: 'absolute',
  },
  time: {
    fontSize: 10,
    fontWeight: '600',
  },
});
