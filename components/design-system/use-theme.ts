/**
 * OhPass Design System - useTheme Hook
 * 基于 Pencil 设计稿的主题 Hook
 */

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from './colors';
import type { ColorKey } from './colors';
import { Typography } from './typography';
import { Spacing } from './spacing';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Theme {
  colors: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  typography: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  spacing: any;
  isDark: boolean;
}

export function useTheme(): Theme {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return {
    colors: isDark ? Colors.dark : Colors.light,
    typography: Typography,
    spacing: Spacing,
    isDark,
  };
}

export function useThemeColor(color: ColorKey): string {
  const { colors } = useTheme();
  return colors[color] as string;
}

// 常用颜色快捷hook
export const useColors = () => {
  const { colors } = useTheme();
  return {
    background: colors.background,
    foreground: colors.foreground,
    primary: colors.primary,
    secondary: colors.secondary,
    muted: colors.muted,
    border: colors.border,
    card: colors.card,
    cardHover: colors.cardHover,
    textPrimary: colors.textPrimary,
    textSecondary: colors.textSecondary,
    textTertiary: colors.textTertiary,
    accentBlue: colors.accentBlue,
    accentGreen: colors.accentGreen,
    accentOrange: colors.accentOrange,
    accentRed: colors.accentRed,
    tabBarBg: colors.tabBarBg,
    searchBg: colors.searchBg,
  };
};

// 导出颜色类型供外部使用
export type { ColorKey };
export { Colors };
