import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        // Cloudflare Workers globals
        fetch: 'readonly',
        Request: 'readonly',
        Response: 'readonly',
        URL: 'readonly',
        Headers: 'readonly',
        FormData: 'readonly',
        crypto: 'readonly',
        console: 'readonly',
        // Browser globals (for inline scripts)
        document: 'readonly',
        window: 'readonly',
        localStorage: 'readonly',
        navigator: 'readonly',
        alert: 'readonly',
        confirm: 'readonly',
        setTimeout: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      'no-console': 'off',
      'semi': ['error', 'always'],
      'quotes': ['warn', 'single', { avoidEscape: true }],
      'indent': ['warn', 2],
      'no-trailing-spaces': 'warn',
      'eol-last': ['warn', 'always']
    }
  },
  {
    ignores: [
      'node_modules/',
      'dist/',
      '.wrangler/'
    ]
  }
];
