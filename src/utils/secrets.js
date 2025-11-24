/**
 * Secure environment variable handling utility
 * Provides validation, error handling, and fallback mechanisms for secrets
 */

/**
 * Get environment variable with validation and error handling
 * @param {Object} env - Environment object from Cloudflare Workers
 * @param {string} name - Environment variable name
 * @param {Object} options - Configuration options
 * @param {boolean} options.required - Whether the variable is required (default: true)
 * @param {string} options.fallback - Optional fallback value for development
 * @param {string} options.description - Description for error messages
 * @returns {string|null} The environment variable value or null
 * @throws {Error} If required variable is missing and no fallback provided
 */
export function getSecret(env, name, options = {}) {
  const { required = true, fallback = null, description = name } = options;
  
  // Get value from environment
  const value = env[name];
  
  // If value exists and is not empty, return it
  if (value && value.trim().length > 0) {
    return value.trim();
  }
  
  // If not required and no fallback, return null
  if (!required && !fallback) {
    return null;
  }
  
  // If fallback exists and is valid, return it
  if (fallback && fallback.trim().length > 0) {
    // Using fallback - acceptable for development
    return fallback.trim();
  }

  // If required and no value/fallback, throw error
  if (required) {
    const errorMsg = `Missing required environment variable: ${name}${description !== name ? ` (${description})` : ''}`;
    throw new Error(errorMsg);
  }
  
  return null;
}

/**
 * Validate multiple secrets at once
 * @param {Object} env - Environment object from Cloudflare Workers
 * @param {Array} secrets - Array of secret configurations
 * @returns {Object} Object with all validated secrets
 * @throws {Error} If any required secret is missing
 */
export function validateSecrets(env, secrets) {
  const results = {};
  const errors = [];
  
  for (const secret of secrets) {
    try {
      const { name, options = {} } = secret;
      results[name] = getSecret(env, name, options);
    } catch (error) {
      if (options.required !== false) {
        errors.push(error.message);
      }
    }
  }
  
  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
  }
  
  return results;
}

/**
 * Get analytics secrets with validation
 * @param {Object} env - Environment object
 * @returns {Object} Validated analytics configuration
 */
export function getAnalyticsSecrets(env) {
  return validateSecrets(env, [
    {
      name: 'ADMIN_ANALYTICS_KEY',
      options: {
        required: true,
        description: 'API key for accessing analytics dashboard'
      }
    }
  ]);
}

/**
 * Get Ko-fi webhook secrets with validation
 * @param {Object} env - Environment object
 * @returns {Object} Validated Ko-fi webhook configuration
 */
export function getKofiSecrets(env) {
  return validateSecrets(env, [
    {
      name: 'KOFI_TOKEN',
      options: {
        required: true,
        description: 'Ko-fi webhook verification token'
      }
    },
    {
      name: 'SENDGRID_API_KEY',
      options: {
        required: true,
        description: 'SendGrid API key for email delivery'
      }
    }
  ]);
}

/**
 * Check if a secret exists without throwing
 * @param {Object} env - Environment object
 * @param {string} name - Secret name
 * @returns {boolean} True if secret exists and is not empty
 */
export function hasSecret(env, name) {
  const value = env[name];
  return value && value.trim().length > 0;
}

/**
 * Check secret availability status (for programmatic validation)
 * @param {Object} env - Environment object
 * @param {Array} secretNames - Array of secret names to check
 * @returns {Object} Object mapping secret names to availability status
 */
export function checkSecretStatus(env, secretNames) {
  const status = {};
  secretNames.forEach(name => {
    status[name] = hasSecret(env, name);
  });
  return status;
}