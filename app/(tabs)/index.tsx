/**
 * OhPass - 密码库首页
 * 基于 Pencil 设计稿的首页-密码库
 */

import { useTheme } from '@/components/design-system';
import { FilterChip, PasswordRow, PrimaryButton, SearchBar, SectionHeader } from '@/components/ui';
import { useData } from '@/contexts/DataContext';
import { getCategoryColor, getIconName } from '@/utils/password';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { PasswordEntry } from '@/services/database';

const filterOptions = ['全部', '网站', 'App', '其他'];

export default function PasswordScreen() {
  const { colors, spacing } = useTheme();
  const { passwords, isLoading, searchPasswords } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('全部');
  const [filteredPasswords, setFilteredPasswords] = useState<PasswordEntry[]>([]);

  const doSearch = useCallback(async () => {
    const results = await searchPasswords(searchQuery, activeFilter);
    setFilteredPasswords(results);
  }, [searchQuery, activeFilter, searchPasswords]);

  useEffect(() => {
    doSearch();
  }, [doSearch]);

  // 同步最新密码列表
  useEffect(() => {
    if (!searchQuery && activeFilter === '全部') {
      setFilteredPasswords(passwords);
    }
  }, [passwords, searchQuery, activeFilter]);

  const handlePasswordPress = (id: string) => {
    router.push(`/password/${id}`);
  };

  const handleAddPress = () => {
    router.push('/password/add');
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>密码</Text>
        <TouchableOpacity
          style={[styles.headerBtn, { backgroundColor: colors.bgTertiary }]}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="搜索密码"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        {filterOptions.map((filter) => (
          <FilterChip
            key={filter}
            label={filter}
            active={activeFilter === filter}
            onPress={() => setActiveFilter(filter)}
          />
        ))}
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : filteredPasswords.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="key-outline" size={64} color={colors.textTertiary} />
            <Text style={[styles.emptyTitle, { color: colors.textSecondary }]}>
              {searchQuery || activeFilter !== '全部' ? '没有找到匹配的密码' : '还没有保存任何密码'}
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textTertiary }]}>
              {searchQuery || activeFilter !== '全部' ? '试试其他搜索词或筛选条件' : '点击下方按钮添加第一个密码'}
            </Text>
          </View>
        ) : (
          <>
            <SectionHeader
              title={`全部密码 (${filteredPasswords.length})`}
              actionText=""
              onActionPress={() => {}}
            />
            <View style={styles.passwordList}>
              {filteredPasswords.map((item) => (
                <PasswordRow
                  key={item.id}
                  title={item.title}
                  subtitle={item.username || item.website}
                  icon={getIconName(item.category) as any}
                  iconColor={item.icon_color || getCategoryColor(item.title)}
                  onPress={() => handlePasswordPress(item.id)}
                  style={styles.passwordItem}
                />
              ))}
            </View>
          </>
        )}

        <PrimaryButton
          title="添加密码"
          icon="add"
          onPress={handleAddPress}
          style={styles.addButton}
        />
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
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
    height: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  passwordList: {
    gap: 8,
    marginBottom: 24,
  },
  passwordItem: {
    marginBottom: 0,
  },
  addButton: {
    marginTop: 8,
  },
  loader: {
    marginTop: 60,
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
});
