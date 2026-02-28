# UI_PAGES_DESIGN_SYNC - Feature Document

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

OhPass 的 5 个页面（Wi-Fi管理、安全检测、设置、添加编辑条目、通行密钥）的代码实现与 Pencil 设计稿（`pencil-new.pen`）存在较大差异。需要逐一核对设计稿并修正代码，确保 UI 与原型一致。

---

## User Input Summary

用户要求：「请你读取正在打开的 pencil，也就是 design.pen，重点核对下 wifi管理后面的页面，确保原型一致」

---

## AI Design Summary

### 核对方法

1. 使用 Pencil MCP 工具读取设计稿的完整节点结构
2. 截图每个设计稿页面进行视觉对比
3. 逐一读取对应的代码文件
4. 识别差异并重写

### 发现的差异总览

| 页面 | 差异程度 | 主要问题 |
|------|---------|---------|
| Wi-Fi管理 | 大 | 缺搜索栏、列表样式不同、缺QR码分享区、多余组件 |
| 安全检测 | 大 | 标题错误、评分样式完全不同、安全问题项不匹配 |
| 设置 | 大 | 分组结构完全不同、多了很多不存在的分区 |
| 通行密钥 | 大 | 数据内容不同、缺"管理"分区、返回文本错误 |
| 添加编辑 | 中 | 表单结构不同、缺图标选择器、密码生成器不同 |

---

## Implementation Details

### Wi-Fi管理 (`app/(tabs)/wifi.tsx`)

| 设计稿 | 修改前 | 修改后 |
|--------|--------|--------|
| SearchBar "搜索 Wi-Fi" | 无搜索栏 | ✅ 添加 |
| 分组卡片列表 (3项) | 独立 SettingsRow | ✅ 分组卡片 (cornerRadius:12, gap:2) |
| Home Network (蓝), Office-5G (绿), Cafe_FreeWifi (橙) | 数据不同 | ✅ 匹配 |
| QR + Share 操作图标 | 无 | ✅ 添加 |
| "分享 Wi-Fi" QR码卡片 | "添加 Wi-Fi 网络" 按钮 | ✅ 替换为 QR 卡片 |
| 无 header "..." 按钮 | 有 | ✅ 移除 |

### 安全检测 (`app/(tabs)/security.tsx`)

| 设计稿 | 修改前 | 修改后 |
|--------|--------|--------|
| 标题 "安全检测" | "安全" | ✅ 修正 |
| 圆环评分 (82分) | 进度条 (85分) | ✅ 圆环样式 |
| 弱密码/重复密码/泄露检测 + 修复按钮 | 不同的安全项 | ✅ 匹配 |
| "已通过检查" 区 (双重验证/自动锁定) | "安全设置" 区 | ✅ 替换 |

### 设置 (`app/(tabs)/settings.tsx`)

| 设计稿 | 修改前 | 修改后 |
|--------|--------|--------|
| 3 个分区: 安全/数据/关于 | 7 个分区 | ✅ 精简为 3+深色模式 |
| 主密码修改, Face ID, Touch ID, 自动锁定 | 不同项目 | ✅ 匹配 |
| 数据导出, 云备份, 恢复代码 | 同步/备份/存储 | ✅ 匹配 |
| 版本 2.1.0, 隐私政策 | 多项 | ✅ 匹配 |
| 分组卡片样式 | 独立 SettingsRow | ✅ 分组卡片 |

### 通行密钥 (`app/passkey.tsx`)

| 设计稿 | 修改前 | 修改后 |
|--------|--------|--------|
| "< 设置" 返回 | "< 返回" | ✅ 修正 |
| 钥匙图标 + "无密码登录" | 指纹图标 + "使用通行密钥登录" | ✅ 匹配 |
| Google/Apple/GitHub (带设备信息) | Face ID/Touch ID/YubiKey | ✅ 匹配 |
| "管理" 分区 (添加/删除) | 底部信息 + 添加按钮 | ✅ 替换 |

### 添加编辑条目 (`app/password/add.tsx`)

| 设计稿 | 修改前 | 修改后 |
|--------|--------|--------|
| 图标选择器 (72x72) | 无 | ✅ 添加 |
| 分组表单 (label + input) | 独立输入组 | ✅ 分组卡片样式 |
| 备注字段 (80px高) | 无 | ✅ 添加 |
| 分类标签 (网站/App/Wi-Fi/其他) | 无 | ✅ 添加 |
| 密码生成器 (密码/长度/滑块/选项/重新生成) | 简单的 toggle | ✅ 完整实现 |

---

## Completion Status

| 页面 | 状态 |
|------|------|
| Wi-Fi管理 | ✅ |
| 安全检测 | ✅ |
| 设置 | ✅ |
| 通行密钥 | ✅ |
| 添加编辑条目 | ✅ |
| TypeScript 类型检查 | ✅ |

---

## Technical Decisions

1. **分组卡片样式** — 所有页面统一使用 `overflow: hidden + gap: 2 + borderRadius: 12` 实现 iOS 风格的分组列表
2. **设置页保留深色模式** — 设计稿没有深色模式开关，但这是用户在本次会话中明确要求的功能，因此保留
3. **直接使用 Ionicons 替代 Lucide** — 设计稿使用 Lucide 图标，代码使用 Ionicons（@expo/vector-icons），选择最接近的图标映射
4. **圆环评分** — 使用 CSS border 模拟圆环（而非 SVG），保持实现简单

---

## Future Improvements

- 使用 `react-native-svg` 实现精确的圆环评分动画
- 密码生成器的长度滑块改为可交互的 Slider 组件
- Wi-Fi 页面的 QR 码使用真实的 QR 码生成库
- 添加页面的图标选择器连接图片选择功能
