export const BLOG_EXCEL_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Share Excel Tables Without Login (What Survives the Paste) | Table Share</title>
    <meta name="description" content="Share Excel data online without login or attachments. Learn exactly what data, formatting, and formulas survive the copy-paste, and what to expect.">
    <meta name="keywords" content="share excel without login, share excel online, excel to web table, excel sharing tool, no signup excel share">

    <meta property="og:title" content="Share Excel Tables Without Login - What Survives the Paste">
    <meta property="og:description" content="Honest guide to copy-pasting Excel data online: what survives, what's lost, and when to send the file instead.">
    <meta property="og:image" content="https://table-share.org/logo.png">
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
      "headline": "Share Excel Tables Without Login (What Survives the Paste)",
      "description": "Share Excel spreadsheet data online without login or email attachments. Honest guide to what data, formatting, and formulas survive the copy-paste step.",
      "image": "https://table-share.org/logo.png",
      "datePublished": "2025-11-21T00:00:00+00:00",
      "dateModified": "2026-05-27T00:00:00+00:00",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://table-share.org/blog/share-excel-without-login"
      },
      "author": {
        "@type": "Organization",
        "name": "Table Share",
        "url": "https://table-share.org"
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
            Share Excel Tables Without Login (What Survives the Paste)
        </h1>

        <p class="blog-meta">
            <time datetime="2025-11-21">November 21, 2025</time> · Updated <time datetime="2026-05-27">May 27, 2026</time> · 5 min read
        </p>

        <section class="blog-section">
            <h2>The honest version</h2>
            <p>
                You can share an Excel range as a no-signup web link in about five seconds: select cells, Ctrl+C, paste into <a href="/">table-share.org</a>, copy the link, send. The friction lives in expectations — not every Excel feature survives the round-trip.
            </p>
            <p>
                This post is the explicit list of what comes through cleanly, what gets dropped, and which Excel-specific behaviors to know about before you send the link. If the goal is "the recipient sees the same values I see," this works. If the goal is "the recipient sees the same workbook," send the file.
            </p>
        </section>

        <section class="blog-section">
            <h2>What survives</h2>
            <ul>
                <li><strong>Cell values.</strong> Numbers, strings, dates as they currently display in the cell.</li>
                <li><strong>Row and column structure.</strong> A 12×4 selection becomes a 12-row, 4-column HTML table.</li>
                <li><strong>Header row.</strong> The first row is treated as headers by default. There's a "no headers" toggle if your first row is actually data.</li>
                <li><strong>Calculated formula results.</strong> If <code>=A1+B1</code> displays <code>42</code>, the recipient sees <code>42</code>. The formula itself does not travel.</li>
                <li><strong>Currency, percentage, date display formats.</strong> What you see is what gets sent — Excel renders these to text on copy.</li>
                <li><strong>Quoted strings with commas.</strong> Excel quotes them on copy; the parser un-quotes correctly.</li>
            </ul>
        </section>

        <section class="blog-section">
            <h2>What doesn't survive</h2>
            <ul>
                <li><strong>Formulas as formulas.</strong> Only their evaluated results. If you need the recipient to re-run calculations, send the file.</li>
                <li><strong>Cell colors, fonts, conditional formatting.</strong> All visual styling is dropped. Tables render in the recipient's chosen theme (light or dark).</li>
                <li><strong>Merged cells.</strong> Excel "unmerges" on copy — the value appears in the top-left cell of the original merge and the rest become empty.</li>
                <li><strong>Hidden rows or columns.</strong> If a column is hidden in the Excel view, it's not included in the copy buffer. Unhide before copying if needed.</li>
                <li><strong>Images, charts, shapes.</strong> Not data, not transferred. The link is data-only.</li>
                <li><strong>Hyperlinks.</strong> The display text comes through; the URL behind it does not.</li>
                <li><strong>Comments and notes.</strong> Excel-side metadata is stripped on copy.</li>
                <li><strong>Multiple sheets.</strong> One paste = one table. To share multiple sheets, create multiple links.</li>
            </ul>
        </section>

        <section class="blog-section">
            <h2>Three Excel-specific things worth knowing</h2>

            <h3>1. Excel copies tab-separated, not comma-separated</h3>
            <p>
                Excel's clipboard format uses tabs between cells, not commas. The parser autodetects this — no setting to change. The reason this matters: if you ever paste an Excel range into a plain text editor, what you see is tab-separated, not CSV.
            </p>

            <h3>2. The first-row-is-headers default</h3>
            <p>
                The parser assumes row one contains column names and renders it as a styled header row. Three cases where you'll want to flip the "no headers" toggle in the options panel:
            </p>
            <ul>
                <li>Your selection starts mid-table and the first row is data.</li>
                <li>The source table genuinely has no headers (a raw list).</li>
                <li>The first row contains values that look generic (e.g., "1, 2, 3") and you want them treated as data.</li>
            </ul>

            <h3>3. Currency and date formatting is locale-dependent</h3>
            <p>
                Excel renders <code>$1,234.56</code> in US locale and <code>1.234,56 €</code> in German locale — and copies the rendered form. The recipient sees whatever was rendered on your machine. This is occasionally surprising for international teams; if precision matters, copy the raw numbers, not the formatted display.
            </p>
        </section>

        <section class="blog-section">
            <h2>The five-second workflow</h2>
            <ol>
                <li>In Excel, select the range you want to share.</li>
                <li>Ctrl+C (or Cmd+C).</li>
                <li>Open <a href="/">table-share.org</a>. Click the paste box. Ctrl+V.</li>
                <li>The link is auto-copied to your clipboard.</li>
                <li>Paste the link wherever you needed to send the table.</li>
            </ol>
            <p>
                If the table is wider than expected, the recipient can scroll horizontally — sticky headers stay visible on mobile. There's also a CSV download button on every shared table so the recipient can pull it back into a spreadsheet if they want.
            </p>
        </section>

        <section class="blog-section">
            <h2>When to send the file instead</h2>
            <p>Three cases where a link is the wrong format:</p>
            <ul>
                <li><strong>The recipient needs to edit.</strong> Tables are read-only by design. If editing matters, share a Google Sheet or send the <code>.xlsx</code>.</li>
                <li><strong>The recipient needs formulas to re-run on new inputs.</strong> The link contains values, not logic. For interactive modeling, send the workbook.</li>
                <li><strong>The table is larger than tier limits.</strong> Free tier maxes at 500 rows / 50 columns. <a href="/pricing">Pro</a> at 5,000 / 100. Anything bigger is genuinely a file.</li>
            </ul>
        </section>

        <section class="blog-section">
            <h2>Privacy notes</h2>
            <ul>
                <li><strong>No accounts.</strong> Creator and recipient both stay anonymous.</li>
                <li><strong>Unguessable URLs.</strong> 8-character base62 IDs (over 200 trillion combinations). Brute-force is not a viable attack.</li>
                <li><strong>Auto-expiry.</strong> Free links expire after 7 days. Pro links can be set to expire anywhere from 1 hour to 90 days.</li>
                <li><strong>Password protection (Pro).</strong> For sensitive data, the <a href="/pricing">$5 one-time Pro upgrade</a> adds password gating on shared links.</li>
                <li><strong>No analytics on free tier.</strong> The creator doesn't see who viewed the link.</li>
            </ul>
        </section>

        <section class="blog-cta">
            <h2>Try it</h2>
            <p>
                Open any spreadsheet you have, copy a range, and <a href="/">paste it on the homepage</a>. You'll see immediately what survives and what doesn't on your own data — which is more useful than any documentation.
            </p>
            <a href="/" class="blog-cta-button">
                Share an Excel Range →
            </a>
        </section>

        <section class="blog-section">
            <h2>Related</h2>
            <ul style="list-style: none; padding: 0;">
                <li style="margin-bottom: 12px;"><a href="/blog/share-csv-online" style="color: var(--link-color, #0066cc);">How to Share CSV Files Online (No Email, No Signup)</a></li>
                <li style="margin-bottom: 12px;"><a href="/blog/google-sheets-alternatives" style="color: var(--link-color, #0066cc);">10 Google Sheets Alternatives for Quick Data Sharing</a></li>
                <li style="margin-bottom: 12px;"><a href="/docs" style="color: var(--link-color, #0066cc);">API Documentation</a></li>
            </ul>
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
                if (!initThemeToggle()) {
                    setTimeout(initThemeToggle, 100);
                }
            });
        }
    </script>
</body>
</html>
`;
