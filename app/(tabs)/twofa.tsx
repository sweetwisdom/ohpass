/**
 * OhPass - 两步验证码页面
 * 基于 Pencil 设计稿的两步验证码
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
import { TwoFACard, SectionHeader } from '@/components/ui';

// 模拟数据
const mock2FAList = [
  { id: '1', serviceName: 'Google', code: '482039', icon: 'shield', iconColor: '#5856D6', timeRemaining: 21 },
  { id: '2', serviceName: 'Apple', code: '719254', icon: 'logo-apple', iconColor: '#000000', timeRemaining: 15 },
  { id: '3', serviceName: 'GitHub', code: '305817', icon: 'logo-github', iconColor: '#333333', timeRemaining: 28 },
  { id: '4', serviceName: 'Amazon', code: '642198', icon: 'cart', iconColor: '#FF9900', timeRemaining: 8 },
  { id: '5', serviceName: 'Microsoft', code: '953471', icon: 'desktop', iconColor: '#00A4EF', timeRemaining: 12 },
];

export default function TwoFAScreen() {
  const { colors, spacing } = useTheme();

  const handle2FAPress = (id: string) => {
    router.push(`/otp/${id}`);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>验证码</Text>
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
        {/* 2FA List */}
        <View style={styles.tfaList}>
          {mock2FAList.map((item) => (
            <TwoFACard
              key={item.id}
              serviceName={item.serviceName}
              code={item.code}
              icon={item.icon as any}
              iconColor={item.iconColor}
              timeRemaining={item.timeRemaining}
              onPress={() => handle2FAPress(item.id)}
              style={styles.tfaItem}
            />
          ))}
        </View>

        {/* Add Section */}
        <View style={styles.addSection}>
          <SectionHeader title="添加新服务" />
          <TouchableOpacity
            style={[
              styles.addButton,
              { backgroundColor: colors.card },
            ]}
          >
            <Ionicons name="add-circle-outline" size={24} color={colors.accentBlue} />
            <Text style={[styles.addButtonText, { color: colors.textPrimary }]}>
              扫描二维码
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.addButton,
              { backgroundColor: colors.card },
            ]}
          >
            <Ionicons name="key-outline" size={24} color={colors.accentBlue} />
            <Text style={[styles.addButtonText, { color: colors.textPrimary }]}>
              手动输入密钥
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
  tfaList: {
    gap: 8,
    marginBottom: 24,
  },
  tfaItem: {
    marginBottom: 0,
  },
  addSection: {
    gap: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
