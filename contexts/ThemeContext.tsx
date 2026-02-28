/**
 * OhPass - 主题偏好 Context
 * 管理用户的深色模式偏好，支持持久化存储
 * 通过 Context 分发解析后的 colorScheme，兼容所有平台（Native + Web）
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Appearance, type ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeContextType {
  /** 用户的主题偏好设置 */
  themePreference: ThemePreference;
  /** 解析后的颜色方案（'light' | 'dark'） */
  colorScheme: 'light' | 'dark';
  /** 设置主题偏好 */
  setThemePreference: (preference: ThemePreference) => void;
}

const STORAGE_KEY = 'ohpass_theme_preference';

const ThemeContext = createContext<ThemeContextType>({
  themePreference: 'system',
  colorScheme: 'light',
  setThemePreference: () => {},
});

export function ThemePreferenceProvider({ children }: { children: React.ReactNode }) {
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('system');
  const [systemScheme, setSystemScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme() ?? 'light'
  );
  const [isLoaded, setIsLoaded] = useState(false);

  // 从 AsyncStorage 读取持久化的偏好
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setThemePreferenceState(stored);
      }
      setIsLoaded(true);
    });
  }, []);

  // 监听系统主题变化（当偏好为 'system' 时需要响应）
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme: newScheme }) => {
      setSystemScheme(newScheme ?? 'light');
    });
    return () => subscription.remove();
  }, []);

  const setThemePreference = useCallback((preference: ThemePreference) => {
    setThemePreferenceState(preference);
    AsyncStorage.setItem(STORAGE_KEY, preference);
  }, []);

  // 根据偏好计算最终的颜色方案
  const colorScheme: 'light' | 'dark' = (() => {
    if (themePreference === 'system') {
      return systemScheme === 'dark' ? 'dark' : 'light';
    }
    return themePreference;
  })();

  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ themePreference, colorScheme, setThemePreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** 获取主题偏好和设置方法 */
export function useThemePreference() {
  return useContext(ThemeContext);
}

/** 获取解析后的颜色方案，替代 useColorScheme */
export function useResolvedColorScheme(): 'light' | 'dark' {
  const { colorScheme } = useContext(ThemeContext);
  return colorScheme;
}
