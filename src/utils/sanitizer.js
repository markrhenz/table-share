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
  // Check both raw and HTML-escaped formula characters
  if (/^[=@+-]/.test(str) || /^&(amp;|lt;|gt;|quot;|#39;)*[=@+-]/.test(str)) {
    return "'" + str;
  }
  return str;
}

/**
 * Sanitize a single table cell for STORAGE and HTML display.
 *
 * Deliberately does NOT call preventCSVInjection. That guard prefixes anything
 * starting with = @ + - with an apostrophe, which corrupted every negative
 * number on the rendered page (-5 displayed as '-5). Formula injection is an
 * Excel-import threat, so the guard now lives at CSV export time inside
 * downloadCSV() in handlers/view.js. Do not move it back here.
 *
 * @param {any} cell - Cell value
 * @returns {string} Sanitized cell content
 */
export function sanitizeCell(cell) {
  if (cell === null || cell === undefined) {
    return '';
  }
  let str = String(cell);
  // Escape HTML to prevent XSS
  str = escapeHtml(str);
  // Truncate
  str = str.substring(0, 1000);
  return str;
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
  },
  owner: {
    maxRows: 999999,
    maxCols: 9999,
    // Workers KV caps a single value at 25 MiB on ALL plans. The previous 100MB
    // limit could not be honoured: the request passed validation and then threw
    // inside KV.put(), surfacing as an opaque 500. 24 MiB leaves envelope headroom.
    maxSize: 25165824 // 24MB (KV hard ceiling is 25 MiB)
  }
};
export function validateInput(data, tier = 'free') {
  // Unknown/missing tier must not crash. A keys:* record lacking a 'tier' field
  // used to yield TIER_LIMITS[undefined], then threw on limits.maxRows -> 500.
  const limits = TIER_LIMITS[tier] || TIER_LIMITS.free;
  if (!Array.isArray(data)) {
    return { valid: false, error: 'Data must be an array' };
  }

  if (data.length === 0) {
    return { valid: false, error: 'Data cannot be empty' };
  }

  if (data.length > limits.maxRows) {
    return { valid: false, error: `Too many rows (max ${limits.maxRows}). <a href="/pricing" style="text-decoration: underline;">Get Pro →</a>` };
  }

  for (let i = 0; i < data.length; i++) {
    if (!Array.isArray(data[i])) {
      return { valid: false, error: `Row ${i} is not an array` };
    }

    if (data[i].length > limits.maxCols) {
      return { valid: false, error: `Row ${i} has too many columns (max ${limits.maxCols}). <a href="/pricing" style="text-decoration: underline;">Get Pro →</a>` };
    }
  }

  const jsonSize = JSON.stringify(data).length;
  if (jsonSize > limits.maxSize) {
    return { valid: false, error: 'Data too large (max 5MB). <a href="/pricing" style="text-decoration: underline;">Get Pro →</a>' };
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
    /<script[\s>]/i,
    /javascript\s*:/i,
    /<iframe[\s>]/i,
    /eval\s*\(/i,
    /expression\s*\(/i,
    /on(click|load|error|mouseover|focus|blur|submit|change|input|keydown|keyup|mousedown|mouseup|dblclick|contextmenu|drag|drop)\s*=/i
  ];

  return maliciousPatterns.some(pattern => pattern.test(text));
}
