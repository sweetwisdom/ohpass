/**
 * OhPass - 密码详情页面
 * 基于 Pencil 设计稿的密码详情
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
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/components/design-system';
import { SettingsRow, PrimaryButton } from '@/components/ui';

export default function PasswordDetailScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  // 模拟数据 - 实际应用中应该从存储/状态管理获取
  const passwordData = {
    title: 'Google',
    subtitle: 'google.com',
    icon: 'globe',
    iconColor: '#4285F4',
    username: 'user@gmail.com',
    password: '••••••••••••',
    url: 'https://google.com',
    strength: 85,
    strengthLabel: '强',
  };

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    router.push(`/password/add?id=${id}`);
  };

  const handleCopy = (field: string) => {
    // 实现复制功能
  };

  const handleGenerate = () => {
    // 实现密码生成
  };

  const handleAutofill = () => {
    // 实现自动填充
  };

  const handleDelete = () => {
    // 实现删除功能
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <StatusBar barStyle="dark-content" />

      {/* Nav Bar */}
      <View style={[styles.navBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={20} color={colors.accentBlue} />
          <Text style={[styles.backText, { color: colors.accentBlue }]}>返回</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleEdit}>
          <Text style={[styles.editText, { color: colors.accentBlue }]}>编辑</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View
            style={[
              styles.heroIcon,
              { backgroundColor: passwordData.iconColor },
            ]}
          >
            <Ionicons name={passwordData.icon as any} size={28} color={colors.white} />
          </View>
          <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
            {passwordData.title}
          </Text>
          <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
            {passwordData.subtitle}
          </Text>
        </View>

        {/* Fields */}
        <View
          style={[
            styles.fieldsCard,
            { backgroundColor: colors.card },
          ]}
        >
          <TouchableOpacity
            style={styles.fieldItem}
            onPress={() => handleCopy('username')}
          >
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
              用户名
            </Text>
            <Text style={[styles.fieldValue, { color: colors.textPrimary }]}>
              {passwordData.username}
            </Text>
          </TouchableOpacity>

          <View style={[styles.fieldDivider, { backgroundColor: colors.border }]} />

          <TouchableOpacity
            style={styles.fieldItem}
            onPress={() => handleCopy('password')}
          >
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
              密码
            </Text>
            <Text style={[styles.fieldValue, { color: colors.textPrimary }]}>
              {passwordData.password}
            </Text>
          </TouchableOpacity>

          <View style={[styles.fieldDivider, { backgroundColor: colors.border }]} />

          <TouchableOpacity
            style={styles.fieldItem}
            onPress={() => handleCopy('url')}
          >
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
              网站
            </Text>
            <Text style={[styles.fieldValue, { color: colors.textPrimary }]}>
              {passwordData.url}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Strength Section */}
        <View style={styles.strengthSection}>
          <Text style={[styles.strengthLabel, { color: colors.textSecondary }]}>
            密码强度
          </Text>
          <View style={styles.strengthBar}>
            <View
              style={[
                styles.strengthProgress,
                {
                  width: `${passwordData.strength}%`,
                  backgroundColor:
                    passwordData.strength > 70
                      ? colors.accentGreen
                      : passwordData.strength > 40
                      ? colors.accentOrange
                      : colors.accentRed,
                },
              ]}
            />
          </View>
          <View style={styles.strengthInfo}>
            <Text style={[styles.strengthValue, { color: colors.textPrimary }]}>
              {passwordData.strengthLabel}
            </Text>
            <Text style={[styles.strengthPercent, { color: colors.textSecondary }]}>
              {passwordData.strength}%
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View
          style={[
            styles.actionsCard,
            { backgroundColor: colors.card },
          ]}
        >
          <SettingsRow
            label="生成新密码"
            icon="refresh"
            iconColor={colors.accentBlue}
            onPress={handleGenerate}
          />
          <View style={[styles.fieldDivider, { backgroundColor: colors.border }]} />
          <SettingsRow
            label="自动填充"
            icon="flash"
            iconColor={colors.accentGreen}
            onPress={handleAutofill}
          />
        </View>

        {/* Delete Button */}
        <TouchableOpacity
          style={[
            styles.deleteBtn,
            { backgroundColor: colors.card },
          ]}
          onPress={handleDelete}
        >
          <Text style={[styles.deleteText, { color: colors.accentRed }]}>
            删除密码
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: '#E5E5EA',
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
  },
  deleteText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
