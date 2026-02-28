/**
 * OhPass - TOTP 工具
 * 基于 RFC 6238 的 TOTP 算法实现（纯 JS，无原生依赖）
 */

// ==================== HMAC-SHA1 实现 ====================

function hmacSha1(key: Uint8Array, message: Uint8Array): Uint8Array {
  const BLOCK_SIZE = 64;

  let keyBlock = key;
  if (keyBlock.length > BLOCK_SIZE) {
    keyBlock = sha1(keyBlock);
  }

  const paddedKey = new Uint8Array(BLOCK_SIZE);
  paddedKey.set(keyBlock);

  const ipad = new Uint8Array(BLOCK_SIZE);
  const opad = new Uint8Array(BLOCK_SIZE);
  for (let i = 0; i < BLOCK_SIZE; i++) {
    ipad[i] = paddedKey[i] ^ 0x36;
    opad[i] = paddedKey[i] ^ 0x5c;
  }

  const innerData = new Uint8Array(BLOCK_SIZE + message.length);
  innerData.set(ipad);
  innerData.set(message, BLOCK_SIZE);
  const innerHash = sha1(innerData);

  const outerData = new Uint8Array(BLOCK_SIZE + 20);
  outerData.set(opad);
  outerData.set(innerHash, BLOCK_SIZE);
  return sha1(outerData);
}

function sha1(data: Uint8Array): Uint8Array {
  let h0 = 0x67452301;
  let h1 = 0xEFCDAB89;
  let h2 = 0x98BADCFE;
  let h3 = 0x10325476;
  let h4 = 0xC3D2E1F0;

  const msgLen = data.length;
  const bitLen = msgLen * 8;

  // Padding
  const paddedLen = Math.ceil((msgLen + 9) / 64) * 64;
  const padded = new Uint8Array(paddedLen);
  padded.set(data);
  padded[msgLen] = 0x80;

  // Length in bits (big-endian, 64-bit)
  const view = new DataView(padded.buffer);
  view.setUint32(paddedLen - 4, bitLen, false);

  // Process blocks
  const w = new Int32Array(80);
  for (let offset = 0; offset < paddedLen; offset += 64) {
    for (let i = 0; i < 16; i++) {
      w[i] = view.getInt32(offset + i * 4, false);
    }
    for (let i = 16; i < 80; i++) {
      w[i] = rotl(w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16], 1);
    }

    let a = h0, b = h1, c = h2, d = h3, e = h4;

    for (let i = 0; i < 80; i++) {
      let f: number, k: number;
      if (i < 20) {
        f = (b & c) | (~b & d);
        k = 0x5A827999;
      } else if (i < 40) {
        f = b ^ c ^ d;
        k = 0x6ED9EBA1;
      } else if (i < 60) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8F1BBCDC;
      } else {
        f = b ^ c ^ d;
        k = 0xCA62C1D6;
      }

      const temp = (rotl(a, 5) + f + e + k + w[i]) | 0;
      e = d;
      d = c;
      c = rotl(b, 30);
      b = a;
      a = temp;
    }

    h0 = (h0 + a) | 0;
    h1 = (h1 + b) | 0;
    h2 = (h2 + c) | 0;
    h3 = (h3 + d) | 0;
    h4 = (h4 + e) | 0;
  }

  const result = new Uint8Array(20);
  const rv = new DataView(result.buffer);
  rv.setUint32(0, h0, false);
  rv.setUint32(4, h1, false);
  rv.setUint32(8, h2, false);
  rv.setUint32(12, h3, false);
  rv.setUint32(16, h4, false);
  return result;
}

function rotl(n: number, bits: number): number {
  return ((n << bits) | (n >>> (32 - bits))) | 0;
}

// ==================== Base32 解码 ====================

const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Decode(input: string): Uint8Array {
  const cleaned = input.toUpperCase().replace(/[=\s]/g, '');
  const bytes: number[] = [];
  let buffer = 0;
  let bitsLeft = 0;

  for (const char of cleaned) {
    const val = BASE32_CHARS.indexOf(char);
    if (val === -1) continue;
    buffer = (buffer << 5) | val;
    bitsLeft += 5;
    if (bitsLeft >= 8) {
      bitsLeft -= 8;
      bytes.push((buffer >> bitsLeft) & 0xff);
    }
  }

  return new Uint8Array(bytes);
}

// ==================== TOTP 核心 ====================

export interface TotpParams {
  secret: string;       // Base32 编码的密钥
  digits?: number;      // 验证码位数，默认 6
  period?: number;      // 时间步长（秒），默认 30
  algorithm?: string;   // 算法，默认 SHA1
}

/**
 * 生成 TOTP 验证码
 */
export function generateTOTP(params: TotpParams, timestamp?: number): string {
  const { secret, digits = 6, period = 30 } = params;

  const time = timestamp ?? Math.floor(Date.now() / 1000);
  const counter = Math.floor(time / period);

  // 将 counter 转为 8 字节大端序
  const counterBytes = new Uint8Array(8);
  const counterView = new DataView(counterBytes.buffer);
  counterView.setUint32(4, counter, false);

  const key = base32Decode(secret);
  const hmac = hmacSha1(key, counterBytes);

  // Dynamic truncation
  const offset = hmac[19] & 0x0f;
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  const otp = code % Math.pow(10, digits);
  return otp.toString().padStart(digits, '0');
}

/**
 * 获取当前时间步的剩余秒数
 */
export function getRemainingSeconds(period: number = 30): number {
  return period - (Math.floor(Date.now() / 1000) % period);
}

/**
 * 格式化验证码显示（如 "123 456"）
 */
export function formatOTP(code: string): string {
  if (code.length === 6) {
    return `${code.slice(0, 3)} ${code.slice(3)}`;
  }
  if (code.length === 8) {
    return `${code.slice(0, 4)} ${code.slice(4)}`;
  }
  return code;
}

/**
 * 验证 Base32 密钥是否有效
 */
export function isValidBase32(input: string): boolean {
  const cleaned = input.toUpperCase().replace(/[=\s]/g, '');
  return /^[A-Z2-7]+$/.test(cleaned) && cleaned.length >= 16;
}

/**
 * 解析 otpauth:// URI
 */
export function parseOtpAuthUri(uri: string): TotpParams & { label?: string; issuer?: string } | null {
  try {
    if (!uri.startsWith('otpauth://totp/')) return null;

    const url = new URL(uri);
    const secret = url.searchParams.get('secret');
    if (!secret) return null;

    const label = decodeURIComponent(url.pathname.replace('/totp/', ''));
    const issuer = url.searchParams.get('issuer') ?? '';
    const digits = parseInt(url.searchParams.get('digits') ?? '6', 10);
    const period = parseInt(url.searchParams.get('period') ?? '30', 10);
    const algorithm = url.searchParams.get('algorithm') ?? 'SHA1';

    return { secret, digits, period, algorithm, label, issuer };
  } catch {
    return null;
  }
}
