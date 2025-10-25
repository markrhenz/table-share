/**
 * Maximum allowed size for input data in bytes (50KB)
 */
const MAX_SIZE = 50 * 1024;

/**
 * Maximum allowed number of rows
 */
const MAX_ROWS = 1000;

/**
 * Maximum allowed number of columns per row
 */
const MAX_COLS = 50;

/**
 * Validate input data for size and structure constraints
 * @param {Array<Array>} data - 2D array of table data
 * @returns {Object} { valid: boolean, error: string | null }
 * @example validateInput([['Name', 'Age'], ['Alice', 30]])
 * // Returns: { valid: true, error: null }
 */
export function validateInput(data) {
  // Check if data is array
  if (!Array.isArray(data)) {
    return { valid: false, error: 'Data must be an array' };
  }

  // Check if not empty
  if (data.length === 0) {
    return { valid: false, error: 'Data cannot be empty' };
  }

  // Check max rows
  if (data.length > MAX_ROWS) {
    return { valid: false, error: `Too many rows (max ${MAX_ROWS})` };
  }

  // Check each row
  for (let i = 0; i < data.length; i++) {
    if (!Array.isArray(data[i])) {
      return { valid: false, error: `Row ${i} is not an array` };
    }

    // Check max columns
    if (data[i].length > MAX_COLS) {
      return { valid: false, error: `Row ${i} has too many columns (max ${MAX_COLS})` };
    }
  }

  // Check total size
  const jsonSize = JSON.stringify(data).length;
  if (jsonSize > MAX_SIZE) {
    return { valid: false, error: `Data too large (max ${MAX_SIZE} bytes)` };
  }

  return { valid: true, error: null };
}

/**
 * Validate if ID matches base62 pattern (8 characters, alphanumeric only)
 * @param {string} id - ID string to validate
 * @returns {boolean} True if valid base62 ID
 * @example isValidId('aB3xK9mZ') // Returns: true
 */
export function isValidId(id) {
  if (typeof id !== 'string') {
    return false;
  }

  // Check length and pattern: exactly 8 alphanumeric characters
  return /^[a-zA-Z0-9]{8}$/.test(id);
}