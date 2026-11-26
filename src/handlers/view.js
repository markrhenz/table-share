import { corsHeaders, htmlResponse, textResponse } from '../utils/headers.js';
import { incrementMetric } from '../utils/analytics.js';
import { checkRateLimit } from '../utils/rate-limiter.js';
import { verifyPassword, cookieToken } from '../utils/password.js';
import { logView, hostFromReferer } from '../utils/ae.js';

const TABLE_ID_PLACEHOLDER = '__TABLE_ID__';

const VIEW_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>{{PAGE_TITLE}}</title>
  <!-- Phase 1: OG/Twitter cards so shared /t/ links unfurl (Slack, Discord, X, Reddit) -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://table-share.org/t/{{TABLE_ID}}">
  <meta property="og:title" content="{{OG_TITLE}}">
  <meta property="og:description" content="{{OG_DESC}}">
  <meta property="og:image" content="https://table-share.org/logo.png">
  <meta property="og:site_name" content="Table Share">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="{{OG_TITLE}}">
  <meta name="twitter:description" content="{{OG_DESC}}">
  <meta name="twitter:image" content="https://table-share.org/logo.png">
  <link rel="icon" type="image/png" href="/logo.png">
  <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
  <link rel="preconnect" href="https://scripts.simpleanalyticscdn.com" crossorigin>
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
      width: 100%;
      max-height: 70vh;
      overflow-y: auto;
      overflow-x: auto;
      border: none;
      margin: 0;
      box-sizing: border-box;
      position: relative;
    }

    .table-wrapper.expanded {
      max-height: none;
    }

    .table-panel {
      border: none;
      margin: 20px auto;
    }

    .action-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 16px;
      background: var(--bg-color);
      border: 2px solid var(--border-color);
      margin: 20px auto 0 auto;
      gap: 10px;
    }

    .action-meta {
      font-size: 13px;
      color: var(--muted-color);
      white-space: nowrap;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
      flex-wrap: nowrap;
    }

    .action-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      font-size: 13px;
      font-weight: 600;
      border: 2px solid var(--border-color);
      background: var(--bg-color);
      color: var(--text-color);
      cursor: pointer;
      white-space: nowrap;
      font-family: inherit;
    }

    .action-btn:hover {
      background: var(--text-color);
      color: var(--bg-color);
    }

    .action-btn.primary {
      background: var(--accent-color);
      color: #fff;
      border-color: var(--accent-color);
    }

    .action-btn.primary:hover {
      opacity: 0.85;
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
       max-width: 400px;
       overflow-wrap: break-word;
       white-space: normal;
       padding: 12px 16px;
       text-align: left;
       border: 1px solid var(--border-color);
       border-bottom: 2px solid var(--border-color);
       font-size: 14px;
       line-height: 1.4;
       box-shadow: inset 0 2px 0 0 var(--border-color), inset 0 -2px 0 0 var(--border-color);
       position: relative;
     }

     thead tr.is-sticky th,
     thead tr[style*="position: sticky"] th {
       border-top: 2px solid var(--border-color);
     }

    td {
      max-width: 400px;
      overflow-wrap: break-word;
      white-space: normal;
    }

    tbody tr:nth-child(even) {
      background: color-mix(in srgb, var(--text-color) 4%, var(--bg-color));
    }

    td:first-child,
    th:first-child {
      min-width: 120px;
      white-space: normal;
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
        margin: 0;
        max-height: 60vh;
        border: none;
        position: relative;
      }

      .table-panel {
        border: none;
        margin: 10px 0;
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

      .action-bar {
        flex-direction: column;
        gap: 8px;
        padding: 10px 12px;
        border: 2px solid var(--border-color);
        border-bottom: none;
        margin: 10px 0 0 0;
      }

      .action-buttons {
        width: 100%;
        justify-content: stretch;
      }

      .action-btn {
        flex: 1;
        justify-content: center;
        padding: 10px 8px;
        font-size: 12px;
      }
    }
  </style>
  <script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
</head>
<body>
  <button id="themeToggle" class="theme-toggle" aria-label="Toggle dark mode"></button>
  <div style="text-align: center; margin-bottom: 20px;">
    <a href="/" style="text-decoration: none; color: var(--text-color); display: inline-flex; align-items: center; gap: 8px;">
      <img src="/logo.png" width="24" height="24" alt="Table Share">
      <span style="font-size: 16px; font-weight: 600;">Table Share</span>
    </a>
  </div>
  {{TITLE_SECTION}}
  <div class="action-bar">
    <span class="action-meta">{{ROW_COUNT}} row{{ROW_PLURAL}} &times; {{COL_COUNT}} col{{COL_PLURAL}}{{ACTION_BAR_EXPIRY}}</span>
    <div class="action-buttons">
      <button class="action-btn" onclick="copyLink()" id="copyLinkBtn">
        &#x1F4CB; Copy Link
      </button>
      <button class="action-btn primary" onclick="downloadCSV()">
        &#x2B07; Download CSV
      </button>
      <button class="action-btn" onclick="toggleExpand()" id="expandBtn" title="Expand table">
        &#x26F6; Expand
      </button>
    </div>
  </div>
  <div class="table-panel">
  <div class="table-wrapper" id="tableWrapper">
    <div class="table-container">
      <table>
        {{TABLE_HTML}}
      </table>
    </div>
  </div>
  </div>

  {{#NO_BRANDING}}
  {{else}}
  <footer>
    <a href="/?s={{TABLE_ID}}" style="font-weight: 600;">Create your own free table →</a><br>
    Created with <a href="/?s={{TABLE_ID}}">Table Share</a> |
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
          // CSV formula-injection guard, applied at EXPORT (not at storage, so the
          // on-page table renders the user's real values).
          if (/^[=@+\-]/.test(text)) { text = "'" + text; }
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

    function copyLink() {
      const url = window.location.href;
      const btn = document.getElementById('copyLinkBtn');
      navigator.clipboard.writeText(url).then(() => {
        btn.innerHTML = '&#x2705; Copied!';
        setTimeout(() => { btn.innerHTML = '&#x1F4CB; Copy Link'; }, 2000);
      }).catch(() => {
        // Fallback for older browsers
        const input = document.createElement('input');
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        btn.innerHTML = '&#x2705; Copied!';
        setTimeout(() => { btn.innerHTML = '&#x1F4CB; Copy Link'; }, 2000);
      });
    }

    function toggleExpand() {
      const wrapper = document.getElementById('tableWrapper');
      const btn = document.getElementById('expandBtn');
      const isExpanded = wrapper.classList.toggle('expanded');
      btn.innerHTML = isExpanded ? '&#x26F6; Collapse' : '&#x26F6; Expand';
      btn.title = isExpanded ? 'Collapse table' : 'Expand table';
    }
  </script>
</body>
</html>`;

const PASSWORD_FORM_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Required - Table Share</title>
  <!-- Phase 1: generic OG tags — crawlers hit this form for protected tables; never leak the real title -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="Protected Table - Table Share">
  <meta property="og:description" content="This table is password protected. No signup needed to view.">
  <meta property="og:image" content="https://table-share.org/logo.png">
  <meta property="og:site_name" content="Table Share">
  <meta name="twitter:card" content="summary">
  <link rel="icon" type="image/png" href="/logo.png">
  <style>
    :root {
      --bg-color: #fff;
      --text-color: #000;
      --border-color: #000;
      --accent-color: #0066cc;
      --error-color: #d00;
    }
    [data-theme="dark"] {
      --bg-color: #000;
      --text-color: #fff;
      --border-color: #fff;
      --accent-color: #4da6ff;
      --error-color: #ff6666;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      max-width: 400px;
      margin: 100px auto;
      padding: 20px;
      text-align: center;
      background: var(--bg-color);
      color: var(--text-color);
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
      border: 2px solid var(--border-color);
      font-size: 16px;
      margin-bottom: 10px;
      background: var(--bg-color);
      color: var(--text-color);
    }
    button {
      background: var(--accent-color);
      color: #fff;
      border: none;
      padding: 12px 24px;
      font-size: 16px;
      cursor: pointer;
      width: 100%;
    }
    .error {
      color: var(--error-color);
      margin-bottom: 10px;
    }
    [data-theme="dark"] img[src="/logo.png"] {
      filter: invert(1);
    }
  </style>
</head>
<body>
  <button onclick="const c=document.documentElement.getAttribute('data-theme');const n=c==='dark'?'light':'dark';document.documentElement.setAttribute('data-theme',n);localStorage.setItem('theme',n);"
    style="position:absolute;top:20px;right:20px;width:40px;height:40px;border-radius:50%;border:2px solid var(--text-color);background:var(--bg-color);cursor:pointer;"
    aria-label="Toggle dark mode">
    <span style="display:block;width:20px;height:20px;border-radius:50%;background:var(--text-color);margin:auto;"></span>
  </button>
  <img src="/logo.png" alt="Table Share" class="logo">
  <h1>Password Required</h1>
  <p>This table is password protected.</p>
  <form method="POST" action="/t/{{TABLE_ID}}/unlock">
    {{ERROR_MESSAGE}}
    <input type="password" name="password" placeholder="Enter password" required>
    <button type="submit">Unlock Table</button>
  </form>
  <script>
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
  </script>
</body>
</html>`;

export async function handleView(request, env, id) {
  try {
    if (!/^[a-zA-Z0-9]{8}$/.test(id)) {
      return textResponse('Not Found', 404);
    }

    const dataStr = await env.TABLES.get(id);
    if (!dataStr) {
      const notFoundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>Table Not Found - Table Share</title>
  <link rel="icon" type="image/png" href="/logo.png">
  <style>
    :root { --bg-color: #fff; --text-color: #000; --accent-color: #0066cc; --muted-color: #666; }
    [data-theme="dark"] { --bg-color: #000; --text-color: #fff; --accent-color: #4da6ff; --muted-color: #aaa; }
    [data-theme="dark"] img[src="/logo.png"] { filter: invert(1); }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; background: var(--bg-color); color: var(--text-color); text-align: center; padding: 60px 20px; margin: 0; }
    a { color: var(--accent-color); text-decoration: none; }
    .btn { display: inline-block; background: var(--accent-color); color: #fff; padding: 14px 32px; font-size: 18px; font-weight: 600; border: none; margin-top: 24px; }
  </style>
</head>
<body>
  <a href="/"><img src="/logo.png" width="64" height="64" alt="Table Share"></a>
  <h1 style="font-size: 36px; margin: 20px 0 10px;">Table Not Found</h1>
  <p style="font-size: 18px; color: var(--muted-color); margin-bottom: 8px;">This table doesn't exist or has expired.</p>
  <p style="font-size: 14px; color: var(--muted-color);">Free tables expire after 7 days. Pro tables last 90 days.</p>
  <a href="/" class="btn">Share a New Table</a>
  <script>
    const s = localStorage.getItem('theme');
    if (s) document.documentElement.setAttribute('data-theme', s);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) document.documentElement.setAttribute('data-theme', 'dark');
  </script>
</body>
</html>`;
      return htmlResponse(notFoundHtml, 404);
    }

    let tableData;
    try {
      tableData = JSON.parse(dataStr);
    } catch (parseError) {
      const dataErrorHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>Data Error - Table Share</title>
  <link rel="icon" type="image/png" href="/logo.png">
  <style>
    :root { --bg-color: #fff; --text-color: #000; --accent-color: #0066cc; --muted-color: #666; }
    [data-theme="dark"] { --bg-color: #000; --text-color: #fff; --accent-color: #4da6ff; --muted-color: #aaa; }
    [data-theme="dark"] img[src="/logo.png"] { filter: invert(1); }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; background: var(--bg-color); color: var(--text-color); text-align: center; padding: 60px 20px; margin: 0; }
    a { color: var(--accent-color); text-decoration: none; }
    .btn { display: inline-block; background: var(--accent-color); color: #fff; padding: 14px 32px; font-size: 18px; font-weight: 600; border: none; margin-top: 24px; }
  </style>
</head>
<body>
  <a href="/"><img src="/logo.png" width="64" height="64" alt="Table Share"></a>
  <h1 style="font-size: 36px; margin: 20px 0 10px;">Data Error</h1>
  <p style="font-size: 18px; color: var(--muted-color); margin-bottom: 8px;">This table's data appears to be corrupted.</p>
  <a href="/" class="btn">Share a New Table</a>
  <script>
    const s = localStorage.getItem('theme');
    if (s) document.documentElement.setAttribute('data-theme', s);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) document.documentElement.setAttribute('data-theme', 'dark');
  </script>
</body>
</html>`;
      return htmlResponse(dataErrorHtml, 500);
    }

    let { data, title, createdAt, expiresAt, passwordHash, noBranding, noHeaders } = tableData;
    // passwordSalt / passwordKdf are read inside the verify logic via tableData (may be absent on legacy records)

    // Phase 0: log the /t/ view (loop raw material) on GET only — zero KV cost
    if (request.method === 'GET') {
      logView(env, { tableId: id, referrerHost: hostFromReferer(request.headers.get('Referer')) });
    }

    // ==========================================
    // PASSWORD PROTECTION LOGIC (FIXED)
    // ==========================================
    let isUnlocked = false;
    let unlockCookie = null;

    if (passwordHash) {
      // Step 1: Check for existing valid cookie
      const cookieHeader = request.headers.get('Cookie') || '';
      const cookieName = `ts_unlock_${id}`;
      const cookieMatch = cookieHeader.match(new RegExp(`${cookieName}=([^;]+)`));

      if (cookieMatch) {
        const cookieValue = cookieMatch[1];
        if (cookieValue === cookieToken(tableData)) {
          // Valid cookie found - user is already unlocked
          isUnlocked = true;
        }
      }

      // Step 2: If not unlocked by cookie, check for POST password submission
      if (!isUnlocked && request.method === 'POST') {
        const contentType = request.headers.get('content-type') || '';
        if (contentType.includes('application/x-www-form-urlencoded')) {
          // Rate limiting: 10 attempts per minute per IP per table ID
          const ip = request.headers.get('CF-Connecting-IP') || '127.0.0.1';
          const minute = Math.floor(Date.now() / 60000);
          const rateKey = `pwd:${ip}:${id}:${minute}`;

          const maxAttempts = 10;
          const countStr = await env.TABLES.get(rateKey);
          const count = countStr ? parseInt(countStr, 10) : 0;

          if (count >= maxAttempts) {
            const errorHtml = PASSWORD_FORM_TEMPLATE
              .replace(/{{TABLE_ID}}/g, id)
              .replace(/{{ERROR_MESSAGE}}/g, '<div class="error">Too many password attempts. Please wait 60 seconds.</div>');
            return htmlResponse(errorHtml, 429, { 'Retry-After': '60', 'Cache-Control': 'private, no-store' });
          }

          // Increment counter with 60-second expiration
          await env.TABLES.put(rateKey, String(count + 1), { expirationTtl: 60 });

          const formData = await request.formData();
          const submittedPassword = formData.get('password');

          if (submittedPassword) {
            // Verify against stored record (PBKDF2 for new tables, legacy SHA-256 for old)
            const { ok, cookieValue } = await verifyPassword(submittedPassword, tableData);

            if (ok) {
              // Password correct - unlock and set cookie
              isUnlocked = true;
              const maxAge = 3600; // 1 hour
              unlockCookie = `${cookieName}=${cookieValue}; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Strict; Path=/t/${id}`;
            } else {
              // Password incorrect - show form with error
              const errorHtml = PASSWORD_FORM_TEMPLATE
                .replace(/{{TABLE_ID}}/g, id)
                .replace(/{{ERROR_MESSAGE}}/g, '<div class="error">Incorrect password. Please try again.</div>');
              return htmlResponse(errorHtml, 200, { 'Cache-Control': 'private, no-store' });
            }
          }
        }
      }

      // Step 3: If still not unlocked, show password form
      if (!isUnlocked) {
        const formHtml = PASSWORD_FORM_TEMPLATE
          .replace(/{{TABLE_ID}}/g, id)
          .replace(/{{ERROR_MESSAGE}}/g, '');
        return htmlResponse(formHtml, 200, { 'Cache-Control': 'private, no-store' });
      }
    }
    // ==========================================
    // END PASSWORD PROTECTION LOGIC
    // ==========================================

    // Track view analytics (fail silently).
    // bumpLifetime:false — stats:lifetime:table_views is written by nobody's reader.
    // handleStats only reads stats:lifetime:tables_created. Halves the per-view KV
    // write cost (2 -> 1) against the 1,000 writes/day free ceiling.
    try {
      await incrementMetric(env.TABLES, 'table_views', { bumpLifetime: false });
    } catch (error) {
      // Analytics failure should not break table viewing
    }

    // Calculate expiration using stored timestamp
    const now = new Date();
    const expiryDate = expiresAt ? new Date(expiresAt) : new Date(new Date(createdAt).getTime() + 7 * 24 * 60 * 60 * 1000);
    const daysLeft = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

    const pageTitle = title ? `${title} - Table Share` : 'Table - Table Share';
    const expirationText = daysLeft > 1 ? `Expires in ${daysLeft} days` : 'Expires soon';

    // Title section: show only if user set a custom title
    let titleSectionHtml = '';
    let actionBarExpiry = '';
    if (title) {
      // Titled: show title block with expiry underneath, action bar gets no expiry
      titleSectionHtml = `<div style="text-align: center; margin-bottom: 20px; padding-bottom: 20px;">
    <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 8px; word-wrap: break-word; max-width: 100%; overflow-wrap: break-word;">${title}</h1>
    <p style="font-size: 14px; color: var(--muted-color);">${expirationText}</p>
  </div>`;
      actionBarExpiry = '';
    } else {
      // Untitled: no title block, expiry moves to action bar
      titleSectionHtml = '';
      actionBarExpiry = ' \u00B7 ' + expirationText;
    }

    // Normalize rows
    const maxCols = Math.max(...data.map(r => r.length));
    data = data.map(r => {
      while (r.length < maxCols) r.push('');
      return r;
    });

    // Strip columns that are entirely empty across ALL rows
    if (data.length > 0 && data[0].length > 0) {
      // Find which column indices are 100% empty
      const colCount_raw = data[0].length;
      const emptyColIndices = new Set();
      for (let c = 0; c < colCount_raw; c++) {
        const allEmpty = data.every(row => {
          const val = (row[c] || '').trim();
          return val === '';
        });
        if (allEmpty) emptyColIndices.add(c);
      }

      // Remove empty columns from every row (only if not ALL columns are empty)
      if (emptyColIndices.size > 0 && emptyColIndices.size < colCount_raw) {
        data = data.map(row =>
          row.filter((_, idx) => !emptyColIndices.has(idx))
        );
      }
    }

     // Build table HTML
     // NOTE: Data is already sanitized in create.js - DO NOT sanitize again here
     let tableHtml = '';
     if (data.length > 0) {
       if (noHeaders) {
         // No headers - all rows are data rows
         tableHtml += '<tbody>';
         for (let i = 0; i < data.length; i++) {
           tableHtml += '<tr>';
           for (const cell of data[i]) {
             tableHtml += `<td>${cell}</td>`;
           }
           tableHtml += '</tr>';
         }
         tableHtml += '</tbody>';
       } else {
         // With headers - first row is header
         tableHtml += '<thead><tr>';
         for (const cell of data[0]) {
           tableHtml += `<th>${cell}</th>`;
         }
         tableHtml += '</tr></thead>';

         tableHtml += '<tbody>';
         for (let i = 1; i < data.length; i++) {
           tableHtml += '<tr>';
           for (const cell of data[i]) {
             tableHtml += `<td>${cell}</td>`;
           }
           tableHtml += '</tr>';
         }
         tableHtml += '</tbody>';
       }
     }

    const rowCount = data.length > 0 ? (noHeaders ? data.length : data.length - 1) : 0;
    const colCount = data.length > 0 ? data[0].length : 0;

    // Phase 1: OG card values. Title is already HTML-escaped at create time (attribute-safe).
    // Crawlers never reach this template for protected tables (they get the password form),
    // but keep the real title here regardless — only unlocked humans see this HTML.
    const ogTitle = title ? `${title} - Table Share` : 'Shared Table - Table Share';
    const ogDesc = `${rowCount} row${rowCount !== 1 ? 's' : ''} \u00D7 ${colCount} col${colCount !== 1 ? 's' : ''} \u00B7 View this table on Table Share \u2014 no signup needed.`;

    let html = VIEW_TEMPLATE
      .replace(/{{PAGE_TITLE}}/g, () => pageTitle)
      .replace(/{{OG_TITLE}}/g, () => ogTitle)
      .replace(/{{OG_DESC}}/g, () => ogDesc)
      .replace(/{{TITLE_SECTION}}/g, () => titleSectionHtml)
      .replace(/{{ACTION_BAR_EXPIRY}}/g, () => actionBarExpiry)
      .replace(/{{TABLE_HTML}}/g, () => tableHtml)
      .replace(/{{TABLE_ID}}/g, () => id)
      .replace(/{{ROW_COUNT}}/g, () => rowCount)
      .replace(/{{COL_COUNT}}/g, () => colCount)
      .replace(/{{ROW_PLURAL}}/g, () => rowCount !== 1 ? 's' : '')
      .replace(/{{COL_PLURAL}}/g, () => colCount !== 1 ? 's' : '');

    // Handle conditional footer based on noBranding flag
    if (noBranding) {
      html = html.replace(/{{#NO_BRANDING}}[\s\S]*?{{else}}[\s\S]*?{{\/NO_BRANDING}}/g, '');
    } else {
      html = html.replace(/{{#NO_BRANDING}}[\s\S]*?{{else}}/g, '').replace(/{{\/NO_BRANDING}}/g, '');
    }

    // Cache policy. A password-protected table must NEVER be stored by a shared
    // cache or written to disk by the browser: 'public, max-age=300' would let a
    // proxy serve protected content to someone who never entered the password,
    // and leaves it recoverable via the back button after the 1h cookie expires.
    const cachePolicy = passwordHash ? 'private, no-store' : 'public, max-age=300';

    // Set unlock cookie if password was just verified
    if (unlockCookie) {
      return htmlResponse(html, 200, {
        'Cache-Control': cachePolicy,
        'Set-Cookie': unlockCookie
      });
    }

    return htmlResponse(html, 200, { 'Cache-Control': cachePolicy });

  } catch (error) {
    console.error('Error in handleView:', error);
    return textResponse('Internal Server Error', 500);
  }
}
