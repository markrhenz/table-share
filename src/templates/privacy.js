export const PRIVACY_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - Table Share</title>
    <meta name="description" content="Table Share Privacy Policy. Minimal data collection, no tracking, automatic deletion after 7 days (free) or up to 90 days (Pro).">
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
