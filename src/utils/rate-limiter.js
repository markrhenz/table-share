/**
 * Generate a rate limit key for KV storage
 * Key format: 'rate-limit:{ip}:{minute}'
 * @param {string} ip - Client IP address
 * @returns {string} KV key for rate limiting
 * @example getRateLimitKey('192.168.1.1') 
 * // Returns: 'rate-limit:192.168.1.1:29847123'
 */
export function getRateLimitKey(ip) {
  // Get current minute timestamp
  const minute = Math.floor(Date.now() / 60000);
  return `rate-limit:${ip}:${minute}`;
}

/**
 * Check if IP is whitelisted (development/localhost)
 * @param {string|null} ip - Client IP address
 * @returns {boolean} True if IP is whitelisted
 */
export function isWhitelisted(ip) {
  if (!ip) return true; // Allow if no IP (development)
  
  const whitelist = [
    '127.0.0.1',     // IPv4 localhost
    '::1',           // IPv6 localhost
    'localhost'
  ];
  
  return whitelist.includes(ip);
}

/**
 * Check and enforce rate limit for an IP address
 * Uses KV storage with 60-second TTL
 * @param {KVNamespace} kvNamespace - Cloudflare KV binding
 * @param {string} ip - Client IP address
 * @param {number} maxRequests - Max requests per minute (default: 5)
 * @returns {Promise<Object>} {allowed: boolean, remaining: number}
 */
export async function checkRateLimit(kvNamespace, ip, maxRequests = 5) {
  // Whitelist localhost/development
  if (isWhitelisted(ip)) {
    return { allowed: true, remaining: maxRequests };
  }
  
  try {
    const key = getRateLimitKey(ip);
    
    // Get current count from KV
    const countStr = await kvNamespace.get(key);
    const count = countStr ? parseInt(countStr, 10) : 0;
    
    // Check if limit exceeded
    if (count >= maxRequests) {
      return { allowed: false, remaining: 0 };
    }
    
    // Increment counter with 60-second expiration
    const newCount = count + 1;
    await kvNamespace.put(key, String(newCount), { expirationTtl: 60 });
    
    return { 
      allowed: true, 
      remaining: maxRequests - newCount 
    };
    
  } catch (error) {
    // Fail open - allow request if KV operation fails
    console.error('Rate limit check failed:', error);
    return { allowed: true, remaining: maxRequests };
  }
}