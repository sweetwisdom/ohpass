/**
 * OhPass - 密码详情页面
 * 基于 Pencil 设计稿的密码详情
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '@/components/design-system';
import { SettingsRow } from '@/components/ui';
import { useData } from '@/contexts/DataContext';
import { calculatePasswordStrength, getIconName } from '@/utils/password';
import type { PasswordEntry } from '@/services/database';

export default function PasswordDetailScreen() {
  const { colors, isDark } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { passwords, removePassword } = useData();
  const [entry, setEntry] = useState<PasswordEntry | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const found = passwords.find(p => p.id === id);
    setEntry(found ?? null);
  }, [id, passwords]);

  if (!entry) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.loading}>
          <Text style={{ color: colors.textSecondary }}>密码不存在</Text>
          <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
            <Text style={{ color: colors.accentBlue }}>返回</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const strength = calculatePasswordStrength(entry.password);

  const handleCopy = async (value: string, label: string) => {
    await Clipboard.setStringAsync(value);
    Alert.alert('已复制', `${label}已复制到剪贴板`);
  };

  const handleEdit = () => {
    router.push(`/password/add?id=${entry.id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      '删除密码',
      `确定要删除 "${entry.title}" 的密码吗？此操作不可撤销。`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            await removePassword(entry.id);
            router.back();
          },
        },
      ]
    );
  };

  const displayPassword = showPassword ? entry.password : '•'.repeat(Math.min(entry.password.length, 16));

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Nav Bar */}
      <View style={[styles.navBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={20} color={colors.accentBlue} />
          <Text style={[styles.backText, { color: colors.accentBlue }]}>返回</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleEdit}>
          <Text style={[styles.editText, { color: colors.accentBlue }]}>编辑</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={[styles.heroIcon, { backgroundColor: entry.icon_color || '#FF8400' }]}>
            <Ionicons name={getIconName(entry.category) as any} size={28} color="#FFFFFF" />
          </View>
          <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>{entry.title}</Text>
          <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
            {entry.website || entry.category}
          </Text>
        </View>

        {/* Fields */}
        <View style={[styles.fieldsCard, { backgroundColor: colors.card }]}>
          {entry.username ? (
            <>
              <TouchableOpacity
                style={styles.fieldItem}
                onPress={() => handleCopy(entry.username, '用户名')}
              >
                <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>用户名</Text>
                <View style={styles.fieldRow}>
                  <Text style={[styles.fieldValue, { color: colors.textPrimary, flex: 1 }]}>
                    {entry.username}
                  </Text>
                  <Ionicons name="copy-outline" size={18} color={colors.textTertiary} />
                </View>
              </TouchableOpacity>
              <View style={[styles.fieldDivider, { backgroundColor: colors.border }]} />
            </>
          ) : null}

          <TouchableOpacity
            style={styles.fieldItem}
            onPress={() => handleCopy(entry.password, '密码')}
          >
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>密码</Text>
            <View style={styles.fieldRow}>
              <Text style={[styles.fieldValue, { color: colors.textPrimary, flex: 1 }]}>
                {displayPassword}
              </Text>
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ marginRight: 12 }}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.textTertiary} />
              </TouchableOpacity>
              <Ionicons name="copy-outline" size={18} color={colors.textTertiary} />
            </View>
          </TouchableOpacity>

          {entry.website ? (
            <>
              <View style={[styles.fieldDivider, { backgroundColor: colors.border }]} />
              <TouchableOpacity
                style={styles.fieldItem}
                onPress={() => handleCopy(entry.website, '网址')}
              >
                <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>网站</Text>
                <View style={styles.fieldRow}>
                  <Text style={[styles.fieldValue, { color: colors.textPrimary, flex: 1 }]}>
                    {entry.website}
                  </Text>
                  <Ionicons name="copy-outline" size={18} color={colors.textTertiary} />
                </View>
              </TouchableOpacity>
            </>
          ) : null}

          {entry.notes ? (
            <>
              <View style={[styles.fieldDivider, { backgroundColor: colors.border }]} />
              <View style={styles.fieldItem}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>备注</Text>
                <Text style={[styles.fieldValue, { color: colors.textPrimary }]}>
                  {entry.notes}
                </Text>
              </View>
            </>
          ) : null}
        </View>

        {/* Strength Section */}
        <View style={styles.strengthSection}>
          <Text style={[styles.strengthLabel, { color: colors.textSecondary }]}>密码强度</Text>
          <View style={[styles.strengthBar, { backgroundColor: colors.bgTertiary }]}>
            <View
              style={[
                styles.strengthProgress,
                {
                  width: `${strength.score}%` as any,
                  backgroundColor: strength.color,
                },
              ]}
            />
          </View>
          <View style={styles.strengthInfo}>
            <Text style={[styles.strengthValue, { color: strength.color }]}>{strength.label}</Text>
            <Text style={[styles.strengthPercent, { color: colors.textSecondary }]}>{strength.score}%</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={[styles.actionsCard, { backgroundColor: colors.card }]}>
          <SettingsRow
            label="复制用户名"
            icon="person-outline"
            iconColor={colors.accentBlue}
            onPress={() => entry.username && handleCopy(entry.username, '用户名')}
          />
          <View style={[styles.fieldDivider, { backgroundColor: colors.border }]} />
          <SettingsRow
            label="复制密码"
            icon="key-outline"
            iconColor={colors.accentGreen}
            onPress={() => handleCopy(entry.password, '密码')}
          />
        </View>

        {/* Delete Button */}
        <TouchableOpacity
          style={[styles.deleteBtn, { backgroundColor: colors.card }]}
          onPress={handleDelete}
        >
          <Text style={[styles.deleteText, { color: colors.accentRed }]}>删除密码</Text>
        </TouchableOpacity>

        {/* Meta info */}
        <Text style={[styles.metaText, { color: colors.textTertiary }]}>
          创建于 {new Date(entry.created_at).toLocaleDateString('zh-CN')} ·
          更新于 {new Date(entry.updated_at).toLocaleDateString('zh-CN')}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backText: {
    fontSize: 16,
  },
  editText: {
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 12,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  heroSubtitle: {
    fontSize: 14,
  },
  fieldsCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  fieldItem: {
    padding: 16,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 15,
  },
  fieldDivider: {
    height: 1,
    marginHorizontal: 16,
  },
  strengthSection: {
    marginBottom: 20,
  },
  strengthLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  strengthBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  strengthProgress: {
    height: '100%',
    borderRadius: 3,
  },
  strengthInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  strengthValue: {
    fontSize: 13,
    fontWeight: '500',
  },
  strengthPercent: {
    fontSize: 13,
  },
  actionsCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  deleteBtn: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  deleteText: {
    fontSize: 16,
    fontWeight: '500',
  },
  metaText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
