/**
 * OhPass - 添加/编辑密码页面
 * 基于 Pencil 设计稿的添加编辑条目
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/components/design-system';
import { PrimaryButton, ToggleSwitch } from '@/components/ui';

export default function AddPasswordScreen() {
  const { colors, spacing } = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;

  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [url, setUrl] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const handleBack = () => {
    router.back();
  };

  const handleSave = () => {
    // 实现保存功能
    router.back();
  };

  const handleGenerate = () => {
    // 生成随机密码
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    let result = '';
    let allChars = chars;

    if (includeNumbers) allChars += numbers;
    if (includeSymbols) allChars += symbols;

    for (let i = 0; i < 20; i++) {
      result += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    setPassword(result);
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
          <Text style={[styles.backText, { color: colors.accentBlue }]}>取消</Text>
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: colors.textPrimary }]}>
          {isEditing ? '编辑密码' : '添加密码'}
        </Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={[styles.saveText, { color: colors.accentBlue }]}>保存</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>标题</Text>
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: colors.card,
                borderRadius: spacing.card.borderRadius,
              },
            ]}
          >
            <TextInput
              style={[styles.input, { color: colors.textPrimary }]}
              placeholder="例如: Google"
              placeholderTextColor={colors.textTertiary}
              value={title}
              onChangeText={setTitle}
            />
          </View>
        </View>

        {/* Username Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>用户名</Text>
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: colors.card,
                borderRadius: spacing.card.borderRadius,
              },
            ]}
          >
            <TextInput
              style={[styles.input, { color: colors.textPrimary }]}
              placeholder="用户名或邮箱"
              placeholderTextColor={colors.textTertiary}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* Password Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>密码</Text>
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: colors.card,
                borderRadius: spacing.card.borderRadius,
              },
            ]}
          >
            <TextInput
              style={[styles.input, { color: colors.textPrimary }]}
              placeholder="输入密码"
              placeholderTextColor={colors.textTertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeBtn}
            >
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Generate Password Options */}
        <View
          style={[
            styles.optionsCard,
            { backgroundColor: colors.card, borderRadius: spacing.card.borderRadius },
          ]}
        >
          <TouchableOpacity style={styles.optionRow} onPress={handleGenerate}>
            <View style={styles.optionInfo}>
              <Ionicons name="refresh" size={20} color={colors.accentBlue} />
              <Text style={[styles.optionText, { color: colors.textPrimary }]}>
                生成强密码
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.optionRow}>
            <View style={styles.optionInfo}>
              <Text style={[styles.optionText, { color: colors.textPrimary }]}>
                包含数字
              </Text>
            </View>
            <ToggleSwitch
              value={includeNumbers}
              onValueChange={setIncludeNumbers}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.optionRow}>
            <View style={styles.optionInfo}>
              <Text style={[styles.optionText, { color: colors.textPrimary }]}>
                包含符号
              </Text>
            </View>
            <ToggleSwitch
              value={includeSymbols}
              onValueChange={setIncludeSymbols}
            />
          </View>
        </View>

        {/* URL Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>网站 URL</Text>
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: colors.card,
                borderRadius: spacing.card.borderRadius,
              },
            ]}
          >
            <TextInput
              style={[styles.input, { color: colors.textPrimary }]}
              placeholder="https://example.com"
              placeholderTextColor={colors.textTertiary}
              value={url}
              onChangeText={setUrl}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
          </View>
        </View>

        {/* Save Button */}
        <PrimaryButton
          title={isEditing ? '保存更改' : '添加密码'}
          onPress={handleSave}
          style={styles.saveButton}
        />

        {/* Delete Button (only when editing) */}
        {isEditing && (
          <TouchableOpacity
            style={[
              styles.deleteButton,
              { backgroundColor: colors.card },
            ]}
          >
            <Text style={[styles.deleteText, { color: colors.accentRed }]}>
              删除密码
            </Text>
          </TouchableOpacity>
        )}
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
  navTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  eyeBtn: {
    padding: 4,
  },
  optionsCard: {
    marginBottom: 20,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  optionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionText: {
    fontSize: 15,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  saveButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  deleteButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
