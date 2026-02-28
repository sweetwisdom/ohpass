/**
 * OhPass Design System - Spacing
 * 基于 Pencil 设计稿的间距与尺寸系统
 */

export const Spacing = {
  // 基础间距
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,

  // 页面内边距
  screenPadding: 20,

  // 组件间距
  componentGap: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },

  // 列表项
  listItem: {
    height: 52,
    heightLarge: 64,
    heightXLarge: 72,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },

  // 按钮
  button: {
    heightSmall: 36,
    heightMedium: 44,
    heightLarge: 50,
    heightXLarge: 56,
    paddingHorizontal: 16,
    borderRadius: 12,
  },

  // 输入框
  input: {
    height: 36,
    heightLarge: 44,
    borderRadius: 10,
    paddingHorizontal: 12,
  },

  // 搜索框
  searchBar: {
    height: 36,
    borderRadius: 10,
    paddingHorizontal: 12,
  },

  // 卡片
  card: {
    borderRadius: 12,
    borderRadiusLarge: 16,
    padding: 16,
    gap: 12,
  },

  // 标签/角标
  chip: {
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 14,
  },

  // 状态栏
  statusBar: {
    height: 54,
    paddingTop: 14,
    paddingHorizontal: 20,
  },

  // 底部导航
  tabBar: {
    height: 83,
    paddingTop: 8,
    paddingBottom: 21,
    paddingHorizontal: 12,
    iconSize: 22,
  },

  // 图标容器
  iconContainer: {
    small: 20,
    medium: 24,
    large: 32,
    xlarge: 40,
    xxlarge: 64,
  },

  // 圆角
  borderRadius: {
    none: 0,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    pill: 999,
  },
} as const;

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { x: 0, y: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { x: 0, y: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { x: 0, y: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
} as const;

export type SpacingKey = keyof typeof Spacing;