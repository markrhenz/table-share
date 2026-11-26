export const BLOG_CSV_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>How to Share CSV Files Online (No Email, No Signup) | Table Share</title>
    <meta name="description" content="Share CSV files instantly without email attachments or signups. Convert CSV to shareable link in 5 seconds. Free, fast, no account required.">
    <meta name="keywords" content="share csv online, send csv file, csv sharing tool, share csv without email, csv to link">

    <meta property="og:title" content="Share CSV Files Online - No Email, No Signup">
    <meta property="og:description" content="Convert any CSV file to a shareable link in 5 seconds. No email attachments, no accounts.">
    <meta property="og:image" content="https://table-share.org/logo.png">
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
      "description": "Share CSV files instantly without email attachments or signups. Convert CSV to shareable link in 5 seconds. Free, fast, no account required.",
      "image": "https://table-share.org/logo.png",
      "datePublished": "2025-11-21T00:00:00+00:00",
      "dateModified": "2026-05-27T00:00:00+00:00",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://table-share.org/blog/share-csv-online"
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
            How to Share CSV Files Online (No Email, No Signup)
        </h1>

        <p class="blog-meta">
            <time datetime="2025-11-21">November 21, 2025</time> · Updated <time datetime="2026-05-27">May 27, 2026</time> · 5 min read
        </p>

        <section class="blog-section">
            <h2>The honest framing</h2>
            <p>
                Most CSV files don't need to be files. They need to be a URL you can paste into Slack. The file format is a vehicle for the table inside it, and once the recipient opens it, the file goes to their Downloads folder and dies there.
            </p>
            <p>
                This post covers four specific workflows I use to skip the file step entirely: from pandas, from R, from <code>jq</code> output, and from Excel's "Save As". The destination in all of them is the same — a paste box at <a href="/">table-share.org</a> that turns a clipboard buffer into a shareable HTML table.
            </p>
        </section>

        <section class="blog-section">
            <h2>Why email attachments lose</h2>
            <p>The defaults of email attachments and chat file-uploads create six small frictions that compound:</p>
            <ul>
                <li><strong>Download required before viewing.</strong> A 12KB CSV still demands a tap, then a spreadsheet app launch on mobile.</li>
                <li><strong>Inbox archaeology.</strong> "Where's that file you sent on Tuesday" — even with good search, attachments fragment from the conversation.</li>
                <li><strong>Mobile spreadsheet experience.</strong> Most phone spreadsheet apps load slowly and render tables worse than plain HTML.</li>
                <li><strong>Version drift.</strong> Each download is a snapshot in someone's filesystem that diverges from yours.</li>
                <li><strong>Reply-all bloat.</strong> Threads multiply attachment copies across recipients' storage.</li>
                <li><strong>Corporate filters.</strong> CSV with unfamiliar headers occasionally gets flagged as suspicious.</li>
            </ul>
            <p>
                None of these is individually disqualifying. Stacked, they're why people screenshot CSVs into Slack instead of attaching them.
            </p>
        </section>

        <section class="blog-section">
            <h2>Four workflows that skip the file</h2>

            <h3>pandas (Python)</h3>
            <p>If you live in a Jupyter notebook, you already know <code>to_csv</code> writes a file. The trick is to write to the clipboard instead:</p>
            <pre style="background:#f0f0f0; border:2px solid #000; padding:14px; overflow-x:auto; font-family:'Courier New',monospace; font-size:13px;"><code>import pandas as pd

df = pd.read_sql("SELECT * FROM orders LIMIT 200", conn)
df.to_clipboard(index=False)   # default sep is tab, perfect for paste
</code></pre>
            <p>The clipboard now contains tab-separated values that <a href="/">Table Share</a>'s parser autodetects. Paste, get link, share. The headers come along automatically.</p>
            <p>If <code>to_clipboard</code> errors with a missing dependency, install <code>pyperclip</code> (or, on Linux, <code>xclip</code>).</p>

            <h3>R</h3>
            <p>R's clipboard write is a one-liner:</p>
            <pre style="background:#f0f0f0; border:2px solid #000; padding:14px; overflow-x:auto; font-family:'Courier New',monospace; font-size:13px;"><code>write.table(df, "clipboard", sep="\\t", row.names=FALSE)</code></pre>
            <p>On macOS the equivalent uses <code>pipe("pbcopy")</code> instead of <code>"clipboard"</code>. On Linux, route through <code>xclip -selection clipboard</code>.</p>

            <h3>Command-line JSON to CSV (jq)</h3>
            <p>If you're staring at a JSON API response and just want the table version of it, <code>jq</code> can flatten and pipe straight to clipboard:</p>
            <pre style="background:#f0f0f0; border:2px solid #000; padding:14px; overflow-x:auto; font-family:'Courier New',monospace; font-size:13px;"><code>curl -s api.example.com/orders \\
  | jq -r '(.[0] | keys_unsorted), (.[] | [.[]]) | @tsv' \\
  | clip
</code></pre>
            <p>That emits headers from the first object's keys, then every row as tab-separated values. Substitute <code>pbcopy</code> on macOS or <code>xclip -selection clipboard</code> on Linux.</p>

            <h3>Excel / Sheets "Save As" you don't actually need</h3>
            <p>Most people exporting to CSV from Excel do it as an intermediate step. Skip it: select your data range, copy, paste into <a href="/">table-share.org</a> directly. Excel's clipboard format is tab-separated and the parser handles it the same way as a CSV file. You only need an actual <code>.csv</code> on disk if a downstream tool requires the file format itself.</p>
        </section>

        <section class="blog-section">
            <h2>CSV edge cases that bite</h2>
            <p>CSV is informally specified — RFC 4180 exists but nobody fully follows it. The four edge cases that come up most:</p>

            <h3>1. Encoding</h3>
            <p>UTF-8 is the only sane default. Windows tools that emit UTF-16 or ANSI cause mojibake on the receiving end. If your CSV opens with garbled characters, check encoding before blaming the parser. Excel will sometimes write a byte-order mark (BOM) — Table Share strips it on parse.</p>

            <h3>2. Line endings</h3>
            <p>Windows tools write CRLF (<code>\\r\\n</code>). Unix tools write LF (<code>\\n</code>). PapaParse handles both. Mixed line endings in the same file (an editor accidentally saved with both) usually still parse, but row counts can drift on the boundary.</p>

            <h3>3. Quoted fields with commas inside</h3>
            <p>The classic. <code>"Smith, John"</code> is one cell only when the field is quoted. Most exports do this correctly. The pretty-print formats from database REPLs do not — they use box-drawing characters that aren't valid CSV at all.</p>

            <h3>4. Formula injection</h3>
            <p>A cell starting with <code>=</code>, <code>+</code>, <code>-</code>, or <code>@</code> executes as a formula when the recipient opens the CSV in Excel. Reference: <a href="https://owasp.org/www-community/attacks/CSV_Injection" rel="noopener">OWASP CSV Injection</a>. Table Share prefixes any such cell with a single quote when displaying or downloading, neutralizing the attack.</p>
        </section>

        <section class="blog-section">
            <h2>Side-by-side: file vs link</h2>
            <div class="blog-table-wrapper">
                <table class="blog-table">
                    <thead>
                        <tr>
                            <th>Concern</th>
                            <th>Email attachment</th>
                            <th>Table Share link</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>View on mobile</td>
                            <td>Open file → spreadsheet app</td>
                            <td>Tap link, see table</td>
                        </tr>
                        <tr>
                            <td>Search a value</td>
                            <td>Spreadsheet app's Find</td>
                            <td>Ctrl+F in browser</td>
                        </tr>
                        <tr>
                            <td>Copy a single cell</td>
                            <td>Open file, select, copy</td>
                            <td>Click and drag</td>
                        </tr>
                        <tr>
                            <td>Lifetime</td>
                            <td>Forever in inbox + their disk</td>
                            <td>Auto-expires (7d free, up to 90d Pro)</td>
                        </tr>
                        <tr>
                            <td>Forwarding</td>
                            <td>Re-attach file</td>
                            <td>Forward the link</td>
                        </tr>
                        <tr>
                            <td>Schema change since send</td>
                            <td>Cached old version everywhere</td>
                            <td>Generate a new link</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section class="blog-section">
            <h2>What this isn't for</h2>
            <ul>
                <li><strong>Long-term archival.</strong> Links expire. If the data needs to live forever, put the file in Drive or S3.</li>
                <li><strong>Files larger than the row/column tier limits.</strong> 500 rows / 50 columns free, 5,000 / 100 Pro. Bigger than that is genuinely a file-shaped problem — send the file.</li>
                <li><strong>Confidential data without a password.</strong> Free links are unguessable but not access-controlled. Pro adds password protection.</li>
                <li><strong>Binary or non-tabular CSV.</strong> CSVs containing embedded JSON, base64, or anything that isn't really a table should travel as files.</li>
            </ul>
        </section>

        <section class="blog-cta">
            <h2>Try it</h2>
            <p>
                Open your terminal, run <code>pandas.DataFrame.to_clipboard()</code> or any of the workflows above, then <a href="/">paste at table-share.org</a>. Five seconds from script output to shareable link.
            </p>
            <a href="/" class="blog-cta-button">
                Share a CSV →
            </a>
        </section>

        <section class="blog-section">
            <h2>Related</h2>
            <ul style="list-style: none; padding: 0;">
                <li style="margin-bottom: 12px;"><a href="/blog/sql-results-sharing" style="color: var(--link-color, #0066cc);">Share SQL Query Results Instantly (Without Screenshots)</a></li>
                <li style="margin-bottom: 12px;"><a href="/blog/share-excel-without-login" style="color: var(--link-color, #0066cc);">Share Excel Tables Without Login</a></li>
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
