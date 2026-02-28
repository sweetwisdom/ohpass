# DARK_MODE_TOGGLE - Feature Document

**Created**: 2026-02-28

---

## Table of Contents

- [Background](#background)
- [User Input Summary](#user-input-summary)
- [AI Design Summary](#ai-design-summary)
- [Implementation Details](#implementation-details)
- [Completion Status](#completion-status)
- [Technical Decisions](#technical-decisions)
- [Future Improvements](#future-improvements)

---

## Background

OhPass 密码管理器的设置页面有一个"深色模式"开关，但切换后没有任何效果。应用默认显示为深色主题，开关只是一个 `useState(false)` 的本地状态，完全与主题系统断开连接。

---

## User Input Summary

用户反馈：「现在设置页面切换深色模式没有效果，默认为深色，请完善」

---

## AI Design Summary

### 问题诊断

1. 设置页的深色模式开关是纯装饰性的 —— `useState(false)` 只改变本地状态
2. 整个应用的主题完全依赖 `react-native` 的 `useColorScheme()`（跟随系统）
3. 没有任何主题偏好持久化机制
4. `StatusBar` 在设置页硬编码为 `dark-content`

### 解决方案

采用**纯 Context 方案**管理主题（兼容 Native + Web）：

1. 创建 `ThemePreferenceProvider` 管理用户偏好（light / dark / system）
2. 使用 `AsyncStorage` 持久化偏好
3. 通过 `Appearance.addChangeListener` 监听系统主题变化
4. 导出 `useResolvedColorScheme()` 替代所有 `useColorScheme()` 调用

> 注意：最初尝试使用 `Appearance.setColorScheme()` 方案，但在 Web 平台（react-native-web）上不支持该 API，因此改为纯 Context 方案。

---

## Implementation Details

### 新增文件

| 文件 | 说明 |
|------|------|
| `contexts/ThemeContext.tsx` | ThemePreferenceProvider、useThemePreference、useResolvedColorScheme |

### 修改文件

| 文件 | 变更 |
|------|------|
| `app/_layout.tsx` | 包裹 ThemePreferenceProvider，使用 useResolvedColorScheme |
| `app/(tabs)/_layout.tsx` | 替换 useColorScheme → useResolvedColorScheme |
| `app/(tabs)/settings.tsx` | 深色模式开关连接 useThemePreference |
| `components/design-system/use-theme.ts` | 替换 useColorScheme → useResolvedColorScheme |
| `package.json` | 添加 @react-native-async-storage/async-storage |

### 数据流

```
用户切换开关
  → setThemePreference('dark'/'light')
  → Context 更新 colorScheme
  → AsyncStorage 持久化
  → 所有 useResolvedColorScheme() 消费者重新渲染
  → 全局主题切换
```

---

## Completion Status

| 任务 | 状态 |
|------|------|
| 安装 AsyncStorage 依赖 | ✅ |
| 创建 ThemeContext | ✅ |
| 集成到根布局 | ✅ |
| 设置页连接主题切换 | ✅ |
| 修复 StatusBar 硬编码 | ✅ |
| Web 平台兼容修复 | ✅ |
| TypeScript 类型检查 | ✅ |

---

## Technical Decisions

1. **纯 Context vs Appearance.setColorScheme()** — 选择纯 Context，因为后者在 Web 平台不可用
2. **AsyncStorage vs 其他存储** — AsyncStorage 是 React Native 生态标准的持久化方案
3. **三态偏好 (light/dark/system)** — 保留 system 选项允许跟随系统设置

---

## Future Improvements

- 添加 "跟随系统" 选项到设置页（当前 UI 只有开/关）
- 主题切换动画过渡效果
- 将 `hooks/use-color-scheme.ts` 标记为 deprecated（已被 useResolvedColorScheme 替代）
