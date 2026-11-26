export const TERMS_HTML = `<!DOCTYPE html>
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
    <p class="updated">Last updated: May 27, 2026</p>
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
    <p>We store your pasted data for 7 days on the free tier, or up to 90 days on the Pro tier. Data is automatically deleted after expiration. See <a href="/privacy">Privacy Policy</a>.</p>
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
