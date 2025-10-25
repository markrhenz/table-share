/**
 * Base-62 character set for ID generation
 */
const BASE62_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * Convert a number to base62 string
 * @param {number} num - Number to convert
 * @returns {string} Base62 representation
 */
function toBase62(num) {
  if (num === 0) return BASE62_CHARS[0];
  let result = '';
  while (num > 0) {
    result = BASE62_CHARS[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result;
}

/**
 * Generate a random base62 ID of specified length
 * Uses Cloudflare Workers crypto API for randomness
 * @param {number} length - Length of the ID (default: 8)
 * @returns {string} Random base62 ID
 * @example generateId(8) // Returns: "aB3xK9mZ"
 */
export function generateId(length = 8) {
  let id = '';
  for (let i = 0; i < length; i++) {
    const randomByte = new Uint8Array(1);
    crypto.getRandomValues(randomByte);
    const index = randomByte[0] % 62;
    id += BASE62_CHARS[index];
  }
  return id;
}