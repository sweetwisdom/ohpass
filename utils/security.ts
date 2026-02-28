/**
 * OhPass - 安全检测工具
 * 密码安全评分、弱密码检测、重复密码检测
 */

import type { PasswordEntry } from '@/services/database';
import { calculatePasswordStrength } from './password';

export interface SecurityIssue {
  id: string;
  type: 'weak' | 'reused' | 'old';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  affectedIds: string[];
  icon: string;
  color: string;
}

export interface SecurityReport {
  score: number;
  totalPasswords: number;
  issues: SecurityIssue[];
  passedChecks: { title: string; description: string; icon: string }[];
}

/**
 * 生成完整的安全报告
 */
export function generateSecurityReport(passwords: PasswordEntry[]): SecurityReport {
  if (passwords.length === 0) {
    return {
      score: 100,
      totalPasswords: 0,
      issues: [],
      passedChecks: [
        { title: '无密码需要检查', description: '添加密码后可进行安全检测', icon: 'information-circle' },
      ],
    };
  }

  const issues: SecurityIssue[] = [];
  const passedChecks: { title: string; description: string; icon: string }[] = [];

  // 1. 检测弱密码
  const weakPasswords = passwords.filter(p => {
    const strength = calculatePasswordStrength(p.password);
    return strength.level === 'weak' || strength.level === 'fair';
  });

  if (weakPasswords.length > 0) {
    issues.push({
      id: 'weak',
      type: 'weak',
      severity: 'high',
      title: `${weakPasswords.length} 个弱密码`,
      description: '这些密码容易被暴力破解，建议更换为更强的密码',
      affectedIds: weakPasswords.map(p => p.id),
      icon: 'warning',
      color: '#FF3B30',
    });
  } else {
    passedChecks.push({
      title: '密码强度检查',
      description: '所有密码强度均达标',
      icon: 'shield-checkmark',
    });
  }

  // 2. 检测重复密码
  const passwordMap = new Map<string, PasswordEntry[]>();
  for (const p of passwords) {
    const existing = passwordMap.get(p.password) ?? [];
    existing.push(p);
    passwordMap.set(p.password, existing);
  }

  const reusedGroups = [...passwordMap.values()].filter(group => group.length > 1);
  const reusedCount = reusedGroups.reduce((sum, group) => sum + group.length, 0);

  if (reusedCount > 0) {
    issues.push({
      id: 'reused',
      type: 'reused',
      severity: 'high',
      title: `${reusedCount} 个重复密码`,
      description: `${reusedGroups.length} 组密码被多个账户共用，一旦泄露将影响所有关联账户`,
      affectedIds: reusedGroups.flatMap(group => group.map(p => p.id)),
      icon: 'copy',
      color: '#FF9500',
    });
  } else {
    passedChecks.push({
      title: '密码唯一性检查',
      description: '未发现重复使用的密码',
      icon: 'checkmark-circle',
    });
  }

  // 3. 检测长期未更新的密码（超过 180 天）
  const SIX_MONTHS = 180 * 24 * 60 * 60 * 1000;
  const oldPasswords = passwords.filter(p => Date.now() - p.updated_at > SIX_MONTHS);

  if (oldPasswords.length > 0) {
    issues.push({
      id: 'old',
      type: 'old',
      severity: 'low',
      title: `${oldPasswords.length} 个密码超过半年未更新`,
      description: '建议定期更换密码以提高安全性',
      affectedIds: oldPasswords.map(p => p.id),
      icon: 'time',
      color: '#8E8E93',
    });
  } else {
    passedChecks.push({
      title: '密码更新检查',
      description: '所有密码均在近期更新过',
      icon: 'time',
    });
  }

  // 计算总分
  const totalIssueWeight = issues.reduce((sum, issue) => {
    const weight = issue.severity === 'high' ? 3 : issue.severity === 'medium' ? 2 : 1;
    return sum + weight * issue.affectedIds.length;
  }, 0);

  const maxWeight = passwords.length * 3;
  const deduction = Math.min(100, Math.round((totalIssueWeight / maxWeight) * 100));
  const score = Math.max(0, 100 - deduction);

  return { score, totalPasswords: passwords.length, issues, passedChecks };
}

/**
 * 获取安全评分对应的颜色和标签
 */
export function getScoreInfo(score: number): { color: string; label: string } {
  if (score >= 80) return { color: '#34C759', label: '安全' };
  if (score >= 60) return { color: '#007AFF', label: '良好' };
  if (score >= 40) return { color: '#FF9500', label: '一般' };
  return { color: '#FF3B30', label: '危险' };
}
