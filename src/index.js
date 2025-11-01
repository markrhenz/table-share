import { handleCreate } from './handlers/create.js';
import { handleView } from './handlers/view.js';
import { handleKofiWebhook } from './handlers/kofi-webhook.js';

const INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Table Share</title>
    <!-- SEO Meta Tags -->
    <meta name="description" content="The fastest way to share tables. Paste your data, get an instant shareable link. No signup required. Auto-expires in 30 days. Perfect for developers, freelancers, and teams.">
    <meta name="keywords" content="table sharing, CSV sharing, spreadsheet sharing, data sharing, no signup, ephemeral data, free table tool">
    <meta name="author" content="Table Share">
    <link rel="canonical" href="https://table-share.org">
    <!-- Open Graph Tags for Social Sharing -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://table-share.org">
    <meta property="og:title" content="Table Share - The Fastest Way to Share a Table">
    <meta property="og:description" content="Stop taking screenshots. Paste your data and get an instant shareable link. No signup required, auto-expires in 30 days.">
    <meta property="og:image" content="https://table-share.org/logo.png">
    <meta property="og:site_name" content="Table Share">
    <!-- Twitter Card Tags -->
    <meta name="twitter:card" content="summary">
    <meta name="twitter:url" content="https://table-share.org">
    <meta name="twitter:title" content="Table Share - The Fastest Way to Share a Table">
    <meta name="twitter:description" content="Stop taking screenshots. Paste your data and get an instant shareable link. No signup required.">
    <meta name="twitter:image" content="https://table-share.org/logo.png">
    <link rel="icon" type="image/png" href="/logo.png">
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
            --bg-color: #000;
            --text-color: #fff;
            --secondary-bg: #2a2a2a;
            --border-color: #fff;
            --accent-color: #4da6ff;
            --muted-color: #aaa;
            --tagline-color: #ccc;
            .logo {
                filter: invert(1);
            }
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
        .theme-toggle { position: absolute; top: 20px; right: 20px; width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--border-color); background: var(--bg-color); cursor: pointer; transition: all 0.2s; }
        .theme-toggle::after { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 20px; height: 20px; border-radius: 50%; background: var(--text-color); }
        [data-theme="dark"] img[src="/logo.png"] { filter: invert(1); }
        [data-theme="dark"] img[src="/logo.png"] { filter: invert(1); }
        @media (max-width: 600px) { h1 { font-size: 32px; } .tagline { font-size: 18px; } .how-it-works, .features { padding: 20px; } }
    </style>
</head>
<body>
    <button id="themeToggle" class="theme-toggle" aria-label="Toggle dark mode"></button>
    <div class="container">
        <header>
            <div style="display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 20px;">
                <img src="/logo.png" width="48" height="48" alt="Table Share" class="logo">
                <h1 style="font-size: 48px; font-weight: 700; margin: 0;">Table Share</h1>
            </div>
            <p class="tagline">The fastest way to share a table</p>
            <p class="cta">Stop taking screenshots. Paste your data and get an instant shareable link.</p>
        </header>
        <main>
            <div style="margin-bottom: 12px;">
                <label for="titleInput" style="display: block; font-size: 14px; color: var(--muted-color); margin-bottom: 6px;">
                    Title (optional)
                </label>
                <input 
                    type="text" 
                    id="titleInput" 
                    placeholder="e.g., Q4 Sales Report" 
                    maxlength="100"
                    style="width: 100%; border: 2px solid var(--border-color); padding: 10px; font-size: 16px; background: var(--bg-color); color: var(--text-color);"
                >
            </div>
            <div style="margin-bottom: 12px;">
                <details>
                    <summary style="cursor: pointer; color: var(--muted-color); font-size: 14px;">
                        🔑 Pro Mode (Optional)
                    </summary>
                    <input
                        type="password"
                        id="apiKeyInput"
                        placeholder="Paste your Pro API key here"
                        style="width: 100%; margin-top: 8px; border: 2px solid var(--border-color); padding: 10px; font-size: 14px; background: var(--bg-color); color: var(--text-color);"
                    >
                    <div id="proStatus" style="font-size: 12px; margin-top: 6px; font-weight: 600; display: none;"></div>
                    <div id="expiryContainer" style="margin-top: 8px; display: none;">
                        <label for="expirySelect" style="display: block; font-size: 12px; color: var(--muted-color); margin-bottom: 4px;">
                            Link expires in:
                        </label>
                        <select id="expirySelect" style="width: 100%; border: 2px solid var(--border-color); padding: 8px; font-size: 14px; background: var(--bg-color); color: var(--text-color);">
                            <option value="3600">1 hour</option>
                            <option value="604800">7 days</option>
                            <option value="2592000" selected>30 days</option>
                            <option value="7776000">90 days (Pro)</option>
                        </select>
                        <div style="margin-top: 8px;">
                            <label style="display: flex; align-items: center; font-size: 12px; color: var(--muted-color); cursor: pointer;">
                                <input type="checkbox" id="noBranding" style="margin-right: 6px;">
                                Remove Table Share branding
                            </label>
                        </div>
                    </div>
                    <p style="font-size: 12px; color: var(--muted-color); margin-top: 4px;">
                        Need Pro? <a href="/pricing" style="color: var(--accent-color);">View pricing →</a>
                    </p>
                </details>
            </div>
            <textarea id="pasteBox" class="paste-box" placeholder="Paste your table data here (from Excel, Google Sheets, CSV, or anywhere)...

Example:
Name    Age    City
Alice   30     NYC
Bob     25     LA"></textarea>
            <div style="font-size: 13px; color: var(--muted-color); margin-top: 8px; margin-bottom: 12px;">
                💡 Tip: Use tabs or commas to separate columns. Paste directly from Excel, Sheets, or CSV.
            </div>
             <button id="generateBtn" class="button">Generate Link</button>
            <div id="status" class="status"></div>
            <!-- History Section -->
            <div id="history-section" style="margin-top: 30px; display: none;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; font-size: 16px; font-weight: normal; cursor: pointer;" id="history-toggle">
                  ▼ Your Recent Tables (<span id="history-count">0</span>)
                </h3>
                <div style="display: flex; gap: 10px;">
                  <button id="export-history-btn" style="padding: 5px 10px; font-size: 12px; background: transparent; border: 1px solid var(--border); cursor: pointer;">
                    Export CSV
                  </button>
                  <button id="clear-history-btn" style="padding: 5px 10px; font-size: 12px; background: transparent; border: 1px solid var(--border); cursor: pointer; color: #d00;">
                    Clear History
                  </button>
                </div>
              </div>

              <div id="history-list" style="border: 1px solid var(--border); padding: 15px; max-height: 300px; overflow-y: auto;">
                <!-- Populated by JavaScript -->
              </div>
            </div>
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
            <p>&copy; 2025 Table Share | <a href="mailto:markrhenz2@gmail.com">Contact</a> | <a href="/terms">Terms</a> | <a href="/privacy">Privacy</a></p>
        </footer>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>
    <script>
        // Theme management
        const themeToggle = document.getElementById('themeToggle');
        function applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
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
        
        // Pro Mode validation with localStorage persistence
        const apiKeyInput = document.getElementById('apiKeyInput');
        const proStatus = document.getElementById('proStatus');
        const expiryContainer = document.getElementById('expiryContainer');

        // Load saved key on page load
        const savedKey = localStorage.getItem('proApiKey');
        if (savedKey) {
            apiKeyInput.value = savedKey;
            proStatus.textContent = '✓ Pro Mode Active - 5,000 rows, 90-day expiry';
            proStatus.style.color = '#00cc66';
            proStatus.style.display = 'block';
            expiryContainer.style.display = 'block';
        }

        // Validate key on input
        apiKeyInput.addEventListener('input', () => {
            const key = apiKeyInput.value.trim();

            if (!key) {
                proStatus.style.display = 'none';
                expiryContainer.style.display = 'none';
                localStorage.removeItem('proApiKey');
                return;
            }

            if (key.startsWith('ts_live_') && key.length >= 28) {
                proStatus.textContent = '✓ Pro Mode Active - 5,000 rows, 90-day expiry';
                proStatus.style.color = '#00cc66';
                proStatus.style.display = 'block';
                expiryContainer.style.display = 'block';
                localStorage.setItem('proApiKey', key);
            } else {
                proStatus.textContent = '✗ Invalid API key format';
                proStatus.style.color = '#ff4444';
                proStatus.style.display = 'block';
                expiryContainer.style.display = 'none';
                localStorage.removeItem('proApiKey');
            }
        });

        const pasteBox = document.getElementById('pasteBox');
        const generateBtn = document.getElementById('generateBtn');
        const status = document.getElementById('status');
        pasteBox.addEventListener('paste', () => {
            setTimeout(() => {
                if (pasteBox.value.trim()) {
                    generateBtn.style.display = 'block';
                    generateBtn.disabled = false;
                    status.textContent = '';
                }
            }, 100);
        });
        pasteBox.addEventListener('input', () => {
            if (pasteBox.value.trim()) {
                generateBtn.style.display = 'block';
                generateBtn.disabled = false;
                status.textContent = '';
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
                // PapaParse auto-detects tabs and commas
                const parsed = Papa.parse(data, {
                    header: false,
                    skipEmptyLines: true,
                    delimitersToGuess: ['\t', ',', '|', ';']
                });
                
                const response = await fetch('/api/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        data: parsed.data,
                        title: document.getElementById('titleInput').value.trim() || null,
                        apiKey: document.getElementById('apiKeyInput').value.trim() || null,
                        expiry: document.getElementById('expirySelect') ? parseInt(document.getElementById('expirySelect').value) : 2592000,
                        noBranding: document.getElementById('noBranding') ? document.getElementById('noBranding').checked : false,
                        honeypot: ''
                    })
                });
                const result = await response.json();
                if (result.url) {
                    await navigator.clipboard.writeText(result.url);
                    status.textContent = '✓ Link copied to clipboard!';
                    // Save to history
                    const id = result.url.split('/').pop();
                    addToHistory(id, result.url, pasteBox.value);

                    // Redirect to view page
                    setTimeout(() => { window.location.href = result.url; }, 1000);
                } else {
                    throw new Error(result.error || 'Failed to generate link');
                }
            } catch (error) {
                status.innerHTML = '✗ Error: ' + error.message;
                generateBtn.disabled = false;
            }
        });

        // History Management
        const HISTORY_KEY = 'table-share-history';
        const MAX_HISTORY = 50;

        function addToHistory(id, url, previewText) {
          try {
            const history = getHistory();
            history.unshift({
              id,
              url,
              created: new Date().toISOString(),
              preview: previewText.slice(0, 50).trim() + (previewText.length > 50 ? '...' : '')
            });
            if (history.length > MAX_HISTORY) history.length = MAX_HISTORY;
            localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
            renderHistory();
          } catch (error) {
            console.error('Failed to save history:', error);
          }
        }

        function getHistory() {
          try {
            const data = localStorage.getItem(HISTORY_KEY);
            return data ? JSON.parse(data) : [];
          } catch (error) {
            return [];
          }
        }

        function clearHistory() {
          if (confirm('Clear all history? This cannot be undone.')) {
            localStorage.removeItem(HISTORY_KEY);
            renderHistory();
          }
        }

        function exportHistory() {
          const history = getHistory();
          if (history.length === 0) {
            alert('No history to export');
            return;
          }

          let csv = 'URL,Created,Preview\\n';
          history.forEach(entry => {
            const url = entry.url;
            const created = entry.created;
            const preview = entry.preview.replace(/"/g, '""');
            csv += '"' + url + '","' + created + '","' + preview + '"\\n';
          });

          const blob = new Blob([csv], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'table-share-history.csv';
          a.click();
          URL.revokeObjectURL(url);
        }

        function getRelativeTime(isoDate) {
          const now = new Date();
          const created = new Date(isoDate);
          const diffMs = now - created;
          const diffMins = Math.floor(diffMs / 60000);

          if (diffMins < 1) return 'just now';
          if (diffMins === 1) return '1 min ago';
          if (diffMins < 60) return diffMins + ' mins ago';

          const diffHours = Math.floor(diffMins / 60);
          if (diffHours === 1) return '1 hour ago';
          if (diffHours < 24) return diffHours + ' hours ago';

          const diffDays = Math.floor(diffHours / 24);
          if (diffDays === 1) return '1 day ago';
          if (diffDays < 30) return diffDays + ' days ago';

          return created.toLocaleDateString();
        }

        function renderHistory() {
          const history = getHistory();
          const section = document.getElementById('history-section');
          const list = document.getElementById('history-list');
          const count = document.getElementById('history-count');

          count.textContent = history.length;

          if (history.length === 0) {
            section.style.display = 'none';
            return;
          }

          section.style.display = 'block';

          list.innerHTML = history.map(entry => 
            '<div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--border);">' +
              '<div style="font-size: 13px; color: var(--text); margin-bottom: 4px;">' +
                entry.preview +
              '</div>' +
              '<div style="font-size: 11px; opacity: 0.7;">' +
                '<a href="' + entry.url + '" target="_blank" style="color: var(--text); text-decoration: underline;">' +
                  entry.url +
                '</a>' +
                '<span style="margin-left: 10px;">' + getRelativeTime(entry.created) + '</span>' +
              '</div>' +
            '</div>'
          ).join('');

          const items = list.querySelectorAll('div');
          if (items.length > 0) {
            items[items.length - 1].style.borderBottom = 'none';
          }
        }

        // Event Listeners
        document.getElementById('clear-history-btn')?.addEventListener('click', clearHistory);
        document.getElementById('export-history-btn')?.addEventListener('click', exportHistory);

        // Toggle history visibility
        let historyExpanded = true;
        document.getElementById('history-toggle')?.addEventListener('click', () => {
          historyExpanded = !historyExpanded;
          const list = document.getElementById('history-list');
          const toggle = document.getElementById('history-toggle');
          list.style.display = historyExpanded ? 'block' : 'none';
          toggle.textContent = (historyExpanded ? '▼' : '▶') + toggle.textContent.slice(1);
        });

        // Initial render
        renderHistory();
    </script>
</body>
</html>
`;

const TERMS_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terms of Service - Table Share</title>
    <meta name="description" content="Table Share Terms of Service. No accounts, auto-expiring links, acceptable use policy.">
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
            .logo {
                filter: invert(1);
            }
        }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; background: var(--bg-color); color: var(--text-color); }
        h1 { margin-bottom: 10px; }
        h2 { margin-top: 30px; }
        .updated { color: var(--muted-color); margin-bottom: 30px; }
        a { color: var(--accent-color); text-decoration: none; }
        a:hover { text-decoration: underline; }
        .theme-toggle { position: absolute; top: 20px; right: 20px; width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--border-color); background: var(--bg-color); cursor: pointer; transition: all 0.2s; }
        .theme-toggle::after { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 20px; height: 20px; border-radius: 50%; background: var(--text-color); }
    </style>
</head>
<body>
    <button id="themeToggle" class="theme-toggle" aria-label="Toggle dark mode"></button>
    <div style="display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 40px;">
        <a href="/" style="text-decoration: none; color: var(--text-color); display: flex; align-items: center; gap: 16px;">
            <img src="/logo.png" width="48" height="48" alt="Table Share" class="logo">
            <span style="margin: 0; font-size: 48px; font-weight: 700;">Table Share</span>
        </a>
    </div>
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
        const themeToggle = document.getElementById('themeToggle');
        function applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
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

const PRIVACY_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - Table Share</title>
    <meta name="description" content="Table Share Privacy Policy. Minimal data collection, no tracking, 30-day auto-deletion.">
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
            .logo {
                filter: invert(1);
            }
        }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; background: var(--bg-color); color: var(--text-color); }
        h1 { margin-bottom: 10px; }
        h2 { margin-top: 30px; }
        .updated { color: var(--muted-color); margin-bottom: 30px; }
        a { color: var(--accent-color); text-decoration: none; }
        a:hover { text-decoration: underline; }
        .theme-toggle { position: absolute; top: 20px; right: 20px; width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--border-color); background: var(--bg-color); cursor: pointer; transition: all 0.2s; }
        .theme-toggle::after { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 20px; height: 20px; border-radius: 50%; background: var(--text-color); }
    </style>
</head>
<body>
    <button id="themeToggle" class="theme-toggle" aria-label="Toggle dark mode"></button>
    <div style="display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 40px;">
        <a href="/" style="text-decoration: none; color: var(--text-color); display: flex; align-items: center; gap: 16px;">
            <img src="/logo.png" width="48" height="48" alt="Table Share" class="logo">
            <span style="margin: 0; font-size: 48px; font-weight: 700;">Table Share</span>
        </a>
    </div>
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
        const themeToggle = document.getElementById('themeToggle');
        function applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
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

const PRICING_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pricing - Table Share</title>
    <meta name="description" content="Table Share pricing: Free forever plan with 500 rows. Pro plan at $5 one-time for 5,000 rows, custom expiration, and API access.">
    <meta property="og:title" content="Table Share Pricing - Free Forever or Pro for $5">
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
            --bg-color: #000;
            --text-color: #fff;
            --secondary-bg: #2a2a2a;
            --border-color: #fff;
            --accent-color: #4da6ff;
            --muted-color: #aaa;
            .logo {
                filter: invert(1);
            }
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
        .theme-toggle { position: absolute; top: 20px; right: 20px; width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--border-color); background: var(--bg-color); cursor: pointer; transition: all 0.2s; }
        .theme-toggle::after { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 20px; height: 20px; border-radius: 50%; background: var(--text-color); }
    </style>
</head>
<body>
    <button id="themeToggle" class="theme-toggle" aria-label="Toggle dark mode"></button>
    <div style="text-align: center; margin-bottom: 60px;">
        <a href="/" style="text-decoration: none; color: var(--text-color); display: inline-flex; align-items: center; gap: 16px;">
            <img src="/logo.png" width="48" height="48" alt="Table Share" class="logo">
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
                <li>✓ 30-day expiration</li>
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
                <li>✓ <strong>Custom expiration</strong> (1-90 days)</li>
                <li>✓ <strong>Password protection</strong></li>
                <li>✓ <strong>Remove branding</strong></li>
                <li>✓ <strong>API access</strong></li>
                <li>✓ <strong>1 year validity</strong></li>
            </ul>
            <a href="https://ko-fi.com/s/0a371a6316" class="cta-button">Get Pro via Ko-fi</a>
            <p style="text-align: center; margin-top: 10px; font-size: 14px; color: var(--muted-color);">Instant API key after payment</p>
        </div>
    </div>
    
    <div style="text-align: center; margin-top: 60px;">
        <p style="color: var(--muted-color);">Questions? <a href="mailto:markrhenz2@gmail.com" style="color: var(--accent-color);">Contact us</a></p>
        <p style="margin-top: 20px;"><a href="/" style="color: var(--accent-color);">← Back to Table Share</a></p>
    </div>
    <script>
        const themeToggle = document.getElementById('themeToggle');
        function applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
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

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400'
};

const SITEMAP_XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://table-share.org/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://table-share.org/pricing</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://table-share.org/terms</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://table-share.org/privacy</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>`;

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;

      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders });
      }

      if (pathname === '/') {
        return new Response(INDEX_HTML, {
          headers: { 
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            ...corsHeaders 
          }
        });
      }
      
      if (pathname === '/terms') {
        return new Response(TERMS_HTML, {
          headers: { 'Content-Type': 'text/html', ...corsHeaders }
        });
      }
      
      if (pathname === '/privacy') {
        return new Response(PRIVACY_HTML, {
          headers: { 'Content-Type': 'text/html', ...corsHeaders }
        });
      }
      
      if (pathname === '/pricing') {
        return new Response(PRICING_HTML, {
          headers: { 'Content-Type': 'text/html', ...corsHeaders }
        });
      }

      if (pathname === '/sitemap.xml') {
        return new Response(SITEMAP_XML, {
          headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=86400',
            ...corsHeaders
          }
        });
      }

      // Analytics Dashboard (admin only)
      if (pathname === '/analytics' && request.method === 'GET') {
        const adminKey = url.searchParams.get('key');
        const ADMIN_KEY = 'MARK_ANALYTICS_2025'; // Change this to your secret key

        if (adminKey !== ADMIN_KEY) {
          return new Response('Unauthorized', {
            status: 401,
            headers: { 'Content-Type': 'text/plain' }
          });
        }

        try {
          const { getMetrics } = await import('./utils/analytics.js');

          // Fetch all metrics for last 30 days
          const tablesCreated = await getMetrics(env.TABLES, 'tables_created', 30);
          const views = await getMetrics(env.TABLES, 'table_views', 30);
          const proTables = await getMetrics(env.TABLES, 'pro_tables', 30);

          // Calculate totals
          const totalTables = Object.values(tablesCreated).reduce((a, b) => a + b, 0);
          const totalViews = Object.values(views).reduce((a, b) => a + b, 0);
          const totalPro = Object.values(proTables).reduce((a, b) => a + b, 0);

          const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Analytics - Table Share</title>
  <style>
    :root {
      --bg: #fff;
      --text: #000;
      --border: #000;
      --table-bg: #f5f5f5;
    }
    body {
      font-family: 'Courier New', monospace;
      padding: 40px;
      max-width: 1200px;
      margin: 0 auto;
      background: var(--bg);
      color: var(--text);
    }
    h1 {
      margin-bottom: 10px;
      font-size: 28px;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }
    .stat-card {
      border: 2px solid var(--border);
      padding: 20px;
      background: var(--table-bg);
    }
    .stat-card h2 {
      margin: 0 0 10px 0;
      font-size: 16px;
      font-weight: normal;
    }
    .stat-card .number {
      font-size: 48px;
      font-weight: bold;
      margin: 0;
    }
    .metric {
      margin: 40px 0;
    }
    .metric h2 {
      margin-bottom: 15px;
      font-size: 20px;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      border: 2px solid var(--border);
    }
    th, td {
      border: 1px solid var(--border);
      padding: 10px;
      text-align: left;
    }
    th {
      background: var(--table-bg);
      font-weight: bold;
    }
    tr:nth-child(even) {
      background: rgba(0, 0, 0, 0.02);
    }
    .chart {
      margin-top: 10px;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <h1>📊 Table Share Analytics</h1>
  <p>Last 30 days • Updated in real-time</p>

  <div class="summary">
    <div class="stat-card">
      <h2>Total Tables Created</h2>
      <p class="number">${totalTables}</p>
    </div>
    <div class="stat-card">
      <h2>Total Views</h2>
      <p class="number">${totalViews}</p>
    </div>
    <div class="stat-card">
      <h2>Pro Tables Created</h2>
      <p class="number">${totalPro}</p>
    </div>
    <div class="stat-card">
      <h2>Conversion Rate</h2>
      <p class="number">${totalTables > 0 ? ((totalPro / totalTables) * 100).toFixed(1) : 0}%</p>
    </div>
  </div>

  <div class="metric">
    <h2>📈 Tables Created (Daily)</h2>
    <table>
      <thead>
        <tr><th>Date</th><th>Count</th><th>Chart</th></tr>
      </thead>
      <tbody>
        ${Object.entries(tablesCreated)
          .sort((a, b) => b[0].localeCompare(a[0]))
          .map(([date, count]) => {
            const bar = '█'.repeat(Math.max(1, Math.floor(count / 5)));
            return `<tr><td>${date}</td><td><strong>${count}</strong></td><td class="chart">${bar}</td></tr>`;
          })
          .join('')}
      </tbody>
    </table>
  </div>

  <div class="metric">
    <h2>👁️ Table Views (Daily)</h2>
    <table>
      <thead>
        <tr><th>Date</th><th>Count</th><th>Chart</th></tr>
      </thead>
      <tbody>
        ${Object.entries(views)
          .sort((a, b) => b[0].localeCompare(a[0]))
          .map(([date, count]) => {
            const bar = '█'.repeat(Math.max(1, Math.floor(count / 10)));
            return `<tr><td>${date}</td><td><strong>${count}</strong></td><td class="chart">${bar}</td></tr>`;
          })
          .join('')}
      </tbody>
    </table>
  </div>

  <div class="metric">
    <h2>⭐ Pro Tables (Daily)</h2>
    <table>
      <thead>
        <tr><th>Date</th><th>Count</th><th>Chart</th></tr>
      </thead>
      <tbody>
        ${Object.entries(proTables)
          .sort((a, b) => b[0].localeCompare(a[0]))
          .map(([date, count]) => {
            const bar = '█'.repeat(Math.max(count > 0 ? 1 : 0, Math.floor(count / 2)));
            return `<tr><td>${date}</td><td><strong>${count}</strong></td><td class="chart">${bar || '-'}</td></tr>`;
          })
          .join('')}
      </tbody>
    </table>
  </div>
</body>
</html>`;

          return new Response(html, {
            headers: { 'Content-Type': 'text/html' }
          });
        } catch (error) {
          return new Response('Analytics error: ' + error.message, {
            status: 500,
            headers: { 'Content-Type': 'text/plain' }
          });
        }
      }

      if (pathname === '/api/create' && request.method === 'POST') {
        const response = await handleCreate(request, env);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders }
        });
      }

      if (pathname.startsWith('/t/') && pathname.length === 11) {
        const id = pathname.slice(3);
        if (/^[a-zA-Z0-9]{8}$/.test(id)) {
          const response = await handleView(request, env, id);
          return new Response(response.body, {
            ...response,
            headers: { ...response.headers, ...corsHeaders }
          });
        }
      }

      // Handle password unlock POST requests
      if (pathname.match(/^\/t\/[a-zA-Z0-9]{8}\/unlock$/) && request.method === 'POST') {
        const id = pathname.split('/')[2];
        const response = await handleView(request, env, id);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders }
        });
      }

      if (pathname === '/api/kofi-webhook' && request.method === 'POST') {
        const response = await handleKofiWebhook(request, env);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders }
        });
      }

      return new Response('Not Found', {
        status: 404,
        headers: corsHeaders
      });

    } catch (error) {
      return new Response('Internal Server Error: ' + error.message, {
        status: 500,
        headers: corsHeaders
      });
    }
  }
};
