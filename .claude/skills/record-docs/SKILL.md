---
name: record-docs
description: Generates structured project documentation from completed development tasks. Activates ONLY when user explicitly triggers with /record, /record-task, or /record-feature. Analyzes conversation, classifies document type, writes to docs/, and updates CHANGELOG. Does not activate during normal conversation.
---

# 项目文档记录

AI 辅助开发的项目文档技能。**仅在用户显式触发时激活**，不参与日常对话。

## 激活条件（必须满足）

**仅**在用户输入以下任一命令时激活：

- `/record`
- `/record-task`
- `/record-feature`

若未显式触发，**不执行任何操作**。

---

## 工作流

```
任务进度：
- [ ] Step 1: 判断任务是否完成
- [ ] Step 2: 若未完成 → 礼貌拒绝
- [ ] Step 3: 若已完成 → 提取上下文、分类、生成文档、写入、更新 CHANGELOG
```

### Step 1: 任务完成性判断

分析近期对话，判断是否完成了一项**主要开发任务**（如：实现功能、修复 Bug、架构调整、性能优化等）。

**未完成**：任务进行中、仅讨论未实现、需求未落地 → 礼貌拒绝，不生成文档。

**已完成**：功能已实现、Bug 已修复、架构已落地等 → 继续执行。

### Step 2: 拒绝话术（任务未完成时）

> 当前任务尚未完成，暂不生成文档。请完成任务后再使用 `/record` 或 `/record-task` 触发记录。

### Step 3: 文档生成流程（任务已完成时）

1. **提取任务上下文**：需求、设计、实现要点、技术决策
2. **自动分类文档类型**：见 [reference.md](reference.md) 分类规则
3. **生成结构化文档**：使用 [reference.md](reference.md) 中的模板
4. **写入正确目录**：按分类写入对应 `docs/` 子目录
5. **更新 CHANGELOG**：追加到 `docs/changelog/CHANGELOG.md`

---

## 文档分类与路径

| 类型 | 输出路径 |
|------|----------|
| Feature | `docs/features/[NAME]_FEATURE.md` |
| Architecture | `docs/architecture/[NAME]_ARCHITECTURE.md` |
| Bug Fix | `docs/bugfix/BUGFIX_[NAME].md` |
| Performance | `docs/performance/PERFORMANCE_[NAME].md` |
| Requirement | `docs/requirements/REQUIREMENTS_[NAME].md` |
| Task Planning | `docs/[TASK_NAME]/PLAN.md` |

### 文件命名规则

- 中文名 → 清晰英文标识
- 全大写 + 下划线
- 无空格
- 遵循仓库命名规范

示例：`迷你可验证条` → `MINI_VERIFICATION_BAR_FEATURE.md`

---

## 文档必备结构

每份文档必须包含（按顺序）：

1. Title
2. Creation Date (YYYY-MM-DD)
3. Table of Contents（若内容较长）
4. Background
5. User Input Summary（必须包含用户原始意图）
6. AI Design Summary
7. Implementation Details
8. Completion Status Table（若适用）
9. Technical Decisions
10. Future Improvements

使用 Markdown 格式。架构类文档使用 Mermaid 图。

---

## CHANGELOG 更新（强制）

追加到 `docs/changelog/CHANGELOG.md`：

```markdown
## [YYYY-MM-DD]

### Added
- Added [FEATURE_NAME]
```

若 `docs/changelog/` 或 `CHANGELOG.md` 不存在，先创建目录和文件。

---

## 行为规则

- **不打断**正常对话
- **仅**在显式触发后执行
- **不生成重复文档**：若文档已存在，则**更新**而非覆盖
- 格式与仓库规范保持一致

---

## 附加资源

- 完整模板与分类细则见 [reference.md](reference.md)
- 使用示例见 [examples.md](examples.md)
