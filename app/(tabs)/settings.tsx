/**
 * OhPass - 设置页面
 * 基于 Pencil 设计稿的设置页面
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
import { ToggleSwitch } from '@/components/ui';
import { useThemePreference } from '@/contexts/ThemeContext';

export default function SettingsScreen() {
  const { colors, isDark } = useTheme();
  const { themePreference, setThemePreference } = useThemePreference();

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
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>设置</Text>

        {/* 安全 Section */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>安全</Text>
        <View style={[styles.groupCard, { borderRadius: 12 }]}>
          {/* 主密码修改 */}
          <TouchableOpacity
            style={[styles.row, { backgroundColor: colors.card }]}
            activeOpacity={0.7}
          >
            <Ionicons name="lock-closed-outline" size={20} color={colors.accentBlue} />
            <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>主密码修改</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
          </TouchableOpacity>

          {/* Face ID */}
          <View style={[styles.row, { backgroundColor: colors.card }]}>
            <Ionicons name="scan-outline" size={20} color={colors.accentBlue} />
            <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>Face ID</Text>
            <ToggleSwitch value={true} onValueChange={() => {}} />
          </View>

          {/* Touch ID */}
          <View style={[styles.row, { backgroundColor: colors.card }]}>
            <Ionicons name="finger-print" size={20} color={colors.accentBlue} />
            <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>Touch ID</Text>
            <ToggleSwitch value={true} onValueChange={() => {}} />
          </View>

          {/* 自动锁定 */}
          <TouchableOpacity
            style={[styles.row, { backgroundColor: colors.card }]}
            activeOpacity={0.7}
          >
            <Ionicons name="timer-outline" size={20} color={colors.accentBlue} />
            <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>自动锁定</Text>
            <Text style={[styles.rowValue, { color: colors.textSecondary }]}>1 分钟</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
          </TouchableOpacity>

          {/* 深色模式 - 用户要求的功能 */}
          <View style={[styles.row, { backgroundColor: colors.card }]}>
            <Ionicons name="moon-outline" size={20} color={colors.accentBlue} />
            <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>深色模式</Text>
            <ToggleSwitch
              value={themePreference === 'dark' || (themePreference === 'system' && isDark)}
              onValueChange={(val) => setThemePreference(val ? 'dark' : 'light')}
            />
          </View>
        </View>

        {/* 数据 Section */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>数据</Text>
        <View style={[styles.groupCard, { borderRadius: 12 }]}>
          {/* 数据导出 */}
          <TouchableOpacity
            style={[styles.row, { backgroundColor: colors.card }]}
            activeOpacity={0.7}
          >
            <Ionicons name="download-outline" size={20} color={colors.accentBlue} />
            <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>数据导出</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
          </TouchableOpacity>

          {/* 云备份 */}
          <View style={[styles.row, { backgroundColor: colors.card }]}>
            <Ionicons name="cloud-upload-outline" size={20} color={colors.accentBlue} />
            <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>云备份</Text>
            <ToggleSwitch value={true} onValueChange={() => {}} />
          </View>

          {/* 恢复代码 */}
          <TouchableOpacity
            style={[styles.row, { backgroundColor: colors.card }]}
            activeOpacity={0.7}
          >
            <Ionicons name="key-outline" size={20} color={colors.accentBlue} />
            <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>恢复代码</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* 关于 Section */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>关于</Text>
        <View style={[styles.groupCard, { borderRadius: 12 }]}>
          {/* 版本 */}
          <View style={[styles.row, { backgroundColor: colors.card }]}>
            <Ionicons name="information-circle-outline" size={20} color={colors.accentBlue} />
            <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>版本 2.1.0</Text>
          </View>

          {/* 隐私政策 */}
          <TouchableOpacity
            style={[styles.row, { backgroundColor: colors.card }]}
            activeOpacity={0.7}
          >
            <Ionicons name="shield-outline" size={20} color={colors.accentBlue} />
            <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>隐私政策</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
          </TouchableOpacity>
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
    gap: 8,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
    paddingTop: 8,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginTop: 16,
  },
  groupCard: {
    overflow: 'hidden',
    gap: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: 16,
    gap: 12,
  },
  rowLabel: {
    flex: 1,
    fontSize: 16,
  },
  rowValue: {
    fontSize: 15,
  },
});
