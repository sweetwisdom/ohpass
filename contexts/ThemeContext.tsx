/**
 * OhPass - 主题偏好 Context
 * 管理用户的深色模式偏好
 * 通过 Context 分发解析后的 colorScheme，兼容所有平台（Native + Web）
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Appearance, type ColorSchemeName } from 'react-native';

type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeContextType {
  /** 用户的主题偏好设置 */
  themePreference: ThemePreference;
  /** 解析后的颜色方案（'light' | 'dark'） */
  colorScheme: 'light' | 'dark';
  /** 设置主题偏好 */
  setThemePreference: (preference: ThemePreference) => void;
}

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

  // 监听系统主题变化（当偏好为 'system' 时需要响应）
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme: newScheme }) => {
      setSystemScheme(newScheme ?? 'light');
    });
    return () => subscription.remove();
  }, []);

  const setThemePreference = useCallback((preference: ThemePreference) => {
    setThemePreferenceState(preference);
  }, []);

  // 根据偏好计算最终的颜色方案
  const colorScheme: 'light' | 'dark' = (() => {
    if (themePreference === 'system') {
      return systemScheme === 'dark' ? 'dark' : 'light';
    }
    return themePreference;
  })();

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
