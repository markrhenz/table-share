/**
 * Escape HTML special characters to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped text safe for HTML
 */
export function escapeHtml(text) {
  if (text === null || text === undefined) {
    return '';
  }

  const replacements = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  let result = String(text);
  for (const [char, replacement] of Object.entries(replacements)) {
    result = result.replaceAll(char, replacement);
  }
  return result;
}

/**
 * Prevent CSV formula injection by prefixing dangerous cells
 * @param {any} value - Cell value
 * @returns {string} Sanitized cell content
 */
export function preventCSVInjection(value) {
  const str = String(value || '');

  // Check if starts with dangerous formula characters
  if (/^[=@+-]/.test(str)) {
    // Prefix with single quote to neutralize
    return "'" + str;
  }

  return str;
}

/**
 * Sanitize a single table cell
 * @param {any} cell - Cell value
 * @returns {string} Sanitized cell content
 */
export function sanitizeCell(cell) {
  if (cell === null || cell === undefined) {
    return '';
  }

  let str = String(cell);

  // Apply CSV injection prevention FIRST
  str = preventCSVInjection(str);

  // Then escape HTML
  str = escapeHtml(str);

  // Truncate if too long
  return str.substring(0, 1000);
}

/**
 * Validate table data
 * @param {Array<Array>} data - 2D array of table data
 * @returns {Object} {valid: boolean, error: string|null}
 */
export const TIER_LIMITS = {
  free: {
    maxRows: 500,
    maxCols: 50,
    maxSize: 5242880
  },
  pro: {
    maxRows: 5000,
    maxCols: 100,
    maxSize: 5242880
  }
};
export function validateInput(data, tier = 'free') {
  const limits = TIER_LIMITS[tier];
  if (!Array.isArray(data)) {
    return { valid: false, error: 'Data must be an array' };
  }

  if (data.length === 0) {
    return { valid: false, error: 'Data cannot be empty' };
  }

  if (data.length > limits.maxRows) {
    return { valid: false, error: `Too many rows (max ${limits.maxRows}). <a href="/pricing" style="color: #0066cc; text-decoration: underline;">Get Pro →</a>` };
  }

  for (let i = 0; i < data.length; i++) {
    if (!Array.isArray(data[i])) {
      return { valid: false, error: `Row ${i} is not an array` };
    }

    if (data[i].length > limits.maxCols) {
      return { valid: false, error: `Row ${i} has too many columns (max ${limits.maxCols}). <a href="/pricing" style="color: #0066cc; text-decoration: underline;">Get Pro →</a>` };
    }
  }

  const jsonSize = JSON.stringify(data).length;
  if (jsonSize > limits.maxSize) {
    return { valid: false, error: 'Data too large (max 5MB). <a href="/pricing" style="color: #0066cc; text-decoration: underline;">Get Pro →</a>' };
  }

  return { valid: true, error: null };
}

/**
 * Detect malicious content patterns
 * @param {string} text - Text to check
 * @returns {boolean} True if malicious
 */
export function detectMaliciousContent(text) {
  const maliciousPatterns = [
    /<script/i,
    /javascript:/i,
    /data:/i,
    /on\w+=/i,
    /<iframe/i,
    /eval\(/i,
    /expression\(/i
  ];

  return maliciousPatterns.some(pattern => pattern.test(text));
}
