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
    '&': '&',
    '<': '<',
    '>': '>',
    '"': '"',
    "'": '&#' + '39;'
  };
  
  return String(text).replace(/[&<>"']/g, char => replacements[char]);
}

/**
 * Prevent CSV formula injection by prefixing dangerous cells
 * @param {any} value - Cell value
 * @returns {string} Sanitized cell content
 */
export function preventCSVInjection(value) {
  const str = String(value || '');

  // Check if starts with dangerous formula characters
  if (/^[=@+\-]/.test(str)) {
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
export function validateInput(data) {
  if (!Array.isArray(data)) {
    return { valid: false, error: 'Data must be an array' };
  }
  
  if (data.length === 0) {
    return { valid: false, error: 'Data cannot be empty' };
  }
  
  if (data.length > 1000) {
    return { valid: false, error: 'Too many rows (max 1000)' };
  }
  
  for (let i = 0; i < data.length; i++) {
    if (!Array.isArray(data[i])) {
      return { valid: false, error: `Row ${i} is not an array` };
    }
    
    if (data[i].length > 100) {
      return { valid: false, error: `Row ${i} has too many columns (max 100)` };
    }
  }
  
  const jsonSize = JSON.stringify(data).length;
  if (jsonSize > 51200) {
    return { valid: false, error: 'Data too large (max 50KB)' };
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
