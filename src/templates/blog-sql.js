export const BLOG_SQL_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Share SQL Query Results Instantly (Without Screenshots) | Table Share</title>
    <meta name="description" content="Stop taking screenshots of SQL results. Share query output as clean HTML tables in seconds. Perfect for developers sharing data in Slack, Teams, or email.">
    <meta name="keywords" content="sql results sharing, share query results, database output sharing, sql to html table, developer tools">

    <!-- Open Graph -->
    <meta property="og:title" content="Share SQL Query Results Instantly">
    <meta property="og:image" content="https://table-share.org/logo.png">
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
      "description": "Stop taking screenshots of SQL results. Share query output as clean HTML tables in seconds. Perfect for developers in Slack, Teams, or email.",
      "image": "https://table-share.org/logo.png",
      "datePublished": "2025-11-21T00:00:00+00:00",
      "dateModified": "2026-05-27T00:00:00+00:00",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://table-share.org/blog/sql-results-sharing"
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
            Share SQL Query Results Instantly (Without Screenshots)
        </h1>

        <p class="blog-meta">
            <time datetime="2025-11-21">November 21, 2025</time> · Updated <time datetime="2026-05-27">May 27, 2026</time> · 6 min read
        </p>

        <section class="blog-section">
            <h2>The problem in one sentence</h2>
            <p>
                You have a query result on screen and you need someone else to look at it within the next thirty seconds. Every existing option fails differently, and screenshots fail in six ways at once.
            </p>
            <p>
                This post documents the workflow I settled on, four database-specific shortcuts that get the rows onto the clipboard in one command, and the parser edge cases that broke my first three implementations of <a href="/">Table Share</a>.
            </p>
        </section>

        <section class="blog-section">
            <h2>Why screenshots are worse than you remember</h2>
            <p>A screenshot of a query result fails simultaneously on six axes:</p>
            <ol>
                <li><strong>Not searchable.</strong> The recipient wants to find one order ID. They scroll.</li>
                <li><strong>Not copyable.</strong> They need to paste a value into a ticket. They retype it.</li>
                <li><strong>Not accessible.</strong> Screen readers see nothing.</li>
                <li><strong>High bandwidth.</strong> A 300-row screenshot is hundreds of kilobytes. The same data as an HTML table is a small fraction of that.</li>
                <li><strong>Mobile-hostile.</strong> Phone users get pinch-zoom on a flat image.</li>
                <li><strong>Unsearchable archive.</strong> If you ever want to find "that query I sent in May," screenshots are invisible to your tools.</li>
            </ol>
            <p>
                Plain-text paste has different problems but the same root cause: text is not a table, and chat clients are not table renderers. Column widths collapse the instant your values vary in length.
            </p>
        </section>

        <section class="blog-section">
            <h2>Comparative cost of the common options</h2>
            <p>Order-of-magnitude estimates from typical real-world use, not stopwatched lab numbers:</p>
            <div class="blog-table-wrapper">
                <table class="blog-table">
                    <thead>
                        <tr>
                            <th>Method</th>
                            <th>Time</th>
                            <th>Recipient experience</th>
                            <th>Login required?</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Screenshot → Slack</td>
                            <td>10–15 seconds</td>
                            <td>Image; not searchable, not copyable</td>
                            <td>No</td>
                        </tr>
                        <tr>
                            <td>Raw paste → Slack</td>
                            <td>A few seconds</td>
                            <td>Columns collapse, unreadable for non-uniform widths</td>
                            <td>No</td>
                        </tr>
                        <tr>
                            <td>Export CSV → email attachment</td>
                            <td>30+ seconds</td>
                            <td>Must download, open in spreadsheet app</td>
                            <td>No</td>
                        </tr>
                        <tr>
                            <td>Paste into Google Sheets → share</td>
                            <td>1–2 minutes</td>
                            <td>Clean table, but "Request Access" if perms are wrong</td>
                            <td>Yes</td>
                        </tr>
                        <tr>
                            <td><strong>Paste → Table Share link</strong></td>
                            <td><strong>Under 5 seconds</strong></td>
                            <td>Clean HTML table, mobile responsive, searchable</td>
                            <td>No</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p>
                The Table Share row is the only one where the recipient experience doesn't degrade with table size. A 50-row Slack screenshot and a 5,000-row Slack screenshot are equally useless on a phone.
            </p>
        </section>

        <section class="blog-section">
            <h2>The workflow I actually use</h2>
            <p>The flow is identical regardless of database. Only the "get rows onto the clipboard" step changes.</p>
            <ol>
                <li>Run the query in whatever client you already use.</li>
                <li>Copy the result rows (Ctrl+A then Ctrl+C in most result panes).</li>
                <li>Paste into the textarea at <a href="/">table-share.org</a>.</li>
                <li>The shareable link is auto-copied to your clipboard.</li>
                <li>Paste the link where you were going to put the screenshot.</li>
            </ol>
            <p>
                The recipient sees a clean HTML table on any device. No login, no download. The data is plain HTML, so they can Ctrl+F to search, copy individual values, or forward the link.
            </p>
            <p>
                Links auto-expire after 7 days on the free tier and up to 90 days with a <a href="/pricing">Pro key</a>. That's intentional — the design assumes snapshot data, not living documents. If you need collaborative editing, use a real spreadsheet. If you just need to <em>show</em> someone what came back from the database, this is faster.
            </p>
        </section>

        <section class="blog-section">
            <h2>Database-specific shortcuts</h2>
            <p>Tested, working, no fluff. Pipes to clipboard on Windows (<code>clip</code>), macOS (<code>pbcopy</code>), or Linux (<code>xclip -selection clipboard</code>). Pick the one for your OS.</p>

            <h3>PostgreSQL (psql)</h3>
            <p>Run a one-shot query and pipe the CSV to clipboard:</p>
            <pre style="background:#f0f0f0; border:2px solid #000; padding:14px; overflow-x:auto; font-family:'Courier New',monospace; font-size:13px;"><code>psql -d mydb --csv -c "SELECT id, email, total FROM orders WHERE created_at &gt; '2026-04-01'" | clip</code></pre>
            <p>Inside the psql REPL, use <code>\\copy</code> instead:</p>
            <pre style="background:#f0f0f0; border:2px solid #000; padding:14px; overflow-x:auto; font-family:'Courier New',monospace; font-size:13px;"><code>\\copy (SELECT id, email, total FROM orders) TO '/tmp/q.csv' CSV HEADER</code></pre>
            <p>Then open the file, select all, copy, paste.</p>

            <h3>MySQL / MariaDB</h3>
            <p>The <code>--batch</code> flag swaps the pretty <code>+----+</code> borders for clean tab-separated output that Table Share's parser autodetects:</p>
            <pre style="background:#f0f0f0; border:2px solid #000; padding:14px; overflow-x:auto; font-family:'Courier New',monospace; font-size:13px;"><code>mysql -u user -p mydb --batch -e "SELECT id, email, total FROM orders LIMIT 100" | clip</code></pre>

            <h3>SQLite</h3>
            <p>Configure CSV mode with headers, then run the query and copy the output:</p>
            <pre style="background:#f0f0f0; border:2px solid #000; padding:14px; overflow-x:auto; font-family:'Courier New',monospace; font-size:13px;"><code>.mode csv
.headers on
SELECT id, email, total FROM orders LIMIT 100;</code></pre>

            <h3>GUI clients (DBeaver, Postico, TablePlus, DataGrip)</h3>
            <p>All four have a "Copy Selected as CSV" or "Copy with Headers" in the right-click menu on the results grid. Use that. The clipboard contents are exactly what the parser expects.</p>
        </section>

        <section class="blog-section">
            <h2>Edge cases the parser handles</h2>
            <p>Table Share uses <a href="https://www.papaparse.com/" rel="noopener">PapaParse</a> for parsing. Four cases needed conscious decisions:</p>

            <h3>1. Quoted commas in cell values</h3>
            <p>
                A value like <code>"Smith, John"</code> stays as one cell only if the database actually quotes the field. <code>psql --csv</code> does. The pretty-print <code>+----+</code> format does not, which is one reason I always use <code>--csv</code> or <code>--batch</code>.
            </p>

            <h3>2. Newlines inside cells</h3>
            <p>
                A <code>TEXT</code> column containing line breaks confuses most parsers. PapaParse handles it correctly when the cell is properly quoted. If your database emits the newline raw, the parser splits the row — again, use the structured output mode.
            </p>

            <h3>3. CSV formula injection</h3>
            <p>
                If a cell starts with <code>=</code>, <code>+</code>, <code>-</code>, or <code>@</code>, a recipient who downloads the data and opens it in Excel will execute the formula. This is a known attack class — see <a href="https://owasp.org/www-community/attacks/CSV_Injection" rel="noopener">OWASP CSV Injection</a>. Table Share prefixes any such cell with a single quote on display and download, neutralizing it.
            </p>

            <h3>4. Delimiter autodetection</h3>
            <p>
                Some clients output tab-separated by default and CSV when asked. The parser autodetects which one a paste is using by counting separators in the first row. Spaces are deliberately not treated as delimiters, because column values frequently contain them.
            </p>
        </section>

        <section class="blog-section">
            <h2>What this is not for</h2>
            <p>To save us both time:</p>
            <ul>
                <li><strong>Not for live dashboards.</strong> Tables are immutable once created. If your data changes hourly, share a database view or a real BI tool, not a snapshot.</li>
                <li><strong>Not for confidential data without a password.</strong> Free-tier links are unguessable but not access-controlled. <a href="/pricing">Pro keys</a> unlock password protection.</li>
                <li><strong>Not for very large result sets.</strong> Free tier maxes at 500 rows / 50 columns. Pro at 5,000 / 100. Beyond that, send the CSV file or use a proper data warehouse export.</li>
            </ul>
        </section>

        <section class="blog-cta">
            <h2>Try it</h2>
            <p>
                The fastest test: copy any query result you have open right now, <a href="/">paste it on the homepage</a>, and see what comes out. The full workflow is under five seconds and there's no account to create.
            </p>
            <p>
                If you find a parser edge case that isn't handled, email <a href="mailto:markrhenz@table-share.org">markrhenz@table-share.org</a>.
            </p>
            <a href="/" class="blog-cta-button">
                Share SQL Results →
            </a>
        </section>

        <section class="blog-section">
            <h2>Related</h2>
            <ul style="list-style: none; padding: 0;">
                <li style="margin-bottom: 12px;"><a href="/blog/pastebin-for-tables" style="color: var(--link-color, #0066cc);">Pastebin for Tables: Share Data Like Code</a></li>
                <li style="margin-bottom: 12px;"><a href="/blog/share-csv-online" style="color: var(--link-color, #0066cc);">How to Share CSV Files Online (No Email, No Signup)</a></li>
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
