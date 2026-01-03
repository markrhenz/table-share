import { sanitizeCell } from '../utils/sanitizer.js';
import { incrementMetric } from '../utils/analytics.js';

const TABLE_ID_PLACEHOLDER = '__TABLE_ID__';

// Constant-time comparison to prevent timing attacks
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

const VIEW_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{PAGE_TITLE}}</title>
  <link rel="icon" type="image/png" href="/logo.png">
  <link rel="stylesheet" href="/view.css">
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
      // Rate limit password attempts (3 per minute per IP per table)
      const ip = request.headers.get('CF-Connecting-IP') || '127.0.0.1';
      const pwRateLimitKey = `pw-rate:${id}:${ip}:${Math.floor(Date.now() / 60000)}`;

      if (request.method === 'POST') {
        try {
          const attempts = await env.TABLES.get(pwRateLimitKey);
          const attemptCount = attempts ? parseInt(attempts) : 0;

          if (attemptCount >= 3) {
            return new Response(`
              <!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Too Many Attempts - Table Share</title>
                <link rel="icon" type="image/png" href="/logo.png">
                <style>
                  body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
                    max-width: 400px;
                    margin: 100px auto;
                    padding: 20px;
                    text-align: center;
                  }
                  .error { color: #d00; font-size: 18px; }
                  a { color: #0066cc; }
                </style>
              </head>
              <body>
                <img src="/logo.png" alt="Table Share" width="64" height="64">
                <h1>Too Many Attempts</h1>
                <p class="error">Please wait 1 minute before trying again.</p>
                <p><a href="/t/${id}">Try again</a></p>
              </body>
              </html>
            `, {
              status: 429,
              headers: { 'Content-Type': 'text/html' }
            });
          }

          // Increment attempt counter
          await env.TABLES.put(pwRateLimitKey, String(attemptCount + 1), { expirationTtl: 60 });
        } catch (error) {
          console.error('Password rate limit check failed:', error);
          // Fail open - don't block if KV fails
        }
      }

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

          if (timingSafeEqual(submittedHash, passwordHash)) {
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