/**
 * URL Validator - SSRF Prevention for Table Share
 * Validates user-supplied URLs before server-side fetching.
 * Blocks private IPs, internal hosts, and dangerous protocols.
 * Reference: OWASP SSRF Prevention Cheat Sheet
 */

/**
 * Checks if a hostname is a private or internal IP address
 * @param {string} hostname - Hostname or IP address to check
 * @returns {boolean} True if hostname is a private/internal IP
 */
function isPrivateIP(hostname) {
  // Check for IPv6 (contains colon) - block all IPv6 addresses
  if (hostname.includes(':')) {
    return true;
  }

  // Check if it's an IPv4 address format
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipv4Regex.test(hostname)) {
    // Not an IP address (it's a domain name)
    return false;
  }

  // Parse IPv4 octets
  const octets = hostname.split('.').map(Number);
  const [octet1, octet2, octet3, octet4] = octets;

  // Check various private IP ranges
  if (octet1 === 10) {
    // 10.0.0.0/8
    return true;
  }

  if (octet1 === 172 && octet2 >= 16 && octet2 <= 31) {
    // 172.16.0.0/12
    return true;
  }

  if (octet1 === 192 && octet2 === 168) {
    // 192.168.0.0/16
    return true;
  }

  if (octet1 === 169 && octet2 === 254) {
    // 169.254.0.0/16 (link-local)
    return true;
  }

  if (octet1 === 127) {
    // 127.0.0.0/8 (loopback)
    return true;
  }

  if (octet1 === 0) {
    // 0.0.0.0/8 (invalid but commonly blocked)
    return true;
  }

  if (octet1 === 100 && octet2 >= 64 && octet2 <= 127) {
    // 100.64.0.0/10 (carrier-grade NAT)
    return true;
  }

  if (octet1 === 198 && octet2 >= 18 && octet2 <= 19) {
    // 198.18.0.0/15 (benchmarking/testing)
    return true;
  }

  if (octet1 >= 224) {
    // 224.0.0.0/4 (multicast, reserved)
    return true;
  }

  return false;
}

/**
 * Validates a URL string against SSRF prevention rules
 * @param {string} urlString - URL to validate
 * @returns {Object} { valid: boolean, error?: string }
 */
function validateURL(urlString) {
  // Step 1: Parse URL
  let url;
  try {
    url = new URL(urlString);
  } catch (error) {
    return { valid: false, error: 'Invalid URL format' };
  }

  // Step 2: Check protocol
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return { valid: false, error: 'Only HTTP and HTTPS URLs are allowed' };
  }

  // Step 3: Check hostname is not empty
  if (!url.hostname) {
    return { valid: false, error: 'Invalid hostname' };
  }

  // Step 4: Block exact hostnames (case-insensitive)
  const blockedHosts = new Set([
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '::1',
    '[::1]',
    '169.254.169.254',
    'metadata.google.internal',
    'metadata.google.com'
  ]);

  if (blockedHosts.has(url.hostname.toLowerCase())) {
    return { valid: false, error: 'This host is not allowed' };
  }

  // Step 5: Check for private IP addresses
  if (isPrivateIP(url.hostname)) {
    return { valid: false, error: 'Private/internal IP addresses are not allowed' };
  }

  // Step 6: Block decimal IP addresses (like http://2130706433 which is 127.0.0.1)
  const decimalIpRegex = /^\d+$/;
  if (decimalIpRegex.test(url.hostname)) {
    return { valid: false, error: 'Numeric IP addresses are not allowed' };
  }

  // Step 7: Block URLs with credentials
  if (url.username || url.password) {
    return { valid: false, error: 'URLs with credentials are not allowed' };
  }

  // Step 8: Block non-standard ports
  const allowedPorts = new Set(['', '80', '443']);
  if (!allowedPorts.has(url.port)) {
    return { valid: false, error: 'Only standard ports (80, 443) are allowed' };
  }

  // Step 9: All checks passed
  return { valid: true };
}

// Exports
export { validateURL, isPrivateIP };
