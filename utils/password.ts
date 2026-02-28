/**
 * OhPass - 密码工具集
 * 密码生成、强度计算、通用工具
 */

// ==================== 密码生成器 ====================

export interface GeneratorOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

export function generatePassword(options: GeneratorOptions): string {
  let pool = '';
  const required: string[] = [];

  if (options.uppercase) {
    pool += CHAR_SETS.uppercase;
    required.push(randomChar(CHAR_SETS.uppercase));
  }
  if (options.lowercase) {
    pool += CHAR_SETS.lowercase;
    required.push(randomChar(CHAR_SETS.lowercase));
  }
  if (options.numbers) {
    pool += CHAR_SETS.numbers;
    required.push(randomChar(CHAR_SETS.numbers));
  }
  if (options.symbols) {
    pool += CHAR_SETS.symbols;
    required.push(randomChar(CHAR_SETS.symbols));
  }

  if (pool.length === 0) {
    pool = CHAR_SETS.lowercase + CHAR_SETS.numbers;
  }

  const remaining = options.length - required.length;
  const chars = [...required];
  for (let i = 0; i < Math.max(0, remaining); i++) {
    chars.push(randomChar(pool));
  }

  // Shuffle
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join('');
}

function randomChar(str: string): string {
  return str[Math.floor(Math.random() * str.length)];
}

// ==================== 密码强度计算 ====================

export interface StrengthResult {
  score: number;        // 0-100
  level: 'weak' | 'fair' | 'good' | 'strong';
  label: string;
  color: string;
}

const COMMON_PASSWORDS = new Set([
  'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', 'master',
  'dragon', 'login', 'princess', 'football', 'shadow', 'sunshine', 'trustno1',
  'iloveyou', 'batman', 'access', 'hello', 'charlie', 'donald', '123456789',
  'password1', 'qwerty123', 'admin', 'letmein', 'welcome', '1234567890',
]);

export function calculatePasswordStrength(password: string): StrengthResult {
  if (!password) return { score: 0, level: 'weak', label: '无密码', color: '#FF3B30' };

  let score = 0;

  // 长度评分 (0-30)
  if (password.length >= 16) score += 30;
  else if (password.length >= 12) score += 25;
  else if (password.length >= 8) score += 15;
  else if (password.length >= 6) score += 8;
  else score += 3;

  // 字符多样性 (0-40)
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);
  const diversity = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean).length;
  score += diversity * 10;

  // 唯一字符比例 (0-15)
  const uniqueRatio = new Set(password).size / password.length;
  score += Math.round(uniqueRatio * 15);

  // 连续/重复惩罚 (-15)
  if (/(.)\1{2,}/.test(password)) score -= 10;
  if (/^(012|123|234|345|456|567|678|789|abc|bcd|cde|def)/.test(password.toLowerCase())) score -= 5;

  // 常见密码惩罚 (-30)
  if (COMMON_PASSWORDS.has(password.toLowerCase())) score = Math.min(score, 10);

  score = Math.max(0, Math.min(100, score));

  if (score >= 80) return { score, level: 'strong', label: '强', color: '#34C759' };
  if (score >= 60) return { score, level: 'good', label: '良好', color: '#007AFF' };
  if (score >= 40) return { score, level: 'fair', label: '一般', color: '#FF9500' };
  return { score, level: 'weak', label: '弱', color: '#FF3B30' };
}

// ==================== 分类图标颜色 ====================

const CATEGORY_COLORS = [
  '#FF8400', '#007AFF', '#34C759', '#FF3B30', '#AF52DE',
  '#5856D6', '#FF9500', '#00C7BE', '#FF2D55', '#5AC8FA',
];

export function getCategoryColor(title: string): string {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = (hash * 31 + title.charCodeAt(i)) | 0;
  }
  return CATEGORY_COLORS[Math.abs(hash) % CATEGORY_COLORS.length];
}

// ==================== 格式化工具 ====================

export function maskPassword(password: string): string {
  return '•'.repeat(Math.min(password.length, 12));
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function getIconName(category: string): string {
  switch (category) {
    case 'website': return 'globe-outline';
    case 'app': return 'phone-portrait-outline';
    case 'wifi': return 'wifi-outline';
    default: return 'key-outline';
  }
}
