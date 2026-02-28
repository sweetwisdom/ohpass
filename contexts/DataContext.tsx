/**
 * OhPass - 全局数据 Context
 * 提供密码、TOTP、Wi-Fi 的 CRUD 操作及状态管理
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as db from '@/services/database';

interface DataContextType {
  // 密码
  passwords: db.PasswordEntry[];
  loadPasswords: () => Promise<void>;
  addPassword: (entry: Omit<db.PasswordEntry, 'id' | 'created_at' | 'updated_at'>) => Promise<string>;
  editPassword: (id: string, entry: Partial<Omit<db.PasswordEntry, 'id' | 'created_at'>>) => Promise<void>;
  removePassword: (id: string) => Promise<void>;
  searchPasswords: (query: string, category?: string) => Promise<db.PasswordEntry[]>;

  // TOTP
  totpAccounts: db.TotpAccount[];
  loadTotpAccounts: () => Promise<void>;
  addTotpAccount: (entry: Omit<db.TotpAccount, 'id' | 'created_at' | 'updated_at'>) => Promise<string>;
  removeTotpAccount: (id: string) => Promise<void>;

  // Wi-Fi
  wifiNetworks: db.WifiNetwork[];
  loadWifiNetworks: () => Promise<void>;
  addWifiNetwork: (entry: Omit<db.WifiNetwork, 'id' | 'created_at' | 'updated_at'>) => Promise<string>;
  editWifiNetwork: (id: string, entry: Partial<Omit<db.WifiNetwork, 'id' | 'created_at'>>) => Promise<void>;
  removeWifiNetwork: (id: string) => Promise<void>;

  // 设置
  getSetting: (key: string) => Promise<string | null>;
  saveSetting: (key: string, value: string) => Promise<void>;

  // 加载状态
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [passwords, setPasswords] = useState<db.PasswordEntry[]>([]);
  const [totpAccounts, setTotpAccounts] = useState<db.TotpAccount[]>([]);
  const [wifiNetworks, setWifiNetworks] = useState<db.WifiNetwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ==================== 初始化 ====================
  useEffect(() => {
    (async () => {
      try {
        const [p, t, w] = await Promise.all([
          db.getAllPasswords(),
          db.getAllTotpAccounts(),
          db.getAllWifiNetworks(),
        ]);
        setPasswords(p);
        setTotpAccounts(t);
        setWifiNetworks(w);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // ==================== 密码操作 ====================
  const loadPasswords = useCallback(async () => {
    const result = await db.getAllPasswords();
    setPasswords(result);
  }, []);

  const addPassword = useCallback(async (entry: Omit<db.PasswordEntry, 'id' | 'created_at' | 'updated_at'>) => {
    const id = await db.insertPassword(entry);
    await loadPasswords();
    return id;
  }, [loadPasswords]);

  const editPassword = useCallback(async (id: string, entry: Partial<Omit<db.PasswordEntry, 'id' | 'created_at'>>) => {
    await db.updatePassword(id, entry);
    await loadPasswords();
  }, [loadPasswords]);

  const removePassword = useCallback(async (id: string) => {
    await db.deletePassword(id);
    await loadPasswords();
  }, [loadPasswords]);

  const searchPasswordsFn = useCallback(async (query: string, category?: string) => {
    if (!query && (!category || category === '全部')) {
      return passwords;
    }
    return db.searchPasswords(query, category);
  }, [passwords]);

  // ==================== TOTP 操作 ====================
  const loadTotpAccounts = useCallback(async () => {
    const result = await db.getAllTotpAccounts();
    setTotpAccounts(result);
  }, []);

  const addTotpAccount = useCallback(async (entry: Omit<db.TotpAccount, 'id' | 'created_at' | 'updated_at'>) => {
    const id = await db.insertTotpAccount(entry);
    await loadTotpAccounts();
    return id;
  }, [loadTotpAccounts]);

  const removeTotpAccount = useCallback(async (id: string) => {
    await db.deleteTotpAccount(id);
    await loadTotpAccounts();
  }, [loadTotpAccounts]);

  // ==================== Wi-Fi 操作 ====================
  const loadWifiNetworks = useCallback(async () => {
    const result = await db.getAllWifiNetworks();
    setWifiNetworks(result);
  }, []);

  const addWifiNetwork = useCallback(async (entry: Omit<db.WifiNetwork, 'id' | 'created_at' | 'updated_at'>) => {
    const id = await db.insertWifiNetwork(entry);
    await loadWifiNetworks();
    return id;
  }, [loadWifiNetworks]);

  const editWifiNetwork = useCallback(async (id: string, entry: Partial<Omit<db.WifiNetwork, 'id' | 'created_at'>>) => {
    await db.updateWifiNetwork(id, entry);
    await loadWifiNetworks();
  }, [loadWifiNetworks]);

  const removeWifiNetwork = useCallback(async (id: string) => {
    await db.deleteWifiNetwork(id);
    await loadWifiNetworks();
  }, [loadWifiNetworks]);

  // ==================== 设置 ====================
  const getSettingFn = useCallback(async (key: string) => {
    return db.getSetting(key);
  }, []);

  const saveSetting = useCallback(async (key: string, value: string) => {
    await db.setSetting(key, value);
  }, []);

  return (
    <DataContext.Provider
      value={{
        passwords,
        loadPasswords,
        addPassword,
        editPassword,
        removePassword,
        searchPasswords: searchPasswordsFn,
        totpAccounts,
        loadTotpAccounts,
        addTotpAccount,
        removeTotpAccount,
        wifiNetworks,
        loadWifiNetworks,
        addWifiNetwork,
        editWifiNetwork,
        removeWifiNetwork,
        getSetting: getSettingFn,
        saveSetting,
        isLoading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataContextType {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
