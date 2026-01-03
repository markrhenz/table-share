**Title:** [Project] Built a zero-friction table sharing tool - paste CSV, get expiring link, no signup

**Body:**

Hey r/webdev!

I got tired of the "can you give me access to this Sheet?" dance every time I needed to share some data.

So I built Table Share: paste tabular data, get an instant link, recipients see a clean HTML table. No accounts, no permissions, link auto-expires.

**Stack:**
- Cloudflare Workers (edge functions, sub-100ms globally)
- Cloudflare KV (auto-expiring storage)
- PapaParse (client-side parsing)
- Vanilla JS, no frameworks

**Why edge-first:**
- Zero cold starts
- 100K requests/day on free tier
- Built-in rate limiting

**Try it:** https://table-share.org

Free tier: 500 rows, 7-day expiry
Pro ($5 one-time): 5K rows, 90-day expiry, password protection

Would love feedback - especially on the workflow speed. Trying to keep it under 5 seconds from paste to shareable link.