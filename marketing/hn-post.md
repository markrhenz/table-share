**Title:** Show HN: Table Share - Ephemeral table sharing, no signup

**First comment:**

I built this because I got tired of the Google Sheets permission dance.

Use case: You have some data (SQL output, CSV, spreadsheet range). You want someone to see it. You don't want to create a file, set permissions, or force them to log in.

Table Share: paste → get link → share. Link expires in 7 days (or 90 days with Pro).

Tech: Cloudflare Workers + KV. Sub-100ms response globally. Zero cold starts.

Free tier covers most use cases. Pro ($5 one-time) adds password protection, longer expiry, remove branding.

https://table-share.org

Happy to discuss architecture decisions or answer questions.