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

const TAG_OPTIONS = ['网站', 'App', 'Wi-Fi', '其他'];

const GEN_OPTIONS = [
  { label: 'A-Z', key: 'upper' },
  { label: 'a-z', key: 'lower' },
  { label: '0-9', key: 'digits' },
  { label: '#@$', key: 'symbols' },
];

export default function AddPasswordScreen() {
  const { colors, isDark } = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;

  const [serviceName, setServiceName] = useState('');
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [note, setNote] = useState('');
  const [selectedTag, setSelectedTag] = useState(0);
  const [genOptions, setGenOptions] = useState<Record<string, boolean>>({
    upper: true,
    lower: true,
    digits: true,
    symbols: true,
  });
  const [generatedPassword, setGeneratedPassword] = useState('kX9#mP2$vL7@nQ');

  const handleGenerate = () => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const symbols = '!@#$%^&*()_+-=';
    let chars = '';
    if (genOptions.upper) chars += upper;
    if (genOptions.lower) chars += lower;
    if (genOptions.digits) chars += digits;
    if (genOptions.symbols) chars += symbols;
    if (!chars) chars = upper + lower;
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(result);
  };

  const toggleGenOption = (key: string) => {
    setGenOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Nav Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.navCancel, { color: colors.accentBlue }]}>取消</Text>
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: colors.textPrimary }]}>
          {isEditing ? '编辑密码' : '添加密码'}
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.navSave, { color: colors.accentBlue }]}>保存</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Icon Picker */}
        <View style={styles.iconPickerCenter}>
          <View
            style={[
              styles.iconPicker,
              {
                backgroundColor: colors.bgTertiary,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons name="image-outline" size={28} color={colors.textTertiary} />
          </View>
        </View>

        {/* Form Group */}
        <View style={[styles.formGroup, { borderRadius: 12 }]}>
          {/* 服务名称 */}
          <View style={[styles.formRow, { backgroundColor: colors.card }]}>
            <Text style={[styles.formLabel, { color: colors.textSecondary }]}>服务名称</Text>
            <TextInput
              style={[styles.formInput, { color: colors.textPrimary }]}
              placeholder="Google"
              placeholderTextColor={colors.textTertiary}
              value={serviceName}
              onChangeText={setServiceName}
            />
          </View>

          {/* 地址 */}
          <View style={[styles.formRow, { backgroundColor: colors.card }]}>
            <Text style={[styles.formLabel, { color: colors.textSecondary }]}>地址</Text>
            <TextInput
              style={[styles.formInput, { color: colors.textPrimary }]}
              placeholder="google.com"
              placeholderTextColor={colors.textTertiary}
              value={url}
              onChangeText={setUrl}
              autoCapitalize="none"
            />
          </View>

          {/* 用户名 */}
          <View style={[styles.formRow, { backgroundColor: colors.card }]}>
            <Text style={[styles.formLabel, { color: colors.textSecondary }]}>用户名</Text>
            <TextInput
              style={[styles.formInput, { color: colors.textPrimary }]}
              placeholder="user@gmail.com"
              placeholderTextColor={colors.textTertiary}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          {/* 密码 */}
          <View style={[styles.formRow, { backgroundColor: colors.card }]}>
            <Text style={[styles.formLabel, { color: colors.textSecondary }]}>密码</Text>
            <TextInput
              style={[styles.formInput, { color: colors.textPrimary }]}
              placeholder="••••••••••••••"
              placeholderTextColor={colors.textTertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            <Ionicons name="sparkles" size={18} color={colors.accentBlue} />
          </View>

          {/* 备注 */}
          <View style={[styles.formRowNote, { backgroundColor: colors.card }]}>
            <Text style={[styles.formLabel, { color: colors.textSecondary }]}>备注</Text>
            <TextInput
              style={[styles.formInput, { color: colors.textPrimary }]}
              placeholder="个人账户，包含 Google 全套服务"
              placeholderTextColor={colors.textTertiary}
              value={note}
              onChangeText={setNote}
              multiline
            />
          </View>
        </View>

        {/* 分类标签 */}
        <View style={styles.tagSection}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
            分类标签
          </Text>
          <View style={styles.tagRow}>
            {TAG_OPTIONS.map((tag, index) => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.tagChip,
                  selectedTag === index
                    ? { backgroundColor: colors.accentBlue }
                    : { backgroundColor: colors.card },
                ]}
                onPress={() => setSelectedTag(index)}
              >
                <Text
                  style={[
                    styles.tagText,
                    { color: selectedTag === index ? '#FFFFFF' : colors.textPrimary },
                  ]}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 密码生成器 */}
        <View style={styles.genSection}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
            密码生成器
          </Text>
          <View style={[styles.genCard, { backgroundColor: colors.card }]}>
            {/* Generated password */}
            <Text style={[styles.genPassword, { color: colors.accentBlue }]}>
              {generatedPassword}
            </Text>

            {/* Length */}
            <View style={styles.genLenRow}>
              <Text style={[styles.genLenLabel, { color: colors.textSecondary }]}>长度</Text>
              <Text style={[styles.genLenValue, { color: colors.textPrimary }]}>16 位</Text>
            </View>

            {/* Slider (visual) */}
            <View style={[styles.genSliderBg, { backgroundColor: colors.bgTertiary }]}>
              <View style={[styles.genSliderFill, { backgroundColor: colors.accentBlue }]} />
            </View>

            {/* Options */}
            <View style={styles.genOptsRow}>
              {GEN_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.key}
                  style={[
                    styles.genOptChip,
                    {
                      backgroundColor: genOptions[opt.key]
                        ? colors.accentBlue
                        : colors.bgTertiary,
                    },
                  ]}
                  onPress={() => toggleGenOption(opt.key)}
                >
                  <Text
                    style={[
                      styles.genOptText,
                      {
                        color: genOptions[opt.key] ? '#FFFFFF' : colors.textSecondary,
                      },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Regenerate button */}
            <TouchableOpacity
              style={[styles.genRefreshBtn, { backgroundColor: colors.accentBlue }]}
              onPress={handleGenerate}
              activeOpacity={0.8}
            >
              <Ionicons name="refresh" size={16} color="#FFFFFF" />
              <Text style={styles.genRefreshText}>重新生成</Text>
            </TouchableOpacity>
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
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 44,
  },
  navCancel: {
    fontSize: 16,
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  navSave: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 24,
  },
  iconPickerCenter: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconPicker: {
    width: 72,
    height: 72,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  formGroup: {
    overflow: 'hidden',
    gap: 2,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 16,
    gap: 12,
  },
  formRowNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: 80,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  formLabel: {
    fontSize: 14,
    width: 80,
  },
  formInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  tagSection: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tagChip: {
    height: 32,
    paddingHorizontal: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  genSection: {
    gap: 8,
  },
  genCard: {
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  genPassword: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 2,
  },
  genLenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  genLenLabel: {
    fontSize: 14,
  },
  genLenValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  genSliderBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  genSliderFill: {
    height: 6,
    borderRadius: 3,
    width: '65%',
  },
  genOptsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  genOptChip: {
    height: 28,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genOptText: {
    fontSize: 12,
    fontWeight: '600',
  },
  genRefreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 10,
    gap: 8,
  },
  genRefreshText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
