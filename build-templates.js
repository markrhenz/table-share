#!/usr/bin/env node

/**
 * Build script to generate templates.js from HTML files
 * Run this before deploying: node build-templates.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATES_DIR = path.join(__dirname, 'src', 'templates');
const OUTPUT_FILE = path.join(__dirname, 'src', 'utils', 'templates.js');

console.log('🔨 Building templates from HTML files...\n');

// Read all HTML files
// ONLY blog templates - other templates are hardcoded in templates.js
const templateFiles = {
  blogIndexTemplate: 'blog-index.html',
  blogPostExcelTemplate: 'blog-post-excel.html',
  blogPostSqlTemplate: 'blog-post-sql.html',
  blogPostSheetsTemplate: 'blog-post-sheets.html'
};

const templates = {};

// Read each HTML file
for (const [varName, fileName] of Object.entries(templateFiles)) {
  const filePath = path.join(TEMPLATES_DIR, fileName);

  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  Warning: ${fileName} not found, skipping...`);
    continue;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  templates[varName] = content;
  console.log(`✓ Loaded ${fileName}`);
}

// Generate template exports
const templateExports = Object.entries(templates).map(([varName, content]) => {
  // Escape backticks and ${ in the HTML content
  const escapedContent = content
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');

  return `export const ${varName} = \`${escapedContent}\`;`;
}).join('\n\n');

// Hardcoded non-blog templates (not read from HTML files)
const hardcodedTemplates = `
// NON-BLOG TEMPLATES - These are hardcoded and NOT auto-generated from HTML files
// Blog templates above are auto-generated. Only edit these manually or in their source handlers.

export const indexTemplate = \`${fs.readFileSync(path.join(TEMPLATES_DIR, 'index.html'), 'utf-8').replace(/\\/g, '\\\\').replace(/\`/g, '\\`').replace(/\$\{/g, '\\${')} \`;

export const viewTemplate = \`${fs.readFileSync(path.join(TEMPLATES_DIR, 'view.html'), 'utf-8').replace(/\\/g, '\\\\').replace(/\`/g, '\\`').replace(/\$\{/g, '\\${')} \`;

export const pricingTemplate = \`${fs.readFileSync(path.join(TEMPLATES_DIR, 'pricing.html'), 'utf-8').replace(/\\/g, '\\\\').replace(/\`/g, '\\`').replace(/\$\{/g, '\\${')} \`;

export const termsTemplate = \`${fs.readFileSync(path.join(TEMPLATES_DIR, 'terms.html'), 'utf-8').replace(/\\/g, '\\\\').replace(/\`/g, '\\`').replace(/\$\{/g, '\\${')} \`;

export const privacyTemplate = \`${fs.readFileSync(path.join(TEMPLATES_DIR, 'privacy.html'), 'utf-8').replace(/\\/g, '\\\\').replace(/\`/g, '\\`').replace(/\$\{/g, '\\${')} \`;

export const passwordFormTemplate = \`
<div style="max-width: 400px; margin: 100px auto; padding: 40px; border: 1px solid #ddd; border-radius: 8px; text-align: center;">
  <h2 style="margin-bottom: 20px; color: #333;">Enter Password</h2>
  <p style="color: #666; margin-bottom: 30px;">This table is password protected.</p>
  <form method="POST" style="margin-bottom: 20px;">
    <input type="password" name="password" placeholder="Enter password" required 
           style="width: 100%; padding: 12px; margin-bottom: 20px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;">
    <button type="submit" 
            style="width: 100%; padding: 12px; background: #007bff; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer;">
      Unlock Table
    </button>
  </form>
  <a href="/" style="color: #007bff; text-decoration: none;">← Back to Table Share</a>
  {{ERROR_MESSAGE}}
</div>
\`;


`;

// Generate templates.js
const output = `/**
 * AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
 * Blog templates are generated from HTML files in src/templates/
 * Non-blog templates are snapshot copies (edit the HTML files and rebuild)
 * Run 'npm run build-templates' to regenerate
 */

// BLOG TEMPLATES - Auto-generated from HTML files
${templateExports}

${hardcodedTemplates}

/**
 * Render password form for protected tables
 * @param {Object} params - Parameters
 * @param {string} params.tableId - Table ID
 * @param {boolean} params.hasError - Whether to show error message
 * @returns {string} Rendered HTML
 */
export function renderPasswordForm({ tableId, hasError }) {
  return passwordFormTemplate
    .replace(/{{TABLE_ID}}/g, tableId)
    .replace('{{ERROR_MESSAGE}}', hasError ? '<p style="color: red; margin-bottom: 20px;">Incorrect password. Please try again.</p>' : '');
}

/**
 * Render table view
 * @param {Object} params - Parameters
 * @param {string} params.pageTitle - Page title
 * @param {string} params.tableTitle - Table title
 * @param {string} params.expirationText - Expiration text
 * @param {string} params.tableHtml - Table HTML content
 * @param {string} params.tableId - Table ID
 * @param {boolean} params.noBranding - Whether to hide branding
 * @returns {string} Rendered HTML
 */
export function renderTableView({ pageTitle, tableTitle, expirationText, tableHtml, tableId, noBranding }) {
  let html = viewTemplate
    .replace('{{PAGE_TITLE}}', pageTitle)
    .replace('{{TABLE_TITLE}}', tableTitle)
    .replace('{{EXPIRATION_TEXT}}', expirationText)
    .replace('{{TABLE_HTML}}', tableHtml)
    .replace(/{{TABLE_ID}}/g, tableId);

  // Handle branding conditional
  if (noBranding) {
    html = html.replace(/{{#NO_BRANDING}}[\\s\\S]*?{{else}}[\\s\\S]*?{{\\/NO_BRANDING}}/g, '');
  } else {
    html = html.replace(/{{#NO_BRANDING}}[\\s\\S]*?{{else}}/g, '').replace(/{{\\/NO_BRANDING}}/g, '');
  }

  return html;
}

export const baseUrl = 'https://table-share.org';
`;

// Write to file
fs.writeFileSync(OUTPUT_FILE, output, 'utf-8');

console.log(`\n✅ Generated ${OUTPUT_FILE}`);
console.log(`📦 ${Object.keys(templates).length} templates exported\n`);
