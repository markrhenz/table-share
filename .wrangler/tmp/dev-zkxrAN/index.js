var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/utils/id-generator.js
var BASE62_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
function generateId() {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  let id = "";
  for (let i = 0; i < 8; i++) {
    id += BASE62_CHARS[bytes[i] % 62];
  }
  return id;
}
__name(generateId, "generateId");
async function generateUniqueId(kvNamespace) {
  const MAX_ATTEMPTS = 3;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const id = generateId();
    const exists = await kvNamespace.get(id);
    if (!exists) {
      return id;
    }
    console.warn(`ID collision on attempt ${attempt}/${MAX_ATTEMPTS}: ${id}`);
  }
  throw new Error(`Failed to generate unique ID after ${MAX_ATTEMPTS} attempts`);
}
__name(generateUniqueId, "generateUniqueId");

// src/utils/sanitizer.js
function escapeHtml(text) {
  if (text === null || text === void 0) {
    return "";
  }
  const replacements = {
    "&": "&",
    "<": "<",
    ">": ">",
    '"': '"',
    "'": "&#39;"
  };
  return String(text).replace(/[&<>"']/g, (char) => replacements[char]);
}
__name(escapeHtml, "escapeHtml");
function preventCSVInjection(value) {
  const str = String(value || "");
  if (/^[=@+\-]/.test(str)) {
    return "'" + str;
  }
  return str;
}
__name(preventCSVInjection, "preventCSVInjection");
function sanitizeCell(cell) {
  if (cell === null || cell === void 0) {
    return "";
  }
  let str = String(cell);
  str = preventCSVInjection(str);
  str = escapeHtml(str);
  return str.substring(0, 1e3);
}
__name(sanitizeCell, "sanitizeCell");
function validateInput(data) {
  if (!Array.isArray(data)) {
    return { valid: false, error: "Data must be an array" };
  }
  if (data.length === 0) {
    return { valid: false, error: "Data cannot be empty" };
  }
  if (data.length > 1e3) {
    return { valid: false, error: "Too many rows (max 1000)" };
  }
  for (let i = 0; i < data.length; i++) {
    if (!Array.isArray(data[i])) {
      return { valid: false, error: `Row ${i} is not an array` };
    }
    if (data[i].length > 100) {
      return { valid: false, error: `Row ${i} has too many columns (max 100)` };
    }
  }
  const jsonSize = JSON.stringify(data).length;
  if (jsonSize > 51200) {
    return { valid: false, error: "Data too large (max 50KB)" };
  }
  return { valid: true, error: null };
}
__name(validateInput, "validateInput");
function detectMaliciousContent(text) {
  const maliciousPatterns = [
    /<script/i,
    /javascript:/i,
    /data:/i,
    /on\w+=/i,
    /<iframe/i,
    /eval\(/i,
    /expression\(/i
  ];
  return maliciousPatterns.some((pattern) => pattern.test(text));
}
__name(detectMaliciousContent, "detectMaliciousContent");

// src/utils/rate-limiter.js
function getRateLimitKey(ip) {
  const minute = Math.floor(Date.now() / 6e4);
  return `rate-limit:${ip}:${minute}`;
}
__name(getRateLimitKey, "getRateLimitKey");
function isWhitelisted(ip) {
  if (!ip) return true;
  const whitelist = [
    "127.0.0.1",
    // IPv4 localhost
    "::1",
    // IPv6 localhost
    "localhost"
  ];
  return whitelist.includes(ip);
}
__name(isWhitelisted, "isWhitelisted");
async function checkRateLimit(kvNamespace, ip, maxRequests = 5) {
  if (isWhitelisted(ip)) {
    return { allowed: true, remaining: maxRequests };
  }
  try {
    const key = getRateLimitKey(ip);
    const countStr = await kvNamespace.get(key);
    const count = countStr ? parseInt(countStr, 10) : 0;
    if (count >= maxRequests) {
      return { allowed: false, remaining: 0 };
    }
    const newCount = count + 1;
    await kvNamespace.put(key, String(newCount), { expirationTtl: 60 });
    return {
      allowed: true,
      remaining: maxRequests - newCount
    };
  } catch (error) {
    console.error("Rate limit check failed:", error);
    return { allowed: true, remaining: maxRequests };
  }
}
__name(checkRateLimit, "checkRateLimit");

// src/handlers/create.js
async function handleCreate(request, env) {
  try {
    const ip = request.headers.get("CF-Connecting-IP") || "127.0.0.1";
    const rateCheck = await checkRateLimit(env.TABLES, ip, 5);
    if (!rateCheck.allowed) {
      return new Response(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { data, honeypot } = await request.json();
    if (honeypot) {
      return new Response(JSON.stringify({ error: "Invalid submission" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const validation = validateInput(data);
    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const sanitizedData = data.map((row) => row.map((cell) => sanitizeCell(cell)));
    const maxCols = Math.max(...sanitizedData.map((row) => row.length));
    sanitizedData.forEach((row) => {
      while (row.length < maxCols) row.push("");
    });
    for (const row of sanitizedData) {
      for (const cell of row) {
        if (detectMaliciousContent(cell)) {
          return new Response(JSON.stringify({ error: "Invalid content" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }
      }
    }
    const id = await generateUniqueId(env.TABLES);
    const tableData = {
      data: sanitizedData,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      rowCount: sanitizedData.length,
      colCount: maxCols
    };
    await env.TABLES.put(id, JSON.stringify(tableData), { expirationTtl: 2592e3 });
    const url = `${new URL(request.url).origin}/t/${id}`;
    return new Response(JSON.stringify({ id, url }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleCreate, "handleCreate");

// src/handlers/view.js
var VIEW_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Table Share</title>
  <style>
    :root {
      --bg-color: #fff;
      --text-color: #000;
      --border-color: #000;
      --accent-color: #0066cc;
      --muted-color: #666;
    }
    [data-theme="dark"] {
      --bg-color: #1a1a1a;
      --text-color: #fff;
      --border-color: #fff;
      --accent-color: #4da6ff;
      --muted-color: #aaa;
    }
    body {
      font-family: system-ui, sans-serif;
      max-width: 900px;
      margin: 40px auto;
      padding: 20px;
      background: var(--bg-color);
      color: var(--text-color);
    }

    .table-container {
      width: 100%;
      overflow-x: auto;
      margin: 20px 0;
      box-sizing: border-box;
    }

    table {
      width: auto;
      margin: 0 auto;
      border-collapse: collapse;
      border: 2px solid var(--border-color);
    }

    th, td {
      padding: 8px 12px;
      border: 1px solid var(--border-color);
      text-align: left;
    }

    .download-link {
      display: block;
      margin: 20px 0;
      color: var(--accent-color);
      text-decoration: none;
    }

    .download-link:hover {
      text-decoration: underline;
    }

    footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid var(--border-color);
      text-align: center;
      font-size: 12px;
      color: var(--muted-color);
    }

    footer a {
      color: var(--accent-color);
      text-decoration: none;
    }
  </style>
  <script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"><\/script>
</head>
<body>
  <div class="table-container">
    <table>
      {{TABLE_HTML}}
    </table>
  </div>

  <a href="#" class="download-link" onclick="downloadCSV()">Download CSV</a>

  <footer>
    Created with <a href="/">Table Share</a> |
    <a href="mailto:markrhenz2@gmail.com?subject=Report Table {{TABLE_ID}}">
      Report Abuse
    </a>
  </footer>

  <script>
    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
    }
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      applyTheme(storedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light');
    }

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
  <\/script>
</body>
</html>`;
async function handleView(request, env, id) {
  try {
    if (!/^[a-zA-Z0-9]{8}$/.test(id)) {
      return new Response("Not Found", { status: 404 });
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
      `, { status: 404, headers: { "Content-Type": "text/html" } });
    }
    const tableData = JSON.parse(dataStr);
    let { data } = tableData;
    const maxCols = Math.max(...data.map((r) => r.length));
    data = data.map((r) => {
      while (r.length > 0 && r[r.length - 1] === "") r.pop();
      while (r.length < maxCols) r.push("");
      return r;
    });
    let tableHtml = "";
    if (data.length > 0) {
      tableHtml += "<thead><tr>";
      data[0].forEach((cell) => {
        tableHtml += `<th>${sanitizeCell(cell)}</th>`;
      });
      tableHtml += "</tr></thead>";
      tableHtml += "<tbody>";
      for (let i = 1; i < data.length; i++) {
        tableHtml += "<tr>";
        data[i].forEach((cell) => {
          tableHtml += `<td>${sanitizeCell(cell)}</td>`;
        });
        tableHtml += "</tr>";
      }
      tableHtml += "</tbody>";
    }
    let html = VIEW_TEMPLATE.replace(/{{TABLE_HTML}}/g, tableHtml).replace(/{{TABLE_ID}}/g, id);
    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
__name(handleView, "handleView");

// src/index.js
var INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Table Share</title>
    <style>
        :root {
            --bg-color: #fff;
            --text-color: #000;
            --secondary-bg: #f5f5f5;
            --border-color: #000;
            --accent-color: #0066cc;
            --muted-color: #666;
            --tagline-color: #333;
        }
        [data-theme="dark"] {
            --bg-color: #1a1a1a;
            --text-color: #fff;
            --secondary-bg: #2a2a2a;
            --border-color: #fff;
            --accent-color: #4da6ff;
            --muted-color: #aaa;
            --tagline-color: #ccc;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; background: var(--bg-color); color: var(--text-color); line-height: 1.6; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        header { text-align: center; margin-bottom: 60px; padding-top: 40px; }
        h1 { font-size: 48px; font-weight: 700; margin-bottom: 20px; }
        .tagline { font-size: 24px; color: var(--tagline-color); margin-bottom: 40px; }
        .cta { font-size: 18px; color: var(--muted-color); margin-bottom: 60px; }
        .paste-box { width: 100%; border: 2px solid var(--border-color); padding: 20px; font-size: 16px; font-family: monospace; resize: vertical; min-height: 200px; margin-bottom: 20px; background: var(--bg-color); color: var(--text-color); }
        .button { display: none; width: 100%; background: var(--accent-color); color: #fff; border: none; padding: 15px; font-size: 18px; font-weight: 600; cursor: pointer; margin-bottom: 20px; }
        .button:hover { background: #0052A3; }
        .status { text-align: center; font-size: 16px; color: var(--muted-color); min-height: 24px; }
        .how-it-works { margin: 80px 0; padding: 40px; background: var(--secondary-bg); }
        .how-it-works h2 { font-size: 32px; margin-bottom: 30px; text-align: center; }
        .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 30px; }
        .step { text-align: center; }
        .step-number { font-size: 48px; font-weight: 700; color: var(--accent-color); margin-bottom: 10px; }
        .step h3 { font-size: 20px; margin-bottom: 10px; }
        .step p { color: var(--muted-color); }
        .use-cases { margin: 80px 0; }
        .use-cases h2 { font-size: 32px; margin-bottom: 30px; text-align: center; }
        .case-list { display: grid; gap: 20px; }
        .case { padding: 20px; border: 2px solid var(--border-color); }
        .case h3 { font-size: 20px; margin-bottom: 10px; }
        .case p { color: var(--muted-color); }
        .features { margin: 80px 0; padding: 40px; background: var(--secondary-bg); }
        .features h2 { font-size: 32px; margin-bottom: 30px; text-align: center; }
        .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; }
        .feature { text-align: center; }
        .feature-icon { font-size: 36px; margin-bottom: 10px; }
        .feature h3 { font-size: 18px; margin-bottom: 10px; }
        .feature p { color: var(--muted-color); font-size: 14px; }
        footer { margin-top: 80px; padding-top: 40px; border-top: 2px solid var(--border-color); text-align: center; color: var(--muted-color); }
        footer a { color: var(--accent-color); text-decoration: none; }
        footer a:hover { text-decoration: underline; }
        .theme-toggle { position: absolute; top: 20px; right: 20px; background: none; border: none; font-size: 24px; cursor: pointer; color: var(--text-color); }
        @media (max-width: 600px) { h1 { font-size: 32px; } .tagline { font-size: 18px; } .how-it-works, .features { padding: 20px; } }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <button id="themeToggle" class="theme-toggle" aria-label="Toggle dark mode">\u{1F319}</button>
            <h1>Table Share</h1>
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
                        <h3>\u{1F527} Developers</h3>
                        <p>Share SQL query results, API responses, or log data with teammates or clients instantly</p>
                    </div>
                    <div class="case">
                        <h3>\u{1F4BC} Freelancers</h3>
                        <p>Send pricing tables, project timelines, or deliverables without formatting nightmares</p>
                    </div>
                    <div class="case">
                        <h3>\u{1F465} Teams</h3>
                        <p>Quick data snapshots for meetings, action items, or temporary lists</p>
                    </div>
                    <div class="case">
                        <h3>\u{1F4CA} Data Analysts</h3>
                        <p>Share analysis results, pandas DataFrame outputs, or R data tables</p>
                    </div>
                </div>
            </section>
            <section class="features">
                <h2>Why Table Share?</h2>
                <div class="feature-grid">
                    <div class="feature">
                        <div class="feature-icon">\u26A1</div>
                        <h3>5-Second Workflow</h3>
                        <p>From paste to shareable link in under 5 seconds</p>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">\u{1F6AB}</div>
                        <h3>No Accounts</h3>
                        <p>Zero signup for you or recipients. Forever.</p>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">\u{1F4F1}</div>
                        <h3>Mobile-Perfect</h3>
                        <p>Clean, readable tables on any device</p>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">\u{1F512}</div>
                        <h3>Auto-Expires</h3>
                        <p>Links expire in 30 days (privacy by default)</p>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">\u{1F4BE}</div>
                        <h3>CSV Download</h3>
                        <p>Recipients can export to spreadsheet</p>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">\u{1F6E1}\uFE0F</div>
                        <h3>Security Built-In</h3>
                        <p>XSS prevention, rate limiting, content filtering</p>
                    </div>
                </div>
            </section>
        </main>
        <footer>
            <p>&copy; 2025 Table Share | <a href="mailto:markrhenz2@gmail.com">Contact</a> | <a href="/terms">Terms</a> | <a href="/privacy">Privacy</a></p>
        </footer>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"><\/script>
    <script>
        // Theme management
        const themeToggle = document.getElementById('themeToggle');
        function applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            themeToggle.textContent = theme === 'dark' ? '\u2600\uFE0F' : '\u{1F319}';
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

        const pasteBox = document.getElementById('pasteBox');
        const generateBtn = document.getElementById('generateBtn');
        const status = document.getElementById('status');
        pasteBox.addEventListener('paste', () => {
            if (pasteBox.value.trim()) generateBtn.style.display = 'block';
        });
        pasteBox.addEventListener('input', () => {
            if (pasteBox.value.trim()) generateBtn.style.display = 'block';
            else generateBtn.style.display = 'none';
        });
        generateBtn.addEventListener('click', async () => {
            const data = pasteBox.value.trim();
            if (!data) return;
            status.textContent = 'Generating link...';
            generateBtn.disabled = true;
            try {
                // PapaParse auto-detects tabs and commas
                const parsed = Papa.parse(data, {
                    header: false,
                    skipEmptyLines: true,
                    delimitersToGuess: ['	', ',', '|', ';']
                });
                
                const response = await fetch('/api/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ data: parsed.data, honeypot: '' })
                });
                const result = await response.json();
                if (result.url) {
                    await navigator.clipboard.writeText(result.url);
                    status.textContent = '\u2713 Link copied to clipboard!';
                    setTimeout(() => { window.location.href = result.url; }, 1000);
                } else throw new Error('Failed to generate link');
            } catch (error) {
                status.textContent = '\u2717 Error: ' + error.message;
                generateBtn.disabled = false;
            }
        });
    <\/script>
</body>
</html>
`;
var TERMS_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terms of Service - Table Share</title>
    <style>
        :root {
            --bg-color: #fff;
            --text-color: #000;
            --accent-color: #0066cc;
            --muted-color: #666;
        }
        [data-theme="dark"] {
            --bg-color: #1a1a1a;
            --text-color: #fff;
            --accent-color: #4da6ff;
            --muted-color: #aaa;
        }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; background: var(--bg-color); color: var(--text-color); }
        h1 { margin-bottom: 10px; }
        h2 { margin-top: 30px; }
        .updated { color: var(--muted-color); margin-bottom: 30px; }
        a { color: var(--accent-color); text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <h1>Terms of Service</h1>
    <p class="updated">Last updated: October 25, 2025</p>
    <h2>1. Acceptance of Terms</h2>
    <p>By using Table Share, you agree to these terms. If you don't agree, don't use the service.</p>
    <h2>2. Service Description</h2>
    <p>Table Share allows you to paste tabular data and generate shareable links. Links expire after 30 days by default.</p>
    <h2>3. Acceptable Use</h2>
    <p>You may NOT use Table Share to:</p>
    <ul>
        <li>Share illegal, malicious, or harmful content</li>
        <li>Violate others' privacy or intellectual property</li>
        <li>Distribute spam, phishing, or malware</li>
        <li>Abuse the service (e.g., excessive automation)</li>
    </ul>
    <h2>4. Data & Privacy</h2>
    <p>We store your pasted data for 30 days (or custom duration if premium). No accounts = no personal data collected. See <a href="/privacy">Privacy Policy</a>.</p>
    <h2>5. No Warranty</h2>
    <p>Service provided "as is." We don't guarantee uptime, data persistence, or security.</p>
    <h2>6. Termination</h2>
    <p>We may remove content or block users who violate these terms.</p>
    <h2>7. Contact</h2>
    <p>Questions? Email: <a href="mailto:markrhenz2@gmail.com">markrhenz2@gmail.com</a></p>
    <p style="margin-top: 40px;"><a href="/">&larr; Back to Table Share</a></p>
    <script>
        function applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
        }
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            applyTheme(storedTheme);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyTheme(prefersDark ? 'dark' : 'light');
        }
    <\/script>
</body>
</html>
`;
var PRIVACY_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - Table Share</title>
    <style>
        :root {
            --bg-color: #fff;
            --text-color: #000;
            --accent-color: #0066cc;
            --muted-color: #666;
        }
        [data-theme="dark"] {
            --bg-color: #1a1a1a;
            --text-color: #fff;
            --accent-color: #4da6ff;
            --muted-color: #aaa;
        }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; background: var(--bg-color); color: var(--text-color); }
        h1 { margin-bottom: 10px; }
        h2 { margin-top: 30px; }
        .updated { color: var(--muted-color); margin-bottom: 30px; }
        a { color: var(--accent-color); text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <h1>Privacy Policy</h1>
    <p class="updated">Last updated: October 25, 2025</p>
    <h2>1. What We Collect</h2>
    <p><strong>No accounts = minimal data:</strong></p>
    <ul>
        <li>Pasted table data (stored 30 days)</li>
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
    <p>Tables auto-delete after 30 days. Manual deletion: email us at markrhenz2@gmail.com with the link.</p>
    <h2>4. Third Parties</h2>
    <p>We use Cloudflare (hosting/CDN). They may collect standard logs. No analytics/tracking.</p>
    <h2>5. Your Rights</h2>
    <ul>
        <li>Request deletion: email markrhenz2@gmail.com with link</li>
        <li>No data portability (no accounts)</li>
        <li>GDPR/CCPA: Data auto-expires, no PII stored</li>
    </ul>
    <h2>6. Security</h2>
    <p>Data encrypted in transit (HTTPS). Storage on Cloudflare infrastructure.</p>
    <h2>7. Changes</h2>
    <p>We'll update this page. No email notifications (no accounts!).</p>
    <h2>8. Contact</h2>
    <p>Email: <a href="mailto:markrhenz2@gmail.com">markrhenz2@gmail.com</a></p>
    <p style="margin-top: 40px;"><a href="/">&larr; Back to Table Share</a></p>
    <script>
        function applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
        }
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            applyTheme(storedTheme);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyTheme(prefersDark ? 'dark' : 'light');
        }
    <\/script>
</body>
</html>
`;
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400"
};
var src_default = {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;
      if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: corsHeaders });
      }
      if (pathname === "/") {
        return new Response(INDEX_HTML, {
          headers: {
            "Content-Type": "text/html",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
            ...corsHeaders
          }
        });
      }
      if (pathname === "/terms") {
        return new Response(TERMS_HTML, {
          headers: { "Content-Type": "text/html", ...corsHeaders }
        });
      }
      if (pathname === "/privacy") {
        return new Response(PRIVACY_HTML, {
          headers: { "Content-Type": "text/html", ...corsHeaders }
        });
      }
      if (pathname === "/api/create" && request.method === "POST") {
        const response = await handleCreate(request, env);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders }
        });
      }
      if (pathname.startsWith("/t/") && pathname.length === 11) {
        const id = pathname.slice(3);
        if (/^[a-zA-Z0-9]{8}$/.test(id)) {
          const response = await handleView(request, env, id);
          return new Response(response.body, {
            ...response,
            headers: { ...response.headers, ...corsHeaders }
          });
        }
      }
      return new Response("Not Found", {
        status: 404,
        headers: corsHeaders
      });
    } catch (error) {
      return new Response("Internal Server Error: " + error.message, {
        status: 500,
        headers: corsHeaders
      });
    }
  }
};

// C:/Users/markr/AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// C:/Users/markr/AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-S6mK0y/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// C:/Users/markr/AppData/Roaming/npm/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-S6mK0y/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
