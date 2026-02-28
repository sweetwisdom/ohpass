/**
 * OhPass - 密码库首页
 * 基于 Pencil 设计稿的首页-密码库
 */

import React, { useState } from 'react';
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
import { router } from 'expo-router';
import { useTheme } from '@/components/design-system';
import { SearchBar, FilterChip, SectionHeader, PasswordRow, PrimaryButton } from '@/components/ui';

// 模拟数据
const mockPasswords = [
  { id: '1', title: 'Google', subtitle: 'user@gmail.com', icon: 'globe', iconColor: '#4285F4' },
  { id: '2', title: 'Apple', subtitle: 'user@icloud.com', icon: 'logo-apple', iconColor: '#000000' },
  { id: '3', title: 'GitHub', subtitle: 'dev@github.com', icon: 'logo-github', iconColor: '#333333' },
  { id: '4', title: 'Twitter/X', subtitle: '@myhandle', icon: 'logo-twitter', iconColor: '#1DA1F2' },
  { id: '5', title: 'Netflix', subtitle: 'user@email.com', icon: 'tv', iconColor: '#E50914' },
  { id: '6', title: 'Amazon', subtitle: 'shopper@amazon.com', icon: 'cart', iconColor: '#FF9900' },
  { id: '7', title: 'Slack', subtitle: 'work@company.com', icon: 'chatbubbles', iconColor: '#4A154B' },
];

const filterOptions = ['全部', 'App', '网站', 'Wi-Fi'];

export default function PasswordScreen() {
  const { colors, spacing } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('全部');

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
          style={[
            styles.headerBtn,
            { backgroundColor: colors.bgTertiary },
          ]}
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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {filterOptions.map((filter) => (
          <FilterChip
            key={filter}
            label={filter}
            active={activeFilter === filter}
            onPress={() => setActiveFilter(filter)}
          />
        ))}
      </ScrollView>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Section Header */}
        <SectionHeader
          title="最近使用"
          actionText="查看全部"
          onActionPress={() => {}}
        />

        {/* Password List */}
        <View style={styles.passwordList}>
          {mockPasswords.map((item) => (
            <PasswordRow
              key={item.id}
              title={item.title}
              subtitle={item.subtitle}
              icon={item.icon as any}
              iconColor={item.iconColor}
              onPress={() => handlePasswordPress(item.id)}
              style={styles.passwordItem}
            />
          ))}
        </View>

        {/* Add Button */}
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
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
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
});
