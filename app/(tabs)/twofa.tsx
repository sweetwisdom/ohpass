/**
 * OhPass - 两步验证码页面
 * 接入真实 TOTP 数据，实时生成验证码
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '@/components/design-system';
import { SectionHeader } from '@/components/ui';
import { useData } from '@/contexts/DataContext';
import { generateTOTP, getRemainingSeconds, formatOTP, isValidBase32 } from '@/utils/totp';
import { getCategoryColor } from '@/utils/password';

export default function TwoFAScreen() {
  const { colors, isDark } = useTheme();
  const { totpAccounts, addTotpAccount, removeTotpAccount } = useData();
  const [tick, setTick] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newService, setNewService] = useState('');
  const [newSecret, setNewSecret] = useState('');

  // 每秒刷新以更新验证码和倒计时
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = useCallback(async (code: string, name: string) => {
    await Clipboard.setStringAsync(code);
    Alert.alert('已复制', `${name} 的验证码已复制到剪贴板`);
  }, []);

  const handleDelete = useCallback((id: string, name: string) => {
    Alert.alert(
      '删除验证码',
      `确定要删除 "${name}" 的两步验证吗？删除后将无法恢复。`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => removeTotpAccount(id),
        },
      ]
    );
  }, [removeTotpAccount]);

  const handleAddManual = async () => {
    if (!newService.trim()) {
      Alert.alert('提示', '请输入服务名称');
      return;
    }
    if (!isValidBase32(newSecret)) {
      Alert.alert('提示', '密钥格式无效，请输入有效的 Base32 密钥（至少 16 个字符，只含 A-Z 和 2-7）');
      return;
    }

    await addTotpAccount({
      service_name: newService.trim(),
      secret: newSecret.toUpperCase().replace(/\s/g, ''),
      issuer: '',
      digits: 6,
      period: 30,
      algorithm: 'SHA1',
      icon_color: getCategoryColor(newService),
    });

    setNewService('');
    setNewSecret('');
    setShowAddModal(false);
  };

  const remaining = getRemainingSeconds(30);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>验证码</Text>
        <TouchableOpacity
          style={[styles.headerBtn, { backgroundColor: colors.bgTertiary }]}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {totpAccounts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="shield-outline" size={64} color={colors.textTertiary} />
            <Text style={[styles.emptyTitle, { color: colors.textSecondary }]}>
              还没有两步验证账户
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textTertiary }]}>
              点击右上角 + 手动添加验证密钥
            </Text>
          </View>
        ) : (
          <View style={styles.tfaList}>
            {totpAccounts.map((account) => {
              const code = generateTOTP({ secret: account.secret, digits: account.digits, period: account.period });
              return (
                <TouchableOpacity
                  key={account.id}
                  style={[styles.tfaCard, { backgroundColor: colors.card }]}
                  onPress={() => handleCopy(code, account.service_name)}
                  onLongPress={() => handleDelete(account.id, account.service_name)}
                  activeOpacity={0.7}
                >
                  <View style={styles.tfaCardLeft}>
                    <View style={[styles.tfaIcon, { backgroundColor: account.icon_color }]}>
                      <Ionicons name="shield-checkmark" size={20} color="#FFFFFF" />
                    </View>
                    <View style={styles.tfaInfo}>
                      <Text style={[styles.tfaService, { color: colors.textPrimary }]}>
                        {account.service_name}
                      </Text>
                      {account.issuer ? (
                        <Text style={[styles.tfaIssuer, { color: colors.textTertiary }]}>
                          {account.issuer}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                  <View style={styles.tfaCardRight}>
                    <Text style={[styles.tfaCode, { color: colors.primary }]}>
                      {formatOTP(code)}
                    </Text>
                    <View style={styles.tfaTimer}>
                      <Ionicons
                        name="time-outline"
                        size={14}
                        color={remaining <= 5 ? colors.accentRed : colors.textTertiary}
                      />
                      <Text style={[
                        styles.tfaTimerText,
                        { color: remaining <= 5 ? colors.accentRed : colors.textTertiary },
                      ]}>
                        {remaining}s
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Add Section */}
        <View style={styles.addSection}>
          <SectionHeader title="添加新服务" />
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.card }]}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="key-outline" size={24} color={colors.accentBlue} />
            <Text style={[styles.addButtonText, { color: colors.textPrimary }]}>
              手动输入密钥
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Add Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Text style={[styles.modalCancel, { color: colors.accentBlue }]}>取消</Text>
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>添加验证码</Text>
              <TouchableOpacity onPress={handleAddManual}>
                <Text style={[styles.modalSave, { color: colors.accentBlue }]}>保存</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              <View style={[styles.modalField, { backgroundColor: colors.card }]}>
                <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>服务名称</Text>
                <TextInput
                  style={[styles.modalInput, { color: colors.textPrimary }]}
                  placeholder="如：Google"
                  placeholderTextColor={colors.textTertiary}
                  value={newService}
                  onChangeText={setNewService}
                />
              </View>
              <View style={[styles.modalField, { backgroundColor: colors.card }]}>
                <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>密钥 (Secret Key)</Text>
                <TextInput
                  style={[styles.modalInput, { color: colors.textPrimary }]}
                  placeholder="如：JBSWY3DPEHPK3PXP"
                  placeholderTextColor={colors.textTertiary}
                  value={newSecret}
                  onChangeText={setNewSecret}
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
              </View>
              <Text style={[styles.modalHint, { color: colors.textTertiary }]}>
                在启用两步验证时，服务商会提供一个 Base32 格式的密钥。将密钥粘贴到上方即可。
              </Text>
            </View>
          </View>
        </View>
      </Modal>
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  tfaList: {
    gap: 8,
    marginBottom: 24,
  },
  tfaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
  },
  tfaCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  tfaIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tfaInfo: {
    flex: 1,
  },
  tfaService: {
    fontSize: 16,
    fontWeight: '600',
  },
  tfaIssuer: {
    fontSize: 12,
    marginTop: 2,
  },
  tfaCardRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  tfaCode: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 2,
  },
  tfaTimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tfaTimerText: {
    fontSize: 12,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalCancel: {
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  modalSave: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalForm: {
    paddingHorizontal: 20,
    gap: 12,
  },
  modalField: {
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  modalLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  modalInput: {
    fontSize: 16,
    padding: 0,
  },
  modalHint: {
    fontSize: 13,
    lineHeight: 18,
  },
});
