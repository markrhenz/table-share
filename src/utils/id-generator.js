// Base-62 character set (a-z, A-Z, 0-9)
const BASE62_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * Generate a random 8-character base-62 ID
 * Uses Cloudflare Workers crypto API
 * @returns {string} Random 8-character ID
 * @example generateId() // Returns: "aB3xK9mZ"
 */
export function generateId() {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  
  let id = '';
  for (let i = 0; i < 8; i++) {
    id += BASE62_CHARS[bytes[i] % 62];
  }
  
  return id;
}

/**
 * Generate a unique ID by checking KV namespace for collisions
 * Retries up to 3 times if collision detected
 * @param {KVNamespace} kvNamespace - Cloudflare KV binding
 * @returns {Promise<string>} Unique 8-character ID
 * @throws {Error} If unable to generate unique ID after max attempts
 */
export async function generateUniqueId(kvNamespace) {
  const MAX_ATTEMPTS = 3;
  
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const id = generateId();
    
    // Check if ID already exists in KV
    const exists = await kvNamespace.get(id);
    
    if (!exists) {
      return id;
    }
    
    // Log collision (rare but possible)
    console.warn(`ID collision on attempt ${attempt}/${MAX_ATTEMPTS}: ${id}`);
  }
  
  throw new Error(`Failed to generate unique ID after ${MAX_ATTEMPTS} attempts`);
}