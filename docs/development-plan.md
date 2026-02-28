# OhPass 开发计划

> 创建日期: 2026-03-01
> 状态: 进行中

## 当前状态总结

所有 5 个 Tab 页面 + 3 个子页面的 **UI 骨架已完成**，使用统一设计系统，支持 Light/Dark 主题切换。但 **没有任何真实业务逻辑和数据持久化**，所有数据均为硬编码 mock 数据。

### 已完成
- [x] 设计系统（颜色、间距、字体定义）
- [x] UI 组件库（SearchBar、PrimaryButton、PasswordRow 等 10+ 组件）
- [x] 所有页面 UI 骨架
- [x] 深色模式切换（ThemeContext）
- [x] Expo Router 路由配置
- [x] 密码生成器基础逻辑（add.tsx 中部分实现）

---

## 开发任务

### Phase 1: 数据基础层
> 优先级: P0 | 预计文件: 3-4 个新文件

| 任务 | 说明 | 状态 |
|------|------|------|
| 安装 expo-sqlite、expo-secure-store | Expo Go 兼容的存储方案 | ⬜ |
| 创建 `services/database.ts` | SQLite 数据库初始化、表结构定义 | ⬜ |
| 创建 `services/crypto.ts` | 密码加密/解密工具（使用 expo-crypto） | ⬜ |
| 创建 `contexts/DataContext.tsx` | 全局数据状态管理，提供 CRUD 方法 | ⬜ |

**数据库表结构设计**:
```sql
-- 密码表
CREATE TABLE passwords (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  website TEXT,
  username TEXT,
  password_encrypted TEXT NOT NULL,
  category TEXT DEFAULT 'website',  -- website/app/wifi/other
  icon_color TEXT,
  notes TEXT,
  created_at INTEGER,
  updated_at INTEGER
);

-- 2FA 表
CREATE TABLE totp_accounts (
  id TEXT PRIMARY KEY,
  service_name TEXT NOT NULL,
  secret TEXT NOT NULL,          -- TOTP secret key (加密存储)
  issuer TEXT,
  digits INTEGER DEFAULT 6,
  period INTEGER DEFAULT 30,
  algorithm TEXT DEFAULT 'SHA1',
  icon_color TEXT,
  created_at INTEGER,
  updated_at INTEGER
);

-- Wi-Fi 表
CREATE TABLE wifi_networks (
  id TEXT PRIMARY KEY,
  ssid TEXT NOT NULL,
  password_encrypted TEXT NOT NULL,
  security_type TEXT DEFAULT 'WPA2',
  is_hidden INTEGER DEFAULT 0,
  notes TEXT,
  created_at INTEGER,
  updated_at INTEGER
);

-- 应用设置表
CREATE TABLE app_settings (
  key TEXT PRIMARY KEY,
  value TEXT
);
```

---

### Phase 2: 密码 CRUD
> 优先级: P0 | 涉及文件: 4 个页面

| 任务 | 说明 | 状态 |
|------|------|------|
| 密码列表接入真实数据 | `(tabs)/index.tsx` 从 DataContext 读取 | ⬜ |
| 搜索过滤功能 | 按标题/用户名/网站搜索，按分类筛选 | ⬜ |
| 添加密码页面 | `password/add.tsx` 保存到数据库 | ⬜ |
| 密码详情页 | `password/[id].tsx` 根据 id 加载数据 | ⬜ |
| 编辑密码 | 复用 add 页面，传入已有数据 | ⬜ |
| 删除密码 | 确认弹窗 + 删除 | ⬜ |

---

### Phase 3: 密码工具
> 优先级: P1 | 涉及文件: 2-3 个

| 任务 | 说明 | 状态 |
|------|------|------|
| 创建 `utils/password.ts` | 密码生成器、强度计算、常用工具 | ⬜ |
| 密码生成器完善 | 长度滑块、字符集选择、生成→填入 | ⬜ |
| 密码强度计算 | 基于长度/字符多样性/常见密码库评分 | ⬜ |
| 复制到剪贴板 | 使用 expo-clipboard 实现所有 handleCopy | ⬜ |
| 密码显示/隐藏 | 密码详情页的眼睛图标切换 | ⬜ |

---

### Phase 4: TOTP 两步验证
> 优先级: P1 | 涉及文件: 3-4 个

| 任务 | 说明 | 状态 |
|------|------|------|
| 创建 `utils/totp.ts` | TOTP 算法实现（RFC 6238） | ⬜ |
| 2FA 列表接入数据 | `(tabs)/twofa.tsx` 显示真实验证码 | ⬜ |
| 实时倒计时 | 30 秒周期自动刷新验证码 | ⬜ |
| 手动添加 TOTP | 输入 secret key 添加账户 | ⬜ |
| OTP 详情页重构 | `otp/[id].tsx` 改为展示码而非输入 | ⬜ |
| 复制验证码 | 点击卡片复制当前验证码 | ⬜ |

---

### Phase 5: Wi-Fi 管理
> 优先级: P2 | 涉及文件: 2-3 个

| 任务 | 说明 | 状态 |
|------|------|------|
| Wi-Fi CRUD | 添加、查看、编辑、删除 Wi-Fi 密码 | ⬜ |
| Wi-Fi 搜索 | 按 SSID 搜索 | ⬜ |
| Wi-Fi 密码复制 | 复制到剪贴板 | ⬜ |
| Wi-Fi 分享占位 | QR 码生成暂用文本占位（需 react-native-svg） | ⬜ |

---

### Phase 6: 安全检测
> 优先级: P2 | 涉及文件: 2 个

| 任务 | 说明 | 状态 |
|------|------|------|
| 创建 `utils/security.ts` | 安全评分算法 | ⬜ |
| 弱密码检测 | 扫描所有密码，标记弱密码 | ⬜ |
| 重复密码检测 | 找出多个账户使用相同密码 | ⬜ |
| 安全评分页接入 | `(tabs)/security.tsx` 展示真实数据 | ⬜ |
| 一键修复导航 | 点击"修复"跳转到对应密码编辑页 | ⬜ |

---

### Phase 7: 设置功能
> 优先级: P2 | 涉及文件: 2-3 个

| 任务 | 说明 | 状态 |
|------|------|------|
| 主题偏好持久化 | 使用 expo-secure-store 存储 | ⬜ |
| 自动锁定时间 | 1/5/15/30 分钟可选 | ⬜ |
| 数据导出 | JSON 格式导出密码 | ⬜ |
| 应用版本号 | 从 app.json 读取 | ⬜ |

---

### Phase 8: 清理优化
> 优先级: P3

| 任务 | 说明 | 状态 |
|------|------|------|
| 删除未使用组件 | StatusBar.tsx、TabBar.tsx 等 | ⬜ |
| 修复 hooks 一致性 | 统一使用 ThemeContext | ⬜ |
| 类型安全优化 | 消除 `any` 类型 | ⬜ |

---

## 技术选型

| 需求 | 方案 | 备注 |
|------|------|------|
| 结构化存储 | `expo-sqlite` | Expo Go 兼容 |
| 敏感数据 | `expo-secure-store` | 加密密钥存储 |
| 剪贴板 | `expo-clipboard` | Expo Go 兼容 |
| 加密 | `expo-crypto` | SHA256/随机数 |
| TOTP | 纯 JS 实现 | 基于 jsSHA 或手写 |

## 不在本期范围

以下功能复杂度高，留待后续版本：
- 主密码/锁屏认证（需完整的安全设计）
- WebAuthn/FIDO2 通行密钥
- 云备份与同步
- 二维码扫描（需 expo-camera + 解码库）
- QR 码生成（需 react-native-svg）
- 生物识别解锁
- 数据导入（CSV/其他密码管理器格式）
