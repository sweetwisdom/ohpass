/**
 * OhPass - 数据库服务
 * 使用 expo-sqlite 管理本地数据存储
 */

import * as SQLite from 'expo-sqlite';

const DB_NAME = 'ohpass.db';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync(DB_NAME);
    await initTables(db);
  }
  return db;
}

async function initTables(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS passwords (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      website TEXT DEFAULT '',
      username TEXT DEFAULT '',
      password TEXT NOT NULL,
      category TEXT DEFAULT 'website',
      icon_color TEXT DEFAULT '#FF8400',
      notes TEXT DEFAULT '',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS totp_accounts (
      id TEXT PRIMARY KEY,
      service_name TEXT NOT NULL,
      secret TEXT NOT NULL,
      issuer TEXT DEFAULT '',
      digits INTEGER DEFAULT 6,
      period INTEGER DEFAULT 30,
      algorithm TEXT DEFAULT 'SHA1',
      icon_color TEXT DEFAULT '#007AFF',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS wifi_networks (
      id TEXT PRIMARY KEY,
      ssid TEXT NOT NULL,
      password TEXT NOT NULL,
      security_type TEXT DEFAULT 'WPA2',
      is_hidden INTEGER DEFAULT 0,
      notes TEXT DEFAULT '',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
}

// ==================== 密码 CRUD ====================

export interface PasswordEntry {
  id: string;
  title: string;
  website: string;
  username: string;
  password: string;
  category: string;
  icon_color: string;
  notes: string;
  created_at: number;
  updated_at: number;
}

export async function getAllPasswords(): Promise<PasswordEntry[]> {
  const database = await getDatabase();
  return database.getAllAsync<PasswordEntry>(
    'SELECT * FROM passwords ORDER BY updated_at DESC'
  );
}

export async function getPasswordById(id: string): Promise<PasswordEntry | null> {
  const database = await getDatabase();
  return database.getFirstAsync<PasswordEntry>(
    'SELECT * FROM passwords WHERE id = ?',
    [id]
  );
}

export async function searchPasswords(query: string, category?: string): Promise<PasswordEntry[]> {
  const database = await getDatabase();
  const searchTerm = `%${query}%`;

  if (category && category !== '全部') {
    const categoryMap: Record<string, string> = {
      '网站': 'website',
      'App': 'app',
      '其他': 'other',
    };
    const cat = categoryMap[category] || category;
    return database.getAllAsync<PasswordEntry>(
      'SELECT * FROM passwords WHERE category = ? AND (title LIKE ? OR username LIKE ? OR website LIKE ?) ORDER BY updated_at DESC',
      [cat, searchTerm, searchTerm, searchTerm]
    );
  }

  return database.getAllAsync<PasswordEntry>(
    'SELECT * FROM passwords WHERE title LIKE ? OR username LIKE ? OR website LIKE ? ORDER BY updated_at DESC',
    [searchTerm, searchTerm, searchTerm]
  );
}

export async function insertPassword(entry: Omit<PasswordEntry, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
  const database = await getDatabase();
  const id = generateId();
  const now = Date.now();
  await database.runAsync(
    'INSERT INTO passwords (id, title, website, username, password, category, icon_color, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, entry.title, entry.website, entry.username, entry.password, entry.category, entry.icon_color, entry.notes, now, now]
  );
  return id;
}

export async function updatePassword(id: string, entry: Partial<Omit<PasswordEntry, 'id' | 'created_at'>>): Promise<void> {
  const database = await getDatabase();
  const fields: string[] = [];
  const values: (string | number)[] = [];

  const updatable = ['title', 'website', 'username', 'password', 'category', 'icon_color', 'notes'] as const;
  for (const key of updatable) {
    if (entry[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(entry[key] as string);
    }
  }

  if (fields.length === 0) return;

  fields.push('updated_at = ?');
  values.push(Date.now());
  values.push(id);

  await database.runAsync(
    `UPDATE passwords SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
}

export async function deletePassword(id: string): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM passwords WHERE id = ?', [id]);
}

// ==================== TOTP CRUD ====================

export interface TotpAccount {
  id: string;
  service_name: string;
  secret: string;
  issuer: string;
  digits: number;
  period: number;
  algorithm: string;
  icon_color: string;
  created_at: number;
  updated_at: number;
}

export async function getAllTotpAccounts(): Promise<TotpAccount[]> {
  const database = await getDatabase();
  return database.getAllAsync<TotpAccount>(
    'SELECT * FROM totp_accounts ORDER BY service_name ASC'
  );
}

export async function getTotpById(id: string): Promise<TotpAccount | null> {
  const database = await getDatabase();
  return database.getFirstAsync<TotpAccount>(
    'SELECT * FROM totp_accounts WHERE id = ?',
    [id]
  );
}

export async function insertTotpAccount(entry: Omit<TotpAccount, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
  const database = await getDatabase();
  const id = generateId();
  const now = Date.now();
  await database.runAsync(
    'INSERT INTO totp_accounts (id, service_name, secret, issuer, digits, period, algorithm, icon_color, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, entry.service_name, entry.secret, entry.issuer, entry.digits, entry.period, entry.algorithm, entry.icon_color, now, now]
  );
  return id;
}

export async function deleteTotpAccount(id: string): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM totp_accounts WHERE id = ?', [id]);
}

// ==================== Wi-Fi CRUD ====================

export interface WifiNetwork {
  id: string;
  ssid: string;
  password: string;
  security_type: string;
  is_hidden: number;
  notes: string;
  created_at: number;
  updated_at: number;
}

export async function getAllWifiNetworks(): Promise<WifiNetwork[]> {
  const database = await getDatabase();
  return database.getAllAsync<WifiNetwork>(
    'SELECT * FROM wifi_networks ORDER BY ssid ASC'
  );
}

export async function getWifiById(id: string): Promise<WifiNetwork | null> {
  const database = await getDatabase();
  return database.getFirstAsync<WifiNetwork>(
    'SELECT * FROM wifi_networks WHERE id = ?',
    [id]
  );
}

export async function insertWifiNetwork(entry: Omit<WifiNetwork, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
  const database = await getDatabase();
  const id = generateId();
  const now = Date.now();
  await database.runAsync(
    'INSERT INTO wifi_networks (id, ssid, password, security_type, is_hidden, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, entry.ssid, entry.password, entry.security_type, entry.is_hidden, entry.notes, now, now]
  );
  return id;
}

export async function updateWifiNetwork(id: string, entry: Partial<Omit<WifiNetwork, 'id' | 'created_at'>>): Promise<void> {
  const database = await getDatabase();
  const fields: string[] = [];
  const values: (string | number)[] = [];

  const updatable = ['ssid', 'password', 'security_type', 'is_hidden', 'notes'] as const;
  for (const key of updatable) {
    if (entry[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(entry[key] as string | number);
    }
  }

  if (fields.length === 0) return;

  fields.push('updated_at = ?');
  values.push(Date.now());
  values.push(id);

  await database.runAsync(
    `UPDATE wifi_networks SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
}

export async function deleteWifiNetwork(id: string): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM wifi_networks WHERE id = ?', [id]);
}

// ==================== 设置 ====================

export async function getSetting(key: string): Promise<string | null> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_settings WHERE key = ?',
    [key]
  );
  return row?.value ?? null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    'INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)',
    [key, value]
  );
}

// ==================== 工具 ====================

function generateId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const segments = [8, 4, 4, 4, 12];
  return segments
    .map(len =>
      Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    )
    .join('-');
}

export async function getPasswordCount(): Promise<number> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM passwords');
  return row?.count ?? 0;
}

export async function getTotpCount(): Promise<number> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM totp_accounts');
  return row?.count ?? 0;
}

export async function getWifiCount(): Promise<number> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM wifi_networks');
  return row?.count ?? 0;
}
