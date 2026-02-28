/**
 * OhPass UI - ToggleSwitch
 * 基于 Pencil 设计稿的开关组件
 */

import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ViewStyle,
  Animated,
} from 'react-native';
import { useTheme } from '@/components/design-system';

interface ToggleSwitchProps {
  value: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
  activeColor?: string;
  inactiveColor?: string;
  style?: ViewStyle;
}

export function ToggleSwitch({
  value,
  onValueChange,
  disabled = false,
  activeColor,
  inactiveColor,
  style,
}: ToggleSwitchProps) {
  const { colors } = useTheme();

  const translateX = React.useRef(new Animated.Value(value ? 22 : 2)).current;

  React.useEffect(() => {
    Animated.spring(translateX, {
      toValue: value ? 22 : 2,
      useNativeDriver: true,
      friction: 8,
      tension: 10,
    }).start();
  }, [value, translateX]);

  const handlePress = () => {
    if (!disabled && onValueChange) {
      onValueChange(!value);
    }
  };

  const bgColor = value
    ? activeColor || colors.accentGreen
    : inactiveColor || colors.muted;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: bgColor,
          borderRadius: 16,
          width: 51,
          height: 31,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <View style={styles.knobContainer}>
        <Animated.View
          style={[
            styles.knob,
            {
              backgroundColor: colors.white,
              transform: [{ translateX }],
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 2,
    justifyContent: 'center',
  },
  knobContainer: {
    position: 'absolute',
    left: 2,
    top: 2,
  },
  knob: {
    width: 27,
    height: 27,
    borderRadius: 13.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
