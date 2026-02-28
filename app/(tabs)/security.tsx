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
import { SectionHeader, SettingsRow, ToggleSwitch } from '@/components/ui';

interface SecurityItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  iconColor: string;
  status: 'success' | 'warning' | 'danger';
  statusText: string;
}

const mockSecurityItems: SecurityItem[] = [
  {
    id: '1',
    title: '密码强度',
    subtitle: '您的密码强度足够',
    icon: 'shield-checkmark',
    iconColor: '#34C759',
    status: 'success',
    statusText: '安全',
  },
  {
    id: '2',
    title: '数据泄露检查',
    subtitle: '检测到 2 个泄露的密码',
    icon: 'warning',
    iconColor: '#FF9500',
    status: 'warning',
    statusText: '风险',
  },
  {
    id: '3',
    title: '双因素认证',
    subtitle: '已为 15 个账户启用',
    icon: 'lock-closed',
    iconColor: '#007AFF',
    status: 'success',
    statusText: '已启用',
  },
  {
    id: '4',
    title: '安全登录',
    subtitle: '使用通行密钥登录',
    icon: 'key',
    iconColor: '#5856D6',
    status: 'success',
    statusText: '已启用',
  },
];

export default function SecurityScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>安全</Text>
        <TouchableOpacity
          style={[
            styles.headerBtn,
            { backgroundColor: colors.bgTertiary },
          ]}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Security Score Card */}
        <View
          style={[
            styles.scoreCard,
            { backgroundColor: colors.card },
          ]}
        >
          <View style={styles.scoreHeader}>
            <Text style={[styles.scoreTitle, { color: colors.textPrimary }]}>
              安全评分
            </Text>
            <View
              style={[
                styles.scoreBadge,
                { backgroundColor: colors.accentGreen + '20' },
              ]}
            >
              <Text style={[styles.scoreValue, { color: colors.accentGreen }]}>
                85
              </Text>
            </View>
          </View>
          <View style={styles.scoreBar}>
            <View
              style={[
                styles.scoreProgress,
                {
                  width: '85%',
                  backgroundColor: colors.accentGreen,
                },
              ]}
            />
          </View>
          <Text style={[styles.scoreSubtitle, { color: colors.textSecondary }]}>
            您的账户安全状态良好
          </Text>
        </View>

        {/* Security Items */}
        <SectionHeader title="安全检查" style={styles.sectionHeader} />

        <View style={styles.securityList}>
          {mockSecurityItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.securityItem,
                { backgroundColor: colors.card },
              ]}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.securityIcon,
                  { backgroundColor: item.iconColor + '20' },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={item.iconColor}
                />
              </View>
              <View style={styles.securityInfo}>
                <Text style={[styles.securityTitle, { color: colors.textPrimary }]}>
                  {item.title}
                </Text>
                <Text style={[styles.securitySubtitle, { color: colors.textSecondary }]}>
                  {item.subtitle}
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      item.status === 'success'
                        ? colors.accentGreen + '20'
                        : item.status === 'warning'
                        ? colors.accentOrange + '20'
                        : colors.accentRed + '20',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        item.status === 'success'
                          ? colors.accentGreen
                          : item.status === 'warning'
                          ? colors.accentOrange
                          : colors.accentRed,
                    },
                  ]}
                >
                  {item.statusText}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Settings */}
        <SectionHeader title="安全设置" style={styles.sectionHeader} />

        <View style={styles.settingsList}>
          <SettingsRow
            label="自动锁定"
            icon="timer-outline"
            iconColor={colors.accentBlue}
            onPress={() => {}}
          />
          <SettingsRow
            label="生物识别"
            icon="finger-print"
            iconColor={colors.accentGreen}
            rightElement={
              <ToggleSwitch value={true} onValueChange={() => {}} />
            }
          />
          <SettingsRow
            label="剪贴板清除"
            icon="clipboard-outline"
            iconColor={colors.accentOrange}
            rightElement={
              <ToggleSwitch value={true} onValueChange={() => {}} />
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  scoreCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  scoreTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  scoreBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  scoreBar: {
    height: 6,
    backgroundColor: '#E5E5EA',
    borderRadius: 3,
    marginBottom: 12,
    overflow: 'hidden',
  },
  scoreProgress: {
    height: '100%',
    borderRadius: 3,
  },
  scoreSubtitle: {
    fontSize: 13,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  securityList: {
    gap: 8,
    marginBottom: 24,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  securityIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  securityInfo: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  securitySubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  settingsList: {
    gap: 8,
  },
});