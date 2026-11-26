export const RECOVER_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recover Your Pro API Key - Table Share</title>
    <meta name="description" content="Lost your Table Share Pro API key? Recover it with your Ko-fi transaction ID and email address.">
    <meta name="robots" content="noindex, follow">
    <link rel="canonical" href="https://table-share.org/recover">
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
            --secondary-bg: #1a1a1a;
            --border-color: #fff;
            --accent-color: #4da6ff;
            --muted-color: #aaa;
        }
        [data-theme="dark"] .logo { filter: invert(1); }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
            background: var(--bg-color); color: var(--text-color); line-height: 1.6; padding: 20px;
        }
        .container { max-width: 600px; margin: 0 auto; padding-top: 40px; }
        header { text-align: center; margin-bottom: 32px; }
        h1 { font-size: 32px; font-weight: 700; margin: 16px 0 8px; }
        .tagline { color: var(--muted-color); font-size: 15px; margin-bottom: 24px; }
        a { color: var(--accent-color); text-decoration: none; }
        a:hover { text-decoration: underline; }
        label { display: block; font-size: 14px; font-weight: 600; margin: 18px 0 6px; }
        input[type="text"], input[type="email"] {
            width: 100%; padding: 12px 14px; font-size: 15px;
            border: 2px solid var(--border-color); background: var(--bg-color); color: var(--text-color);
            font-family: 'Courier New', monospace;
        }
        .help { font-size: 12px; color: var(--muted-color); margin-top: 4px; }
        button {
            width: 100%; padding: 14px; margin-top: 24px;
            background: var(--accent-color); color: #fff; border: none; cursor: pointer;
            font-size: 16px; font-weight: 600;
        }
        button:hover { background: #0052A3; }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
        .note {
            background: var(--secondary-bg); border-left: 4px solid var(--accent-color);
            padding: 12px 16px; margin: 24px 0; font-size: 14px;
        }
        #result { margin-top: 24px; padding: 14px 18px; border: 2px solid var(--border-color); display: none; }
        #result.ok { background: var(--secondary-bg); }
        #result.err { border-color: #d00; color: #d00; }
        footer {
            margin-top: 80px; padding-top: 32px;
            border-top: 2px solid var(--border-color);
            text-align: center; color: var(--muted-color); font-size: 13px;
        }
        .theme-toggle {
            position: absolute; top: 20px; right: 20px; width: 40px; height: 40px;
            border-radius: 50%; border: 2px solid var(--border-color);
            background: var(--bg-color); cursor: pointer;
        }
        .theme-toggle::after {
            content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 20px; height: 20px; border-radius: 50%; background: var(--text-color);
        }
    </style>
</head>
<body>
    <button id="themeToggle" class="theme-toggle" aria-label="Toggle dark mode"></button>
    <div class="container">
        <header>
            <a href="/" style="text-decoration: none; color: var(--text-color); display: inline-flex; align-items: center; gap: 12px;">
                <img src="/logo.png" width="40" height="40" alt="Table Share" class="logo">
                <h1>Recover Pro Key</h1>
            </a>
            <p class="tagline">Lost your API key? Enter your Ko-fi details below to re-send it to your registered email.</p>
        </header>

        <form id="recoverForm" autocomplete="off">
            <label for="transactionId">Ko-fi transaction ID</label>
            <input type="text" id="transactionId" name="transactionId" required minlength="4" maxlength="128" placeholder="From your Ko-fi receipt email">
            <p class="help">Found in the subject line or body of your Ko-fi purchase confirmation email.</p>

            <label for="email">Email used at checkout</label>
            <input type="email" id="email" name="email" required maxlength="320" placeholder="you@example.com">
            <p class="help">Must match the email on your Ko-fi purchase exactly.</p>

            <button type="submit" id="submitBtn">Re-send my API key</button>
        </form>

        <div id="result" role="status" aria-live="polite"></div>

        <div class="note">
            <strong>Privacy note:</strong> we only send the key to the email address on record from your original purchase, never to the address you type here — even if you typed a different one. This prevents account takeover. If you no longer have access to that email, contact <a href="mailto:markrhenz@table-share.org">markrhenz@table-share.org</a> from any address and include your Ko-fi receipt.
        </div>

        <footer>
            <p>&copy; 2026 Table Share | <a href="/">Home</a> | <a href="/pricing">Pricing</a> | <a href="/docs">API Docs</a> | <a href="/terms">Terms</a> | <a href="/privacy">Privacy</a></p>
        </footer>
    </div>
    <script>
        // Theme
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

        // Form submit
        const form = document.getElementById('recoverForm');
        const result = document.getElementById('result');
        const btn = document.getElementById('submitBtn');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            btn.disabled = true;
            btn.textContent = 'Sending...';
            result.style.display = 'none';

            const transactionId = document.getElementById('transactionId').value.trim();
            const email = document.getElementById('email').value.trim();

            try {
                const r = await fetch('/api/recover', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ transactionId, email })
                });
                const data = await r.json().catch(() => ({}));

                if (r.ok) {
                    result.className = 'ok';
                    result.textContent = data.message || 'Request received. Check your email in a few minutes.';
                } else if (r.status === 429) {
                    result.className = 'err';
                    result.textContent = data.error || 'Too many attempts. Try again in an hour.';
                } else {
                    result.className = 'err';
                    result.textContent = data.error || 'Something went wrong. Please try again.';
                }
                result.style.display = 'block';
            } catch (err) {
                result.className = 'err';
                result.textContent = 'Network error. Please try again.';
                result.style.display = 'block';
            } finally {
                btn.disabled = false;
                btn.textContent = 'Re-send my API key';
            }
        });
    </script>
</body>
</html>
`;
