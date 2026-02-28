/**
 * OhPass - 主题偏好 Context
 * 管理用户的深色模式偏好，支持持久化存储
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeContextType {
  /** 当前用户的主题偏好 */
  themePreference: ThemePreference;
  /** 当前是否为深色模式（计算后的实际值） */
  isDark: boolean;
  /** 设置主题偏好 */
  setThemePreference: (preference: ThemePreference) => void;
}

const STORAGE_KEY = 'ohpass_theme_preference';

const ThemeContext = createContext<ThemeContextType>({
  themePreference: 'system',
  isDark: false,
  setThemePreference: () => {},
});

export function ThemePreferenceProvider({ children }: { children: React.ReactNode }) {
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  // 从 AsyncStorage 读取持久化的偏好
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setThemePreferenceState(stored);
        applyTheme(stored);
      }
      setIsLoaded(true);
    });
  }, []);

  const applyTheme = useCallback((preference: ThemePreference) => {
    // Appearance.setColorScheme 会全局覆盖 useColorScheme() 的返回值
    switch (preference) {
      case 'dark':
        Appearance.setColorScheme('dark');
        break;
      case 'light':
        Appearance.setColorScheme('light');
        break;
      case 'system':
        Appearance.setColorScheme(null); // 跟随系统
        break;
    }
  }, []);

  const setThemePreference = useCallback((preference: ThemePreference) => {
    setThemePreferenceState(preference);
    applyTheme(preference);
    AsyncStorage.setItem(STORAGE_KEY, preference);
  }, [applyTheme]);

  const isDark = (() => {
    if (themePreference === 'system') {
      return Appearance.getColorScheme() === 'dark';
    }
    return themePreference === 'dark';
  })();

  if (!isLoaded) {
    return null; // 等待偏好加载完成再渲染
  }

  return (
    <ThemeContext.Provider value={{ themePreference, isDark, setThemePreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemePreference() {
  return useContext(ThemeContext);
}
