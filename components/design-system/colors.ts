/**
 * OhPass Design System - Colors
 * 基于 Pencil 设计稿的颜色变量系统
 */

export const Colors = {
  light: {
    // 基础颜色
    background: '#F2F3F0',
    foreground: '#111111',
    accent: '#F2F3F0',
    accentForeground: '#111111',

    // 卡片
    card: '#FFFFFF',
    cardForeground: '#111111',
    cardHover: '#F9F9FB',

    // 主色调
    primary: '#FF8400',
    primaryForeground: '#111111',

    // 次要
    secondary: '#E7E8E5',
    secondaryForeground: '#111111',

    // 边框
    border: '#CBCCC9',
    input: '#CBCCC9',
    ring: '#666666',

    // 静音
    muted: '#F2F3F0',
    mutedForeground: '#666666',

    // 强调色
    accentBlue: '#007AFF',
    accentGreen: '#34C759',
    accentOrange: '#FF9500',
    accentRed: '#FF3B30',
    accentYellow: '#FFCC00',
    accentPurple: '#5856D6',

    // 语义色
    colorError: '#E5DCDA',
    colorErrorForeground: '#8C1C00',
    colorSuccess: '#DFE6E1',
    colorSuccessForeground: '#004D1A',
    colorWarning: '#E9E3D8',
    colorWarningForeground: '#804200',
    colorInfo: '#DFDFE6',
    colorInfoForeground: '#000066',

    // 特殊背景
    bgPrimary: '#F2F2F7',
    bgSecondary: '#FFFFFF',
    bgTertiary: '#F2F2F7',
    tabBarBg: '#FFFFFFCC',
    glassBg: '#FFFFFFBB',
    searchBg: '#E5E5EA',

    // 文本
    textPrimary: '#000000',
    textSecondary: '#6C6C70',
    textTertiary: '#AEAEB2',

    // 基础色
    white: '#FFFFFF',
    black: '#000000',

    // 侧边栏
    sidebar: '#E7E8E5',
    sidebarAccent: '#CBCCC9',
    sidebarAccentForeground: '#18181b',
    sidebarBorder: '#CBCCC9',
    sidebarForeground: '#666666',
    sidebarPrimary: '#18181b',
    sidebarPrimaryForeground: '#fafafa',
    sidebarRing: '#71717a',
  },
  dark: {
    // 基础颜色
    background: '#111111',
    foreground: '#FFFFFF',
    accent: '#111111',
    accentForeground: '#F2F3F0',

    // 卡片
    card: '#1A1A1A',
    cardForeground: '#FFFFFF',
    cardHover: '#2C2C2E',

    // 主色调
    primary: '#FF8400',
    primaryForeground: '#111111',

    // 次要
    secondary: '#2E2E2E',
    secondaryForeground: '#FFFFFF',

    // 边框
    border: '#2E2E2E',
    input: '#2E2E2E',
    ring: '#666666',

    // 静音
    muted: '#2E2E2E',
    mutedForeground: '#B8B9B6',

    // 强调色
    accentBlue: '#007AFF',
    accentGreen: '#34C759',
    accentOrange: '#FF9500',
    accentRed: '#FF3B30',
    accentYellow: '#FFCC00',
    accentPurple: '#5856D6',

    // 语义色
    colorError: '#24100B',
    colorErrorForeground: '#FF5C33',
    colorSuccess: '#222924',
    colorSuccessForeground: '#B6FFCE',
    colorWarning: '#291C0F',
    colorWarningForeground: '#FF8400',
    colorInfo: '#222229',
    colorInfoForeground: '#B2B2FF',

    // 特殊背景
    bgPrimary: '#000000',
    bgSecondary: '#1C1C1E',
    bgTertiary: '#2C2C2E',
    tabBarBg: '#1C1C1ECC',
    glassBg: '#1C1C1EBB',
    searchBg: '#1C1C1E',

    // 文本
    textPrimary: '#FFFFFF',
    textSecondary: '#8E8E93',
    textTertiary: '#636366',

    // 基础色
    white: '#FFFFFF',
    black: '#000000',

    // 侧边栏
    sidebar: '#18181b',
    sidebarAccent: '#2a2a30',
    sidebarAccentForeground: '#fafafa',
    sidebarBorder: '#ffffff1a',
    sidebarForeground: '#fafafa',
    sidebarPrimary: '#18181b',
    sidebarPrimaryForeground: '#fafafa',
    sidebarRing: '#71717a',
  },
} as const;

export type ColorScheme = keyof typeof Colors;
export type ColorKey = keyof typeof Colors.light;
