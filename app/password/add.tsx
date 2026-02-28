/**
 * OhPass - 添加/编辑密码页面
 * 基于 Pencil 设计稿的添加编辑条目
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/components/design-system';
import { useData } from '@/contexts/DataContext';
import { generatePassword, getCategoryColor } from '@/utils/password';

const TAG_OPTIONS = ['网站', 'App', '其他'];
const TAG_MAP: Record<string, string> = { '网站': 'website', 'App': 'app', '其他': 'other' };
const TAG_REVERSE: Record<string, number> = { website: 0, app: 1, other: 2 };

const GEN_OPTIONS = [
  { label: 'A-Z', key: 'uppercase' },
  { label: 'a-z', key: 'lowercase' },
  { label: '0-9', key: 'numbers' },
  { label: '#@$', key: 'symbols' },
];

export default function AddPasswordScreen() {
  const { colors, isDark } = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { addPassword, editPassword, passwords } = useData();
  const isEditing = !!id;

  const [serviceName, setServiceName] = useState('');
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [note, setNote] = useState('');
  const [selectedTag, setSelectedTag] = useState(0);
  const [genLength, setGenLength] = useState(16);
  const [genOptions, setGenOptions] = useState<Record<string, boolean>>({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [saving, setSaving] = useState(false);

  // 编辑模式：加载已有数据
  useEffect(() => {
    if (isEditing && id) {
      const existing = passwords.find(p => p.id === id);
      if (existing) {
        setServiceName(existing.title);
        setUrl(existing.website);
        setUsername(existing.username);
        setPassword(existing.password);
        setNote(existing.notes);
        setSelectedTag(TAG_REVERSE[existing.category] ?? 0);
      }
    }
  }, [isEditing, id, passwords]);

  // 初始生成密码
  useEffect(() => {
    handleGenerate();
  }, []);

  const handleGenerate = () => {
    const pwd = generatePassword({
      length: genLength,
      uppercase: genOptions.uppercase,
      lowercase: genOptions.lowercase,
      numbers: genOptions.numbers,
      symbols: genOptions.symbols,
    });
    setGeneratedPassword(pwd);
  };

  const handleUseGenerated = () => {
    setPassword(generatedPassword);
  };

  const toggleGenOption = (key: string) => {
    setGenOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    if (!serviceName.trim()) {
      Alert.alert('提示', '请输入服务名称');
      return;
    }
    if (!password.trim()) {
      Alert.alert('提示', '请输入密码');
      return;
    }

    setSaving(true);
    try {
      const category = TAG_MAP[TAG_OPTIONS[selectedTag]] || 'website';
      const iconColor = getCategoryColor(serviceName);

      if (isEditing && id) {
        await editPassword(id, {
          title: serviceName.trim(),
          website: url.trim(),
          username: username.trim(),
          password: password,
          category,
          icon_color: iconColor,
          notes: note.trim(),
        });
      } else {
        await addPassword({
          title: serviceName.trim(),
          website: url.trim(),
          username: username.trim(),
          password: password,
          category,
          icon_color: iconColor,
          notes: note.trim(),
        });
      }
      router.back();
    } catch {
      Alert.alert('错误', '保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const sliderPercent = `${Math.round(((genLength - 8) / 24) * 100)}%`;

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
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          <Text style={[styles.navSave, { color: saving ? colors.textTertiary : colors.accentBlue }]}>
            {saving ? '保存中...' : '保存'}
          </Text>
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

          <View style={[styles.formRow, { backgroundColor: colors.card }]}>
            <Text style={[styles.formLabel, { color: colors.textSecondary }]}>密码</Text>
            <TextInput
              style={[styles.formInput, { color: colors.textPrimary }]}
              placeholder="••••••••••••••"
              placeholderTextColor={colors.textTertiary}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={handleUseGenerated}>
              <Ionicons name="sparkles" size={18} color={colors.accentBlue} />
            </TouchableOpacity>
          </View>

          <View style={[styles.formRowNote, { backgroundColor: colors.card }]}>
            <Text style={[styles.formLabel, { color: colors.textSecondary }]}>备注</Text>
            <TextInput
              style={[styles.formInput, { color: colors.textPrimary }]}
              placeholder="个人账户备注信息"
              placeholderTextColor={colors.textTertiary}
              value={note}
              onChangeText={setNote}
              multiline
            />
          </View>
        </View>

        {/* 分类标签 */}
        <View style={styles.tagSection}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>分类标签</Text>
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
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>密码生成器</Text>
          <View style={[styles.genCard, { backgroundColor: colors.card }]}>
            <TouchableOpacity onPress={handleUseGenerated}>
              <Text style={[styles.genPassword, { color: colors.accentBlue }]}>
                {generatedPassword}
              </Text>
              <Text style={[styles.genHint, { color: colors.textTertiary }]}>
                点击使用此密码
              </Text>
            </TouchableOpacity>

            <View style={styles.genLenRow}>
              <Text style={[styles.genLenLabel, { color: colors.textSecondary }]}>长度</Text>
              <View style={styles.genLenControls}>
                <TouchableOpacity onPress={() => setGenLength(Math.max(8, genLength - 2))}>
                  <Ionicons name="remove-circle-outline" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
                <Text style={[styles.genLenValue, { color: colors.textPrimary }]}>{genLength} 位</Text>
                <TouchableOpacity onPress={() => setGenLength(Math.min(32, genLength + 2))}>
                  <Ionicons name="add-circle-outline" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.genSliderBg, { backgroundColor: colors.bgTertiary }]}>
              <View style={[styles.genSliderFill, { backgroundColor: colors.accentBlue, width: sliderPercent as any }]} />
            </View>

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
  genHint: {
    fontSize: 12,
    marginTop: 4,
  },
  genLenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  genLenLabel: {
    fontSize: 14,
  },
  genLenControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  genLenValue: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'center',
  },
  genSliderBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  genSliderFill: {
    height: 6,
    borderRadius: 3,
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
