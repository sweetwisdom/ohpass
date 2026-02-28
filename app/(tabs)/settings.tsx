/**
 * OhPass - 设置页面
 * 深色模式、自动锁定、数据导出等功能
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useTheme } from '@/components/design-system';
import { ToggleSwitch } from '@/components/ui';
import { useThemePreference } from '@/contexts/ThemeContext';
import { useData } from '@/contexts/DataContext';

const AUTO_LOCK_OPTIONS = [
  { label: '立即', value: '0' },
  { label: '1 分钟', value: '60' },
  { label: '5 分钟', value: '300' },
  { label: '15 分钟', value: '900' },
  { label: '30 分钟', value: '1800' },
];

export default function SettingsScreen() {
  const { colors, isDark } = useTheme();
  const { themePreference, setThemePreference } = useThemePreference();
  const { passwords, wifiNetworks, totpAccounts, getSetting, saveSetting } = useData();
  const [autoLockIndex, setAutoLockIndex] = useState(1);

  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  // 加载设置
  useEffect(() => {
    (async () => {
      const saved = await getSetting('auto_lock');
      if (saved) {
        const idx = AUTO_LOCK_OPTIONS.findIndex(o => o.value === saved);
        if (idx >= 0) setAutoLockIndex(idx);
      }
    })();
  }, [getSetting]);

  const handleAutoLockCycle = async () => {
    const next = (autoLockIndex + 1) % AUTO_LOCK_OPTIONS.length;
    setAutoLockIndex(next);
    await saveSetting('auto_lock', AUTO_LOCK_OPTIONS[next].value);
  };

  const handleExport = async () => {
    if (passwords.length === 0 && wifiNetworks.length === 0 && totpAccounts.length === 0) {
      Alert.alert('提示', '没有数据可以导出');
      return;
    }

    const exportData = {
      exportDate: new Date().toISOString(),
      version: appVersion,
      passwords: passwords.map(p => ({
        title: p.title,
        website: p.website,
        username: p.username,
        password: p.password,
        category: p.category,
        notes: p.notes,
      })),
      wifiNetworks: wifiNetworks.map(w => ({
        ssid: w.ssid,
        password: w.password,
        securityType: w.security_type,
      })),
      totpAccounts: totpAccounts.map(t => ({
        serviceName: t.service_name,
        secret: t.secret,
        issuer: t.issuer,
        digits: t.digits,
        period: t.period,
      })),
    };

    try {
      await Share.share({
        message: JSON.stringify(exportData, null, 2),
        title: 'OhPass 数据导出',
      });
    } catch {
      Alert.alert('错误', '导出失败');
    }
  };

  const handleThemeChange = (dark: boolean) => {
    setThemePreference(dark ? 'dark' : 'light');
  };

  const handleSystemTheme = () => {
    setThemePreference('system');
    Alert.alert('已切换', '主题已设置为跟随系统');
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
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>设置</Text>

        {/* 外观 Section */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>外观</Text>
        <View style={[styles.groupCard, { borderRadius: 12 }]}>
          <View style={[styles.row, { backgroundColor: colors.card }]}>
            <Ionicons name="moon-outline" size={20} color={colors.accentBlue} />
            <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>深色模式</Text>
            <ToggleSwitch
              value={themePreference === 'dark' || (themePreference === 'system' && isDark)}
              onValueChange={handleThemeChange}
            />
          </View>
          <TouchableOpacity
            style={[styles.row, { backgroundColor: colors.card }]}
            onPress={handleSystemTheme}
            activeOpacity={0.7}
          >
            <Ionicons name="phone-portrait-outline" size={20} color={colors.accentBlue} />
            <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>跟随系统</Text>
            {themePreference === 'system' && (
              <Ionicons name="checkmark" size={20} color={colors.accentGreen} />
            )}
          </TouchableOpacity>
        </View>

        {/* 安全 Section */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>安全</Text>
        <View style={[styles.groupCard, { borderRadius: 12 }]}>
          <TouchableOpacity
            style={[styles.row, { backgroundColor: colors.card }]}
            activeOpacity={0.7}
            onPress={handleAutoLockCycle}
          >
            <Ionicons name="timer-outline" size={20} color={colors.accentBlue} />
            <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>自动锁定</Text>
            <Text style={[styles.rowValue, { color: colors.textSecondary }]}>
              {AUTO_LOCK_OPTIONS[autoLockIndex].label}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* 数据 Section */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>数据</Text>
        <View style={[styles.groupCard, { borderRadius: 12 }]}>
          <TouchableOpacity
            style={[styles.row, { backgroundColor: colors.card }]}
            activeOpacity={0.7}
            onPress={handleExport}
          >
            <Ionicons name="download-outline" size={20} color={colors.accentBlue} />
            <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>数据导出 (JSON)</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* 统计 Section */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>统计</Text>
        <View style={[styles.groupCard, { borderRadius: 12 }]}>
          <View style={[styles.row, { backgroundColor: colors.card }]}>
            <Ionicons name="key-outline" size={20} color={colors.primary} />
            <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>已保存密码</Text>
            <Text style={[styles.rowValue, { color: colors.textSecondary }]}>
              {passwords.length}
            </Text>
          </View>
          <View style={[styles.row, { backgroundColor: colors.card }]}>
            <Ionicons name="shield-checkmark-outline" size={20} color={colors.accentGreen} />
            <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>两步验证</Text>
            <Text style={[styles.rowValue, { color: colors.textSecondary }]}>
              {totpAccounts.length}
            </Text>
          </View>
          <View style={[styles.row, { backgroundColor: colors.card }]}>
            <Ionicons name="wifi-outline" size={20} color={colors.accentBlue} />
            <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>Wi-Fi 网络</Text>
            <Text style={[styles.rowValue, { color: colors.textSecondary }]}>
              {wifiNetworks.length}
            </Text>
          </View>
        </View>

        {/* 关于 Section */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>关于</Text>
        <View style={[styles.groupCard, { borderRadius: 12 }]}>
          <View style={[styles.row, { backgroundColor: colors.card }]}>
            <Ionicons name="information-circle-outline" size={20} color={colors.accentBlue} />
            <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>版本 {appVersion}</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={[styles.footer, { color: colors.textTertiary }]}>
          OhPass · 安全的密码管理器
        </Text>
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
  footer: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 24,
  },
});
