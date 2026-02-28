/**
 * OhPass - 设置页面
 * 基于 Pencil 设计稿的设置页面
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/components/design-system';
import { SectionHeader, SettingsRow, ToggleSwitch } from '@/components/ui';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>设置</Text>
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
        {/* Account Section */}
        <SectionHeader title="账户" style={styles.sectionHeader} />
        <View style={styles.settingsList}>
          <SettingsRow
            label="主密码"
            icon="key"
            iconColor={colors.accentBlue}
            onPress={() => {}}
          />
          <SettingsRow
            label="通行密钥"
            icon="finger-print"
            iconColor={colors.accentPurple}
            onPress={() => router.push('/passkey')}
          />
          <SettingsRow
            label="导入数据"
            icon="download-outline"
            iconColor={colors.accentGreen}
            onPress={() => {}}
          />
          <SettingsRow
            label="导出数据"
            icon="share-outline"
            iconColor={colors.accentOrange}
            onPress={() => {}}
          />
        </View>

        {/* Appearance Section */}
        <SectionHeader title="外观" style={styles.sectionHeader} />
        <View style={styles.settingsList}>
          <SettingsRow
            label="深色模式"
            icon="moon"
            iconColor={colors.accentPurple}
            showChevron={false}
            rightElement={
              <ToggleSwitch
                value={darkMode}
                onValueChange={(val) => setDarkMode(val)}
              />
            }
          />
        </View>

        {/* Notifications Section */}
        <SectionHeader title="通知" style={styles.sectionHeader} />
        <View style={styles.settingsList}>
          <SettingsRow
            label="推送通知"
            icon="notifications"
            iconColor={colors.accentRed}
            showChevron={false}
            rightElement={
              <ToggleSwitch
                value={notifications}
                onValueChange={(val) => setNotifications(val)}
              />
            }
          />
        </View>

        {/* Security Section */}
        <SectionHeader title="安全" style={styles.sectionHeader} />
        <View style={styles.settingsList}>
          <SettingsRow
            label="自动锁定"
            icon="timer"
            iconColor={colors.accentBlue}
            onPress={() => {}}
          />
          <SettingsRow
            label="生物识别"
            icon="scan"
            iconColor={colors.accentGreen}
            showChevron={false}
            rightElement={
              <ToggleSwitch value={true} onValueChange={() => {}} />
            }
          />
          <SettingsRow
            label="剪贴板清除"
            icon="clipboard"
            iconColor={colors.accentOrange}
            showChevron={false}
            rightElement={
              <ToggleSwitch value={true} onValueChange={() => {}} />
            }
          />
        </View>

        {/* Data Section */}
        <SectionHeader title="数据" style={styles.sectionHeader} />
        <View style={styles.settingsList}>
          <SettingsRow
            label="同步"
            icon="cloud"
            iconColor={colors.accentBlue}
            onPress={() => {}}
          />
          <SettingsRow
            label="备份"
            icon="folder"
            iconColor={colors.accentOrange}
            onPress={() => {}}
          />
          <SettingsRow
            label="存储使用"
            icon="server"
            iconColor={colors.textSecondary}
            onPress={() => {}}
          />
        </View>

        {/* About Section */}
        <SectionHeader title="关于" style={styles.sectionHeader} />
        <View style={styles.settingsList}>
          <SettingsRow
            label="帮助与支持"
            icon="help-circle"
            iconColor={colors.accentBlue}
            onPress={() => {}}
          />
          <SettingsRow
            label="隐私政策"
            icon="shield-checkmark"
            iconColor={colors.accentGreen}
            onPress={() => {}}
          />
          <SettingsRow
            label="版本"
            icon="information-circle"
            iconColor={colors.textSecondary}
            showChevron={false}
            rightElement={
              <Text style={{ color: colors.textSecondary, fontSize: 15 }}>
                1.0.0
              </Text>
            }
          />
        </View>

        {/* Danger Zone */}
        <SectionHeader title="危险区域" style={styles.sectionHeader} />
        <View style={styles.settingsList}>
          <SettingsRow
            label="删除所有数据"
            icon="trash"
            iconColor={colors.accentRed}
            onPress={() => {
              Alert.alert(
                '确认删除',
                '此操作将删除所有本地数据，无法恢复。确定要继续吗？',
                [
                  { text: '取消', style: 'cancel' },
                  { text: '删除', style: 'destructive' },
                ]
              );
            }}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textTertiary }]}>
            OhPass v1.0.0
          </Text>
          <Text style={[styles.footerText, { color: colors.textTertiary }]}>
            Made with ❤️
          </Text>
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
  sectionHeader: {
    marginTop: 20,
    marginBottom: 12,
  },
  settingsList: {
    gap: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  footerText: {
    fontSize: 13,
  },
});
