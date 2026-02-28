# Record-Docs 使用示例

## 示例 1：功能完成 → 生成 Feature 文档

**对话摘要**：用户要求实现「迷你可验证条」组件，AI 完成设计与实现。

**用户输入**：`/record`

**输出**：
1. 判断任务已完成
2. 分类为 Feature
3. 生成 `docs/features/MINI_VERIFICATION_BAR_FEATURE.md`
4. 更新 `docs/changelog/CHANGELOG.md`，追加：
   ```markdown
   ## [2026-02-28]
   ### Added
   - Added MINI_VERIFICATION_BAR — 迷你可验证条组件
   ```

---

## 示例 2：任务未完成 → 拒绝

**对话摘要**：用户刚提出需求，尚未开始实现。

**用户输入**：`/record-task`

**输出**：
> 当前任务尚未完成，暂不生成文档。请完成任务后再使用 `/record` 或 `/record-task` 触发记录。

---

## 示例 3：架构设计 → 生成 Architecture 文档

**对话摘要**：用户与 AI 讨论并确定了微服务拆分方案。

**用户输入**：`/record-feature`

**输出**：
1. 判断任务已完成
2. 分类为 Architecture
3. 生成 `docs/architecture/MICROSERVICE_SPLIT_ARCHITECTURE.md`，包含 Mermaid 架构图
4. 更新 CHANGELOG

---

## 示例 4：Bug 修复 → 生成 Bug Fix 文档

**对话摘要**：用户报告日期显示错误，AI 定位并修复。

**用户输入**：`/record`

**输出**：
1. 判断任务已完成
2. 分类为 Bug Fix
3. 生成 `docs/bugfix/BUGFIX_DATE_DISPLAY.md`
4. 更新 CHANGELOG 的 `### Fixed` 部分

---

## 示例 5：文档已存在 → 更新而非覆盖

**场景**：`docs/features/USER_LOGIN_FEATURE.md` 已存在，用户完成登录功能的后续优化后再次 `/record`。

**输出**：
1. 读取现有文档
2. 在 Implementation Details、Completion Status 等章节补充新内容
3. 保留原有结构，不覆盖用户已写内容
4. 更新 CHANGELOG

---

## 示例 6：无显式触发 → 不执行

**用户输入**：`帮我把这个功能写个文档`

**输出**：不激活 record-docs 技能。按普通对话处理，可建议用户使用 `/record` 触发。
