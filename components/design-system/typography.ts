/**
 * OhPass Design System - Typography
 * 基于 Pencil 设计稿的字体系统
 */

import { Platform, TextStyle } from 'react-native';

const fontFamilies = {
  primary: 'JetBrains Mono',
  secondary: 'Geist',
  sans: Platform.select({
    ios: 'system-ui',
    android: 'Roboto',
    default: 'sans-serif',
  }),
  mono: Platform.select({
    ios: 'ui-monospace',
    android: 'monospace',
    default: 'monospace',
  }),
};

export const Typography = {
  // 大标题
  h1: {
    fontFamily: fontFamilies.sans,
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 41,
    letterSpacing: 0.37,
  } as TextStyle,

  h2: {
    fontFamily: fontFamilies.sans,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    letterSpacing: 0.36,
  } as TextStyle,

  h3: {
    fontFamily: fontFamilies.sans,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
    letterSpacing: 0.35,
  } as TextStyle,

  // 标题
  titleLarge: {
    fontFamily: fontFamilies.sans,
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
  } as TextStyle,

  titleMedium: {
    fontFamily: fontFamilies.sans,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  } as TextStyle,

  titleSmall: {
    fontFamily: fontFamilies.sans,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  } as TextStyle,

  // 正文
  bodyLarge: {
    fontFamily: fontFamilies.sans,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  } as TextStyle,

  bodyMedium: {
    fontFamily: fontFamilies.sans,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  } as TextStyle,

  bodySmall: {
    fontFamily: fontFamilies.sans,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  } as TextStyle,

  // 标签
  labelLarge: {
    fontFamily: fontFamilies.sans,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: 0.1,
  } as TextStyle,

  labelMedium: {
    fontFamily: fontFamilies.sans,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    letterSpacing: 0.5,
  } as TextStyle,

  labelSmall: {
    fontFamily: fontFamilies.sans,
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.5,
  } as TextStyle,

  // Tab 标签
  tabLabel: {
    fontFamily: fontFamilies.sans,
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 12,
  } as TextStyle,

  // 验证码
  otpCode: {
    fontFamily: fontFamilies.mono,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    letterSpacing: 4,
  } as TextStyle,

  // 密码
  password: {
    fontFamily: fontFamilies.mono,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  } as TextStyle,
};

export type TypographyKey = keyof typeof Typography;