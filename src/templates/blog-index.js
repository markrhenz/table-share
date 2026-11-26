export const BLOG_INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Table Share Blog - Data Sharing Tips & Guides | Free Tutorials</title>
    <meta name="description" content="Learn how to share tables, CSV files, and spreadsheet data quickly and securely without signup. Free tutorials for developers, freelancers, and teams.">
    <meta name="keywords" content="table sharing tutorials, spreadsheet guides, CSV sharing, developer tips, data sharing best practices">

    <!-- Open Graph -->
    <meta property="og:title" content="Table Share Blog - Free Data Sharing Guides">
    <meta property="og:image" content="https://table-share.org/logo.png">
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
                        How to Share Excel Tables Without Login (2025)
                    </a>
                </h3>
                <p class="blog-meta">
                    <time datetime="2025-11-21">November 21, 2025</time> • 5 min read
                </p>
                <p>
                    Stop emailing Excel files or forcing people to log in. Learn the fastest way to share spreadsheet data online in 2025 - no login required for you or recipients.
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
                    <time datetime="2025-11-21">November 21, 2025</time> • 4 min read
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
</html>`;
