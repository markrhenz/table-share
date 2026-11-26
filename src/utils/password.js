/**
 * Password hashing utilities.
 * New tables: PBKDF2-HMAC-SHA256 with a per-table random salt (Workers-native, free).
 * Old tables: legacy unsalted SHA-256 is still VERIFIED for backward compatibility.
 */

const PBKDF2_ITERATIONS = 100000;

function toHex(buf) {
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function fromHex(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

async function pbkdf2Hex(password, saltBytes) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(password), { name: 'PBKDF2' }, false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: saltBytes, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial, 256
  );
  return toHex(bits);
}

async function sha256Hex(password) {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(password));
  return toHex(buf);
}

/** Constant-time hex string comparison (avoids early-exit timing leak). */
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Hash a NEW password. Returns { hash, salt, kdf } to store on the table record.
 * @param {string} password
 * @returns {Promise<{hash:string, salt:string, kdf:string}>}
 */
export async function hashPassword(password) {
  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2Hex(password, saltBytes);
  return { hash, salt: toHex(saltBytes), kdf: 'pbkdf2' };
}

/**
 * Unlock-cookie token. Derived from salt+hash so it is per-table unique and
 * non-deterministic across tables even for identical passwords.
 * @param {{passwordSalt?:string, passwordHash?:string}} stored
 * @returns {string}
 */
export function cookieToken(stored) {
  const basis = (stored.passwordSalt || '') + (stored.passwordHash || '');
  return basis.substring(0, 24);
}

/**
 * Verify a submitted password against a stored table record.
 * Handles both pbkdf2 (new) and legacy unsalted SHA-256 (old) records.
 * @param {string} submitted
 * @param {{passwordHash?:string, passwordSalt?:string, passwordKdf?:string}} stored
 * @returns {Promise<{ok:boolean, cookieValue:string|null}>}
 */
export async function verifyPassword(submitted, stored) {
  const { passwordHash, passwordSalt, passwordKdf } = stored;
  if (!passwordHash) return { ok: false, cookieValue: null };

  let computed;
  if (passwordKdf === 'pbkdf2' && passwordSalt) {
    computed = await pbkdf2Hex(submitted, fromHex(passwordSalt));
  } else {
    computed = await sha256Hex(submitted); // legacy unsalted record
  }

  if (safeEqual(computed, passwordHash)) {
    return { ok: true, cookieValue: cookieToken(stored) };
  }
  return { ok: false, cookieValue: null };
}
