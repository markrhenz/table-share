// Handler imports
import { handleCreate } from './handlers/create.js';
import { handleView } from './handlers/view.js';
import { handleKofiWebhook } from './handlers/kofi-webhook.js';
import { handleAnalytics, handleStats } from './handlers/analytics.js';
import { handleFetchURL } from './handlers/fetch-url.js';
import { handleAdminPendingEmails, handleAdminListKeys, handleAdminRevokeKey, handleAdminFunnel } from './handlers/admin.js';
import { handleRecoverKey } from './handlers/recover-key.js';

// Template imports (barrel file)
import { INDEX_HTML, TERMS_HTML, PRIVACY_HTML, PRICING_HTML, SITEMAP_XML, ROBOTS_TXT,
  BLOG_INDEX_HTML, BLOG_EXCEL_HTML, BLOG_SQL_HTML, BLOG_SHEETS_HTML, BLOG_CSV_HTML,
  BLOG_PASTEBIN_HTML, DOCS_HTML, RECOVER_HTML } from './templates/index.js';

// Security headers import
import { corsHeaders } from './utils/headers.js';

function serveHTML(html, cacheControl = 'public, max-age=300') {
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': cacheControl,
      ...corsHeaders
    }
  });
}

const STATIC_ROUTES = {
  '/': { html: INDEX_HTML, cache: 'public, max-age=300, s-maxage=3600' },
  '/terms': { html: TERMS_HTML },
  '/privacy': { html: PRIVACY_HTML },
  '/pricing': { html: PRICING_HTML },
  '/blog': { html: BLOG_INDEX_HTML },
  '/blog/share-excel-without-login': { html: BLOG_EXCEL_HTML },
  '/blog/sql-results-sharing': { html: BLOG_SQL_HTML },
  '/blog/google-sheets-alternatives': { html: BLOG_SHEETS_HTML },
  '/blog/share-csv-online': { html: BLOG_CSV_HTML },
  '/blog/pastebin-for-tables': { html: BLOG_PASTEBIN_HTML },
  '/docs': { html: DOCS_HTML, cache: 'public, max-age=300, s-maxage=3600' },
  '/recover': { html: RECOVER_HTML, cache: 'public, max-age=300, s-maxage=3600' },
};

const NOT_FOUND_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>Page Not Found - Table Share</title>
  <link rel="icon" type="image/png" href="/logo.png">
  <style>
    :root { --bg-color: #fff; --text-color: #000; --accent-color: #0066cc; --muted-color: #666; }
    [data-theme="dark"] { --bg-color: #000; --text-color: #fff; --accent-color: #4da6ff; --muted-color: #aaa; }
    [data-theme="dark"] img[src="/logo.png"] { filter: invert(1); }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; background: var(--bg-color); color: var(--text-color); text-align: center; padding: 60px 20px; margin: 0; }
    a { color: var(--accent-color); text-decoration: none; }
    .btn { display: inline-block; background: var(--accent-color); color: #fff; padding: 14px 32px; font-size: 18px; font-weight: 600; border: none; margin-top: 24px; }
  </style>
</head>
<body>
  <a href="/"><img src="/logo.png" width="64" height="64" alt="Table Share"></a>
  <h1 style="font-size: 48px; margin: 20px 0 10px;">404</h1>
  <p style="font-size: 18px; color: var(--muted-color); margin-bottom: 8px;">This page doesn't exist or has been removed.</p>
  <p style="font-size: 16px; color: var(--muted-color);">The table you're looking for may have expired.</p>
  <a href="/" class="btn">Share a Table</a>
  <script>
    const s = localStorage.getItem('theme');
    if (s) document.documentElement.setAttribute('data-theme', s);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) document.documentElement.setAttribute('data-theme', 'dark');
  </script>
</body>
</html>`;

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;

      // OPTIONS request for CORS preflight
      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders });
      }

      // Trailing slash redirect (except for root).
      // url.search MUST be preserved: /t/{id}/?s= and /pricing/?utm= carry the
      // loop/seed attribution params. Dropping them scores the create as 'direct'.
      if (pathname !== '/' && pathname.endsWith('/')) {
        return Response.redirect(url.origin + pathname.slice(0, -1) + url.search, 301);
      }

      // Static route lookup
      const staticRoute = STATIC_ROUTES[pathname];
      if (staticRoute) {
        return serveHTML(staticRoute.html, staticRoute.cache);
      }

      // /sitemap.xml
      if (pathname === '/sitemap.xml') {
        return new Response(SITEMAP_XML, {
          headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=86400',
            ...corsHeaders
          }
        });
      }

      // /robots.txt
      if (pathname === '/robots.txt') {
        return new Response(ROBOTS_TXT, {
          headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'public, max-age=86400',
            ...corsHeaders
          }
        });
      }

      // /analytics GET
      if (pathname === '/analytics' && request.method === 'GET') {
        return await handleAnalytics(request, env, url);
      }

      // /api/stats GET
      if (pathname === '/api/stats' && request.method === 'GET') {
        return await handleStats(env);
      }

      // /api/create POST
      if (pathname === '/api/create' && request.method === 'POST') {
        return await handleCreate(request, env);
      }

      // /api/fetch-url POST
      if (pathname === '/api/fetch-url' && request.method === 'POST') {
        return await handleFetchURL(request, env);
      }

      // /t/{id} - view table (8 char ID)
      if (pathname.startsWith('/t/') && pathname.length === 11) {
        const id = pathname.slice(3);
        if (/^[a-zA-Z0-9]{8}$/.test(id)) {
          return await handleView(request, env, id);
        }
      }

      // /t/{id}/unlock POST - password unlock
      if (pathname.match(/^\/t\/[a-zA-Z0-9]{8}\/unlock$/) && request.method === 'POST') {
        const id = pathname.split('/')[2];
        return await handleView(request, env, id);
      }

      // /api/kofi-webhook POST
      if (pathname === '/api/kofi-webhook' && request.method === 'POST') {
        return await handleKofiWebhook(request, env);
      }

      // Admin endpoints (gated by ADMIN_KEY secret)
      if (pathname === '/api/admin/pending-emails' && request.method === 'GET') {
        return await handleAdminPendingEmails(request, env, url);
      }
      if (pathname === '/api/admin/keys' && request.method === 'GET') {
        return await handleAdminListKeys(request, env, url);
      }
      if (pathname === '/api/admin/revoke' && request.method === 'POST') {
        return await handleAdminRevokeKey(request, env, url);
      }
      if (pathname === '/api/admin/funnel' && request.method === 'GET') {
        return await handleAdminFunnel(request, env, url);
      }

      // /api/recover POST — public key recovery form
      if (pathname === '/api/recover' && request.method === 'POST') {
        return await handleRecoverKey(request, env);
      }

      // 404 Not Found
      return new Response(NOT_FOUND_HTML, {
        status: 404,
        headers: { 'Content-Type': 'text/html', ...corsHeaders }
      });

    } catch (error) {
      console.error('Worker error:', error.message, error.stack);
      return new Response('Internal Server Error', {
        status: 500,
        headers: { 'Content-Type': 'text/plain', ...corsHeaders }
      });
    }
  }
};
