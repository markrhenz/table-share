import { handleCreate } from './handlers/create.js';
import { handleView } from './handlers/view.js';
import { handleKofiWebhook } from './handlers/kofi-webhook.js';

const INDEX_HTML = `<!DOCTYPE html>
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
    <script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
</head>
<body>
    <a href="#main" class="sr-only" style="position: absolute; left: -9999px; top: auto; width: 1px; height: 1px; overflow: hidden;">Skip to content</a>
    <button id="themeToggle" class="theme-toggle" aria-label="Toggle dark mode"></button>
    <div class="container">
        <header>
            <div style="display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 20px;">
                <img src="/logo.png" width="48" height="48" alt="Table Share" class="logo">
                <h1 style="font-size: 48px; font-weight: 700; margin: 0;">Table Share</h1>
            </div>
            <p class="tagline">Stop emailing CSVs.</p>
            <p class="cta">Paste your data. Share a link that expires. No signup for anyone.</p>
            <p style="font-size: 14px; color: var(--muted-color); margin-top: 12px;" id="statsLine">
                <span id="tableCount">Loading...</span> tables shared
            </p>
        </header>
        <main id="main">
            <div style="background: var(--secondary-bg); border: 2px solid var(--border-color); padding: 16px 20px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                <div>
                    <strong style="font-size: 14px;">Need password protection or longer expiry?</strong>
                    <span style="font-size: 13px; color: var(--muted-color); margin-left: 8px;">Pro unlocks everything for $5 one-time.</span>
                </div>
                <a href="/pricing" style="background: var(--accent-color); color: #fff; padding: 8px 16px; text-decoration: none; font-size: 13px; font-weight: 600; white-space: nowrap;">See Pro Features →</a>
            </div>
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
        <script src="/js/history.js" defer></script>
                        </div>
                    </div>
                    <div id="passwordContainer" style="margin-top: 8px; display: none;">
                        <label for="passwordInput" style="display: block; font-size: 12px; color: var(--muted-color); margin-bottom: 4px;">
                            🔒 Password protect this table (Pro only):
                        </label>
                        <input
                            type="password"
                            id="passwordInput"
                            placeholder="Enter password for recipients"
                            style="width: 100%; border: 2px solid var(--border-color); padding: 8px; font-size: 14px; background: var(--bg-color); color: var(--text-color);"
                        >
                        <p style="font-size: 11px; color: var(--muted-color); margin-top: 4px;">Recipients will need this password to view the table.</p>
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
                ⚡ Paste data from Excel, Sheets, or CSV. Link generated in under 3 seconds.
            </div>
            <div style="margin-bottom: 12px;">
                <label for="passwordInputMain" style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--muted-color); margin-bottom: 6px;">
                    🔒 Password protect
                    <span style="background: var(--accent-color); color: #fff; font-size: 10px; padding: 2px 6px; border-radius: 3px; font-weight: 600;">PRO</span>
                </label>
                <input
                    type="password"
                    id="passwordInputMain"
                    placeholder="Optional - recipients will need this password"
                    style="width: 100%; border: 2px solid var(--border-color); padding: 10px; font-size: 14px; background: var(--bg-color); color: var(--text-color);"
                >
            </div>
             <button id="generateBtn" class="button">Generate Link</button>
             <div id="status" class="status" aria-live="polite" aria-atomic="true"></div>
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
                        <p>Copy from Excel, Sheets, database output, anywhere</p>
                    </div>
                    <div class="step">
                        <div class="step-number">2</div>
                        <h3>Get Link</h3>
                        <p>Instant URL, auto-copied to clipboard</p>
                    </div>
                    <div class="step">
                        <div class="step-number">3</div>
                        <h3>Done</h3>
                        <p>No permissions. No accounts. Link auto-expires.</p>
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
                <h2>Why Not Just Use Google Sheets?</h2>
                <div class="feature-grid">
                    <div class="feature">
                        <div class="feature-icon">⚡</div>
                        <h3>3 Seconds, Not 3 Minutes</h3>
                        <p>No file creation. No permission dialogs. No waiting.</p>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">🚫</div>
                        <h3>No "Request Access" Emails</h3>
                        <p>Recipients click link and see data. That's it.</p>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">⏰</div>
                        <h3>Data Doesn't Live Forever</h3>
                        <p>Links auto-expire. No orphaned files cluttering your Drive.</p>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">🔒</div>
                        <h3>Password Protect</h3>
                        <p>Add a password for sensitive data. <a href="/pricing" style="color: var(--accent-color);">Pro feature</a></p>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">📱</div>
                        <h3>Mobile-Perfect</h3>
                        <p>Clean tables that actually work on phones.</p>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">💾</div>
                        <h3>CSV Download</h3>
                        <p>Recipients can export if they need to.</p>
                    </div>
                </div>
            </section>
            <section class="use-cases" style="margin-top: 80px;">
                <h2>From the Blog</h2>
                <div class="case-list">
                    <div class="case">
                        <h3><a href="/blog/share-csv-online" style="color: var(--accent-color); text-decoration: none;">How to Share CSV Files Online</a></h3>
                        <p>Stop emailing CSV attachments. Turn any CSV into a shareable link with instant preview.</p>
                    </div>
                    <div class="case">
                        <h3><a href="/blog/share-excel-without-login" style="color: var(--accent-color); text-decoration: none;">Share Excel Without Login</a></h3>
                        <p>The fastest way to share spreadsheet data in 2025. No signup required.</p>
                    </div>
                    <div class="case">
                        <h3><a href="/blog/google-sheets-alternatives" style="color: var(--accent-color); text-decoration: none;">Google Sheets Alternatives</a></h3>
                        <p>10 lightweight tools when you need speed over collaboration features.</p>
                    </div>
                </div>
                <p style="text-align: center; margin-top: 20px;"><a href="/blog" style="color: var(--accent-color);">View all articles →</a></p>
            </section>
        </main>
        <footer>
            <p>&copy; 2025 Table Share | <a href="/blog">Blog</a> | <a href="/pricing">Pricing</a> | <a href="mailto:markrhenz@table-share.org">Contact</a> | <a href="/terms">Terms</a> | <a href="/privacy">Privacy</a></p>
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
                document.getElementById('passwordContainer').style.display = 'none';
                localStorage.removeItem('proApiKey');
                return;
            }

            if (key.startsWith('ts_live_') && key.length >= 28) {
                proStatus.textContent = '✓ Pro Mode Active - 5,000 rows, 90-day expiry';
                proStatus.style.color = '#00cc66';
                proStatus.style.display = 'block';
                expiryContainer.style.display = 'block';
                document.getElementById('passwordContainer').style.display = 'block';
                localStorage.setItem('proApiKey', key);
            } else {
                proStatus.textContent = '✗ Invalid API key format';
                proStatus.style.color = '#ff4444';
                proStatus.style.display = 'block';
                expiryContainer.style.display = 'none';
                document.getElementById('passwordContainer').style.display = 'none';
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
        
                const apiKeyValue = document.getElementById('apiKeyInput').value.trim();
                const isProUser = apiKeyValue && apiKeyValue.startsWith('ts_live_') && apiKeyValue.length >= 28;
        
                // Check if free user trying to use >7 day expiry
                const expirySelect = document.getElementById('expirySelect');
                const selectedExpiry = expirySelect ? parseInt(expirySelect.value) : 604800;
                if (selectedExpiry > 604800 && !isProUser) {
                    const modal = document.getElementById('upgradeModal');
                    modal.querySelector('h2').textContent = 'Extended Expiry is Pro';
                    modal.querySelector('p').innerHTML = 'Free tables expire in <strong>7 days</strong>.';
                    modal.querySelector('p:nth-of-type(2)').innerHTML = 'Upgrade once for <strong>$5</strong> to keep tables for up to <strong>90 days</strong>.';
                    modal.style.display = 'flex';
                    if (typeof sa_event === 'function') sa_event('upgrade_modal_shown');
                    generateBtn.disabled = false;
                    status.textContent = '';
                    return;
                }
        
                // Check if free user trying to remove branding
                const noBrandingCheck = document.getElementById('noBranding');
                const wantsBrandingRemoved = noBrandingCheck ? noBrandingCheck.checked : false;
                if (wantsBrandingRemoved && !isProUser) {
                    const modal = document.getElementById('upgradeModal');
                    modal.querySelector('h2').textContent = 'Remove Branding is Pro';
                    modal.querySelector('p').innerHTML = 'Free tables include a small <strong>"Created with Table Share"</strong> footer.';
                    modal.querySelector('p:nth-of-type(2)').innerHTML = 'Upgrade once for <strong>$5</strong> for clean, unbranded tables.';
                    modal.style.display = 'flex';
                    if (typeof sa_event === 'function') sa_event('upgrade_modal_shown');
                    generateBtn.disabled = false;
                    status.textContent = '';
                    return;
                }
        
                // Check if free user trying to use password
                const passwordValue = document.getElementById('passwordInputMain') ? document.getElementById('passwordInputMain').value.trim() : '';

                if (passwordValue && !isProUser) {
                    // Show upgrade modal for password feature
                    const modal = document.getElementById('upgradeModal');
                    modal.querySelector('h2').textContent = 'Pro Feature';
                    modal.querySelector('p').innerHTML = 'Password protection requires <strong>Pro</strong>.';
                    modal.querySelector('p:nth-of-type(2)').innerHTML = 'Upgrade once for <strong>$5</strong> to protect your tables with passwords.';
                    modal.style.display = 'flex';
                    if (typeof sa_event === 'function') sa_event('upgrade_modal_shown');
                    generateBtn.disabled = false;
                    status.textContent = '';
                    return;
                }

                const response = await fetch('/api/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        data: parsed.data,
                        title: document.getElementById('titleInput').value.trim() || null,
                        apiKey: document.getElementById('apiKeyInput').value.trim() || null,
                        password: document.getElementById('passwordInputMain') ? document.getElementById('passwordInputMain').value.trim() : null,
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
                if (error.message.includes('Too many rows')) {
                    document.getElementById('upgradeModal').style.display = 'flex';
                    if (typeof sa_event === 'function') sa_event('upgrade_modal_shown');
                } else {
                    status.innerHTML = '✗ Error: ' + error.message;
                }
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

        // Fetch and display stats
        (async function() {
            try {
                const response = await fetch('/api/stats');
                if (response.ok) {
                    const data = await response.json();
                    document.getElementById('tableCount').textContent = data.total.toLocaleString();
                } else {
                    document.getElementById('statsLine').style.display = 'none';
                }
            } catch (e) {
                document.getElementById('statsLine').style.display = 'none';
            }
        })();
    </script>
<div id="upgradeModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; justify-content: center; align-items: center;">
  <div style="background: var(--bg-color); border: 2px solid var(--border-color); padding: 40px; max-width: 500px; text-align: center;">
    <h2 style="margin-bottom: 20px;">Table Too Large</h2>
    <p style="margin-bottom: 20px; color: var(--muted-color);">Free tables are limited to <strong>500 rows</strong>.</p>
    <p style="margin-bottom: 30px;">Upgrade once for <strong>$5</strong> to share tables up to <strong>5,000 rows</strong>.</p>
    <a href="/pricing" style="display: inline-block; background: var(--accent-color); color: #fff; padding: 15px 30px; text-decoration: none; font-weight: 600; margin-right: 10px;">Get Pro - $5</a>
    <button onclick="document.getElementById('upgradeModal').style.display='none'" style="background: transparent; border: 2px solid var(--border-color); padding: 15px 30px; cursor: pointer; color: var(--text-color);">Cancel</button>
  </div>
</div>
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
    <p>Table Share allows you to paste tabular data and generate shareable links. Free links expire after 7 days. Pro links can last up to 90 days.</p>
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
    <p>Questions? Email: <a href="mailto:markrhenz@table-share.org">markrhenz@table-share.org</a></p>
    <p style="margin-top: 40px;"><a href="/">&larr; Back to Table Share</a> | <a href="/blog">Blog</a> | <a href="/pricing">Pricing</a></p>
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
        <li>Pasted table data (stored 7-90 days depending on tier)</li>
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
    <p>Free tables auto-delete after 7 days. Pro tables after 90 days. Manual deletion: email markrhenz@table-share.org with the link.</p>
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
    <p style="margin-top: 40px;"><a href="/">&larr; Back to Table Share</a> | <a href="/blog">Blog</a> | <a href="/pricing">Pricing</a></p>
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
                <li>✓ 7-day expiration</li>
                <li>✓ CSV download</li>
                <li>✓ Dark mode</li>
                <li>✓ No signup required</li>
            </ul>
            <a href="/" class="cta-button">Start Free</a>
        </div>
        
        <div class="tier pro" style="position: relative;">
            <div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: var(--accent-color); color: #fff; padding: 4px 16px; font-size: 12px; font-weight: 600;">RECOMMENDED</div>
            <h2>Pro</h2>
            <div class="price">$5<small>/one-time</small></div>
            <p style="font-size: 14px; color: var(--muted-color); margin-bottom: 20px; text-align: center;">Pay once, use forever. No subscription.</p>
            <ul>
                <li>✓ <strong>Password protection</strong> - secure sensitive data</li>
                <li>✓ <strong>90-day expiry</strong> - vs 7 days free</li>
                <li>✓ <strong>Remove branding</strong> - clean, professional</li>
                <li>✓ <strong>5,000 rows</strong> - 10x free tier</li>
                <li>✓ <strong>100 columns</strong> - 2x free tier</li>
                <li>✓ <strong>API access</strong> - automate workflows</li>
            </ul>
            <a href="https://ko-fi.com/s/0a371a6316" class="cta-button">Get Pro - $5</a>
            <p style="text-align: center; margin-top: 15px; font-size: 13px; color: var(--muted-color);">Instant API key via email. No account needed.</p>
        </div>
    </div>
    
    <div style="text-align: center; margin-top: 60px;">
        <p style="color: var(--muted-color);">Questions? <a href="mailto:markrhenz@table-share.org" style="color: var(--accent-color);">Contact us</a></p>
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
  <url>
    <loc>https://table-share.org/blog</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://table-share.org/blog/share-excel-without-login</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://table-share.org/blog/sql-results-sharing</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://table-share.org/blog/google-sheets-alternatives</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://table-share.org/blog/share-csv-online</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://table-share.org/blog/pastebin-for-tables</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`;

const ROBOTS_TXT = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://table-share.org/sitemap.xml`;

const BLOG_INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Table Share Blog - Data Sharing Tips & Guides | Free Tutorials</title>
    <meta name="description" content="Learn how to share tables, CSV files, and spreadsheet data quickly and securely without signup. Free tutorials for developers, freelancers, and teams.">
    <meta name="keywords" content="table sharing tutorials, spreadsheet guides, CSV sharing, developer tips, data sharing best practices">

    <!-- Open Graph -->
    <meta property="og:title" content="Table Share Blog - Free Data Sharing Guides">
    <meta property="og:description" content="Free tutorials on sharing tables, CSV files, and spreadsheet data without signup.">
    <meta property="og:url" content="https://table-share.org/blog">
    <meta property="og:type" content="website">

    <link rel="canonical" href="https://table-share.org/blog">
    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="/blog.css">
    <link rel="icon" href="/logo.png" type="image/png">
</head>
<body>
    <header class="blog-header">
        <a href="/">
            <img src="/logo.png" alt="Table Share Logo" class="blog-header-logo">
            <strong>Table Share</strong>
        </a>
        <div>
            <button id="themeToggle" class="blog-theme-toggle" aria-label="Toggle dark mode">🌙</button>
        </div>
    </header>

    <main class="blog-container">
        <h1 class="blog-title">Table Sharing Guides</h1>
        <p class="blog-subtitle">
            Free tutorials on sharing data quickly and securely without signup.
        </p>

        <section class="blog-card">
            <h2>Latest Articles</h2>

            <article class="blog-article">
                <h3>
                    <a href="/blog/pastebin-for-tables">
                        Pastebin for Tables: Share Data Like Developers Share Code
                    </a>
                </h3>
                <p class="blog-meta">
                    <time datetime="2026-01-03">January 3, 2026</time> • 4 min read
                </p>
                <p>
                    Developers have Pastebin for code. Now there's an equivalent for tabular data. Paste CSV or spreadsheet data, get a formatted table link.
                </p>
                <a href="/blog/pastebin-for-tables" class="blog-article-link">
                    Read full article →
                </a>
            </article>

            <article class="blog-article">
                <h3>
                    <a href="/blog/share-excel-without-login">
                        How to Share Excel Tables Without Login or Signup (2025)
                    </a>
                </h3>
                <p class="blog-meta">
                    <time datetime="2025-11-21">November 21, 2025</time> • 5 min read
                </p>
                <p>
                    Stop emailing Excel files or forcing people to create accounts. Learn the fastest way to share spreadsheet data online in 2025 - no login required for you or recipients.
                </p>
                <a href="/blog/share-excel-without-login" class="blog-article-link">
                    Read full article →
                </a>
            </article>

            <article class="blog-article">
                <h3>
                    <a href="/blog/sql-results-sharing">
                        Share SQL Query Results Instantly (Without Screenshots)
                    </a>
                </h3>
                <p class="blog-meta">
                    <time datetime="2025-11-21">November 21, 2025</time> • 4 min read
                </p>
                <p>
                    For developers: paste SQL results directly into shareable HTML tables. No more ugly screenshots or formatting issues in Slack/Teams.
                </p>
                <a href="/blog/sql-results-sharing" class="blog-article-link">
                    Read full article →
                </a>
            </article>

            <article class="blog-article">
                <h3>
                    <a href="/blog/google-sheets-alternatives">
                        10 Google Sheets Alternatives for Quick Data Sharing
                    </a>
                </h3>
                <p class="blog-meta">
                    <time datetime="2025-11-21">November 21, 2025</time> • 7 min read
                </p>
                <p>
                    Google Sheets is overkill for simple table sharing. Compare lightweight alternatives that prioritize speed over collaboration features.
                </p>
                <a href="/blog/google-sheets-alternatives" class="blog-article-link">
                    Read full article →
                </a>
            </article>

            <article class="blog-article">
                <h3>
                    <a href="/blog/share-csv-online">
                        How to Share CSV Files Online (No Email, No Signup)
                    </a>
                </h3>
                <p class="blog-meta">
                    <time datetime="2025-01-03">January 3, 2025</time> • 4 min read
                </p>
                <p>
                    Stop emailing CSV attachments. Turn any CSV into an instant shareable link with preview. No download required for recipients.
                </p>
                <a href="/blog/share-csv-online" class="blog-article-link">
                    Read full article →
                </a>
            </article>
        </section>

        <section class="blog-cta">
            <h2>Try Table Share</h2>
            <p>
                The fastest way to share tables online. Paste → Link → Done.
            </p>
            <a href="/" class="blog-cta-button">
                Start Sharing Tables →
            </a>
        </section>
    </main>

    <footer class="blog-footer">
        <p class="blog-footer-links">
            <a href="/">Home</a> •
            <a href="/pricing">Pricing</a> •
            <a href="/blog">Blog</a> •
            <a href="/terms">Terms</a> •
            <a href="/privacy">Privacy</a>
        </p>
        <p class="blog-footer-text">© 2025 Table Share</p>
    </footer>

    <script src="/shared-theme.js"></script>
    <script>
        // Initialize theme toggle using shared script
        function initThemeToggle() {
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle && window.SharedTheme) {
                themeToggle.addEventListener('click', () => {
                    const current = document.documentElement.getAttribute('data-theme');
                    window.SharedTheme.applyTheme(current === 'dark' ? 'light' : 'dark');
                });
                return true;
            }
            return false;
        }

        // Try immediate initialization, fall back to DOMContentLoaded
        if (!initThemeToggle()) {
            document.addEventListener('DOMContentLoaded', () => {
                if (!initThemeToggle()) {
                    setTimeout(initThemeToggle, 100);
                }
            });
        }
    </script>
</body>
</html>`;


const BLOG_EXCEL_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>How to Share Excel Tables Without Login (2025 Guide) | Table Share</title>
    <meta name="description" content="Share Excel spreadsheet data online without login or email attachments. Step-by-step guide for 2025. Free, instant, no signup required.">
    <meta name="keywords" content="share excel without login, share spreadsheet online, no signup excel sharing, excel to web table">
    
    <!-- Open Graph -->
    <meta property="og:title" content="How to Share Excel Tables Without Login (2025)">
    <meta property="og:description" content="The fastest way to share Excel data online. No login, no email attachments, no formatting issues.">
    <meta property="og:url" content="https://table-share.org/blog/share-excel-without-login">
    <meta property="og:type" content="article">
    
    <link rel="canonical" href="https://table-share.org/blog/share-excel-without-login">
    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="/blog.css">
    <link rel="icon" href="/logo.png" type="image/png">
    
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "How to Share Excel Tables Without Login or Signup (2025)",
      "datePublished": "2025-11-21",
      "author": {
        "@type": "Organization",
        "name": "Table Share"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Table Share",
        "logo": {
          "@type": "ImageObject",
          "url": "https://table-share.org/logo.png"
        }
      }
    }
    </script>
</head>
<body>
    <header class="blog-header">
        <a href="/">
            <img src="/logo.png" alt="Table Share Logo" class="blog-header-logo">
            <strong>Table Share</strong>
        </a>
        <div>
            <button id="themeToggle" class="blog-theme-toggle" aria-label="Toggle dark mode">🌙</button>
        </div>
    </header>

    <nav class="blog-nav">
        <a href="/blog" class="blog-back-link">← Back to Blog</a>
    </nav>

    <article class="blog-container blog-content">
        <h1 class="blog-title">
            How to Share Excel Tables Without Login or Signup
        </h1>

        <p class="blog-meta">
            <time datetime="2025-11-21">November 21, 2025</time> • 5 min read
        </p>

        <section class="blog-section">
            <h2>The Problem with Current Methods</h2>
            <p>
                You need to share a simple Excel table with a colleague or client. What are your options?
            </p>
            <ul>
                <li><strong>Email attachment:</strong> Formatting breaks, version conflicts, mailbox limits</li>
                <li><strong>Google Sheets:</strong> Forces recipient to log in or request access</li>
                <li><strong>Screenshot:</strong> Not searchable, not copyable, looks unprofessional</li>
                <li><strong>Paste into Slack/Teams:</strong> Loses all formatting instantly</li>
            </ul>
            <p>
                Every method either loses formatting, requires accounts, or creates friction. There's a better way.
            </p>
        </section>

        <section class="blog-card-highlight">
            <h2>The Solution: Paste → Link → Share</h2>
            <p>
                Here's how to share any Excel table in under 10 seconds:
            </p>

            <div class="blog-card">
                <h3>Step 1: Select Your Data</h3>
                <p>
                    In Excel, select the cells you want to share. Press <code class="blog-code">Ctrl+C</code> (or <code class="blog-code">Cmd+C</code> on Mac).
                </p>
            </div>

            <div class="blog-card">
                <h3>Step 2: Paste on Table Share</h3>
                <p>
                    Go to <a href="https://table-share.org">table-share.org</a>
                </p>
                <p>
                    Click the text area and press <code class="blog-code">Ctrl+V</code>
                </p>
                <p>
                    Your shareable link is instantly generated and auto-copied to your clipboard.
                </p>
            </div>

            <div class="blog-card">
                <h3>Step 3: Share Anywhere</h3>
                <p>
                    Paste the link into Slack, email, Teams, Discord - anywhere.
                </p>
                <p>
                    Recipients click and see a clean, formatted table. <strong>No login required.</strong>
                </p>
            </div>
        </section>
        
        <section class="blog-section">
            <h2>Why This Method Wins</h2>

            <div class="blog-table-wrapper">
                <table class="blog-table">
                    <thead>
                        <tr>
                            <th>Method</th>
                            <th style="text-align: center;">Login Required?</th>
                            <th style="text-align: center;">Keeps Formatting?</th>
                            <th style="text-align: center;">Time to Share</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Table Share</strong></td>
                            <td style="text-align: center;">❌ No</td>
                            <td style="text-align: center;">✅ Yes</td>
                            <td style="text-align: center;">5 seconds</td>
                        </tr>
                        <tr>
                            <td>Google Sheets</td>
                            <td style="text-align: center;">✅ Yes</td>
                            <td style="text-align: center;">✅ Yes</td>
                            <td style="text-align: center;">3-5 minutes</td>
                        </tr>
                        <tr>
                            <td>Email Attachment</td>
                            <td style="text-align: center;">❌ No</td>
                            <td style="text-align: center;">⚠️ Maybe</td>
                            <td style="text-align: center;">1-2 minutes</td>
                        </tr>
                        <tr>
                            <td>Screenshot</td>
                            <td style="text-align: center;">❌ No</td>
                            <td style="text-align: center;">❌ No</td>
                            <td style="text-align: center;">30 seconds</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
        
        <section class="blog-section">
            <h2>Perfect For</h2>
            <ul>
                <li><strong>Freelancers:</strong> Share pricing tables with clients</li>
                <li><strong>Developers:</strong> Share query results with teammates</li>
                <li><strong>Project Managers:</strong> Quick status updates</li>
                <li><strong>Data Analysts:</strong> Share findings without full reports</li>
                <li><strong>Anyone:</strong> Who values speed over complexity</li>
            </ul>
        </section>
        
        <section class="blog-cta">
            <h2>Try It Now (Free Forever)</h2>
            <p>
                No signup, no credit card, no trial period. Just paste and share.
            </p>
            <a href="/" class="blog-cta-button">
                Share Your First Table →
            </a>
        </section>
        
        <section class="blog-section">
            <h2>FAQ</h2>

            <div class="blog-card">
                <h3>Does it work with large Excel files?</h3>
                <p>
                    Free tier supports up to 500 rows. Pro tier handles 5,000 rows. Copy just the data you need to share, not entire workbooks.
                </p>
            </div>

            <div class="blog-card">
                <h3>How long do links last?</h3>
                <p>
                    Free links expire after 7 days (privacy by default). Pro users get 90 days. Perfect for temporary data sharing.
                </p>
            </div>

            <div class="blog-card">
                <h3>Can recipients edit the table?</h3>
                <p>
                    No. Tables are read-only snapshots. Recipients can download as CSV if they need to edit locally.
                </p>
            </div>

            <div class="blog-card">
                <h3>Does it work with Google Sheets too?</h3>
                <p>
                    Yes! Copy from Sheets the same way (Ctrl+C), paste into Table Share, get link. Works with any spreadsheet software.
                </p>
            </div>
        </section>
    </article>
    
    <footer class="blog-footer">
        <p class="blog-footer-links">
            <a href="/">Home</a> •
            <a href="/pricing">Pricing</a> •
            <a href="/blog">Blog</a> •
            <a href="/terms">Terms</a> •
            <a href="/privacy">Privacy</a>
        </p>
        <p class="blog-footer-text">© 2025 Table Share</p>
    </footer>
    
    <script src="/shared-theme.js"></script>
    <script>
        // Initialize theme toggle using shared script
        function initThemeToggle() {
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle && window.SharedTheme) {
                themeToggle.addEventListener('click', () => {
                    const current = document.documentElement.getAttribute('data-theme');
                    window.SharedTheme.applyTheme(current === 'dark' ? 'light' : 'dark');
                });
                return true;
            }
            return false;
        }
        
        // Try immediate initialization, fall back to DOMContentLoaded
        if (!initThemeToggle()) {
            document.addEventListener('DOMContentLoaded', () => {
                if (!initThemeToggle()) {
                    setTimeout(initThemeToggle, 100);
                }
            });
        }
    </script>
</body>
</html>
`;

const BLOG_SQL_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Share SQL Query Results Instantly (Without Screenshots) | Table Share</title>
    <meta name="description" content="Stop taking screenshots of SQL results. Share query output as clean HTML tables in seconds. Perfect for developers sharing data in Slack, Teams, or email.">
    <meta name="keywords" content="sql results sharing, share query results, database output sharing, sql to html table, developer tools">
    
    <!-- Open Graph -->
    <meta property="og:title" content="Share SQL Query Results Instantly">
    <meta property="og:description" content="For developers: paste SQL results directly into shareable HTML tables. No more ugly screenshots.">
    <meta property="og:url" content="https://table-share.org/blog/sql-results-sharing">
    <meta property="og:type" content="article">
    
    <link rel="canonical" href="https://table-share.org/blog/sql-results-sharing">
    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="/blog.css">
    <link rel="icon" href="/logo.png" type="image/png">
    
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Share SQL Query Results Instantly (Without Screenshots)",
      "datePublished": "2025-11-21",
      "author": {
        "@type": "Organization",
        "name": "Table Share"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Table Share",
        "logo": {
          "@type": "ImageObject",
          "url": "https://table-share.org/logo.png"
        }
      }
    }
    </script>
</head>
<body>
    <header class="blog-header">
        <a href="/">
            <img src="/logo.png" alt="Table Share Logo" class="blog-header-logo">
            <strong>Table Share</strong>
        </a>
        <div>
            <button id="themeToggle" class="blog-theme-toggle" aria-label="Toggle dark mode">🌙</button>
        </div>
    </header>

    <nav class="blog-nav">
        <a href="/blog" class="blog-back-link">← Back to Blog</a>
    </nav>

    <article class="blog-container blog-content">
        <h1 class="blog-title">
            Share SQL Query Results Instantly (Without Screenshots)
        </h1>

        <p class="blog-meta">
            <time datetime="2025-11-21">November 21, 2025</time> • 4 min read
        </p>

        <section class="blog-section">
            <h2>The Developer's Dilemma</h2>
            <p>
                You run a SQL query. The results look perfect. Now you need to share them with your team in Slack.
            </p>
            <p>
                Your options:
            </p>
            <ul>
                <li><strong>Screenshot:</strong> Blurry, not searchable, can't copy values</li>
                <li><strong>Paste raw text:</strong> Formatting destroyed, unreadable mess</li>
                <li><strong>Export to CSV:</strong> Extra steps, requires download, loses context</li>
                <li><strong>Copy to Google Sheets:</strong> Overkill, requires login, too slow</li>
            </ul>
            <p>
                There's a faster way that takes 5 seconds.
            </p>
        </section>

        <section class="blog-section">
            <h2>The 5-Second Solution</h2>

            <div class="blog-card-highlight">
                <h3>Step 1: Copy Query Results</h3>
                <p>
                    In your SQL client (MySQL Workbench, pgAdmin, DBeaver, etc.), select your query results and copy them.
                </p>
                <div class="blog-code-block">
                    SELECT * FROM users LIMIT 10;
                </div>
            </div>

            <div class="blog-card-highlight">
                <h3>Step 2: Paste on Table Share</h3>
                <p>
                    Go to <a href="https://table-share.org">table-share.org</a> and paste (Ctrl+V).
                </p>
                <p>
                    Your shareable link is instantly generated.
                </p>
            </div>

            <div class="blog-card-highlight">
                <h3>Step 3: Share in Slack/Teams</h3>
                <p>
                    Paste the link. Your team sees a clean, formatted HTML table. No screenshots, no formatting issues.
                </p>
            </div>
        </section>

        <section class="blog-section">
            <h2>Why Developers Love This</h2>
            <ul>
                <li><strong>Fast:</strong> 5 seconds from query to shareable link</li>
                <li><strong>Clean:</strong> Proper HTML table formatting</li>
                <li><strong>Searchable:</strong> Recipients can Ctrl+F to find values</li>
                <li><strong>Copyable:</strong> Easy to copy individual cells or rows</li>
                <li><strong>No login:</strong> Neither you nor recipients need accounts</li>
                <li><strong>Privacy:</strong> Links auto-expire in 7 days</li>
            </ul>
        </section>

        <section class="blog-section">
            <h2>Perfect Use Cases</h2>

            <div class="blog-card">
                <h3>Debug Sessions</h3>
                <p>
                    "Here's what the database returned" - share query results instantly during debugging.
                </p>
            </div>

            <div class="blog-card">
                <h3>Code Reviews</h3>
                <p>
                    Show before/after data when reviewing database migrations or data transformations.
                </p>
            </div>

            <div class="blog-card">
                <h3>Quick Reports</h3>
                <p>
                    Share analytics queries with non-technical stakeholders without building dashboards.
                </p>
            </div>

            <div class="blog-card">
                <h3>Documentation</h3>
                <p>
                    Include example query results in technical documentation or tickets.
                </p>
            </div>
        </section>

        <section class="blog-cta">
            <h2>Try It Now (Free Forever)</h2>
            <p>
                No signup required. Works with any SQL database.
            </p>
            <a href="/" class="blog-cta-button">
                Share SQL Results →
            </a>
        </section>

        <section class="blog-section">
            <h2>FAQ</h2>

            <div class="blog-card">
                <h3>Does it work with all SQL databases?</h3>
                <p>
                    Yes! Works with MySQL, PostgreSQL, SQL Server, Oracle, SQLite - any database. Just copy the results from your SQL client.
                </p>
            </div>

            <div class="blog-card">
                <h3>How many rows can I share?</h3>
                <p>
                    Free tier: 500 rows. Pro tier: 5,000 rows. Perfect for most query results.
                </p>
            </div>

            <div class="blog-card">
                <h3>Is my data secure?</h3>
                <p>
                    Links are unguessable random IDs. Data auto-expires in 7 days. For sensitive data, use password protection (Pro feature).
                </p>
            </div>

            <div class="blog-card">
                <h3>Can I share query results from command line?</h3>
                <p>
                    Yes! Pipe your query output through our CLI tool (coming soon) or copy from terminal and paste on the website.
                </p>
            </div>
        </section>
    </article>

    <footer class="blog-footer">
        <p class="blog-footer-links">
            <a href="/">Home</a> •
            <a href="/pricing">Pricing</a> •
            <a href="/blog">Blog</a> •
            <a href="/terms">Terms</a> •
            <a href="/privacy">Privacy</a>
        </p>
        <p class="blog-footer-text">© 2025 Table Share</p>
    </footer>
    
    <script src="/shared-theme.js"></script>
    <script>
        // Initialize theme toggle using shared script
        function initThemeToggle() {
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle && window.SharedTheme) {
                themeToggle.addEventListener('click', () => {
                    const current = document.documentElement.getAttribute('data-theme');
                    window.SharedTheme.applyTheme(current === 'dark' ? 'light' : 'dark');
                });
                return true;
            }
            return false;
        }
        
        // Try immediate initialization, fall back to DOMContentLoaded
        if (!initThemeToggle()) {
            document.addEventListener('DOMContentLoaded', () => {
                if (!initThemeToggle()) {
                    setTimeout(initThemeToggle, 100);
                }
            });
        }
    </script>
</body>
</html>
`;

const BLOG_SHEETS_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>10 Google Sheets Alternatives for Quick Data Sharing | Table Share</title>
    <meta name="description" content="Google Sheets is overkill for simple table sharing. Compare lightweight alternatives that prioritize speed over collaboration. Free, no signup required.">
    <meta name="keywords" content="google sheets alternatives, spreadsheet alternatives, quick data sharing, lightweight spreadsheet, no signup table sharing">
    
    <!-- Open Graph -->
    <meta property="og:title" content="10 Google Sheets Alternatives for Quick Data Sharing">
    <meta property="og:description" content="When you need to share data fast, not collaborate. Lightweight alternatives to Google Sheets.">
    <meta property="og:url" content="https://table-share.org/blog/google-sheets-alternatives">
    <meta property="og:type" content="article">
    
    <link rel="canonical" href="https://table-share.org/blog/google-sheets-alternatives">
    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="/blog.css">
    <link rel="icon" href="/logo.png" type="image/png">
    
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "10 Google Sheets Alternatives for Quick Data Sharing",
      "datePublished": "2025-11-21",
      "author": {
        "@type": "Organization",
        "name": "Table Share"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Table Share",
        "logo": {
          "@type": "ImageObject",
          "url": "https://table-share.org/logo.png"
        }
      }
    }
    </script>
</head>
<body>
    <header class="blog-header">
        <a href="/">
            <img src="/logo.png" alt="Table Share Logo" class="blog-header-logo">
            <strong>Table Share</strong>
        </a>
        <div>
            <button id="themeToggle" class="blog-theme-toggle" aria-label="Toggle dark mode">🌙</button>
        </div>
    </header>

    <nav class="blog-nav">
        <a href="/blog" class="blog-back-link">← Back to Blog</a>
    </nav>

    <article class="blog-container blog-content">
        <h1 class="blog-title">
            10 Google Sheets Alternatives for Quick Data Sharing
        </h1>

        <p class="blog-meta">
            <time datetime="2025-11-21">November 21, 2025</time> • 7 min read
        </p>

        <section class="blog-section">
            <h2>When Google Sheets is Overkill</h2>
            <p>
                Google Sheets is powerful. But sometimes you just need to share a simple table. You don't need:
            </p>
            <ul>
                <li>Real-time collaboration</li>
                <li>Complex formulas</li>
                <li>Pivot tables</li>
                <li>Conditional formatting</li>
                <li>Version history</li>
            </ul>
            <p>
                You just need to share data. Fast. Without forcing people to log in.
            </p>
        </section>

        <section class="blog-section">
            <h2>The Alternatives</h2>

            <div class="blog-card">
                <h3>1. Table Share (Our Pick)</h3>
                <p>
                    <strong>Best for:</strong> Instant sharing without signup
                </p>
                <p>
                    Paste data, get link, done. No accounts, no friction. Links expire in 7 days for privacy.
                </p>
                <p>
                    <strong>Time to share:</strong> 5 seconds | <strong>Login required:</strong> No
                </p>
            </div>
            
            <div class="blog-card">
                <h3>2. Pastebin</h3>
                <p>
                    <strong>Best for:</strong> Plain text data
                </p>
                <p>
                    Good for raw CSV or TSV data. No formatting, but fast and simple.
                </p>
                <p>
                    <strong>Time to share:</strong> 10 seconds | <strong>Login required:</strong> No
                </p>
            </div>

            <div class="blog-card">
                <h3>3. GitHub Gist</h3>
                <p>
                    <strong>Best for:</strong> Developers sharing data with code
                </p>
                <p>
                    Great for CSV/JSON data alongside code. Requires GitHub account.
                </p>
                <p>
                    <strong>Time to share:</strong> 30 seconds | <strong>Login required:</strong> Yes
                </p>
            </div>

            <div class="blog-card">
                <h3>4. Notion Tables</h3>
                <p>
                    <strong>Best for:</strong> Tables within documentation
                </p>
                <p>
                    Beautiful formatting, but requires Notion account and setup time.
                </p>
                <p>
                    <strong>Time to share:</strong> 2-3 minutes | <strong>Login required:</strong> Yes
                </p>
            </div>

            <div class="blog-card">
                <h3>5. Airtable</h3>
                <p>
                    <strong>Best for:</strong> Database-like tables with relationships
                </p>
                <p>
                    Powerful but complex. Overkill for simple data sharing.
                </p>
                <p>
                    <strong>Time to share:</strong> 5+ minutes | <strong>Login required:</strong> Yes
                </p>
            </div>

            <div class="blog-card">
                <h3>6. Excel Online</h3>
                <p>
                    <strong>Best for:</strong> Microsoft ecosystem users
                </p>
                <p>
                    Similar to Google Sheets. Requires Microsoft account.
                </p>
                <p>
                    <strong>Time to share:</strong> 3-5 minutes | <strong>Login required:</strong> Yes
                </p>
            </div>

            <div class="blog-card">
                <h3>7. Markdown Tables</h3>
                <p>
                    <strong>Best for:</strong> GitHub README files
                </p>
                <p>
                    Plain text format. Good for documentation, tedious to create manually.
                </p>
                <p>
                    <strong>Time to share:</strong> 5+ minutes | <strong>Login required:</strong> Depends on platform
                </p>
            </div>

            <div class="blog-card">
                <h3>8. Coda</h3>
                <p>
                    <strong>Best for:</strong> Interactive documents with tables
                </p>
                <p>
                    Powerful but requires learning curve. Too much for simple sharing.
                </p>
                <p>
                    <strong>Time to share:</strong> 5+ minutes | <strong>Login required:</strong> Yes
                </p>
            </div>

            <div class="blog-card">
                <h3>9. CSV to HTML Converters</h3>
                <p>
                    <strong>Best for:</strong> One-time conversions
                </p>
                <p>
                    Convert CSV to HTML, then host somewhere. Multi-step process.
                </p>
                <p>
                    <strong>Time to share:</strong> 2-5 minutes | <strong>Login required:</strong> Varies
                </p>
            </div>

            <div class="blog-card">
                <h3>10. Email Attachments</h3>
                <p>
                    <strong>Best for:</strong> When you're already emailing
                </p>
                <p>
                    Classic method. Formatting often breaks, creates version confusion.
                </p>
                <p>
                    <strong>Time to share:</strong> 1-2 minutes | <strong>Login required:</strong> No
                </p>
            </div>
        </section>
        
        <section class="blog-section">
            <h2>Comparison Table</h2>

            <div class="blog-table-wrapper">
                <table class="blog-table">
                    <thead>
                        <tr>
                            <th>Tool</th>
                            <th>Speed</th>
                            <th>No Login</th>
                            <th>Formatting</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Table Share</strong></td>
                            <td>⚡⚡⚡</td>
                            <td>✅</td>
                            <td>✅</td>
                        </tr>
                        <tr>
                            <td>Google Sheets</td>
                            <td>⚡</td>
                            <td>❌</td>
                            <td>✅</td>
                        </tr>
                        <tr>
                            <td>Pastebin</td>
                            <td>⚡⚡</td>
                            <td>✅</td>
                            <td>❌</td>
                        </tr>
                        <tr>
                            <td>GitHub Gist</td>
                            <td>⚡⚡</td>
                            <td>❌</td>
                            <td>⚠️</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section class="blog-cta">
            <h2>Try the Fastest Option</h2>
            <p>
                Table Share: 5 seconds from paste to shareable link. No signup, no friction.
            </p>
            <a href="/" class="blog-cta-button">
                Share Your First Table →
            </a>
        </section>

        <section class="blog-section">
            <h2>When to Use What</h2>

            <div class="blog-card">
                <h3>Use Table Share when:</h3>
                <ul>
                    <li>You need to share data RIGHT NOW</li>
                    <li>Recipients shouldn't need accounts</li>
                    <li>Data is temporary (expires in 7 days)</li>
                    <li>You want clean HTML table formatting</li>
                </ul>
            </div>

            <div class="blog-card">
                <h3>Use Google Sheets when:</h3>
                <ul>
                    <li>Multiple people need to edit simultaneously</li>
                    <li>You need complex formulas or charts</li>
                    <li>Data needs to persist long-term</li>
                    <li>Everyone already has Google accounts</li>
                </ul>
            </div>

            <div class="blog-card">
                <h3>Use GitHub Gist when:</h3>
                <ul>
                    <li>Sharing data alongside code</li>
                    <li>Your audience is developers</li>
                    <li>You want version control</li>
                </ul>
            </div>
        </section>
    </article>
    
    <footer class="blog-footer">
        <p class="blog-footer-links">
            <a href="/">Home</a> •
            <a href="/pricing">Pricing</a> •
            <a href="/blog">Blog</a> •
            <a href="/terms">Terms</a> •
            <a href="/privacy">Privacy</a>
        </p>
        <p class="blog-footer-text">© 2025 Table Share</p>
    </footer>
    
    <script src="/shared-theme.js"></script>
    <script>
        // Initialize theme toggle using shared script
        function initThemeToggle() {
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle && window.SharedTheme) {
                themeToggle.addEventListener('click', () => {
                    const current = document.documentElement.getAttribute('data-theme');
                    window.SharedTheme.applyTheme(current === 'dark' ? 'light' : 'dark');
                });
                return true;
            }
            return false;
        }
        
        // Try immediate initialization, fall back to DOMContentLoaded
        if (!initThemeToggle()) {
            document.addEventListener('DOMContentLoaded', () => {
                if (!initThemeToggle()) {
                    setTimeout(initThemeToggle, 100);
                }
            });
        }
    </script>
</body>
</html>
`;

const BLOG_CSV_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>How to Share CSV Files Online (No Email, No Signup) | Table Share</title>
    <meta name="description" content="Share CSV files instantly without email attachments or signups. Convert CSV to shareable link in 5 seconds. Free, fast, no account required.">
    <meta name="keywords" content="share csv online, send csv file, csv sharing tool, share csv without email, csv to link">
    
    <meta property="og:title" content="Share CSV Files Online - No Email, No Signup">
    <meta property="og:description" content="Convert any CSV file to a shareable link in 5 seconds. No email attachments, no accounts.">
    <meta property="og:url" content="https://table-share.org/blog/share-csv-online">
    <meta property="og:type" content="article">
    
    <link rel="canonical" href="https://table-share.org/blog/share-csv-online">
    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="/blog.css">
    <link rel="icon" href="/logo.png" type="image/png">
    
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "How to Share CSV Files Online (No Email, No Signup)",
      "datePublished": "2025-01-03",
      "author": {
        "@type": "Organization",
        "name": "Table Share"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Table Share",
        "logo": {
          "@type": "ImageObject",
          "url": "https://table-share.org/logo.png"
        }
      }
    }
    </script>
</head>
<body>
    <header class="blog-header">
        <a href="/">
            <img src="/logo.png" alt="Table Share Logo" class="blog-header-logo">
            <strong>Table Share</strong>
        </a>
        <div>
            <button id="themeToggle" class="blog-theme-toggle" aria-label="Toggle dark mode">🌙</button>
        </div>
    </header>

    <nav class="blog-nav">
        <a href="/blog" class="blog-back-link">← Back to Blog</a>
    </nav>

    <article class="blog-container blog-content">
        <h1 class="blog-title">
            How to Share CSV Files Online (No Email, No Signup)
        </h1>

        <p class="blog-meta">
            <time datetime="2025-01-03">January 3, 2025</time> • 4 min read
        </p>

        <section class="blog-section">
            <h2>The Problem with Sharing CSV Files</h2>
            <p>
                You have a CSV file. You need to share it with someone. What are your options?
            </p>
            <ul>
                <li><strong>Email attachment:</strong> File size limits, gets buried in inbox, version confusion</li>
                <li><strong>Google Drive:</strong> Requires login, permission hassles, overkill for one file</li>
                <li><strong>WeTransfer:</strong> Recipient downloads raw file, can't preview content</li>
                <li><strong>Slack/Teams:</strong> File gets lost in chat history</li>
            </ul>
            <p>
                All these methods share the same problem: the recipient has to download the file and open it in a spreadsheet app just to see what's inside.
            </p>
        </section>

        <section class="blog-card-highlight">
            <h2>The Better Way: CSV to Shareable Link</h2>
            <p>
                What if you could turn your CSV into an instant preview link?
            </p>

            <div class="blog-card">
                <h3>Step 1: Open Your CSV</h3>
                <p>
                    Open your CSV file in any text editor, Excel, or Google Sheets. Select all the data and copy it (<code class="blog-code">Ctrl+C</code>).
                </p>
            </div>

            <div class="blog-card">
                <h3>Step 2: Paste on Table Share</h3>
                <p>
                    Go to <a href="https://table-share.org">table-share.org</a> and paste (<code class="blog-code">Ctrl+V</code>).
                </p>
                <p>
                    Your shareable link is generated instantly and copied to clipboard.
                </p>
            </div>

            <div class="blog-card">
                <h3>Step 3: Share the Link</h3>
                <p>
                    Send the link via email, Slack, text - anywhere. Recipients click and instantly see a clean, formatted table.
                </p>
                <p>
                    <strong>No download required. No login. No spreadsheet app needed.</strong>
                </p>
            </div>
        </section>

        <section class="blog-section">
            <h2>Why This Beats Email Attachments</h2>

            <div class="blog-table-wrapper">
                <table class="blog-table">
                    <thead>
                        <tr>
                            <th>Feature</th>
                            <th>Email Attachment</th>
                            <th>Table Share Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Instant preview</td>
                            <td>❌ Must download & open</td>
                            <td>✅ View in browser</td>
                        </tr>
                        <tr>
                            <td>File size limits</td>
                            <td>⚠️ 25MB typical limit</td>
                            <td>✅ 5,000 rows supported</td>
                        </tr>
                        <tr>
                            <td>Mobile friendly</td>
                            <td>❌ Needs spreadsheet app</td>
                            <td>✅ Works on any device</td>
                        </tr>
                        <tr>
                            <td>Recipient needs account</td>
                            <td>❌ Sometimes</td>
                            <td>✅ Never</td>
                        </tr>
                        <tr>
                            <td>Auto-expires</td>
                            <td>❌ Lives forever in inbox</td>
                            <td>✅ 7-90 days (privacy)</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section class="blog-section">
            <h2>Perfect Use Cases</h2>

            <div class="blog-card">
                <h3>Sharing Reports with Clients</h3>
                <p>
                    Send a weekly metrics report without forcing clients to download files or log into platforms.
                </p>
            </div>

            <div class="blog-card">
                <h3>Data Exports for Colleagues</h3>
                <p>
                    Export from your CRM, database, or analytics tool and share instantly. No file management.
                </p>
            </div>

            <div class="blog-card">
                <h3>Quick Data Handoffs</h3>
                <p>
                    Contractor needs a list? Teammate needs reference data? Share a link instead of attaching files.
                </p>
            </div>

            <div class="blog-card">
                <h3>Temporary Sharing</h3>
                <p>
                    Links auto-expire in 7 days (free) or 90 days (Pro). Perfect for data that shouldn't live forever.
                </p>
            </div>
        </section>

        <section class="blog-cta">
            <h2>Try It Now</h2>
            <p>
                Turn any CSV into a shareable link in 5 seconds. Free forever, no signup.
            </p>
            <a href="/" class="blog-cta-button">
                Share a CSV →
            </a>
        </section>

        <section class="blog-section">
            <h2>FAQ</h2>

            <div class="blog-card">
                <h3>What CSV formats are supported?</h3>
                <p>
                    Any standard CSV (comma-separated) or TSV (tab-separated) works. Just copy the content and paste.
                </p>
            </div>

            <div class="blog-card">
                <h3>Is there a file size limit?</h3>
                <p>
                    Free tier: 500 rows, 50 columns. Pro tier: 5,000 rows, 100 columns. Most CSV exports fit easily.
                </p>
            </div>

            <div class="blog-card">
                <h3>Can recipients download the data?</h3>
                <p>
                    Yes! Every shared table has a "Download CSV" button so recipients can export if needed.
                </p>
            </div>

            <div class="blog-card">
                <h3>Is my data secure?</h3>
                <p>
                    Links use unguessable random IDs. Data auto-deletes after expiry. For sensitive data, Pro tier offers password protection.
                </p>
            </div>
        </section>
    </article>

    <footer class="blog-footer">
        <p class="blog-footer-links">
            <a href="/">Home</a> •
            <a href="/pricing">Pricing</a> •
            <a href="/blog">Blog</a> •
            <a href="/terms">Terms</a> •
            <a href="/privacy">Privacy</a>
        </p>
        <p class="blog-footer-text">© 2025 Table Share</p>
    </footer>
    
    <script src="/shared-theme.js"></script>
    <script>
        function initThemeToggle() {
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle && window.SharedTheme) {
                themeToggle.addEventListener('click', () => {
                    const current = document.documentElement.getAttribute('data-theme');
                    window.SharedTheme.applyTheme(current === 'dark' ? 'light' : 'dark');
                });
                return true;
            }
            return false;
        }
        
        if (!initThemeToggle()) {
            document.addEventListener('DOMContentLoaded', () => {
                if (!initThemeToggle()) {
                    setTimeout(initThemeToggle, 100);
                }
            });
        }
    </script>
</body>
</html>
`;

const BLOG_PASTEBIN_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pastebin for Tables: Share Data Like Code | Table Share</title>
    <meta name="description" content="A pastebin designed for tabular data. Paste CSV, spreadsheet, or SQL results - get a clean shareable table link. No signup, auto-expires.">
    <meta name="keywords" content="pastebin for tables, pastebin spreadsheet, share table data, csv pastebin, data sharing tool">

    <meta property="og:title" content="Pastebin for Tables - Share Data Like Developers Share Code">
    <meta property="og:description" content="Finally, a pastebin that understands tables. Paste data, get formatted table link.">
    <meta property="og:url" content="https://table-share.org/blog/pastebin-for-tables">
    <meta property="og:type" content="article">

    <link rel="canonical" href="https://table-share.org/blog/pastebin-for-tables">
    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="/blog.css">
    <link rel="icon" href="/logo.png" type="image/png">

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Pastebin for Tables: Share Data Like Developers Share Code",
      "datePublished": "2026-01-03",
      "author": {"@type": "Organization", "name": "Table Share"},
      "publisher": {"@type": "Organization", "name": "Table Share", "logo": {"@type": "ImageObject", "url": "https://table-share.org/logo.png"}}
    }
    </script>
</head>
<body>
    <header class="blog-header">
        <a href="/"><img src="/logo.png" alt="Table Share Logo" class="blog-header-logo"><strong>Table Share</strong></a>
        <div><button id="themeToggle" class="blog-theme-toggle" aria-label="Toggle dark mode">🌙</button></div>
    </header>

    <nav class="blog-nav"><a href="/blog" class="blog-back-link">← Back to Blog</a></nav>

    <article class="blog-container blog-content">
        <h1 class="blog-title">Pastebin for Tables: Share Data Like Developers Share Code</h1>
        <p class="blog-meta"><time datetime="2026-01-03">January 3, 2026</time> • 4 min read</p>

        <section class="blog-section">
            <h2>Developers Have Pastebin. Where's the Equivalent for Data?</h2>
            <p>Developers solved code sharing years ago. Need to share a snippet? Paste it on Pastebin, Gist, or Hastebin. Get a link. Done.</p>
            <p>But what about tabular data? SQL query results, CSV exports, spreadsheet ranges - they all get mangled when you paste them into chat. The formatting disappears. Columns misalign. It becomes unreadable.</p>
            <p><strong>Table Share is pastebin for tables.</strong> Same workflow, but designed for structured data.</p>
        </section>

        <section class="blog-card-highlight">
            <h2>How It Works</h2>
            <div class="blog-card">
                <h3>1. Copy Your Data</h3>
                <p>Select data from any source: Excel, Google Sheets, database output, CSV file, terminal output.</p>
            </div>
            <div class="blog-card">
                <h3>2. Paste on Table Share</h3>
                <p>Go to <a href="https://table-share.org">table-share.org</a> and paste. That's it.</p>
            </div>
            <div class="blog-card">
                <h3>3. Share the Link</h3>
                <p>Link is auto-copied to clipboard. Recipients see a clean, formatted HTML table.</p>
            </div>
        </section>

        <section class="blog-section">
            <h2>Pastebin vs Table Share</h2>
            <div class="blog-table-wrapper">
                <table class="blog-table">
                    <thead><tr><th>Feature</th><th>Pastebin</th><th>Table Share</th></tr></thead>
                    <tbody>
                        <tr><td>Best for</td><td>Code snippets</td><td>Tabular data</td></tr>
                        <tr><td>Formatting</td><td>Syntax highlighting</td><td>HTML table rendering</td></tr>
                        <tr><td>CSV support</td><td>Raw text only</td><td>Auto-parsed into columns</td></tr>
                        <tr><td>Mobile view</td><td>Monospace text</td><td>Responsive table</td></tr>
                        <tr><td>Export</td><td>Copy text</td><td>Download as CSV</td></tr>
                        <tr><td>Signup required</td><td>No</td><td>No</td></tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section class="blog-section">
            <h2>Perfect For</h2>
            <ul>
                <li><strong>Database developers:</strong> Share query results without screenshots</li>
                <li><strong>Data analysts:</strong> Quick previews of pandas/R dataframes</li>
                <li><strong>DevOps:</strong> Share log tables, metrics, server lists</li>
                <li><strong>Anyone:</strong> Who needs to share structured data fast</li>
            </ul>
        </section>

        <section class="blog-cta">
            <h2>Try the Pastebin for Tables</h2>
            <p>No signup. No download. Just paste and share.</p>
            <a href="/" class="blog-cta-button">Paste Your Data →</a>
        </section>
    </article>

    <footer class="blog-footer">
        <p class="blog-footer-links"><a href="/">Home</a> • <a href="/pricing">Pricing</a> • <a href="/blog">Blog</a> • <a href="/terms">Terms</a> • <a href="/privacy">Privacy</a></p>
        <p class="blog-footer-text">© 2026 Table Share</p>
    </footer>

    <script src="/shared-theme.js"></script>
    <script>
        function initThemeToggle() {
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle && window.SharedTheme) {
                themeToggle.addEventListener('click', () => {
                    const current = document.documentElement.getAttribute('data-theme');
                    window.SharedTheme.applyTheme(current === 'dark' ? 'light' : 'dark');
                });
                return true;
            }
            return false;
        }
        if (!initThemeToggle()) {
            document.addEventListener('DOMContentLoaded', () => {
                if (!initThemeToggle()) setTimeout(initThemeToggle, 100);
            });
        }
    </script>
</body>
</html>`;

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

      if (pathname === '/blog') {
        return new Response(BLOG_INDEX_HTML, {
          headers: { 'Content-Type': 'text/html', ...corsHeaders }
        });
      }

      if (pathname === '/blog/share-excel-without-login') {
        return new Response(BLOG_EXCEL_HTML, {
          headers: { 'Content-Type': 'text/html', ...corsHeaders }
        });
      }

      if (pathname === '/blog/sql-results-sharing') {
        return new Response(BLOG_SQL_HTML, {
          headers: { 'Content-Type': 'text/html', ...corsHeaders }
        });
      }

      if (pathname === '/blog/google-sheets-alternatives') {
        return new Response(BLOG_SHEETS_HTML, {
          headers: { 'Content-Type': 'text/html', ...corsHeaders }
        });
      }

      if (pathname === '/blog/share-csv-online') {
        return new Response(BLOG_CSV_HTML, {
          headers: { 'Content-Type': 'text/html', ...corsHeaders }
        });
      }

      if (pathname === '/blog/pastebin-for-tables') {
        return new Response(BLOG_PASTEBIN_HTML, {
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

      if (pathname === '/robots.txt') {
        return new Response(ROBOTS_TXT, {
          headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'public, max-age=86400',
            ...corsHeaders
          }
        });
      }

      // Analytics Dashboard (admin only)
      if (pathname === '/analytics' && request.method === 'GET') {
        const adminKey = url.searchParams.get('key');
        const ADMIN_KEY = 'tableshare-admin-2025-markrhenzon';

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

      if (pathname === '/api/stats' && request.method === 'GET') {
        try {
          const { getTotalMetric } = await import('./utils/analytics.js');
          const total = await getTotalMetric(env.TABLES, 'tables_created', 30);
          return new Response(JSON.stringify({ total: total || 0 }), {
            headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300', ...corsHeaders }
          });
        } catch (error) {
          return new Response(JSON.stringify({ total: 0 }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
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
