/**
 * OhPass - 验证码输入页面
 * 基于 Pencil 设计稿的迷你可验证条
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/components/design-system';

export default function OTPScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [code, setCode] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(30);

  // 模拟数据
  const serviceData = {
    name: 'Google',
    icon: 'shield',
    iconColor: '#5856D6',
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 30));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCodeChange = (text: string) => {
    // 只允许数字
    const numericCode = text.replace(/[^0-9]/g, '');
    if (numericCode.length <= 6) {
      setCode(numericCode);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleCopy = () => {
    if (code.length === 6) {
      // 复制到剪贴板
    }
  };

  const progress = timeRemaining / 30;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={20} color={colors.accentBlue} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Service Info */}
        <View style={styles.serviceInfo}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: serviceData.iconColor },
            ]}
          >
            <Ionicons name={serviceData.icon as any} size={24} color={colors.white} />
          </View>
          <Text style={[styles.serviceName, { color: colors.textPrimary }]}>
            {serviceData.name}
          </Text>
        </View>

        {/* Code Input */}
        <View style={styles.codeContainer}>
          <TextInput
            style={[styles.codeInput, { color: colors.textPrimary }]}
            value={code}
            onChangeText={handleCodeChange}
            keyboardType="number-pad"
            maxLength={6}
            placeholder="000000"
            placeholderTextColor={colors.textTertiary}
            autoFocus
          />
        </View>

        {/* Timer */}
        <View style={styles.timerContainer}>
          <View
            style={[
              styles.timerRing,
              {
                width: 60,
                height: 60,
                borderRadius: 30,
                borderWidth: 3,
                borderColor: colors.accentBlue,
              },
            ]}
          >
            <View
              style={[
                styles.timerProgress,
                {
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  borderWidth: 3,
                  borderColor: colors.accentBlue,
                  borderTopColor: 'transparent',
                  borderRightColor: progress > 0.5 ? colors.accentBlue : 'transparent',
                  borderBottomColor: progress > 0.25 ? colors.accentBlue : 'transparent',
                  borderLeftColor: progress > 0.75 ? colors.accentBlue : 'transparent',
                  transform: [{ rotate: `${progress * 360}deg` }],
                },
              ]}
            />
          </View>
          <Text style={[styles.timerText, { color: colors.textSecondary }]}>
            {timeRemaining}秒后刷新
          </Text>
        </View>

        {/* Copy Button */}
        <TouchableOpacity
          style={[
            styles.copyBtn,
            {
              backgroundColor: code.length === 6 ? colors.accentBlue : colors.muted,
            },
          ]}
          onPress={handleCopy}
          disabled={code.length !== 6}
        >
          <Ionicons name="copy" size={18} color={colors.white} />
          <Text style={[styles.copyText, { color: colors.white }]}>
            复制验证码
          </Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backBtn: {
    padding: 4,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  serviceInfo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: '600',
  },
  codeContainer: {
    marginBottom: 32,
  },
  codeInput: {
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: 8,
    textAlign: 'center',
    minWidth: 200,
    fontFamily: 'monospace',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timerRing: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  timerProgress: {
    position: 'absolute',
  },
  timerText: {
    fontSize: 14,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  copyText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
