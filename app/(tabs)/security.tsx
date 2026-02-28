/**
 * OhPass - 安全检测页面
 * 基于 Pencil 设计稿的安全检测
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/components/design-system';

const securityIssues = [
  {
    id: '1',
    title: '弱密码',
    desc: '2 个账户使用弱密码',
    icon: 'alert-triangle' as const,
    iconColor: '#FF3B30',
    iconBg: '#FF3B3022',
    actionText: '修复',
    actionColor: '#007AFF',
  },
  {
    id: '2',
    title: '重复密码',
    desc: '3 个账户使用相同密码',
    icon: 'copy-outline' as const,
    iconColor: '#FF9500',
    iconBg: '#FF950022',
    actionText: '修复',
    actionColor: '#007AFF',
  },
  {
    id: '3',
    title: '泄露检测',
    desc: '1 个密码已出现在泄露数据库中',
    icon: 'shield-outline' as const,
    iconColor: '#FF3B30',
    iconBg: '#FF3B3022',
    actionText: '修改',
    actionColor: '#FF3B30',
  },
];

const passedChecks = [
  { id: '1', text: '双重验证已启用 (5 个账户)' },
  { id: '2', text: '自动锁定已启用' },
];

export default function SecurityScreen() {
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Title */}
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          安全检测
        </Text>

        {/* Score Card with Circular Ring */}
        <View style={[styles.scoreCard, { backgroundColor: colors.card }]}>
          {/* Score Ring */}
          <View style={styles.scoreRing}>
            {/* Background circle */}
            <View
              style={[
                styles.ringBg,
                { borderColor: colors.bgTertiary || '#2C2C2E' },
              ]}
            />
            {/* Score arc - simulated with a partial border */}
            <View
              style={[
                styles.ringProgress,
                { borderColor: colors.accentGreen, borderRightColor: 'transparent' },
              ]}
            />
            {/* Score number */}
            <Text style={[styles.scoreNum, { color: colors.accentGreen }]}>
              82
            </Text>
          </View>

          <Text style={[styles.scoreLabel, { color: colors.textPrimary }]}>
            安全评分：良好
          </Text>
          <Text style={[styles.scoreDesc, { color: colors.textSecondary }]}>
            发现 3 个安全问题需要处理
          </Text>
        </View>

        {/* Security Issues Section */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          安全问题
        </Text>

        <View style={styles.issuesList}>
          {securityIssues.map((issue) => (
            <TouchableOpacity
              key={issue.id}
              style={[styles.issueCard, { backgroundColor: colors.card }]}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.issueBadge,
                  { backgroundColor: issue.iconBg },
                ]}
              >
                <Ionicons
                  name={issue.icon as any}
                  size={20}
                  color={issue.iconColor}
                />
              </View>
              <View style={styles.issueInfo}>
                <Text style={[styles.issueName, { color: colors.textPrimary }]}>
                  {issue.title}
                </Text>
                <Text style={[styles.issueDesc, { color: colors.textSecondary }]}>
                  {issue.desc}
                </Text>
              </View>
              <Text style={[styles.issueAction, { color: issue.actionColor }]}>
                {issue.actionText}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Passed Checks Section */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          已通过检查
        </Text>

        <View style={[styles.passedListCard, { borderRadius: 12 }]}>
          {passedChecks.map((check, index) => (
            <View
              key={check.id}
              style={[
                styles.passedRow,
                { backgroundColor: colors.card },
                index < passedChecks.length - 1 && styles.passedRowGap,
              ]}
            >
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={colors.accentGreen}
              />
              <Text style={[styles.passedText, { color: colors.textPrimary }]}>
                {check.text}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 20,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
    paddingTop: 8,
  },
  scoreCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  scoreRing: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringBg: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
  },
  ringProgress: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    transform: [{ rotate: '-45deg' }],
  },
  scoreNum: {
    fontSize: 36,
    fontWeight: '700',
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  scoreDesc: {
    fontSize: 13,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  issuesList: {
    gap: 12,
  },
  issueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  issueBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  issueInfo: {
    flex: 1,
    gap: 2,
  },
  issueName: {
    fontSize: 16,
    fontWeight: '500',
  },
  issueDesc: {
    fontSize: 13,
  },
  issueAction: {
    fontSize: 14,
    fontWeight: '600',
  },
  passedListCard: {
    overflow: 'hidden',
    gap: 2,
  },
  passedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 16,
    gap: 12,
  },
  passedRowGap: {},
  passedText: {
    fontSize: 15,
    flex: 1,
  },
});
