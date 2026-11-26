export const PRICING_HTML = `<!DOCTYPE html>
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
                <li>✓ <strong><a href="/docs" style="color: var(--accent-color);">API access</a></strong> - automate workflows</li>
            </ul>
            <a href="https://ko-fi.com/s/0a371a6316" class="cta-button">Get Pro - $5</a>
            <p style="text-align: center; margin-top: 15px; font-size: 13px; color: var(--muted-color);">Instant API key via email. No account needed.</p>
        <p style="text-align: center; margin-top: 8px; font-size: 12px; color: var(--muted-color);">Already paid but lost your key? <a href="/recover" style="color: var(--accent-color);">Recover it here</a>.</p>
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
