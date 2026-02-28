# 自动 Git 工作流

**创建日期**: 2026-02-28

## 目录

1. [Background](#1-background)
2. [User Input Summary](#2-user-input-summary)
3. [AI Design Summary](#3-ai-design-summary)
4. [Implementation Details](#4-implementation-details)
5. [Completion Status Table](#5-completion-status-table)
6. [Technical Decisions](#6-technical-decisions)
7. [Future Improvements](#7-future-improvements)

## 1. Background

OhPass 项目使用 Claude Code 进行 AI 辅助开发，需要在完成代码变更后自动执行 Git 提交操作，减少手动操作，提升开发效率。项目已集成 Git MCP Server，具备通过 MCP 工具调用 Git 命令的能力。

## 2. User Input Summary

用户请求：
- 确认 Git MCP 是否已安装
- 在 CLAUDE.md 中配置自动 Git 提交功能

## 3. AI Design Summary

设计方案包含两部分：

1. **CLAUDE.md 指令层**：在项目指南中添加「自动 Git 工作流」章节，定义提交规范、自动提交流程和例外情况
2. **权限配置层**：在 `.claude/settings.local.json` 中预授权所有 Git MCP 工具，实现无需用户确认的自动化操作

采用中文 Conventional Commits 格式保持团队一致性。

## 4. Implementation Details

### 修改文件

**`CLAUDE.md`** — 新增「自动 Git 工作流」章节：
- 自动提交规则（每完成一个有意义的变更后自动提交）
- Commit Message 规范（中文 + Conventional Commits: `feat:`, `fix:`, `style:`, `refactor:`, `docs:`, `chore:`）
- 自动提交流程（`git_add` → `git_commit`，仅添加本次变更的文件）
- 不自动提交的例外情况

**`.claude/settings.local.json`** — 授权 Git MCP 工具权限：
- `mcp__git__git_status` — 查看状态
- `mcp__git__git_add` — 暂存文件
- `mcp__git__git_commit` — 提交变更
- `mcp__git__git_diff_unstaged` / `git_diff_staged` / `git_diff` — 查看差异
- `mcp__git__git_log` — 查看日志
- `mcp__git__git_branch` / `git_create_branch` / `git_checkout` — 分支操作
- `mcp__git__git_show` — 查看提交内容

## 5. Completion Status Table

| 项目 | 状态 |
|------|------|
| 确认 Git MCP 已安装 | ✅ 完成 |
| CLAUDE.md 添加自动 Git 工作流规范 | ✅ 完成 |
| settings.local.json 授权 Git MCP 权限 | ✅ 完成 |
| 验证 Git MCP 工具可正常调用 | ✅ 完成 |

## 6. Technical Decisions

| 决策 | 选择 | 原因 |
|------|------|------|
| Commit 语言 | 中文 | 与项目整体中文风格一致 |
| Commit 格式 | Conventional Commits | 行业标准，便于自动生成 CHANGELOG |
| 权限配置位置 | `settings.local.json` | 本地配置不影响其他协作者 |
| 提交粒度 | 每个有意义的变更 | 保持提交历史清晰，避免过大或过碎的提交 |
| 暂存策略 | 仅添加本次变更文件 | 避免误提交无关文件或敏感配置 |

## 7. Future Improvements

- 集成 pre-commit 钩子进行自动代码检查（TypeScript 类型检查、ESLint）
- 自动生成 CHANGELOG 基于 Conventional Commits
- 支持自动创建分支和 PR 的工作流
- 添加 `.gitignore` 规则优化（排除 `.claude/` 本地配置等）
