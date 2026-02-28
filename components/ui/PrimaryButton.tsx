/**
 * OhPass UI - PrimaryButton
 * 基于 Pencil 设计稿的主要按钮组件
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/components/design-system';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function PrimaryButton({
  title,
  onPress,
  icon,
  variant = 'primary',
  size = 'large',
  disabled = false,
  loading = false,
  style,
}: PrimaryButtonProps) {
  const { colors, spacing } = useTheme();

  const getBackgroundColor = () => {
    if (disabled) return colors.muted;
    switch (variant) {
      case 'primary':
        return colors.accentBlue;
      case 'secondary':
        return colors.secondary;
      case 'danger':
        return colors.accentRed;
      default:
        return colors.accentBlue;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.mutedForeground;
    switch (variant) {
      case 'primary':
        return colors.white;
      case 'secondary':
        return colors.foreground;
      case 'danger':
        return colors.white;
      default:
        return colors.white;
    }
  };

  const getHeight = () => {
    switch (size) {
      case 'small':
        return spacing.button.heightSmall;
      case 'medium':
        return spacing.button.heightMedium;
      case 'large':
        return spacing.button.heightLarge;
      default:
        return spacing.button.heightLarge;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderRadius: spacing.button.borderRadius,
          height: getHeight(),
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon}
              size={18}
              color={getTextColor()}
              style={styles.icon}
            />
          )}
          <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});