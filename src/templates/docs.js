export const DOCS_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Documentation - Table Share</title>
    <meta name="description" content="Table Share REST API documentation. Create shareable tables programmatically with your Pro API key. Endpoints, authentication, and code examples.">
    <meta name="keywords" content="table share api, api documentation, csv api, share data api, programmatic table sharing">
    <meta property="og:title" content="Table Share API Documentation">
    <meta property="og:description" content="Create shareable tables programmatically with the Table Share REST API. Pro users only.">
    <meta property="og:url" content="https://table-share.org/docs">
    <meta property="og:type" content="website">
    <link rel="canonical" href="https://table-share.org/docs">
    <link rel="icon" type="image/png" href="/logo.png">
    <style>
        :root {
            --bg-color: #fff;
            --text-color: #000;
            --secondary-bg: #f5f5f5;
            --border-color: #000;
            --accent-color: #0066cc;
            --muted-color: #666;
            --code-bg: #f0f0f0;
        }
        [data-theme="dark"] {
            --bg-color: #000;
            --text-color: #fff;
            --secondary-bg: #1a1a1a;
            --border-color: #fff;
            --accent-color: #4da6ff;
            --muted-color: #aaa;
            --code-bg: #1e1e1e;
        }
        [data-theme="dark"] .logo { filter: invert(1); }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
            background: var(--bg-color); color: var(--text-color); line-height: 1.6; padding: 20px;
        }
        .container { max-width: 900px; margin: 0 auto; }
        header { text-align: center; margin-bottom: 40px; padding-top: 20px; }
        h1 { font-size: 42px; font-weight: 700; margin: 16px 0 12px; }
        .tagline { font-size: 18px; color: var(--muted-color); margin-bottom: 24px; }
        h2 { font-size: 26px; margin: 48px 0 16px; padding-bottom: 8px; border-bottom: 2px solid var(--border-color); }
        h3 { font-size: 20px; margin: 28px 0 12px; }
        p { margin-bottom: 14px; }
        ul, ol { margin: 12px 0 16px 28px; }
        li { margin-bottom: 6px; }
        a { color: var(--accent-color); text-decoration: none; }
        a:hover { text-decoration: underline; }
        code {
            background: var(--code-bg); padding: 2px 6px; font-family: 'Courier New', Consolas, monospace;
            font-size: 14px; border-radius: 0;
        }
        pre {
            background: var(--code-bg); border: 2px solid var(--border-color); padding: 16px;
            overflow-x: auto; margin: 12px 0 20px; font-family: 'Courier New', Consolas, monospace;
            font-size: 13px; line-height: 1.5;
        }
        pre code { background: transparent; padding: 0; }
        table {
            width: 100%; border-collapse: collapse; margin: 12px 0 20px;
            border: 2px solid var(--border-color);
        }
        th, td {
            border: 1px solid var(--border-color); padding: 10px 12px; text-align: left;
            font-size: 14px; vertical-align: top;
        }
        th { background: var(--secondary-bg); font-weight: 700; }
        .badge {
            display: inline-block; padding: 2px 8px; font-size: 11px; font-weight: 700;
            border: 1px solid var(--border-color);
        }
        .badge-pro { background: #c89b3c; color: #000; border-color: #c89b3c; }
        .badge-method { background: var(--accent-color); color: #fff; border-color: var(--accent-color); }
        .endpoint {
            background: var(--secondary-bg); border: 2px solid var(--border-color);
            padding: 12px 16px; margin: 12px 0; font-family: 'Courier New', Consolas, monospace;
            font-size: 15px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
        }
        .note {
            background: var(--secondary-bg); border-left: 4px solid var(--accent-color);
            padding: 12px 16px; margin: 16px 0;
        }
        .warning {
            background: var(--secondary-bg); border-left: 4px solid #c89b3c;
            padding: 12px 16px; margin: 16px 0;
        }
        footer {
            margin-top: 80px; padding-top: 40px; border-top: 2px solid var(--border-color);
            text-align: center; color: var(--muted-color);
        }
        footer a { color: var(--accent-color); }
        .theme-toggle {
            position: absolute; top: 20px; right: 20px; width: 40px; height: 40px;
            border-radius: 50%; border: 2px solid var(--border-color);
            background: var(--bg-color); cursor: pointer; transition: all 0.2s;
        }
        .theme-toggle::after {
            content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 20px; height: 20px; border-radius: 50%; background: var(--text-color);
        }
        .toc {
            background: var(--secondary-bg); border: 2px solid var(--border-color);
            padding: 16px 20px; margin: 24px 0 40px;
        }
        .toc h3 { margin-top: 0; font-size: 16px; }
        .toc ul { margin-left: 20px; }
    </style>
</head>
<body>
    <button id="themeToggle" class="theme-toggle" aria-label="Toggle dark mode"></button>
    <div class="container">
        <header>
            <a href="/" style="text-decoration: none; color: var(--text-color); display: inline-flex; align-items: center; gap: 16px;">
                <img src="/logo.png" width="48" height="48" alt="Table Share" class="logo">
                <h1 style="margin: 0;">API Documentation</h1>
            </a>
            <p class="tagline">Create shareable tables programmatically. <span class="badge badge-pro">PRO</span></p>
        </header>

        <div class="toc">
            <h3>On this page</h3>
            <ul>
                <li><a href="#auth">Authentication</a></li>
                <li><a href="#create">POST /api/create</a></li>
                <li><a href="#fetch-url">POST /api/fetch-url</a></li>
                <li><a href="#stats">GET /api/stats</a></li>
                <li><a href="#errors">Error codes</a></li>
                <li><a href="#limits">Rate limits &amp; tier limits</a></li>
                <li><a href="#examples">Full examples (curl, Python, Node.js)</a></li>
            </ul>
        </div>

        <h2 id="auth">Authentication</h2>
        <p>All Pro features require an API key. Pass it in the JSON request body as <code>apiKey</code>.</p>
        <p>Keys are issued automatically after a $5 one-time purchase on <a href="/pricing">Ko-fi</a> and emailed to you. Format:</p>
        <pre><code>ts_live_xxxxxxxxxxxxxxxxxxxxxxxx</code></pre>
        <div class="warning">
            <strong>Lost your key?</strong> Use the <a href="/recover">key recovery form</a> with your Ko-fi transaction ID and email — it's the fastest path. Or email <a href="mailto:markrhenz@table-share.org">markrhenz@table-share.org</a> with your transaction ID for manual help.
        </div>

        <h2 id="create">Create a Table</h2>
        <div class="endpoint">
            <span class="badge badge-method">POST</span>
            <span>/api/create</span>
        </div>
        <p>Creates a new shared table from raw row data. Works without an API key (free tier limits apply). Pro key unlocks higher limits and premium features.</p>

        <h3>Request body</h3>
        <table>
            <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
            <tbody>
                <tr><td><code>data</code></td><td>array&lt;array&gt;</td><td>Yes</td><td>Array of rows, each row is an array of cell values</td></tr>
                <tr><td><code>apiKey</code></td><td>string</td><td>No</td><td>Pro API key. Omit for free tier.</td></tr>
                <tr><td><code>title</code></td><td>string</td><td>No</td><td>Optional title shown on table page (max 100 chars)</td></tr>
                <tr><td><code>password</code></td><td>string</td><td>No</td><td>Password to protect the table <span class="badge badge-pro">PRO</span></td></tr>
                <tr><td><code>expiry</code></td><td>number</td><td>No</td><td>Seconds until expiry. Free: max 604800 (7d). Pro: 3600 to 7776000 (1h–90d)</td></tr>
                <tr><td><code>noBranding</code></td><td>boolean</td><td>No</td><td>Hide "Created with Table Share" footer <span class="badge badge-pro">PRO</span></td></tr>
                <tr><td><code>noHeaders</code></td><td>boolean</td><td>No</td><td>Treat first row as data, not headers</td></tr>
            </tbody>
        </table>

        <h3>Response (201 Created)</h3>
        <pre><code>{
  "id": "a1b2c3d4",
  "url": "https://table-share.org/t/a1b2c3d4",
  "passwordProtected": false
}</code></pre>

        <h3>Example</h3>
        <pre><code>curl -X POST https://table-share.org/api/create \\
  -H "Content-Type: application/json" \\
  -d '{
    "apiKey": "ts_live_xxxxxxxxxxxxxxxxxxxxxxxx",
    "title": "Q2 Sales Report",
    "expiry": 2592000,
    "data": [
      ["Region", "Revenue", "Growth"],
      ["NA",     "$1.2M",   "+12%"],
      ["EU",     "$890K",   "+8%"],
      ["APAC",   "$540K",   "+22%"]
    ]
  }'</code></pre>

        <h2 id="fetch-url">Fetch from URL <span class="badge badge-pro">PRO</span></h2>
        <div class="endpoint">
            <span class="badge badge-method">POST</span>
            <span>/api/fetch-url</span>
        </div>
        <p>Server-side fetches a CSV/TSV from a public URL and turns it into a table. Pro key required.</p>

        <h3>Request body</h3>
        <table>
            <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
            <tbody>
                <tr><td><code>url</code></td><td>string</td><td>Yes</td><td>HTTPS URL returning CSV/TSV text</td></tr>
                <tr><td><code>apiKey</code></td><td>string</td><td>Yes</td><td>Pro API key</td></tr>
                <tr><td><code>title</code></td><td>string</td><td>No</td><td>Optional title (max 100 chars)</td></tr>
                <tr><td><code>password</code></td><td>string</td><td>No</td><td>Password protection</td></tr>
                <tr><td><code>expiry</code></td><td>number</td><td>No</td><td>Seconds until expiry (3600–7776000)</td></tr>
                <tr><td><code>noBranding</code></td><td>boolean</td><td>No</td><td>Hide footer branding</td></tr>
                <tr><td><code>noHeaders</code></td><td>boolean</td><td>No</td><td>Treat first row as data</td></tr>
            </tbody>
        </table>

        <h3>Example</h3>
        <pre><code>curl -X POST https://table-share.org/api/fetch-url \\
  -H "Content-Type: application/json" \\
  -d '{
    "apiKey": "ts_live_xxxxxxxxxxxxxxxxxxxxxxxx",
    "url": "https://example.com/data.csv",
    "title": "Live CSV snapshot"
  }'</code></pre>

        <h2 id="stats">Get Stats</h2>
        <div class="endpoint">
            <span class="badge badge-method">GET</span>
            <span>/api/stats</span>
        </div>
        <p>Public endpoint. Returns the lifetime count of tables created.</p>
        <pre><code>curl https://table-share.org/api/stats
// → { "total": 53 }</code></pre>

        <h2 id="errors">Error codes</h2>
        <table>
            <thead><tr><th>Status</th><th>Meaning</th><th>Common cause</th></tr></thead>
            <tbody>
                <tr><td><code>400</code></td><td>Bad request</td><td>Invalid data shape, oversized payload, malicious content, exceeded tier limits</td></tr>
                <tr><td><code>401</code></td><td>Unauthorized</td><td>Invalid or expired API key on a Pro-only endpoint</td></tr>
                <tr><td><code>403</code></td><td>Forbidden</td><td>Free tier attempting a Pro feature (password, long expiry, branding removal)</td></tr>
                <tr><td><code>429</code></td><td>Rate limited</td><td>More than 5 creates per minute from a single IP. Pro: higher limit.</td></tr>
                <tr><td><code>500</code></td><td>Server error</td><td>Transient. Retry with exponential backoff.</td></tr>
            </tbody>
        </table>

        <h3>Error response shape</h3>
        <pre><code>{ "error": "Human-readable message" }</code></pre>

        <h2 id="limits">Limits</h2>
        <h3>Rate limits (per IP)</h3>
        <ul>
            <li><strong>Free:</strong> 5 creates per minute</li>
            <li><strong>Pro:</strong> 5 creates per minute (raised on request — contact support)</li>
        </ul>

        <h3>Tier limits</h3>
        <table>
            <thead><tr><th>Limit</th><th>Free</th><th>Pro ($5 one-time)</th></tr></thead>
            <tbody>
                <tr><td>Max rows</td><td>500</td><td>5,000</td></tr>
                <tr><td>Max columns</td><td>50</td><td>100</td></tr>
                <tr><td>Max payload</td><td>5 MB</td><td>5 MB</td></tr>
                <tr><td>Expiry</td><td>7 days (fixed)</td><td>1 hour – 90 days</td></tr>
                <tr><td>Password protection</td><td>—</td><td>✓</td></tr>
                <tr><td>Remove branding</td><td>—</td><td>✓</td></tr>
                <tr><td>URL fetch</td><td>—</td><td>✓</td></tr>
            </tbody>
        </table>

        <h2 id="examples">Full examples</h2>

        <h3>Python (requests)</h3>
        <pre><code>import requests

API_KEY = "ts_live_xxxxxxxxxxxxxxxxxxxxxxxx"

resp = requests.post(
    "https://table-share.org/api/create",
    json={
        "apiKey": API_KEY,
        "title": "Q2 Sales",
        "expiry": 2592000,  # 30 days
        "data": [
            ["Region", "Revenue"],
            ["NA", "$1.2M"],
            ["EU", "$890K"],
        ]
    },
    timeout=10
)
resp.raise_for_status()
print(resp.json()["url"])
</code></pre>

        <h3>Node.js (fetch)</h3>
        <pre><code>const API_KEY = "ts_live_xxxxxxxxxxxxxxxxxxxxxxxx";

const r = await fetch("https://table-share.org/api/create", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    apiKey: API_KEY,
    title: "Q2 Sales",
    expiry: 2592000,
    data: [
      ["Region", "Revenue"],
      ["NA", "$1.2M"],
      ["EU", "$890K"],
    ]
  })
});

if (!r.ok) throw new Error('HTTP ' + r.status);
const { url } = await r.json();
console.log(url);
</code></pre>

        <h3>Bash one-liner (CSV file → link)</h3>
        <pre><code>cat data.csv | python -c "
import sys, json, csv, requests
rows = list(csv.reader(sys.stdin))
r = requests.post('https://table-share.org/api/create',
  json={'apiKey': 'ts_live_xxxxxxxxxxxxxxxxxxxxxxxx', 'data': rows})
print(r.json()['url'])
"</code></pre>

        <div class="note">
            <strong>Need help?</strong> Email <a href="mailto:markrhenz@table-share.org">markrhenz@table-share.org</a> or check the <a href="/blog">blog</a> for guides.
        </div>

        <footer>
            <p>&copy; 2026 Table Share | <a href="/">Home</a> | <a href="/pricing">Pricing</a> | <a href="/blog">Blog</a> | <a href="/terms">Terms</a> | <a href="/privacy">Privacy</a></p>
        </footer>
    </div>
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
    </script>
</body>
</html>
`;
