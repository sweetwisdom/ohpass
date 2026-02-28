/**
 * OhPass Tab Layout
 * 基于 Pencil 设计稿的底部导航布局
 */

import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/components/design-system';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.accentBlue,
        tabBarInactiveTintColor: colors.textTertiary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBarBg,
          borderTopWidth: 0.5,
          borderTopColor: colors.border,
          height: 83,
          paddingTop: 8,
          paddingBottom: 21,
          paddingHorizontal: 12,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '密码',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={22}
              name={focused ? 'key' : 'key-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="twofa"
        options={{
          title: '验证',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={22}
              name={focused ? 'shield-checkmark' : 'shield-checkmark-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wifi"
        options={{
          title: 'Wi-Fi',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={22}
              name={focused ? 'wifi' : 'wifi-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="security"
        options={{
          title: '安全',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={22}
              name={focused ? 'eye' : 'eye-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '设置',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={22}
              name={focused ? 'settings' : 'settings-outline'}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
