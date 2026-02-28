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
import { SectionHeader, SettingsRow, ToggleSwitch, PrimaryButton } from '@/components/ui';

interface PasskeyItem {
  id: string;
  name: string;
  type: 'face' | 'touch' | 'security-key';
  lastUsed: string;
}

const mockPasskeys: PasskeyItem[] = [
  { id: '1', name: 'Face ID', type: 'face', lastUsed: '2024-01-15' },
  { id: '2', name: 'Touch ID', type: 'touch', lastUsed: '2024-01-14' },
  { id: '3', name: 'YubiKey', type: 'security-key', lastUsed: '2024-01-10' },
];

export default function PasskeyScreen() {
  const { colors } = useTheme();

  const handleBack = () => {
    router.back();
  };

  const getPasskeyIcon = (type: PasskeyItem['type']) => {
    switch (type) {
      case 'face':
        return 'scan';
      case 'touch':
        return 'finger-print';
      case 'security-key':
        return 'key';
      default:
        return 'key';
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={20} color={colors.accentBlue} />
          <Text style={[styles.backText, { color: colors.accentBlue }]}>返回</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>通行密钥</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View
          style={[
            styles.heroCard,
            { backgroundColor: colors.card },
          ]}
        >
          <View style={styles.heroIconContainer}>
            <Ionicons name="finger-print" size={48} color={colors.accentPurple} />
          </View>
          <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
            使用通行密钥登录
          </Text>
          <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
            通行密钥比传统密码更安全、更便捷
          </Text>
        </View>

        {/* Passkey List */}
        <SectionHeader title="已添加的通行密钥" style={styles.sectionHeader} />

        <View style={styles.passkeyList}>
          {mockPasskeys.map((passkey) => (
            <SettingsRow
              key={passkey.id}
              label={passkey.name}
              icon={getPasskeyIcon(passkey.type)}
              iconColor={colors.accentPurple}
              onPress={() => {}}
              rightElement={
                <Text style={{ color: colors.textTertiary, fontSize: 12 }}>
                  {passkey.lastUsed}
                </Text>
              }
              style={styles.passkeyItem}
            />
          ))}
        </View>

        {/* Add Passkey */}
        <PrimaryButton
          title="添加通行密钥"
          icon="add"
          onPress={() => {}}
          style={styles.addButton}
        />

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Ionicons name="shield-checkmark" size={20} color={colors.accentGreen} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              更安全 - 无需记住复杂密码
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="flash" size={20} color={colors.accentBlue} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              更快速 - 一步登录
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="globe" size={20} color={colors.accentOrange} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              跨设备 - 同步您的通行密钥
            </Text>
          </View>
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
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  heroCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  heroIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#5856D620',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  sectionHeader: {
    marginBottom: 12,
  },
  passkeyList: {
    gap: 8,
    marginBottom: 24,
  },
  passkeyItem: {
    marginBottom: 0,
  },
  addButton: {
    marginBottom: 32,
  },
  infoSection: {
    gap: 16,
    padding: 16,
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
  },
});
