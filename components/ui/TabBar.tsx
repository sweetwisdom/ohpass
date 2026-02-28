/**
 * OhPass UI - TabBar
 * 基于 Pencil 设计稿的底部导航组件
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/components/design-system';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type IconName = keyof typeof Ionicons.glyphMap;

interface TabItem {
  key: string;
  title: string;
  icon: IconName;
  activeIcon: IconName;
}

interface TabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (key: string) => void;
}

export function TabBar({
  tabs,
  activeTab,
  onTabPress,
}: TabBarProps) {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.tabBarBg,
          paddingBottom: insets.bottom > 0 ? insets.bottom : spacing.tabBar.paddingBottom,
          height: spacing.tabBar.height + (insets.bottom > 0 ? insets.bottom : 0),
          borderTopWidth: 0.5,
          borderTopColor: colors.border,
        },
      ]}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isActive ? tab.activeIcon : tab.icon}
              size={spacing.tabBar.iconSize}
              color={isActive ? colors.accentBlue : colors.textTertiary}
            />
            <Text
              style={[
                styles.label,
                {
                  color: isActive ? colors.accentBlue : colors.textTertiary,
                },
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: '100%',
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
  },
});
