/**
 * OhPass - QR 码组件
 * 纯 JS 实现，使用 View 渲染像素矩阵，兼容 Expo Go
 */

import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import qrcode from 'qrcode-generator';

interface QRCodeViewProps {
  value: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
}

export function QRCodeView({
  value,
  size = 200,
  color = '#000000',
  backgroundColor = '#FFFFFF',
}: QRCodeViewProps) {
  const matrix = useMemo(() => {
    const qr = qrcode(0, 'M');
    qr.addData(value);
    qr.make();

    const moduleCount = qr.getModuleCount();
    const result: boolean[][] = [];
    for (let row = 0; row < moduleCount; row++) {
      const rowData: boolean[] = [];
      for (let col = 0; col < moduleCount; col++) {
        rowData.push(qr.isDark(row, col));
      }
      result.push(rowData);
    }
    return result;
  }, [value]);

  const moduleCount = matrix.length;
  const cellSize = size / moduleCount;

  return (
    <View style={[styles.container, { width: size, height: size, backgroundColor }]}>
      {matrix.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((isDark, colIndex) => (
            <View
              key={colIndex}
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: isDark ? color : backgroundColor,
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

/**
 * 生成 Wi-Fi QR 码字符串
 * 格式: WIFI:T:<security>;S:<ssid>;P:<password>;;
 */
export function buildWifiQRString(ssid: string, password: string, securityType: string): string {
  const security = securityType === '开放' ? 'nopass' : securityType.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const escapedSsid = escapeQR(ssid);
  const escapedPassword = escapeQR(password);
  return `WIFI:T:${security};S:${escapedSsid};P:${escapedPassword};;`;
}

function escapeQR(str: string): string {
  return str.replace(/([\\;,:"'])/g, '\\$1');
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
});
