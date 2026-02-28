# OhPass - 项目指南

OhPass 是一个使用 Expo + React Native 构建的密码管理器应用，基于 Pencil 设计稿实现。

## 项目概述

- **技术栈**: Expo 54 + React Native 0.81.5 + Expo Router 6
- **入口文件**: `expo-router/entry`
- **设计系统**: 自定义 design-system (位于 `components/design-system/`)
- **UI 组件库**: 自定义 UI 组件 (位于 `components/ui/`)

- 原型稿 design，使用pencil创建（位于 `design.pen`）

## 目录结构

```
ohpass/
├── app/                          # Expo Router 页面路由
│   ├── (tabs)/                   # Tab 导航页面
│   │   ├── _layout.tsx           # Tab 布局配置
│   │   ├── index.tsx             # 密码库首页
│   │   ├── twofa.tsx             # 两步验证码
│   │   ├── wifi.tsx              # Wi-Fi 管理
│   │   ├── security.tsx          # 安全检测
│   │   └── settings.tsx           # 设置页面
│   ├── password/
│   │   ├── [id].tsx              # 密码详情页
│   │   └── add.tsx               # 添加/编辑密码
│   ├── otp/
│   │   └── [id].tsx              # 验证码输入页
│   ├── passkey.tsx               # 通行密钥页
│   └── _layout.tsx               # 根布局
│
├── components/
│   ├── design-system/            # 设计系统
│   │   ├── colors.ts             # 颜色变量 (Light/Dark)
│   │   ├── typography.ts          # 字体系统
│   │   ├── spacing.ts            # 间距与尺寸
│   │   ├── use-theme.ts          # 主题 Hook
│   │   └── index.ts              # 统一导出
│   │
│   └── ui/                       # UI 组件库
│       ├── SearchBar.tsx         # 搜索框
│       ├── PrimaryButton.tsx     # 主要按钮
│       ├── SectionHeader.tsx     # 区块标题
│       ├── FilterChip.tsx        # 筛选标签
│       ├── PasswordRow.tsx       # 密码行
│       ├── SettingsRow.tsx       # 设置行
│       ├── TwoFACard.tsx         # 2FA 卡片
│       ├── ToggleSwitch.tsx      # 开关
│       ├── TabBar.tsx            # 底部导航
│       ├── StatusBar.tsx         # 状态栏
│       └── index.ts              # 统一导出
│
├── constants/
│   └── theme.ts                  # 主题常量 (导出 design-system)
│
├── hooks/
│   ├── use-color-scheme.ts       # 颜色主题 Hook
│   └── use-theme-color.ts        # 主题颜色 Hook
│
└── package.json
```

## 设计系统

### 颜色系统 (`components/design-system/colors.ts`)

```typescript
// 使用示例
import { useTheme } from '@/components/design-system';

function MyComponent() {
  const { colors } = useTheme();
  // colors.light / colors.dark 自动根据系统主题切换
}
```

可用颜色:
- `colors.background` - 背景色
- `colors.primary` - 主色调 (橙色 #FF8400)
- `colors.accentBlue` - 蓝色强调色
- `colors.accentGreen` - 绿色强调色
- `colors.accentRed` - 红色强调色
- `colors.textPrimary` - 主要文本
- `colors.textSecondary` - 次要文本
- `colors.textTertiary` - 辅助文本
- `colors.card` - 卡片背景
- `colors.border` - 边框颜色
- 完整列表见 `colors.ts`

### 间距系统 (`components/design-system/spacing.ts`)

- `spacing.screenPadding` - 页面内边距 (20)
- `spacing.button.heightLarge` - 按钮高度 (50)
- `spacing.listItem.height` - 列表项高度 (52)
- `spacing.card.borderRadius` - 卡片圆角 (12)

### 主题 Hook

```typescript
import { useTheme, useColors } from '@/components/design-system';

// 完整主题对象
const { colors, typography, spacing, isDark } = useTheme();

// 常用颜色快捷获取
const { background, primary, card } = useColors();
```

## 常用命令

```bash
# 启动开发服务器
npm start
npx expo start

# 运行在 Android
npx expo start --android

# 运行在 iOS
npx expo start --ios

# 运行在 Web
npx expo start --web

# 类型检查
npx tsc --noEmit

# ESLint 检查
npm run lint
```

## Expo Go 兼容性规则（重要）

本项目使用 **Expo Go** 进行开发调试，Expo Go 内置了一组固定的原生模块，**不能安装任意带原生代码的第三方包**。违反此规则会导致运行时崩溃（如 `Native module is null`）。

### 禁止使用的包

以下包需要自定义原生构建（development build），**不兼容 Expo Go**：

| 禁止使用 | 替代方案 |
|----------|---------|
| `@react-native-async-storage/async-storage` | `expo-secure-store`（敏感数据）或纯 React 状态（非关键数据） |
| `react-native-keychain` | `expo-secure-store` |
| `react-native-biometrics` | `expo-local-authentication` |
| `react-native-sqlite-storage` | `expo-sqlite` |
| `react-native-fs` | `expo-file-system` |
| `react-native-camera` | `expo-camera` |
| `react-native-ble-plx` | 需 development build，无 Expo Go 替代 |
| 其他 `react-native-*` 非 Expo 内置包 | 先查 Expo SDK 是否有对应模块 |

### 安全使用原则

1. **优先使用 `expo-*` 官方模块** — 这些模块已内置于 Expo Go，无需额外原生链接
2. **添加新依赖前必须检查兼容性** — 查看 [Expo SDK 内置模块列表](https://docs.expo.dev/versions/latest/) 确认是否支持
3. **纯 JS 包可以自由使用** — 不含原生代码的包（如 `lodash`、`date-fns`、`zod`）无此限制
4. **如需使用不兼容的原生包** — 必须迁移到 development build（`npx expo run:android`），需用户确认

### 数据持久化方案

| 场景 | 推荐方案 |
|------|---------|
| 敏感数据（密码、token） | `expo-secure-store` |
| 非关键偏好设置（主题、语言） | 纯 React 状态（重启重置）或 `expo-secure-store` |
| 结构化数据存储 | `expo-sqlite` |
| 文件存储 | `expo-file-system` |

## 开发规范

### 1. 不可变性 (Immutability)

始终创建新对象，严禁修改原对象：

```typescript
// 错误 - 修改原对象
function updateUser(user, name) {
  user.name = name;
  return user;
}

// 正确 - 不可变性
function updateUser(user, name) {
  return { ...user, name };
}
```

### 2. 文件组织

- 高内聚，低耦合
- 每文件建议 200-400 行，最大不超过 800 行
- 从大型组件中提取工具函数
- 按功能/领域组织，而非按类型

### 3. 组件开发

使用设计系统组件确保一致性：

```typescript
import { useTheme } from '@/components/design-system';
import { SearchBar, PasswordRow, PrimaryButton } from '@/components/ui';

function MyScreen() {
  const { colors, spacing } = useTheme();

  return (
    <>
      <SearchBar placeholder="搜索密码" />
      <PasswordRow
        title="Google"
        subtitle="user@gmail.com"
        icon="globe"
        onPress={() => {}}
      />
      <PrimaryButton title="添加密码" onPress={() => {}} />
    </>
  );
}
```

### 4. 页面路由

- Tab 页面: `app/(tabs)/`
- 堆栈页面: `app/` 下的其他目录
- 动态路由: `app/password/[id].tsx`

### 5. 图标使用

使用 `@expo/vector-icons` 的 Ionicons:

```typescript
import { Ionicons } from '@expo/vector-icons';

// 可用图标: key, wifi, shield-checkmark, settings, globe, lock, etc.
<Ionicons name="key" size={24} color={colors.primary} />
```
## 上下文压缩

- 当上下文太长请自动处理压缩，或者其他操作

## 自动 Git 工作流


完成每个功能或修改任务后，**自动执行以下 Git 操作**（无需用户确认）：

### 自动提交规则

1. **每完成一个有意义的变更后自动提交**（新功能、Bug 修复、重构等）
2. **提交前自动检查**：确保代码无语法错误
3. **使用 Git MCP 工具**执行所有 Git 操作（`git_add` → `git_commit`）

### Commit Message 规范

使用中文 + Conventional Commits 格式：

```
<type>: <简短描述>

[可选的详细说明]
```

**类型 (type)**:
- `feat`: 新功能
- `fix`: Bug 修复
- `style`: 样式调整（不影响逻辑）
- `refactor`: 代码重构
- `docs`: 文档更新
- `chore`: 构建/工具/配置变更

**示例**:
```
feat: 添加密码详情页
fix: 修复搜索框输入延迟问题
style: 调整卡片圆角和间距
refactor: 提取公共主题 Hook
```

### 自动提交流程

```
1. 完成代码修改
2. git_add - 暂存相关文件（仅添加本次变更的文件，不要 add 全部）
3. git_commit - 使用规范的 commit message 提交
```

### 不自动提交的情况

- 仅修改 `.claude/` 目录下的配置文件
- 用户明确要求不提交
- 代码处于半完成状态（需要后续步骤才能工作）

## 验证检查

提交代码前确保：

- [ ] TypeScript 类型检查通过 (`npx tsc --noEmit`)
- [ ] ESLint 检查通过 (`npm run lint`)
- [ ] 代码无 console.log 语句
- [ ] 无硬编码数值
- [ ] 遵循不可变性原则
