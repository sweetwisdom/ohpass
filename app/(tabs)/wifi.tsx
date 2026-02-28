/**
 * OhPass - Wi-Fi 管理页面
 * 基于 Pencil 设计稿的 Wi-Fi 管理
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
import { SectionHeader, SettingsRow, PrimaryButton } from '@/components/ui';

// 模拟数据
const mockWifiList = [
  { id: '1', name: 'Home-WiFi', isConnected: true },
  { id: '2', name: 'Office-5G', isConnected: false },
  { id: '3', name: 'CoffeeShop', isConnected: false },
  { id: '4', name: 'Guest-Network', isConnected: false },
];

export default function WifiScreen() {
  const { colors, spacing } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Wi-Fi</Text>
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
        {/* Current Connection */}
        <View
          style={[
            styles.currentConnection,
            { backgroundColor: colors.card },
          ]}
        >
          <View style={styles.wifiIconContainer}>
            <Ionicons name="wifi" size={32} color={colors.accentGreen} />
          </View>
          <View style={styles.connectionInfo}>
            <Text style={[styles.connectionName, { color: colors.textPrimary }]}>
              Home-WiFi
            </Text>
            <Text style={[styles.connectionStatus, { color: colors.accentGreen }]}>
              已连接
            </Text>
          </View>
          <TouchableOpacity style={styles.disconnectBtn}>
            <Text style={[styles.disconnectText, { color: colors.accentRed }]}>
              断开
            </Text>
          </TouchableOpacity>
        </View>

        {/* Wi-Fi List */}
        <SectionHeader title="可用网络" style={styles.sectionHeader} />

        <View style={styles.wifiList}>
          {mockWifiList.map((wifi) => (
            <SettingsRow
              key={wifi.id}
              label={wifi.name}
              icon={wifi.isConnected ? 'wifi' : 'wifi-outline'}
              iconColor={wifi.isConnected ? colors.accentGreen : colors.textSecondary}
              onPress={() => {}}
              style={styles.wifiItem}
            />
          ))}
        </View>

        {/* Add Wi-Fi Button */}
        <PrimaryButton
          title="添加 Wi-Fi 网络"
          icon="add"
          onPress={() => {}}
          variant="secondary"
          style={styles.addButton}
        />

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Ionicons name="information-circle-outline" size={20} color={colors.textSecondary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Wi-Fi 密码会安全存储在您的密码库中
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
  currentConnection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  wifiIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#34C75920',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  connectionInfo: {
    flex: 1,
  },
  connectionName: {
    fontSize: 16,
    fontWeight: '600',
  },
  connectionStatus: {
    fontSize: 13,
    marginTop: 2,
  },
  disconnectBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  disconnectText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sectionHeader: {
    marginBottom: 12,
  },
  wifiList: {
    gap: 8,
    marginBottom: 24,
  },
  wifiItem: {
    marginBottom: 0,
  },
  addButton: {
    marginBottom: 24,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
  },
});
