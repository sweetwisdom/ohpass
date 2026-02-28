/**
 * OhPass - OTP 验证码详情页
 * 展示单个 TOTP 验证码，支持复制和删除
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
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
import { useData } from '@/contexts/DataContext';
import { generateTOTP, getRemainingSeconds, formatOTP } from '@/utils/totp';
import type { TotpAccount } from '@/services/database';

export default function OTPDetailScreen() {
  const { colors, isDark } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { totpAccounts, removeTotpAccount } = useData();
  const [account, setAccount] = useState<TotpAccount | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const found = totpAccounts.find(a => a.id === id);
    setAccount(found ?? null);
  }, [id, totpAccounts]);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!account) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.centered}>
          <Text style={{ color: colors.textSecondary }}>验证码不存在</Text>
          <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
            <Text style={{ color: colors.accentBlue }}>返回</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const code = generateTOTP({
    secret: account.secret,
    digits: account.digits,
    period: account.period,
  });
  const remaining = getRemainingSeconds(account.period);
  const isUrgent = remaining <= 5;
  const progress = remaining / account.period;

  const handleCopy = async () => {
    await Clipboard.setStringAsync(code);
    Alert.alert('已复制', '验证码已复制到剪贴板');
  };

  const handleDelete = () => {
    Alert.alert(
      '删除验证码',
      `确定要删除 "${account.service_name}" 的两步验证吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            await removeTotpAccount(account.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Nav */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={20} color={colors.accentBlue} />
          <Text style={[styles.backText, { color: colors.accentBlue }]}>返回</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color={colors.accentRed} />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <View style={[styles.iconCircle, { backgroundColor: account.icon_color }]}>
          <Ionicons name="shield-checkmark" size={32} color="#FFFFFF" />
        </View>
        <Text style={[styles.serviceName, { color: colors.textPrimary }]}>
          {account.service_name}
        </Text>
        {account.issuer ? (
          <Text style={[styles.issuer, { color: colors.textTertiary }]}>{account.issuer}</Text>
        ) : null}

        <TouchableOpacity onPress={handleCopy} style={styles.codeContainer}>
          <Text style={[styles.codeText, { color: colors.primary }]}>
            {formatOTP(code)}
          </Text>
        </TouchableOpacity>

        <View style={styles.timerContainer}>
          <View style={[styles.timerBarBg, { backgroundColor: colors.bgTertiary }]}>
            <View
              style={[
                styles.timerBarFill,
                {
                  width: `${progress * 100}%` as any,
                  backgroundColor: isUrgent ? colors.accentRed : colors.primary,
                },
              ]}
            />
          </View>
          <Text style={[styles.timerText, { color: isUrgent ? colors.accentRed : colors.textSecondary }]}>
            {remaining} 秒后刷新
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.copyBtn, { backgroundColor: colors.primary }]}
          onPress={handleCopy}
          activeOpacity={0.8}
        >
          <Ionicons name="copy-outline" size={20} color="#FFFFFF" />
          <Text style={styles.copyBtnText}>复制验证码</Text>
        </TouchableOpacity>

        <Text style={[styles.hint, { color: colors.textTertiary }]}>
          点击验证码或按钮即可复制
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
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
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backText: {
    fontSize: 16,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  serviceName: {
    fontSize: 24,
    fontWeight: '700',
  },
  issuer: {
    fontSize: 14,
    marginTop: 4,
  },
  codeContainer: {
    marginTop: 40,
    marginBottom: 24,
  },
  codeText: {
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: 8,
  },
  timerContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 8,
    marginBottom: 40,
  },
  timerBarBg: {
    width: '60%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  timerBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  timerText: {
    fontSize: 14,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 32,
    gap: 8,
  },
  copyBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  hint: {
    fontSize: 13,
    marginTop: 16,
  },
});
