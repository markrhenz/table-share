export const INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Table Share - Share Tables Instantly | No Signup, Free CSV & Spreadsheet Sharing</title>
     <!-- SEO Meta Tags -->
    <meta name="description" content="Share tables online in 5 seconds. Paste CSV, Excel, or spreadsheet data - get instant shareable link. No signup required. Free up to 500 rows. The fastest pastebin for tables.">
    <meta name="keywords" content="share table online, share csv online, pastebin for tables, spreadsheet sharing no login, share excel without account, csv to link, ephemeral table sharing">
    <meta name="author" content="Table Share">
    <link rel="canonical" href="https://table-share.org/">
    <!-- Open Graph Tags for Social Sharing -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://table-share.org/">
    <meta property="og:title" content="Table Share - Share Tables Instantly | No Signup Required">
    <meta property="og:description" content="Paste CSV or spreadsheet data, get shareable link in 5 seconds. No signup for you or recipients. Free pastebin for tables.">
    <meta property="og:image" content="https://table-share.org/logo.png">
    <meta property="og:site_name" content="Table Share">
    <!-- Twitter Card Tags -->
    <meta name="twitter:card" content="summary">
    <meta name="twitter:url" content="https://table-share.org/">
    <meta name="twitter:title" content="Table Share - Share Tables Instantly | No Signup Required">
    <meta name="twitter:description" content="Paste CSV or spreadsheet data, get shareable link in 5 seconds. No signup for you or recipients. Free pastebin for tables.">
    <meta name="twitter:image" content="https://table-share.org/logo.png">
    <link rel="icon" type="image/png" href="/logo.png">
    <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
    <link rel="preconnect" href="https://scripts.simpleanalyticscdn.com" crossorigin>
    
    <!-- Schema.org structured data for Google rich snippets -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Table Share",
      "url": "https://table-share.org",
      "description": "Share tables online in 5 seconds. Paste CSV, Excel, or spreadsheet data and get an instant shareable link. No signup required.",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
    </script>
    
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How is Table Share faster than Google Sheets for sharing tables?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Table Share takes 3 seconds instead of 3 minutes. No file creation, no permission dialogs, no waiting. Paste your data and get an instant shareable link."
          }
        },
        {
          "@type": "Question",
          "name": "Do recipients need an account to view shared tables?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Recipients click the link and see the data immediately. No 'Request Access' emails, no sign-up required."
          }
        },
        {
          "@type": "Question",
          "name": "How long do shared table links last?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Free links auto-expire after 7 days for privacy. Pro users get 90-day expiry. No orphaned files cluttering your Drive."
          }
        },
        {
          "@type": "Question",
          "name": "Can I password protect a shared table?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Pro users can add password protection for sensitive data. Available with the one-time $5 Pro upgrade."
          }
        },
        {
          "@type": "Question",
          "name": "Does Table Share work on mobile devices?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Tables are mobile-responsive with sticky headers, horizontal scrolling, and clean formatting that works on any phone or tablet."
          }
        },
        {
          "@type": "Question",
          "name": "Can recipients download the shared table?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Every shared table includes a CSV download button so recipients can export the data if needed."
          }
        }
      ]
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
        header { text-align: center; margin-bottom: 24px; padding-top: 20px; }
        h1 { font-size: 48px; font-weight: 700; margin-bottom: 20px; }
        .tagline { font-size: 24px; color: var(--tagline-color); margin-bottom: 40px; }
        .cta { font-size: 18px; color: var(--muted-color); margin-bottom: 16px; }
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
/* URL Pro Banner */
.url-pro-banner {
    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
    border: 2px solid #c89b3c;
    padding: 16px 20px;
    margin-bottom: 16px;
    display: none;
    text-align: center;
    font-size: 14px;
    color: #c89b3c;
}
[data-theme="dark"] .url-pro-banner {
    background: linear-gradient(135deg, #1a1a00 0%, #2a2a10 100%);
}
.url-pro-banner a {
    color: #c89b3c;
    text-decoration: underline;
    font-weight: 700;
}

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
            <p class="tagline" style="font-size: 32px; font-weight: 700; margin-bottom: 16px;">Share Tables in 3 Seconds</p>
            <p class="cta" style="font-size: 20px;">No signup. No permissions. Just paste and share.</p>
            <p style="font-size: 14px; color: var(--muted-color); margin-top: 16px; display: none;" id="statsLine">
                <span id="tableCount" style="font-weight: 700;"></span> tables shared
            </p>
        </header>
        <main id="main">
            <!-- Honeypot field for bot detection (invisible to humans) -->
            <div style="position: absolute; left: -9999px; top: -9999px;" aria-hidden="true">
                <input type="text" id="honeypotField" name="website" tabindex="-1" autocomplete="off" value="">
            </div>
            <!-- Hidden inputs for JS compatibility -->
            <input type="hidden" id="apiKeyInput" value="">

            <!-- Paste Box - First Interactive Element -->
            <div id="pasteContainer">
                <textarea id="pasteBox" class="paste-box" placeholder="Paste your table data here (from Excel, Google Sheets, CSV, or anywhere)...

Example:
Name    Age    City
Alice   30     NYC
Bob     25     LA"></textarea>
                <div style="font-size: 13px; color: var(--muted-color); margin-top: 8px; margin-bottom: 12px;">
                    ⚡ Paste data from Excel, Sheets, or CSV. Link generated in under 3 seconds.
                </div>
            </div>

            <!-- URL Container (hidden by default) -->
            <div id="urlContainer" style="display: none;">
                <div class="url-pro-banner" id="urlProBanner">
                    🔒 URL fetching requires a Pro key. <a href="/pricing">Get Pro - $5</a>
                </div>
                <input
                    type="url"
                    id="urlInput"
                    class="paste-box"
                    placeholder="https://example.com/data.csv"
                    autocomplete="off"
                    spellcheck="false"
                >
                <div style="font-size: 13px; color: var(--muted-color); margin-top: 8px; margin-bottom: 12px;">
                    Direct link to a .csv file or any URL that returns CSV/TSV text data
                </div>
            </div>

             <button id="generateBtn" class="button">Generate Table</button>
             <div id="status" class="status" aria-live="polite" aria-atomic="true"></div>

            <!-- Collapsible Options Section -->
            <details id="optionsSection" style="margin-top: 16px; border: 2px solid var(--border-color);">
                <summary style="padding: 12px 16px; cursor: pointer; font-size: 14px; font-weight: 600; background: var(--secondary-bg); user-select: none;">
                    ⚙ Options (title, password, expiry)
                </summary>
                <div style="padding: 16px;">
                    <!-- Title -->
                    <div style="margin-bottom: 12px;">
                        <label for="titleInput" style="font-size: 13px; color: var(--muted-color); display: block; margin-bottom: 4px;">Title (optional)</label>
                        <input type="text" id="titleInput" placeholder="e.g., Q4 Sales Report" maxlength="100"
                            style="width: 100%; border: 2px solid var(--border-color); padding: 8px 10px; font-size: 14px; background: var(--bg-color); color: var(--text-color);">
                    </div>

                    <!-- No headers -->
                    <div style="margin-bottom: 12px;">
                        <label for="noHeadersCheck" style="display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--muted-color); cursor: pointer;">
                            <input type="checkbox" id="noHeadersCheck" style="width: 16px; height: 16px; cursor: pointer;">
                            No headers (treat first row as data)
                        </label>
                    </div>

                    <!-- Password protect -->
                    <div style="margin-bottom: 12px;">
                        <label for="passwordInputMain" style="font-size: 13px; color: var(--muted-color); display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                            🔒 Password protect
                            <span style="background: #c89b3c; color: #000; font-size: 10px; padding: 1px 5px; font-weight: 700;">PRO</span>
                        </label>
                        <input type="password" id="passwordInputMain" placeholder="Optional - recipients will need this password"
                            style="width: 100%; border: 2px solid var(--border-color); padding: 8px 10px; font-size: 14px; background: var(--bg-color); color: var(--text-color);">
                    </div>

                    <!-- Expiry -->
                    <div style="margin-bottom: 12px;">
                        <label for="expirySelect" style="font-size: 13px; color: var(--muted-color); display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                            ⏰ Link expiry
                            <span id="expiryProBadge" style="background: #c89b3c; color: #000; font-size: 10px; padding: 1px 5px; font-weight: 700;">PRO</span>
                        </label>
                        <select id="expirySelect"
                            style="width: 100%; border: 2px solid var(--border-color); padding: 8px 10px; font-size: 14px; background: var(--bg-color); color: var(--text-color);">
                            <option value="604800" selected>7 days (free)</option>
                            <option value="2592000" disabled id="opt30d">30 days (Pro)</option>
                            <option value="7776000" disabled id="opt90d">90 days (Pro)</option>
                        </select>
                    </div>

                    <!-- Remove branding -->
                    <div style="margin-bottom: 12px;">
                        <label for="noBranding" style="display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--muted-color); cursor: pointer;">
                            <input type="checkbox" id="noBranding" style="width: 16px; height: 16px; cursor: pointer;" disabled>
                            Remove "Created with Table Share" footer
                            <span style="background: #c89b3c; color: #000; font-size: 10px; padding: 1px 5px; font-weight: 700;">PRO</span>
                        </label>
                    </div>

                    <!-- URL Fetch mode -->
                    <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border-color);">
                        <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--muted-color); cursor: pointer;">
                            <input type="checkbox" id="urlModeToggle" style="width: 16px; height: 16px; cursor: pointer;" disabled>
                            🔗 Fetch from URL instead of paste
                            <span style="background: #c89b3c; color: #000; font-size: 10px; padding: 1px 5px; font-weight: 700;">PRO</span>
                        </label>
                    </div>

                    <!-- Pro key section -->
                    <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--border-color);">
                        <p style="font-size: 12px; color: var(--muted-color); margin-bottom: 6px;">
                            <a href="#" id="showProKey" style="color: var(--accent-color);">Have a Pro key? Click here</a> |
                            <a href="/pricing" style="color: var(--accent-color);">Get Pro - $5</a>
                        </p>
                        <div id="proKeySection" style="display: none; margin-top: 8px;">
                            <input type="password" id="apiKeyInputVisible" placeholder="Paste your Pro API key here"
                                style="width: 100%; border: 2px solid var(--border-color); padding: 8px 10px; font-size: 14px; background: var(--bg-color); color: var(--text-color);">
                            <div id="proStatusVisible" style="font-size: 12px; margin-top: 6px; font-weight: 600;"></div>
                        </div>
                    </div>
                </div>
            </details>
            <!-- History Section -->
            <div id="history-section" style="margin-top: 30px; display: none;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; font-size: 16px; font-weight: normal; cursor: pointer;" id="history-toggle">
                  ▼ Your Recent Tables (<span id="history-count">0</span>)
                </h3>
                <div style="display: flex; gap: 10px;">
                  <button id="export-history-btn" style="padding: 5px 10px; font-size: 12px; background: transparent; border: 1px solid var(--border-color); cursor: pointer;">
                    Export CSV
                  </button>
                  <button id="clear-history-btn" style="padding: 5px 10px; font-size: 12px; background: transparent; border: 1px solid var(--border-color); cursor: pointer; color: #d00;">
                    Clear History
                  </button>
                </div>
              </div>

              <div id="history-list" style="border: 1px solid var(--border-color); padding: 15px; max-height: 300px; overflow-y: auto;">
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
            <!-- Pro CTA Section -->
            <section style="margin: 80px 0; padding: 60px 40px; background: var(--secondary-bg); border: 2px solid var(--border-color); text-align: center;">
                <h2 style="font-size: 32px; margin-bottom: 16px;">Need More Power?</h2>
                <p style="font-size: 18px; color: var(--muted-color); margin-bottom: 24px;">Pro unlocks password protection, 90-day expiry, 5,000 rows, and removes branding.</p>
                <a href="/pricing" style="display: inline-block; background: var(--accent-color); color: #fff; padding: 16px 40px; font-size: 20px; font-weight: 600; text-decoration: none; border: none;">Get Pro - $5 One-Time</a>
                <p style="font-size: 14px; color: var(--muted-color); margin-top: 16px;">No subscription. Pay once, use forever.</p>
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
        const apiKeyInputVisible = document.getElementById('apiKeyInputVisible');
        const proStatusVisible = document.getElementById('proStatusVisible');
        const proKeySection = document.getElementById('proKeySection');
        const showProKeyLink = document.getElementById('showProKey');

        // ===== URL FETCH MODE VARIABLES =====
        const pasteContainer = document.getElementById('pasteContainer');
        const urlContainer = document.getElementById('urlContainer');
        const urlInput = document.getElementById('urlInput');
        const urlProBanner = document.getElementById('urlProBanner');
        const urlModeToggle = document.getElementById('urlModeToggle');
        let currentMode = 'paste';

        // Update Pro controls based on key status
        function updateProControls() {
            const key = localStorage.getItem('proApiKey') || '';
            const isPro = key.startsWith('ts_live_') && key.length >= 28;

            // Enable/disable expiry options
            const opt30d = document.getElementById('opt30d');
            const opt90d = document.getElementById('opt90d');
            const expiryProBadge = document.getElementById('expiryProBadge');
            
            if (opt30d) opt30d.disabled = !isPro;
            if (opt90d) opt90d.disabled = !isPro;
            if (expiryProBadge) expiryProBadge.style.display = isPro ? 'none' : 'inline-block';

            // Enable/disable remove branding
            const noBranding = document.getElementById('noBranding');
            if (noBranding) noBranding.disabled = !isPro;

            // Enable/disable URL mode toggle
            if (urlModeToggle) urlModeToggle.disabled = !isPro;

            // Update URL Pro banner visibility
            if (urlProBanner) urlProBanner.style.display = (currentMode === 'url' && !isPro) ? 'block' : 'none';
        }

        // Toggle Pro key section
        showProKeyLink.addEventListener('click', (e) => {
            e.preventDefault();
            proKeySection.style.display = proKeySection.style.display === 'none' ? 'block' : 'none';
            showProKeyLink.textContent = proKeySection.style.display === 'none' ? 'Have a Pro key? Click here' : 'Hide Pro key input';
        });

        // Load saved key on page load
        const savedKey = localStorage.getItem('proApiKey');
        if (savedKey) {
            apiKeyInput.value = savedKey;
            apiKeyInputVisible.value = savedKey;
            proStatusVisible.textContent = '✓ Pro Mode Active';
            proStatusVisible.style.color = '#00cc66';
            proKeySection.style.display = 'block';
            showProKeyLink.textContent = 'Hide Pro key input';
        }
        // Initialize Pro controls state
        updateProControls();

        // Validate visible key input and sync with hidden
        apiKeyInputVisible.addEventListener('input', () => {
            const key = apiKeyInputVisible.value.trim();
            apiKeyInput.value = key; // Sync with hidden input

            if (!key) {
                proStatusVisible.textContent = '';
                localStorage.removeItem('proApiKey');
                updateProControls();
                return;
            }

            if (key.startsWith('ts_live_') && key.length >= 28) {
                proStatusVisible.textContent = '✓ Pro Mode Active';
                proStatusVisible.style.color = '#00cc66';
                localStorage.setItem('proApiKey', key);
                updateProControls();
            } else {
                proStatusVisible.textContent = '✗ Invalid key format';
                proStatusVisible.style.color = '#ff4444';
                localStorage.removeItem('proApiKey');
                updateProControls();
            }
        });

        // Keep hidden input handler for compatibility
        apiKeyInput.addEventListener('input', () => {
            const key = apiKeyInput.value.trim();
            if (key.startsWith('ts_live_') && key.length >= 28) {
                localStorage.setItem('proApiKey', key);
            }
        });

        const pasteBox = document.getElementById('pasteBox');
        const generateBtn = document.getElementById('generateBtn');
        const status = document.getElementById('status');
        pasteBox.addEventListener('paste', () => {
            setTimeout(() => {
                if (currentMode === 'paste' && pasteBox.value.trim()) {
                    generateBtn.style.display = 'block';
                    generateBtn.disabled = false;
                    status.textContent = '';
                }
            }, 100);
        });
        pasteBox.addEventListener('input', () => {
            if (currentMode === 'paste') {
                if (pasteBox.value.trim()) {
                    generateBtn.style.display = 'block';
                    generateBtn.disabled = false;
                    status.textContent = '';
                } else {
                    generateBtn.style.display = 'none';
                }
            }
        });
        document.getElementById('generateBtn').addEventListener('click', async function() {
            const btn = this;
            const status = document.getElementById('status');
            btn.disabled = true;
            btn.textContent = currentMode === 'url' ? 'Fetching...' : 'Generating...';

            try {
                const apiKey = localStorage.getItem('proApiKey') || '';
                const titleVal = document.getElementById('titleInput')?.value?.trim() || '';
                const passwordVal = document.getElementById('passwordInputMain')?.value?.trim() || '';

                if (currentMode === 'url') {
                    // === URL FETCH MODE ===
                    const urlVal = document.getElementById('urlInput').value.trim();
                    if (!urlVal) {
                        status.innerHTML = '<span style="color: #d00;">Please enter a URL</span>';
                        btn.disabled = false;
                        btn.textContent = 'Fetch & Create Table';
                        return;
                    }

                    // Quick client-side URL validation
                    try {
                        const testUrl = new URL(urlVal);
                        if (!['http:', 'https:'].includes(testUrl.protocol)) {
                            throw new Error('bad protocol');
                        }
                    } catch (e) {
                        status.innerHTML = '<span style="color: #d00;">Please enter a valid HTTP/HTTPS URL</span>';
                        btn.disabled = false;
                        btn.textContent = 'Fetch & Create Table';
                        return;
                    }

                    if (!apiKey) {
                        status.innerHTML = '<span style="color: #d00;">URL fetching requires a Pro API key. <a href="/pricing" style="color: var(--accent-color);">Get Pro →</a></span>';
                        btn.disabled = false;
                        btn.textContent = 'Fetch & Create Table';
                        return;
                    }

                    status.innerHTML = '⏳ Fetching CSV from URL...';

                    const resp = await fetch('/api/fetch-url', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                            url: urlVal,
                            apiKey: apiKey,
                            title: titleVal,
                            password: passwordVal || undefined,
                            expiry: document.getElementById('expirySelect')?.value || undefined,
                            noBranding: document.getElementById('noBranding')?.checked || false,
                            noHeaders: document.getElementById('noHeadersCheck')?.checked || false
                        })
                    });

                    const result = await resp.json();

                    if (!resp.ok) {
                        status.innerHTML = '<span style="color: #d00;">' + (result.error || 'Fetch failed') + '</span>';
                        if (result.upgradeUrl) {
                            status.innerHTML += ' <a href="' + result.upgradeUrl + '" style="color: var(--accent-color);">Get Pro →</a>';
                        }
                        btn.disabled = false;
                        btn.textContent = 'Fetch & Create Table';
                        return;
                    }

                    // Save to history
                    const id = result.url.split('/').pop();
                    addToHistory(id, result.url, urlVal.substring(0, 50));

                    // Attempt clipboard write, then redirect with brief confirmation
                    let copied = false;
                    try {
                        await navigator.clipboard.writeText(result.url);
                        copied = true;
                    } catch (clipErr) {
                        // Clipboard failed silently - user can copy from address bar
                    }

                    status.innerHTML = copied
                        ? '✅ Link copied! Opening table...'
                        : '✅ Table created! Opening...';

                    // Brief delay so user sees confirmation before redirect
                    setTimeout(() => {
                        window.location.href = result.url;
                    }, 800);
                    return;
                }

                // === PASTE MODE (existing logic below) ===
                const text = document.getElementById('pasteBox').value;
                if (!text.trim()) {
                    status.innerHTML = '<span style="color: #d00;">Please paste some data first</span>';
                    btn.disabled = false;
                    btn.textContent = 'Generate Table';
                    return;
                }

                const parsed = Papa.parse(text, {
                    quoteChar: '"',
                    escapeChar: '"',
                    header: false,
                    dynamicTyping: false,
                    skipEmptyLines: true
                });

                if (!parsed.data || parsed.data.length === 0) {
                    status.innerHTML = '<span style="color: #d00;">Could not parse data. Use tabs or commas to separate columns.</span>';
                    btn.disabled = false;
                    btn.textContent = 'Generate Table';
                    return;
                }

                const payload = {
                    data: parsed.data,
                    title: titleVal,
                    honeypot: document.getElementById('honeypotField')?.value || '',
                    apiKey: apiKey,
                    password: passwordVal || undefined,
                    expiry: document.getElementById('expirySelect')?.value || undefined,
                    noBranding: document.getElementById('noBranding')?.checked || false,
                    noHeaders: document.getElementById('noHeadersCheck')?.checked || false
                };

                const resp = await fetch('/api/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const result = await resp.json();

                if (!resp.ok) {
                    if (resp.status === 400 && result.error && result.error.includes('Too many rows')) {
                        document.getElementById('upgradeModal').style.display = 'flex';
                    }
                    status.innerHTML = '<span style="color: #d00;">' + (result.error || 'Failed') + '</span>';
                    btn.disabled = false;
                    btn.textContent = 'Generate Table';
                    return;
                }

                const id = result.url.split('/').pop();
                addToHistory(id, result.url, text.substring(0, 50));

                // Attempt clipboard write, then redirect with brief confirmation
                let copied = false;
                try {
                    await navigator.clipboard.writeText(result.url);
                    copied = true;
                } catch (clipErr) {
                    // Clipboard failed silently - user can copy from address bar
                }

                status.innerHTML = copied
                    ? '✅ Link copied! Opening table...'
                    : '✅ Table created! Opening...';

                // Brief delay so user sees confirmation before redirect
                setTimeout(() => {
                    window.location.href = result.url;
                }, 800);
                return;

            } catch (error) {
                status.innerHTML = '<span style="color: #d00;">Error: ' + error.message + '</span>';
                btn.disabled = false;
                btn.textContent = currentMode === 'url' ? 'Fetch & Create Table' : 'Generate Table';
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
            '<div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--border-color);">' +
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

        // URL mode toggle handler
        if (urlModeToggle) {
            urlModeToggle.addEventListener('change', function() {
                if (this.checked) {
                    urlContainer.style.display = 'block';
                    pasteContainer.style.display = 'none';
                    currentMode = 'url';
                    document.getElementById('generateBtn').textContent = 'Fetch & Create Table';
                    // Show banner if not Pro
                    const key = localStorage.getItem('proApiKey') || '';
                    const isPro = key.startsWith('ts_live_') && key.length >= 28;
                    urlProBanner.style.display = isPro ? 'none' : 'block';
                    // Show generate button if URL has content
                    if (urlInput.value.trim()) {
                        document.getElementById('generateBtn').style.display = 'block';
                    }
                } else {
                    urlContainer.style.display = 'none';
                    pasteContainer.style.display = 'block';
                    currentMode = 'paste';
                    document.getElementById('generateBtn').textContent = 'Generate Table';
                    // Show generate button if paste has content
                    if (document.getElementById('pasteBox').value.trim()) {
                        document.getElementById('generateBtn').style.display = 'block';
                    }
                }
            });
        }

        // Show generate button when URL is typed
        urlInput.addEventListener('input', function() {
            const btn = document.getElementById('generateBtn');
            btn.style.display = this.value.trim() ? 'block' : 'none';
        });

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

        // Fetch and display stats — hidden by default, revealed only on success with a real number.
        // 3s timeout; silent fail; threshold avoids the "3 tables shared" optics.
        (async function() {
            const MIN_THRESHOLD = 50;
            const TIMEOUT_MS = 3000;
            const statsLine = document.getElementById('statsLine');
            if (!statsLine) return;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
            try {
                const response = await fetch('/api/stats', { signal: controller.signal });
                clearTimeout(timeoutId);
                if (!response.ok) return;
                const data = await response.json();
                const total = parseInt(data && data.total, 10);
                if (isNaN(total) || total < MIN_THRESHOLD) return;
                document.getElementById('tableCount').textContent = total.toLocaleString();
                statsLine.style.display = 'block';
            } catch (e) {
                clearTimeout(timeoutId);
                /* silent — stays hidden */
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
