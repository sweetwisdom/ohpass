/**
 * OhPass - 安全检测页面
 * 基于真实密码数据计算安全评分和检测问题
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/components/design-system';
import { useData } from '@/contexts/DataContext';
import { generateSecurityReport, getScoreInfo } from '@/utils/security';

export default function SecurityScreen() {
  const { colors, isDark } = useTheme();
  const { passwords, isLoading } = useData();

  const report = useMemo(() => generateSecurityReport(passwords), [passwords]);
  const scoreInfo = getScoreInfo(report.score);

  const handleIssueFix = (affectedIds: string[]) => {
    if (affectedIds.length > 0) {
      router.push(`/password/${affectedIds[0]}`);
    }
  };

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
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>安全检测</Text>

        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : (
          <>
            {/* Score Card */}
            <View style={[styles.scoreCard, { backgroundColor: colors.card }]}>
              <View style={styles.scoreRing}>
                <View style={[styles.ringBg, { borderColor: colors.bgTertiary }]} />
                <View
                  style={[
                    styles.ringProgress,
                    {
                      borderColor: scoreInfo.color,
                      borderRightColor: report.score > 25 ? scoreInfo.color : 'transparent',
                      borderBottomColor: report.score > 50 ? scoreInfo.color : 'transparent',
                      borderLeftColor: report.score > 75 ? scoreInfo.color : 'transparent',
                    },
                  ]}
                />
                <Text style={[styles.scoreNum, { color: scoreInfo.color }]}>
                  {report.score}
                </Text>
              </View>

              <Text style={[styles.scoreLabel, { color: colors.textPrimary }]}>
                安全评分：{scoreInfo.label}
              </Text>
              <Text style={[styles.scoreDesc, { color: colors.textSecondary }]}>
                {report.totalPasswords === 0
                  ? '添加密码后可进行安全检测'
                  : report.issues.length === 0
                    ? `已检查 ${report.totalPasswords} 个密码，全部安全`
                    : `发现 ${report.issues.length} 个安全问题需要处理`}
              </Text>
            </View>

            {/* Security Issues */}
            {report.issues.length > 0 && (
              <>
                <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                  安全问题
                </Text>
                <View style={styles.issuesList}>
                  {report.issues.map((issue) => (
                    <TouchableOpacity
                      key={issue.id}
                      style={[styles.issueCard, { backgroundColor: colors.card }]}
                      activeOpacity={0.7}
                      onPress={() => handleIssueFix(issue.affectedIds)}
                    >
                      <View style={[styles.issueBadge, { backgroundColor: `${issue.color}22` }]}>
                        <Ionicons name={issue.icon as any} size={20} color={issue.color} />
                      </View>
                      <View style={styles.issueInfo}>
                        <Text style={[styles.issueName, { color: colors.textPrimary }]}>
                          {issue.title}
                        </Text>
                        <Text style={[styles.issueDesc, { color: colors.textSecondary }]}>
                          {issue.description}
                        </Text>
                      </View>
                      <View style={styles.issueActionContainer}>
                        <Text style={[styles.issueAction, { color: colors.accentBlue }]}>
                          修复
                        </Text>
                        <Ionicons name="chevron-forward" size={14} color={colors.textTertiary} />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {/* Passed Checks */}
            {report.passedChecks.length > 0 && (
              <>
                <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                  已通过检查
                </Text>
                <View style={[styles.passedListCard, { borderRadius: 12 }]}>
                  {report.passedChecks.map((check, index) => (
                    <View
                      key={check.title}
                      style={[
                        styles.passedRow,
                        { backgroundColor: colors.card },
                        index < report.passedChecks.length - 1 && styles.passedRowGap,
                      ]}
                    >
                      <Ionicons name={check.icon as any} size={18} color={colors.accentGreen} />
                      <View style={styles.passedInfo}>
                        <Text style={[styles.passedTitle, { color: colors.textPrimary }]}>
                          {check.title}
                        </Text>
                        <Text style={[styles.passedDesc, { color: colors.textTertiary }]}>
                          {check.description}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* Summary */}
            <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>密码总数</Text>
                <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>{report.totalPasswords}</Text>
              </View>
              <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>安全问题</Text>
                <Text style={[styles.summaryValue, { color: report.issues.length > 0 ? colors.accentRed : colors.accentGreen }]}>
                  {report.issues.length}
                </Text>
              </View>
              <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>通过检查</Text>
                <Text style={[styles.summaryValue, { color: colors.accentGreen }]}>{report.passedChecks.length}</Text>
              </View>
            </View>
          </>
        )}
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
  loader: {
    marginTop: 60,
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
  issueActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  passedRowGap: {},
  passedInfo: {
    flex: 1,
  },
  passedTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  passedDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  summaryCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  summaryDivider: {
    height: 1,
    marginHorizontal: 16,
  },
  summaryLabel: {
    fontSize: 15,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
  },
});
