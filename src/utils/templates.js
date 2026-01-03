/**
 * AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
 * Blog templates are generated from HTML files in src/templates/
 * Non-blog templates are snapshot copies (edit the HTML files and rebuild)
 * Run 'npm run build-templates' to regenerate
 */

// BLOG TEMPLATES - Auto-generated from HTML files



// NON-BLOG TEMPLATES - These are hardcoded and NOT auto-generated from HTML files
// Blog templates above are auto-generated. Only edit these manually or in their source handlers.

export const indexTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Table Share - The Fastest Way to Share a Table</title>
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <header>
        <img src="/logo.png" width="48" height="48" alt="Table Share" class="logo">
        <h1 class="logo-text">Table Share</h1>
        <p class="tagline">The fastest way to share a table</p>
        <p class="cta">Stop taking screenshots. Paste your data and get an instant shareable link.</p>
    </header>
    <main>
        <textarea id="pasteBox" class="paste-box" placeholder="Paste your table data here (from Excel, Google Sheets, CSV, or anywhere)...

Example:
Name    Age    City
Alice   30     NYC
Bob     25     LA"></textarea>
        <button id="generateBtn" class="button">Generate Link</button>
        <div id="status" class="status"></div>
        <section class="how-it-works">
            <h2>How It Works</h2>
            <div class="steps">
                <div class="step">
                    <div class="step-number">1</div>
                    <h3>Paste</h3>
                    <p>Copy data from Excel, Sheets, CSV, or any table</p>
                </div>
                <div class="step">
                    <div class="step-number">2</div>
                    <h3>Generate</h3>
                    <p>Get an instant shareable link (auto-copied)</p>
                </div>
                <div class="step">
                    <div class="step-number">3</div>
                    <h3>Share</h3>
                    <p>Send link anywhere. Recipients need no account.</p>
                </div>
            </div>
        </section>
        <section class="use-cases">
            <h2>Perfect For</h2>
            <div class="case-list">
                <div class="case">
                    <h3>🔧 Developers</h3>
                    <p>Share SQL query results, API responses, or log data with teammates or clients instantly</p>
                </div>
                <div class="case">
                    <h3>💼 Freelancers</h3>
                    <p>Send pricing tables, project timelines, or deliverables without formatting nightmares</p>
                </div>
                <div class="case">
                    <h3>👥 Teams</h3>
                    <p>Quick data snapshots for meetings, action items, or temporary lists</p>
                </div>
                <div class="case">
                    <h3>📊 Data Analysts</h3>
                    <p>Share analysis results, pandas DataFrame outputs, or R data tables</p>
                </div>
            </div>
        </section>
        <section class="features">
            <h2>Why Table Share?</h2>
            <div class="feature-grid">
                <div class="feature">
                    <div class="feature-icon">⚡</div>
                    <h3>5-Second Workflow</h3>
                    <p>From paste to shareable link in under 5 seconds</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">🚫</div>
                    <h3>No Accounts</h3>
                    <p>Zero signup for you or recipients. Forever.</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">📱</div>
                    <h3>Mobile-Perfect</h3>
                    <p>Clean, readable tables on any device</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">🔒</div>
                    <h3>Auto-Expires</h3>
                    <p>Links expire in 30 days (privacy by default)</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">💾</div>
                    <h3>CSV Download</h3>
                    <p>Recipients can export to spreadsheet</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">🛡️</div>
                    <h3>Security Built-In</h3>
                    <p>XSS prevention, rate limiting, content filtering</p>
                </div>
            </div>
        </section>
    </main>
    <footer>
        <p>&copy; 2025 Table Share | <a href="mailto:markrhenz@table-share.org">Contact</a> | <a href="/terms">Terms</a> | <a href="/privacy">Privacy</a></p>
    </footer>
    <script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>
    <script>
        const pasteBox = document.getElementById('pasteBox');
        const generateBtn = document.getElementById('generateBtn');
        const status = document.getElementById('status');
        pasteBox.addEventListener('paste', () => {
            setTimeout(() => {
                if (pasteBox.value.trim()) {
                    generateBtn.style.display = 'block';
                }
            }, 100);
        });
        pasteBox.addEventListener('input', () => {
            if (pasteBox.value.trim()) {
                generateBtn.style.display = 'block';
            } else {
                generateBtn.style.display = 'none';
            }
        });
        generateBtn.addEventListener('click', async () => {
            const data = pasteBox.value.trim();
            if (!data) return;
            status.textContent = 'Generating link...';
            generateBtn.disabled = true;
            try {
                const parsed = Papa.parse(data, {
                    quoteChar: '"',
                    escapeChar: '"',
                    header: false,
                    dynamicTyping: false,
                    skipEmptyLines: true
                });
                const response = await fetch('/api/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        data: parsed.data,
                        honeypot: ''
                    })
                });
                const result = await response.json();
                if (result.url) {
                    await navigator.clipboard.writeText(result.url);
                    status.textContent = '✓ Link copied to clipboard!';
                    setTimeout(() => {
                        globalThis.location.href = result.url;
                    }, 1000);
                } else {
                    throw new Error('Failed to generate link');
                }
            } catch (error) {
                status.textContent = '✗ Error: ' + error.message;
                generateBtn.disabled = false;
            }
        });
    </script>
</body>
</html> `;

export const viewTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{TABLE_TITLE}} - Table Share</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      max-width: 900px;
      margin: 40px auto;
      padding: 20px;
      background: #fff;
      color: #000;
    }

    table {
       width: 100%;
       border: 2px solid #000;
       border-collapse: collapse;
       margin: 20px 0;
       overflow-x: auto;
       display: block;
       box-sizing: border-box;
     }

    th {
      background: #F5F5F5;
      border: 1px solid #000;
      padding: 10px;
      text-align: left;
      font-weight: 600;
    }

    td {
      border: 2px solid #000;
      padding: 10px;
    }

    .download-link {
      display: block;
      margin: 20px 0;
      color: #0066CC;
      text-decoration: none;
    }

    .download-link:hover {
      text-decoration: underline;
    }

    footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #000;
      text-align: center;
      font-size: 12px;
      color: #666;
    }

    footer a {
      color: #0066CC;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <table>
    {{TABLE_HTML}}
  </table>

  <a href="#" class="download-link" onclick="downloadCSV()">Download CSV</a>

  <footer>
    Created with <a href="/">Table Share</a> | <a href="mailto:markrhenz@table-share.org?subject=Report Table {{TABLE_ID}}">Report Abuse</a>
  </footer>

  <script>
    function downloadCSV() {
      const table = document.querySelector('table');
      if (!table) {
        alert('No table found to download');
        return;
      }

      const rows = table.querySelectorAll('tr');
      const csv = [];

      rows.forEach(row => {
        const cells = row.querySelectorAll('th, td');
        const rowData = Array.from(cells).map(cell => {
          let text = cell.textContent.trim();

          // Escape CSV special characters
          if (text.includes(',') || text.includes('"') || text.includes('\\n')) {
            text = '"' + text.replace(/"/g, '""') + '"';
          }

          return text;
        });

        csv.push(rowData.join(','));
      });

      // Create blob and download
      const csvContent = csv.join('\\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'table-{{TABLE_ID}}.csv';
      link.click();
      window.URL.revokeObjectURL(url);
    }
  </script>
</body>
</html> `;

export const pricingTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pricing - Table Share</title>
    <link rel="icon" type="image/png" href="/logo.png">
    <style>
        :root {
            --bg-color: #fff;
            --text-color: #000;
            --secondary-bg: #f5f5f5;
            --border-color: #000;
            --accent-color: #0066cc;
            --muted-color: #666;
        }
        [data-theme="dark"] {
            --bg-color: #1a1a1a;
            --text-color: #fff;
            --secondary-bg: #2a2a2a;
            --border-color: #fff;
            --accent-color: #4da6ff;
            --muted-color: #aaa;
        }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; max-width: 1000px; margin: 40px auto; padding: 20px; background: var(--bg-color); color: var(--text-color); }
        .pricing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin: 60px 0; }
        .tier { border: 2px solid var(--border-color); padding: 40px; }
        .tier.pro { background: var(--secondary-bg); }
        .tier h2 { font-size: 32px; margin-bottom: 10px; }
        .price { font-size: 48px; font-weight: 700; margin: 20px 0; }
        .price small { font-size: 18px; color: var(--muted-color); }
        .tier ul { list-style: none; margin: 30px 0; }
        .tier li { padding: 10px 0; border-bottom: 1px solid var(--border-color); }
        .tier li:last-child { border-bottom: none; }
        .cta-button { display: block; width: 100%; padding: 15px; background: var(--accent-color); color: #fff; text-align: center; text-decoration: none; font-size: 18px; font-weight: 600; margin-top: 20px; }
        .cta-button:hover { background: #0052A3; }
        @media (max-width: 768px) { .pricing-grid { grid-template-columns: 1fr; } }
    </style>
</head>
<body>
    <div style="text-align: center; margin-bottom: 60px;">
        <a href="/" style="text-decoration: none; color: var(--text-color); display: inline-flex; align-items: center; gap: 16px;">
            <img src="/logo.png" width="48" height="48" alt="Table Share">
            <h1 style="margin: 0; font-size: 48px;">Table Share Pricing</h1>
        </a>
        <p style="font-size: 20px; color: var(--muted-color); margin-top: 20px;">Choose the plan that fits your needs</p>
    </div>
    
    <div class="pricing-grid">
        <div class="tier">
            <h2>Free</h2>
            <div class="price">$0<small>/forever</small></div>
            <ul>
                <li>✓ 500 rows max</li>
                <li>✓ 50 columns max</li>
                <li>✓ 7-day expiration</li>
                <li>✓ CSV download</li>
                <li>✓ Dark mode</li>
                <li>✓ No signup required</li>
            </ul>
            <a href="/" class="cta-button">Start Free</a>
        </div>
        
        <div class="tier pro">
            <h2>Pro</h2>
            <div class="price">$5<small>/one-time</small></div>
            <ul>
                <li>✓ <strong>5,000 rows</strong> (10x increase)</li>
                <li>✓ <strong>100 columns</strong> (2x increase)</li>
                <li>✓ <strong>Custom expiration</strong> (1-30 days)</li>
                <li>✓ <strong>Password protection</strong></li>
                <li>✓ <strong>Remove branding</strong></li>
                <li>✓ <strong>API access</strong></li>
                <li>✓ <strong>Extended validity</strong> (up to 90 days)</li>
            </ul>
            <a href="https://ko-fi.com/tableshare" class="cta-button">Get Pro via Ko-fi</a>
            <p style="text-align: center; margin-top: 10px; font-size: 14px; color: var(--muted-color);">Instant API key after payment</p>
        </div>
    </div>
    
    <div style="text-align: center; margin-top: 60px;">
        <p style="color: var(--muted-color);">Questions? <a href="mailto:markrhenz@table-share.org" style="color: var(--accent-color);">Contact us</a></p>
        <p style="margin-top: 20px;"><a href="/" style="color: var(--accent-color);">← Back to Table Share</a></p>
    </div>
</body>
</html> `;

export const termsTemplate = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Terms of Service - Table Share</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            line-height: 1.6;
        }
        h1 { margin-bottom: 10px; }
        h2 { margin-top: 30px; }
        .updated { color: #666; margin-bottom: 30px; }
    </style>
</head>
<body>
    <h1>Terms of Service</h1>
    <p class="updated">Last updated: October 25, 2025</p>
    
    <h2>1. Acceptance of Terms</h2>
    <p>By using Table Share, you agree to these terms. If you don't agree, don't use the service.</p>
    
    <h2>2. Service Description</h2>
    <p>Table Share allows you to paste tabular data and generate shareable links. Links expire after 7 days by default.</p>
    
    <h2>3. Acceptable Use</h2>
    <p>You may NOT use Table Share to:</p>
    <ul>
        <li>Share illegal, malicious, or harmful content</li>
        <li>Violate others' privacy or intellectual property</li>
        <li>Distribute spam, phishing, or malware</li>
        <li>Abuse the service (e.g., excessive automation)</li>
    </ul>
    
    <h2>4. Data & Privacy</h2>
    <p>We store your pasted data for 7 days (or custom duration up to 30 days if premium). No accounts = no personal data collected. See <a href="/privacy">Privacy Policy</a>.</p>
    
    <h2>5. No Warranty</h2>
    <p>Service provided "as is." We don't guarantee uptime, data persistence, or security.</p>
    
    <h2>6. Termination</h2>
    <p>We may remove content or block users who violate these terms.</p>
    
    <h2>7. Contact</h2>
    <p>Questions? Email: <a href="mailto:markrhenz@table-share.org">markrhenz@table-share.org</a></p>
</body>
</html> `;

export const privacyTemplate = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Privacy Policy - Table Share</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            line-height: 1.6;
        }
        h1 { margin-bottom: 10px; }
        h2 { margin-top: 30px; }
        .updated { color: #666; margin-bottom: 30px; }
    </style>
</head>
<body>
    <h1>Privacy Policy</h1>
    <p class="updated">Last updated: October 25, 2025</p>
    
    <h2>1. What We Collect</h2>
    <p><strong>No accounts = minimal data:</strong></p>
    <ul>
        <li>Pasted table data (stored 7 days, up to 30 days for premium)</li>
        <li>IP address (rate limiting only, not logged)</li>
        <li>Browser metadata (standard HTTP headers)</li>
    </ul>
    <p><strong>We do NOT collect:</strong> Names, emails, passwords, payment info, tracking cookies</p>
    
    <h2>2. How We Use Data</h2>
    <ul>
        <li>Display tables to link recipients</li>
        <li>Rate limiting (prevent abuse)</li>
        <li>Security (XSS, malicious content detection)</li>
    </ul>
    
    <h2>3. Data Retention</h2>
    <p>Tables auto-delete after 7 days (or custom duration for premium users up to 30 days). Manual deletion: email us.</p>
    
    <h2>4. Third Parties</h2>
    <p>We use Cloudflare (hosting/CDN). They may collect standard logs. No analytics/tracking.</p>
    
    <h2>5. Your Rights</h2>
    <ul>
        <li>Request deletion: email markrhenz@table-share.org with link</li>
        <li>No data portability (no accounts)</li>
        <li>GDPR/CCPA: Data auto-expires, no PII stored</li>
    </ul>
    
    <h2>6. Security</h2>
    <p>Data encrypted in transit (HTTPS). Storage on Cloudflare infrastructure.</p>
    
    <h2>7. Changes</h2>
    <p>We'll update this page. No email notifications (no accounts!).</p>
    
    <h2>8. Contact</h2>
    <p>Email: <a href="mailto:markrhenz@table-share.org">markrhenz@table-share.org</a></p>
</body>
</html> `;

export const passwordFormTemplate = `
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
`;




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
    html = html.replace(/{{#NO_BRANDING}}[\s\S]*?{{else}}[\s\S]*?{{\/NO_BRANDING}}/g, '');
  } else {
    html = html.replace(/{{#NO_BRANDING}}[\s\S]*?{{else}}/g, '').replace(/{{\/NO_BRANDING}}/g, '');
  }

  return html;
}

export const baseUrl = 'https://table-share.org';
