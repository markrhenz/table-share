**Tweet 1:**
Stop emailing CSVs.

I built Table Share: paste data → get link → done.

- No signup (for anyone)
- Link expires automatically
- Recipient sees clean HTML table

Try it: https://table-share.org

🧵 Thread on why I built it:

**Tweet 2:**
The problem:

Every time I share data, I have to choose between:
- Screenshots (ugly, can't copy)
- Google Sheets (permission hell)
- Email attachment (buried forever)

None of these are right for "here's a quick table, look at it once."

**Tweet 3:**
The solution:

Paste data (from anywhere - Excel, Sheets, CSV, database).
Get instant link.
Link auto-expires in 7 days.

No file created. No permission set. No account needed.

**Tweet 4:**
Tech stack:
- Cloudflare Workers (edge deployed)
- Cloudflare KV (auto-expiring storage)
- PapaParse (CSV parsing)
- Vanilla JS (no frameworks)

Sub-100ms globally. Zero cold starts.

**Tweet 5:**
Free tier: 500 rows, 7-day expiry

Pro ($5 one-time): 
- 5,000 rows
- 90-day expiry
- Password protection
- Remove branding

No subscription. Pay once.

**Tweet 6:**
Try it: https://table-share.org

Feedback welcome. Especially on speed - trying to keep paste → share under 5 seconds.