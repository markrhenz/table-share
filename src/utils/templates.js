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
  <title>Table Share - Share Tables Instantly | No Signup, Free CSV & Spreadsheet Sharing</title>
  <!-- SEO Meta Tags -->
  <meta name="description" content="Share tables online in 5 seconds. Paste CSV, Excel, or spreadsheet data - get instant shareable link. No signup required. Free up to 500 rows. The fastest pastebin for tables.">
  <meta name="keywords" content="share table online, share csv online, pastebin for tables, spreadsheet sharing no login, share excel without account, csv to link, ephemeral table sharing">
  <meta name="author" content="Table Share">
  <link rel="canonical" href="https://table-share.org">
  <!-- Open Graph Tags for Social Sharing -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://table-share.org">
  <meta property="og:title" content="Table Share - Share Tables Instantly | No Signup Required">
  <meta property="og:description" content="Paste CSV or spreadsheet data, get shareable link in 5 seconds. No signup for you or recipients. Free pastebin for tables.">
  <meta property="og:image" content="https://table-share.org/logo.png">
  <meta property="og:site_name" content="Table Share">
  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:url" content="https://table-share.org">
  <meta name="twitter:title" content="Table Share - Share Tables Instantly | No Signup Required">
  <meta name="twitter:description" content="Paste CSV or spreadsheet data, get shareable link in 5 seconds. No signup for you or recipients. Free pastebin for tables.">
  <meta name="twitter:image" content="https://table-share.org/logo.png">
  <link rel="icon" type="image/png" href="/logo.png">

  <!-- Schema.org structured data for Google rich snippets -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Table Share",
    "url": "https://table-share.org",
    "description": "Share tables online in 5 seconds. Paste CSV, Excel, or spreadsheet data - get instant shareable link. No signup required. Free pastebin for tables.",
    "logo": "https://table-share.org/logo.png",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://table-share.org/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }
  </script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 700px;
      margin: 40px auto;
      padding: 20px;
      background: #fff;
      color: #000;
      line-height: 1.5;
    }

    h1 {
      font-size: 24px;
      font-weight: normal;
      margin-bottom: 8px;
    }

    .tagline {
      font-size: 14px;
      color: #666;
      margin-bottom: 20px;
    }

    #dataInput {
      width: 100%;
      height: 300px;
      font-family: Consolas, Monaco, monospace;
      font-size: 14px;
      border: 2px solid #000;
      padding: 10px;
      margin-bottom: 10px;
    }

    #generateBtn {
      background: #0066CC;
      color: #fff;
      border: none;
      padding: 12px 24px;
      font-size: 16px;
      cursor: pointer;
      display: none;
    }

    #status {
      color: #228B22;
      margin-top: 10px;
      display: none;
    }

    #status.show { display: block; }

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
  <h1>Table Share</h1>
  <p class="tagline">Paste your table. Get a link.</p>

  <textarea id="dataInput" placeholder="Paste your table here (from Excel, Sheets, or CSV)"></textarea>

  <button id="generateBtn">Generate Link</button>

  <div id="status"></div>

  <footer>
    Created with <a href="/">Table Share</a>
  </footer>

  <!-- Honeypot for bot detection -->
  <input type="text" name="website" id="website" style="position:absolute;left:-9999px;" tabindex="-1" autocomplete="off" aria-hidden="true">


  <script>
    const dataInput = document.getElementById('dataInput');
    const generateBtn = document.getElementById('generateBtn');
    const status = document.getElementById('status');

    // Show button on paste
    dataInput.addEventListener('paste', () => {
      setTimeout(() => {
        if (dataInput.value.trim()) {
          generateBtn.style.display = 'block';
        }
      }, 100);
    });

    // Process on button click
    generateBtn.addEventListener('click', processData);

    async function processData() {
      const rawData = dataInput.value.trim();

      if (!rawData) return;

      // Check honeypot
      if (document.getElementById('website').value) {
        showError('Invalid submission detected');
        return;
      }

      // Show loading
      status.textContent = 'Generating your link...';
      status.classList.add('show');
      generateBtn.style.display = 'none';

      // Parse manually
      const rows = rawData
        .trim()
        .split(/\\r?\\n/)
        .map(row => row.trim().split(/\\t|,/));

      if (rows.length === 0) {
        showError('No data found to share.');
        return;
      }

      // Send to API
      try {
        const response = await fetch('/api/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data: rows,
            honeypot: document.getElementById('website').value
          })
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to create table');
        }

        // Copy to clipboard
        await navigator.clipboard.writeText(result.url);

        // Show success
        showSuccess('✓ Link copied!');

        // Clear after 3 seconds
        setTimeout(() => {
          status.classList.remove('show');
        }, 3000);

      } catch (error) {
        showError(error.message);
      }
    }

    function showSuccess(message) {
      status.textContent = message;
      status.classList.add('show');
    }

    function showError(message) {
      status.textContent = message;
      status.classList.add('show');
      generateBtn.style.display = 'block';
    }
  </script>
</body>
</html> `;

export const viewTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{TABLE_TITLE}} - Table Share</title>
  <meta name="description" content="View shared table: {{TABLE_TITLE}}. Table shared via Table Share - no signup required.">
  <meta name="robots" content="noindex, nofollow">
  <link rel="icon" type="image/png" href="/logo.png">
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
  <meta name="description" content="Table Share pricing: Free plan with 500 rows and 7-day links. Pro plan at $5 one-time for 5,000 rows, 90-day links, password protection, and API access.">
  <meta property="og:title" content="Table Share Pricing - Free Plan or Pro for $5">
  <link rel="canonical" href="https://table-share.org/pricing">
  <link rel="icon" type="image/png" href="/logo.png">

  <!-- Schema.org structured data for Google rich snippets -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Table Share",
    "url": "https://table-share.org",
    "description": "Share tables online in 5 seconds. Paste CSV, Excel, or spreadsheet data - get instant shareable link. No signup required. Free pastebin for tables.",
    "logo": "https://table-share.org/logo.png",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://table-share.org/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }
  </script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      background: #fff;
      color: #000;
      line-height: 1.5;
    }

    h1 {
      font-size: 32px;
      font-weight: normal;
      margin-bottom: 8px;
    }

    .tagline {
      font-size: 16px;
      color: #666;
      margin-bottom: 40px;
    }

    .back-link {
      display: inline-block;
      margin-bottom: 20px;
      color: #0066CC;
      text-decoration: none;
      font-size: 14px;
    }

    .back-link:hover { text-decoration: underline; }

    .pricing-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 40px;
    }

    .plan {
      border: 2px solid #000;
      padding: 20px;
    }

    .plan h2 {
      font-size: 20px;
      margin-bottom: 10px;
    }

    .price {
      font-size: 24px;
      margin-bottom: 20px;
    }

    .features {
      list-style: none;
      margin-bottom: 20px;
    }

    .features li {
      margin-bottom: 8px;
      padding-left: 20px;
      position: relative;
    }

    .features li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #228B22;
    }

    .get-started {
      background: #0066CC;
      color: #fff;
      border: none;
      padding: 12px 24px;
      font-size: 16px;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
    }

    .popular {
      background: #0066CC;
      color: #fff;
    }

    .popular h2,
    .popular .price {
      color: #fff;
    }

    footer {
      margin-top: 60px;
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

    @media (max-width: 600px) {
      .pricing-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <a href="/" class="back-link">← Back to Table Share</a>

  <h1>Pricing</h1>
  <p class="tagline">Choose the plan that's right for you.</p>

  <div class="pricing-grid">
    <div class="plan">
      <h2>Free</h2>
      <div class="price">$0</div>
      <ul class="features">
        <li>Up to 500 rows</li>
        <li>Up to 20 columns</li>
        <li>Link expires in 7 days</li>
        <li>Basic sharing</li>
      </ul>
      <button class="get-started" onclick="location.href='/'">Get Started</button>
    </div>

    <div class="plan popular">
      <h2>Pro</h2>
      <div class="price">$5<span style="font-size:16px">one-time</span></div>
      <ul class="features">
        <li>Up to 5,000 rows</li>
        <li>Up to 100 columns</li>
        <li>Custom expiration (1-90 days)</li>
        <li>Password protection</li>
        <li>CSV export</li>
        <li>Priority support</li>
        <li>No ads</li>
      </ul>
      <button class="get-started">Get Pro</button>
    </div>
  </div>

  <footer>
    Created with <a href="/">Table Share</a>
  </footer>
</body>
</html> `;

export const termsTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Terms of Service - Table Share</title>
    <meta name="description" content="Table Share Terms of Service. No accounts required. Free tables expire in 7 days, Pro tables in 90 days. Acceptable use policy and data handling.">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="canonical" href="https://table-share.org/terms">
    <link rel="icon" type="image/png" href="/logo.png">

    <!-- Schema.org structured data for Google rich snippets -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Table Share",
      "url": "https://table-share.org",
      "description": "Share tables online in 5 seconds. Paste CSV, Excel, or spreadsheet data - get instant shareable link. No signup required. Free pastebin for tables.",
      "logo": "https://table-share.org/logo.png",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://table-share.org/?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
    </script>
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
    <p>We store your pasted data for 7 days (or custom duration up to 90 days if Pro). No accounts = no personal data collected. See <a href="/privacy">Privacy Policy</a>.</p>
    
    <h2>5. No Warranty</h2>
    <p>Service provided "as is." We don't guarantee uptime, data persistence, or security.</p>
    
    <h2>6. Termination</h2>
    <p>We may remove content or block users who violate these terms.</p>
    
    <h2>7. Contact</h2>
    <p>Questions? Email: <a href="mailto:markrhenz@table-share.org">markrhenz@table-share.org</a></p>
</body>
</html> `;

export const privacyTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Privacy Policy - Table Share</title>
    <meta name="description" content="Table Share Privacy Policy. Minimal data collection: pasted tables stored 7 days (free) or 90 days (Pro). No accounts, no tracking, no personal data.">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="canonical" href="https://table-share.org/privacy">
    <link rel="icon" type="image/png" href="/logo.png">

    <!-- Schema.org structured data for Google rich snippets -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Table Share",
      "url": "https://table-share.org",
      "description": "Share tables online in 5 seconds. Paste CSV, Excel, or spreadsheet data - get instant shareable link. No signup required. Free pastebin for tables.",
      "logo": "https://table-share.org/logo.png",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://table-share.org/?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
    </script>
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
        <li>Pasted table data (stored 7 days, up to 90 days for Pro)</li>
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
    <p>Tables auto-delete after 7 days (or custom duration for Pro users up to 90 days). Manual deletion: email us.</p>
    
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
