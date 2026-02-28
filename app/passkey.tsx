/**
 * OhPass - 通行密钥页面
 * 基于 Pencil 设计稿的通行密钥
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
import { router } from 'expo-router';
import { useTheme } from '@/components/design-system';

const mockPasskeys = [
  {
    id: '1',
    name: 'Google',
    icon: 'globe-outline' as const,
    iconBg: '#007AFF',
    device: 'iPhone 15 Pro · 已绑定',
    deviceIcon: 'phone-portrait-outline' as const,
    active: true,
  },
  {
    id: '2',
    name: 'Apple',
    icon: 'logo-apple' as const,
    iconBg: '#000000',
    device: 'MacBook Pro · 已绑定',
    deviceIcon: 'laptop-outline' as const,
    active: true,
  },
  {
    id: '3',
    name: 'GitHub',
    icon: 'logo-github' as const,
    iconBg: '#333333',
    device: 'iPad Air · 已停用',
    deviceIcon: 'phone-portrait-outline' as const,
    active: false,
  },
];

export default function PasskeyScreen() {
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={20} color={colors.accentBlue} />
          <Text style={[styles.backText, { color: colors.accentBlue }]}>设置</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>通行密钥</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Description Card */}
        <View style={[styles.descCard, { backgroundColor: colors.card }]}>
          <View style={[styles.descIcon, { backgroundColor: '#5856D622' }]}>
            <Ionicons name="key" size={28} color="#5856D6" />
          </View>
          <Text style={[styles.descTitle, { color: colors.textPrimary }]}>
            无密码登录
          </Text>
          <Text style={[styles.descText, { color: colors.textSecondary }]}>
            通行密钥使用生物识别替代传统密码，更安全、更便捷
          </Text>
        </View>

        {/* 已注册通行密钥 */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          已注册通行密钥
        </Text>

        <View style={[styles.groupCard, { borderRadius: 12 }]}>
          {mockPasskeys.map((pk) => (
            <TouchableOpacity
              key={pk.id}
              style={[styles.pkRow, { backgroundColor: colors.card }]}
              activeOpacity={0.7}
            >
              <View style={[styles.pkIcon, { backgroundColor: pk.iconBg }]}>
                <Ionicons name={pk.icon as any} size={20} color="#FFFFFF" />
              </View>
              <View style={styles.pkInfo}>
                <Text style={[styles.pkName, { color: colors.textPrimary }]}>
                  {pk.name}
                </Text>
                <View style={styles.pkDevice}>
                  <Ionicons
                    name={pk.deviceIcon as any}
                    size={12}
                    color={pk.active ? colors.accentGreen : colors.textTertiary}
                  />
                  <Text
                    style={[
                      styles.pkDeviceText,
                      { color: pk.active ? colors.accentGreen : colors.textTertiary },
                    ]}
                  >
                    {pk.device}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* 管理 */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          管理
        </Text>

        <View style={[styles.groupCard, { borderRadius: 12 }]}>
          <TouchableOpacity
            style={[styles.mgmtRow, { backgroundColor: colors.card }]}
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle-outline" size={18} color={colors.accentBlue} />
            <Text style={[styles.mgmtText, { color: colors.accentBlue }]}>
              添加新通行密钥
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.mgmtRow, { backgroundColor: colors.card }]}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={18} color={colors.accentRed} />
            <Text style={[styles.mgmtText, { color: colors.accentRed }]}>
              删除已停用的密钥
            </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 44,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backText: {
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 20,
  },
  descCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  descIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  descTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  descText: {
    fontSize: 13,
    textAlign: 'center',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  groupCard: {
    overflow: 'hidden',
    gap: 2,
  },
  pkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  pkIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pkInfo: {
    flex: 1,
    gap: 2,
  },
  pkName: {
    fontSize: 16,
    fontWeight: '500',
  },
  pkDevice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pkDeviceText: {
    fontSize: 12,
  },
  mgmtRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 16,
    gap: 12,
  },
  mgmtText: {
    flex: 1,
    fontSize: 16,
  },
});
