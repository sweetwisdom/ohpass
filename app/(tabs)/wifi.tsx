/**
 * OhPass - Wi-Fi 管理页面
 * 接入真实数据，支持增删改查、复制密码、QR 码分享
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
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '@/components/design-system';
import { SearchBar, PrimaryButton } from '@/components/ui';
import { QRCodeView, buildWifiQRString } from '@/components/ui/QRCodeView';
import { useData } from '@/contexts/DataContext';
import { getCategoryColor } from '@/utils/password';
import type { WifiNetwork } from '@/services/database';

const SECURITY_TYPES = ['WPA2', 'WPA3', 'WEP', '开放'];

export default function WifiScreen() {
  const { colors, isDark } = useTheme();
  const { wifiNetworks, addWifiNetwork, removeWifiNetwork } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSsid, setNewSsid] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newSecurity, setNewSecurity] = useState(0);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [qrWifi, setQrWifi] = useState<WifiNetwork | null>(null);

  const filtered = searchQuery
    ? wifiNetworks.filter(w => w.ssid.toLowerCase().includes(searchQuery.toLowerCase()))
    : wifiNetworks;

  const handleCopyPassword = async (password: string, ssid: string) => {
    await Clipboard.setStringAsync(password);
    Alert.alert('已复制', `${ssid} 的密码已复制到剪贴板`);
  };

  const handleDelete = (id: string, ssid: string) => {
    Alert.alert(
      '删除 Wi-Fi',
      `确定要删除 "${ssid}" 吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => {
            removeWifiNetwork(id);
            if (qrWifi?.id === id) setQrWifi(null);
          },
        },
      ]
    );
  };

  const toggleShowPassword = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShowQR = (wifi: WifiNetwork) => {
    setQrWifi(qrWifi?.id === wifi.id ? null : wifi);
  };

  const handleAdd = async () => {
    if (!newSsid.trim()) {
      Alert.alert('提示', '请输入 Wi-Fi 名称');
      return;
    }
    if (!newPassword.trim() && SECURITY_TYPES[newSecurity] !== '开放') {
      Alert.alert('提示', '请输入密码');
      return;
    }

    await addWifiNetwork({
      ssid: newSsid.trim(),
      password: newPassword,
      security_type: SECURITY_TYPES[newSecurity],
      is_hidden: 0,
      notes: '',
    });

    setNewSsid('');
    setNewPassword('');
    setNewSecurity(0);
    setShowAddModal(false);
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
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Wi-Fi</Text>
          <TouchableOpacity
            style={[styles.headerBtn, { backgroundColor: colors.bgTertiary }]}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="add" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <SearchBar
          placeholder="搜索 Wi-Fi"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Wi-Fi List */}
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="wifi-outline" size={64} color={colors.textTertiary} />
            <Text style={[styles.emptyTitle, { color: colors.textSecondary }]}>
              {searchQuery ? '没有找到匹配的 Wi-Fi' : '还没有保存任何 Wi-Fi'}
            </Text>
          </View>
        ) : (
          <View style={[styles.wifiListCard, { borderRadius: 12 }]}>
            {filtered.map((wifi, index) => (
              <TouchableOpacity
                key={wifi.id}
                style={[
                  styles.wifiRow,
                  { backgroundColor: colors.card },
                  index < filtered.length - 1 && styles.wifiRowGap,
                ]}
                onPress={() => handleShowQR(wifi)}
                onLongPress={() => handleDelete(wifi.id, wifi.ssid)}
                activeOpacity={0.7}
              >
                <View style={[styles.wifiIcon, { backgroundColor: getCategoryColor(wifi.ssid) }]}>
                  <Ionicons name="wifi" size={20} color="#FFFFFF" />
                </View>

                <View style={styles.wifiInfo}>
                  <Text style={[styles.wifiName, { color: colors.textPrimary }]}>
                    {wifi.ssid}
                  </Text>
                  <Text style={[styles.wifiStatus, { color: colors.textSecondary }]}>
                    {wifi.security_type} · {showPasswords[wifi.id] ? wifi.password : '••••••••'}
                  </Text>
                </View>

                <View style={styles.wifiActions}>
                  <TouchableOpacity onPress={() => toggleShowPassword(wifi.id)}>
                    <Ionicons
                      name={showPasswords[wifi.id] ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color={colors.accentBlue}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleShowQR(wifi)}>
                    <Ionicons name="qr-code-outline" size={18} color={colors.accentBlue} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleCopyPassword(wifi.password, wifi.ssid)}>
                    <Ionicons name="copy-outline" size={18} color={colors.accentBlue} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* QR Code Share Card */}
        {qrWifi && (
          <>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
              分享 Wi-Fi
            </Text>

            <View style={[styles.qrCard, { backgroundColor: colors.card }]}>
              {/* QR Code */}
              <View style={styles.qrFrame}>
                <QRCodeView
                  value={buildWifiQRString(qrWifi.ssid, qrWifi.password, qrWifi.security_type)}
                  size={180}
                  color={isDark ? '#FFFFFF' : '#000000'}
                  backgroundColor={isDark ? '#1C1C1E' : '#FFFFFF'}
                />
              </View>

              <Text style={[styles.qrName, { color: colors.textPrimary }]}>
                {qrWifi.ssid}
              </Text>

              <Text style={[styles.qrDesc, { color: colors.textSecondary }]}>
                扫描二维码即可连接此 Wi-Fi 网络
              </Text>

              {/* Action Buttons */}
              <View style={styles.qrActions}>
                <TouchableOpacity
                  style={[styles.qrActionBtn, { backgroundColor: colors.accentBlue }]}
                  onPress={() => handleCopyPassword(qrWifi.password, qrWifi.ssid)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="copy-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.qrActionText}>复制密码</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.qrActionBtn, { backgroundColor: colors.bgTertiary }]}
                  onPress={() => setQrWifi(null)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="close" size={16} color={colors.textPrimary} />
                  <Text style={[styles.qrActionText, { color: colors.textPrimary }]}>关闭</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        <PrimaryButton
          title="添加 Wi-Fi"
          icon="add"
          onPress={() => setShowAddModal(true)}
          style={styles.addBtn}
        />
      </ScrollView>

      {/* Add Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Text style={[styles.modalCancel, { color: colors.accentBlue }]}>取消</Text>
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>添加 Wi-Fi</Text>
              <TouchableOpacity onPress={handleAdd}>
                <Text style={[styles.modalSave, { color: colors.accentBlue }]}>保存</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              <View style={[styles.modalField, { backgroundColor: colors.card }]}>
                <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>Wi-Fi 名称 (SSID)</Text>
                <TextInput
                  style={[styles.modalInput, { color: colors.textPrimary }]}
                  placeholder="如：Home Network"
                  placeholderTextColor={colors.textTertiary}
                  value={newSsid}
                  onChangeText={setNewSsid}
                />
              </View>
              <View style={[styles.modalField, { backgroundColor: colors.card }]}>
                <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>密码</Text>
                <TextInput
                  style={[styles.modalInput, { color: colors.textPrimary }]}
                  placeholder="Wi-Fi 密码"
                  placeholderTextColor={colors.textTertiary}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.securityRow}>
                <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>加密方式</Text>
                <View style={styles.securityChips}>
                  {SECURITY_TYPES.map((type, index) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.securityChip,
                        {
                          backgroundColor: newSecurity === index ? colors.accentBlue : colors.card,
                        },
                      ]}
                      onPress={() => setNewSecurity(index)}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: '500',
                          color: newSecurity === index ? '#FFFFFF' : colors.textPrimary,
                        }}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
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
  wifiListCard: {
    overflow: 'hidden',
    gap: 2,
  },
  wifiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    paddingHorizontal: 16,
    gap: 12,
  },
  wifiRowGap: {},
  wifiIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wifiInfo: {
    flex: 1,
    gap: 2,
  },
  wifiName: {
    fontSize: 16,
    fontWeight: '500',
  },
  wifiStatus: {
    fontSize: 13,
  },
  wifiActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  qrCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  qrFrame: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  qrName: {
    fontSize: 18,
    fontWeight: '600',
  },
  qrDesc: {
    fontSize: 13,
  },
  qrActions: {
    flexDirection: 'row',
    gap: 12,
  },
  qrActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 20,
    gap: 8,
  },
  qrActionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  addBtn: {
    marginTop: 8,
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
  securityRow: {
    gap: 8,
  },
  securityChips: {
    flexDirection: 'row',
    gap: 8,
  },
  securityChip: {
    height: 32,
    paddingHorizontal: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
