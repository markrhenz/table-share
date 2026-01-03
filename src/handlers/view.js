import { sanitizeCell } from '../utils/sanitizer.js';
import { incrementMetric } from '../utils/analytics.js';

const TABLE_ID_PLACEHOLDER = '__TABLE_ID__';

const VIEW_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{PAGE_TITLE}}</title>
  <link rel="icon" type="image/png" href="/logo.png">
  <style>
    :root {
      --bg-color: #fff;
      --text-color: #000;
      --border-color: #000;
      --accent-color: #0066cc;
      --muted-color: #666;
    }
    [data-theme="dark"] {
      --bg-color: #000;
      --text-color: #fff;
      --border-color: #fff;
      --accent-color: #4da6ff;
      --muted-color: #aaa;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      max-width: 1600px;
      margin: 40px auto;
      padding: 20px;
      background: var(--bg-color);
      color: var(--text-color);
    }

    .table-wrapper {
      width: fit-content;
      max-width: 100%;
      max-height: 70vh;
      overflow-y: auto;
      overflow-x: auto;
      border: 2px solid var(--border-color);
      margin: 20px auto;
      box-sizing: border-box;
      position: relative;
    }

    .table-container {
      width: 100%;
      -webkit-overflow-scrolling: touch;
    }

    table {
      width: auto;
      margin: 0 auto;
      border-collapse: collapse;
      border: none;
    }

    thead tr {
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    th, td {
      padding: 12px 16px;
      text-align: left;
      vertical-align: top;
      border: 1px solid var(--border-color);
      font-size: 14px;
      line-height: 1.4;
    }

    th {
      background: var(--bg-color);
      font-weight: 700;
      white-space: nowrap;
      padding: 12px 16px;
      text-align: left;
      border: 1px solid var(--border-color);
      border-bottom: 2px solid var(--border-color);
      font-size: 14px;
      line-height: 1.4;
      box-shadow: inset 0 -2px 0 0 var(--border-color);
      position: relative;
    thead tr.is-sticky th,
    thead tr[style*="position: sticky"] th {
      border-top: 2px solid var(--border-color);
    }
    }

    td {
      max-width: 400px;
      overflow-wrap: break-word;
      white-space: normal;
    }

    td:first-child,
    th:first-child {
      white-space: nowrap;
      min-width: 120px;
    }

    footer {
      margin-top: 40px;
      padding-top: 20px;
      text-align: center;
      font-size: 12px;
      color: var(--muted-color);
    }

    footer a {
      color: var(--accent-color);
      text-decoration: none;
    }

    button:hover {
      opacity: 0.9;
    }

    .theme-toggle {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid var(--border-color);
      background: var(--bg-color);
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .theme-toggle::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--text-color);
    }

    [data-theme="dark"] img[src="/logo.png"] {
      filter: invert(1);
    }

    @media (max-width: 600px) {
      body {
        padding: 10px;
        margin: 10px auto;
        max-width: 100vw;
      }
      
      .table-container {
        position: relative;
      }
      
      .table-wrapper {
        margin: 10px 0;
        max-height: 60vh;
        border-width: 1px;
        position: relative;
      }
      
      /* Scroll gradient indicators */
      .table-wrapper::before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 20px;
        background: linear-gradient(to right, rgba(0,0,0,0.1), transparent);
        pointer-events: none;
        z-index: 5;
      }
      
      .table-wrapper::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        width: 20px;
        background: linear-gradient(to left, rgba(0,0,0,0.1), transparent);
        pointer-events: none;
        z-index: 5;
      }
      
      th, td {
        padding: 10px 12px;
        font-size: 14px;
        min-width: 80px;
        max-width: 200px;
        line-height: 1.5;
      }
      
      th:first-child {
        position: sticky;
        left: 0;
        background: var(--bg-color);
        border-right: 2px solid var(--border-color);
        z-index: 15;
      }
      
      th {
        font-size: 13px;
        padding: 12px;
      }
      
      button {
        width: 100%;
        font-size: 18px;
        padding: 16px;
      }

      h1 {
        font-size: 20px;
        padding: 0 10px;
        line-height: 1.3;
        word-break: break-word;
        hyphens: auto;
      }

      a img {
        width: 32px;
        height: 32px;
      }

      a span {
        font-size: 16px;
        line-height: 32px;
      }

      .theme-toggle {
        width: 36px;
        height: 36px;
      }
    }
  </style>
  <script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
</head>
<body>
  <button id="themeToggle" class="theme-toggle" aria-label="Toggle dark mode"></button>
  <div style="text-align: center; margin-bottom: 40px;">
    <a href="/" style="text-decoration: none; color: var(--text-color); display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 16px;">
      <img src="/logo.png" width="48" height="48" alt="Table Share">
      <span style="font-size: 48px; font-weight: 700; margin: 0;">Table Share</span>
    </a>
  </div>
  <div style="text-align: center; margin-bottom: 20px; padding-bottom: 20px;">
    <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 8px; word-wrap: break-word; max-width: 100%; overflow-wrap: break-word;">{{TABLE_TITLE}}</h1>
    <p style="font-size: 14px; color: var(--muted-color);">{{EXPIRATION_TEXT}}</p>
  </div>
  <div class="table-wrapper">
    <div class="table-container">
      <table>
        {{TABLE_HTML}}
      </table>
    </div>
  </div>

  <div style="text-align: center; margin: 20px 0;">
    <button onclick="downloadCSV(); return false;" style="background: var(--accent-color); color: #fff; border: none; padding: 12px 24px; font-size: 16px; font-weight: 600; cursor: pointer; border-radius: 4px;">
      Download CSV
    </button>
  </div>

  <div id="proUpgradePrompt" style="display: none; background: var(--secondary-bg, #f5f5f5); border: 2px solid var(--border-color); padding: 16px; margin: 20px 0; text-align: center; border-radius: 4px;">
    <p style="margin: 0 0 12px 0; font-size: 14px; color: var(--text-color);">
      Extend table expiration up to 90 days
    </p>
    <a href="/pricing" style="background: var(--accent-color); color: #fff; padding: 8px 16px; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 4px; margin-right: 12px;">Upgrade to Pro</a>
    <button onclick="dismissProPrompt(); return false;" style="background: transparent; border: 2px solid var(--border-color); padding: 8px 16px; cursor: pointer; font-size: 14px; color: var(--text-color);">Dismiss</button>
  </div>

  {{#NO_BRANDING}}
  {{else}}
  <footer>
    Created with <a href="/">Table Share</a> |
    <a href="mailto:markrhenz@table-share.org?subject=Report Table {{TABLE_ID}}">
      Report Abuse
    </a>
  </footer>
  {{/NO_BRANDING}}

  <script>
    const themeToggle = document.getElementById('themeToggle');
    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
    function getPreferredTheme() {
      const stored = localStorage.getItem('theme');
      if (stored) return stored;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    applyTheme(getPreferredTheme());
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });

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
          if (text.includes(',') || text.includes('"') || text.includes('\\n')) {
            text = '"' + text.replace(/"/g, '""') + '"';
          }
          return text;
        });
        csv.push(rowData.join(','));
      });

      const csvContent = csv.join('\\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'table-{{TABLE_ID}}.csv';
      link.click();
      window.URL.revokeObjectURL(url);
    }

    function dismissProPrompt() {
      document.getElementById('proUpgradePrompt').style.display = 'none';
      sessionStorage.setItem('proPromptDismissed', 'true');
    }

    function showProPromptIfFree() {
      if (sessionStorage.getItem('proPromptDismissed') === 'true') {
        return;
      }

      const expirationEl = document.querySelector('p[style*="color: var(--muted-color)"]');
      if (!expirationEl) return;

      const expirationText = expirationEl.textContent.trim();
      let isFree = false;

      if (expirationText === 'Expires soon') {
        isFree = true;
      } else if (expirationText.startsWith('Expires in ')) {
        const match = expirationText.match(/Expires in (\d+) days/);
        if (match) {
          const days = parseInt(match[1]);
          if (days <= 7) {
            isFree = true;
          }
        }
      }

      if (isFree) {
        document.getElementById('proUpgradePrompt').style.display = 'block';
      }
    }

    // Show Pro prompt after page load for free users
    document.addEventListener('DOMContentLoaded', showProPromptIfFree);
  </script>
</body>
</html>`;

export async function handleView(request, env, id) {
  try {
    if (!/^[a-zA-Z0-9]{8}$/.test(id)) {
      return new Response('Not Found', { status: 404 });
    }

    const dataStr = await env.TABLES.get(id);
    if (!dataStr) {
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head><title>Table Not Found</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h1>Table Not Found</h1>
          <p>The table you're looking for doesn't exist or has expired.</p>
          <a href="/">Create a new table</a>
        </body>
        </html>
      `, { status: 404, headers: { 'Content-Type': 'text/html' } });
    }

    const tableData = JSON.parse(dataStr);
    let { data, title, createdAt, expiresAt, passwordHash, noBranding } = tableData;

    // Check for existing unlock cookie
    if (passwordHash) {
      const cookieHeader = request.headers.get('Cookie') || '';
      const cookieName = `ts_unlock_${id}`;
      const cookieMatch = cookieHeader.match(new RegExp(`${cookieName}=([^;]+)`));
      
      if (cookieMatch) {
        const cookieValue = cookieMatch[1];
        // Verify cookie matches password hash prefix
        if (cookieValue === passwordHash.substring(0, 16)) {
          // Valid cookie - skip password form, proceed to show table
          // (fall through to table rendering)
        } else {
          // Invalid cookie - continue to password check
        }
      }
    }

    // Check if password protected
    if (passwordHash) {
      // Check if password was submitted via POST to /t/{id}/unlock
      if (request.method === 'POST' && request.headers.get('content-type')?.includes('application/x-www-form-urlencoded')) {
        const formData = await request.formData();
        const submittedPassword = formData.get('password');

        if (submittedPassword) {
          // Hash the submitted password
          const encoder = new TextEncoder();
          const data = encoder.encode(submittedPassword);
          const hashBuffer = await crypto.subtle.digest('SHA-256', data);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const submittedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

          if (submittedHash === passwordHash) {
            // Password correct - set session cookie
            const cookieName = `ts_unlock_${id}`;
            const cookieValue = submittedHash.substring(0, 16); // First 16 chars of hash as token
            const maxAge = 3600; // 1 hour
            
            // Create response with cookie header
            // Continue to render table below, but we'll add Set-Cookie to final response
            const unlockCookie = `${cookieName}=${cookieValue}; Max-Age=${maxAge}; HttpOnly; SameSite=Strict; Path=/t/${id}`;
            
            // Store cookie value to add to response headers later
            request.unlockCookie = unlockCookie;
          } else {
            // Password incorrect, show form again with error
            return new Response(`
              <!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Required - Table Share</title>
                <link rel="icon" type="image/png" href="/logo.png">
                <style>
                  body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
                    max-width: 400px;
                    margin: 100px auto;
                    padding: 20px;
                    text-align: center;
                    background: #fff;
                    color: #000;
                  }
                  .logo {
                    width: 64px;
                    height: 64px;
                    margin-bottom: 20px;
                  }
                  form {
                    margin: 20px 0;
                  }
                  input[type="password"] {
                    width: 100%;
                    padding: 12px;
                    border: 2px solid #000;
                    font-size: 16px;
                    margin-bottom: 10px;
                  }
                  button {
                    background: #0066cc;
                    color: #fff;
                    border: none;
                    padding: 12px 24px;
                    font-size: 16px;
                    cursor: pointer;
                    width: 100%;
                  }
                  .error {
                    color: #d00;
                    margin-bottom: 10px;
                  }
                </style>
              </head>
              <body>
                <img src="/logo.png" alt="Table Share" class="logo">
                <h1>Password Required</h1>
                <p>This table is password protected.</p>
                <form method="POST" action="/t/${id}/unlock">
                  <div class="error">Incorrect password. Please try again.</div>
                  <input type="password" name="password" placeholder="Enter password" required>
                  <button type="submit">Unlock Table</button>
                </form>
              </body>
              </html>
            `, {
              status: 200,
              headers: { 'Content-Type': 'text/html' }
            });
          }
        }
      } else {
        // Show password form
        return new Response(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Required - Table Share</title>
            <link rel="icon" type="image/png" href="/logo.png">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
                max-width: 400px;
                margin: 100px auto;
                padding: 20px;
                text-align: center;
                background: #fff;
                color: #000;
              }
              .logo {
                width: 64px;
                height: 64px;
                margin-bottom: 20px;
              }
              form {
                margin: 20px 0;
              }
              input[type="password"] {
                width: 100%;
                padding: 12px;
                border: 2px solid #000;
                font-size: 16px;
                margin-bottom: 10px;
              }
              button {
                background: #0066cc;
                color: #fff;
                border: none;
                padding: 12px 24px;
                font-size: 16px;
                cursor: pointer;
                width: 100%;
              }
            </style>
          </head>
          <body>
            <img src="/logo.png" alt="Table Share" class="logo">
            <h1>Password Required</h1>
            <p>This table is password protected.</p>
            <form method="POST" action="/t/${id}/unlock">
              <input type="password" name="password" placeholder="Enter password" required>
              <button type="submit">Unlock Table</button>
            </form>
          </body>
          </html>
        `, {
          status: 200,
          headers: { 'Content-Type': 'text/html' }
        });
      }
    }

    // Track view analytics (fail silently)
    try {
      await incrementMetric(env.TABLES, 'table_views');
    } catch (error) {
      console.error('Analytics tracking failed:', error);
    }

    // Calculate expiration using stored timestamp
    const now = new Date();
    const expiryDate = expiresAt ? new Date(expiresAt) : new Date(new Date(createdAt).getTime() + 7 * 24 * 60 * 60 * 1000); // Fallback to 7 days for old tables
    const daysLeft = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
    
    const pageTitle = title ? `${title} - Table Share` : 'Table - Table Share';
    const tableTitle = title || 'Table';
    const expirationText = daysLeft > 1 ? `Expires in ${daysLeft} days` : 'Expires soon';

    const maxCols = Math.max(...data.map(r => r.length));
    data = data.map(r => {
      while (r.length > 0 && r.at(-1) === "") r.pop();
      while (r.length < maxCols) r.push("");
      return r;
    });

    let tableHtml = '';
    if (data.length > 0) {
      tableHtml += '<thead><tr>';
      for (const cell of data[0]) {
        tableHtml += `<th>${sanitizeCell(cell)}</th>`;
      }
      tableHtml += '</tr></thead>';

      tableHtml += '<tbody>';
      for (let i = 1; i < data.length; i++) {
        tableHtml += '<tr>';
        for (const cell of data[i]) {
          tableHtml += `<td>${sanitizeCell(cell)}</td>`;
        }
        tableHtml += '</tr>';
      }
      tableHtml += '</tbody>';
    }

    let html = VIEW_TEMPLATE
      .replace(/{{PAGE_TITLE}}/g, pageTitle)
      .replace(/{{TABLE_TITLE}}/g, tableTitle)
      .replace(/{{EXPIRATION_TEXT}}/g, expirationText)
      .replace(/{{TABLE_HTML}}/g, tableHtml)
      .replace(/{{TABLE_ID}}/g, id);

    // Handle conditional footer based on noBranding flag
    if (noBranding) {
      html = html.replace(/{{#NO_BRANDING}}[\s\S]*?{{else}}[\s\S]*?{{\/NO_BRANDING}}/g, '');
    } else {
      html = html.replace(/{{#NO_BRANDING}}[\s\S]*?{{else}}/g, '').replace(/{{\/NO_BRANDING}}/g, '');
    }

    const headers = {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=3600'
    };

    if (request.unlockCookie) {
      headers['Set-Cookie'] = request.unlockCookie;
    }

    return new Response(html, {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('Error in handleView:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}