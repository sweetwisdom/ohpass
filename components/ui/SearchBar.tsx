/**
 * OhPass UI - SearchBar
 * 基于 Pencil 设计稿的搜索框组件
 */

import React from 'react';
import { View, TextInput, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/components/design-system';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  style?: ViewStyle;
  autoFocus?: boolean;
}

export function SearchBar({
  placeholder = '搜索密码',
  value,
  onChangeText,
  onFocus,
  onBlur,
  style,
  autoFocus = false,
}: SearchBarProps) {
  const { colors, spacing } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.searchBg,
          borderRadius: spacing.searchBar.borderRadius,
          height: spacing.searchBar.height,
          paddingHorizontal: spacing.searchBar.paddingHorizontal,
        },
        style,
      ]}
    >
      <Ionicons name="search" size={16} color={colors.textTertiary} />
      <TextInput
        style={[
          styles.input,
          {
            color: colors.textPrimary,
            marginLeft: spacing.componentGap.sm,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        autoFocus={autoFocus}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
});
