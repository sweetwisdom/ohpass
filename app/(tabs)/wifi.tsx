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
import { SearchBar } from '@/components/ui';

const mockWifiList = [
  {
    id: '1',
    name: 'Home Network',
    status: '已连接 · WPA3',
    iconBgColor: '#007AFF',
    showQR: true,
    showShare: true,
  },
  {
    id: '2',
    name: 'Office-5G',
    status: '已保存 · WPA2',
    iconBgColor: '#34C759',
    showQR: true,
    showShare: false,
  },
  {
    id: '3',
    name: 'Cafe_FreeWifi',
    status: '已保存 · 开放',
    iconBgColor: '#FF9500',
    showQR: false,
    showShare: false,
  },
];

export default function WifiScreen() {
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Title */}
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Wi-Fi</Text>

        {/* Search Bar */}
        <SearchBar placeholder="搜索 Wi-Fi" />

        {/* Wi-Fi List - Grouped Card */}
        <View style={[styles.wifiListCard, { borderRadius: 12 }]}>
          {mockWifiList.map((wifi, index) => (
            <TouchableOpacity
              key={wifi.id}
              style={[
                styles.wifiRow,
                { backgroundColor: colors.card },
                index < mockWifiList.length - 1 && styles.wifiRowGap,
              ]}
              activeOpacity={0.7}
            >
              {/* Icon */}
              <View
                style={[
                  styles.wifiIcon,
                  { backgroundColor: wifi.iconBgColor },
                ]}
              >
                <Ionicons name="wifi" size={20} color="#FFFFFF" />
              </View>

              {/* Info */}
              <View style={styles.wifiInfo}>
                <Text style={[styles.wifiName, { color: colors.textPrimary }]}>
                  {wifi.name}
                </Text>
                <Text style={[styles.wifiStatus, { color: colors.textSecondary }]}>
                  {wifi.status}
                </Text>
              </View>

              {/* Actions */}
              <View style={styles.wifiActions}>
                {wifi.showQR && (
                  <Ionicons name="qr-code-outline" size={18} color={colors.accentBlue} />
                )}
                {wifi.showShare && (
                  <Ionicons name="share-outline" size={18} color={colors.accentBlue} />
                )}
                <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Share Wi-Fi Section */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          分享 Wi-Fi
        </Text>

        <View style={[styles.qrCard, { backgroundColor: colors.card }]}>
          {/* QR Code Area */}
          <View style={styles.qrFrame}>
            <Ionicons name="qr-code" size={120} color="#000000" />
          </View>

          <Text style={[styles.qrName, { color: colors.textPrimary }]}>
            Home Network
          </Text>

          <Text style={[styles.qrDesc, { color: colors.textSecondary }]}>
            扫描二维码即可连接此 Wi-Fi 网络
          </Text>

          {/* Share Button */}
          <TouchableOpacity
            style={[styles.shareBtn, { backgroundColor: colors.accentBlue }]}
            activeOpacity={0.8}
          >
            <Ionicons name="share-outline" size={16} color="#FFFFFF" />
            <Text style={styles.shareBtnText}>分享</Text>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 20,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
    paddingTop: 8,
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
    width: 160,
    height: 160,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrName: {
    fontSize: 18,
    fontWeight: '600',
  },
  qrDesc: {
    fontSize: 13,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 24,
    gap: 8,
  },
  shareBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
