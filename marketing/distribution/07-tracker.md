# Distribution Tracker — Weekly Dashboard

Update this file weekly. Single source of truth for what's working.

---

## Lifetime metrics

| Date | Lifetime tables | Pro conversions | Revenue (USD) | Notes |
|------|-----------------|-----------------|---------------|-------|
| 2026-05-27 | 53 | ? | $? | Baseline at distribution plan start |
| 2026-06-03 | | | | End of Week 1 (directories) |
| 2026-06-10 | | | | End of Week 2 (Reddit) |
| 2026-06-17 | | | | End of Week 3 (HN + newsletters) |
| 2026-06-24 | | | | End of Week 4 (IH + social) |

How to fill `Lifetime tables`: `curl https://table-share.org/api/stats` → use the `total` value
How to fill `Pro conversions`: hit `/api/admin/keys?key=<ADMIN_KEY>` and count the records

---

## Week 1 — Directory submissions

| # | Site | Submitted | Approved | Traffic seen | Notes |
|---|------|-----------|----------|--------------|-------|
| 1 | AlternativeTo | ☐ | ☐ | | |
| 2 | SaaSHub | ☐ | ☐ | | |
| 3 | OpenSourceAlternative | ☐ | ☐ | | |
| 4 | G2 | ☐ | ☐ | | |
| 5 | Capterra | ☐ | ☐ | | |
| 6 | DevHunt | ☐ | ☐ | | |
| 7 | TinyLaunch | ☐ | ☐ | | |
| 8 | BetaList | ☐ | ☐ | | |
| 9 | TAAFT | ☐ | ☐ | | |
| 10 | Awesome GitHub list | ☐ | ☐ | | |

---

## Week 2 — Reddit comments

| Date | Subreddit | Thread URL | Upvotes | Clicks (est) | Notes |
|------|-----------|------------|---------|--------------|-------|
| | | | | | |
| | | | | | |
| | | | | | |
| | | | | | |
| | | | | | |

Target: 10+ comments by end of Week 2.

---

## Week 3 — HN + newsletters

### Hacker News

| Date posted | Title | Front page? | Upvotes | Comments | Direct visits |
|-------------|-------|-------------|---------|----------|---------------|
| | | | | | |

### Newsletter pitches

| Newsletter | Sent date | Response | Result | Notes |
|------------|-----------|----------|--------|-------|
| Console.dev | | | | |
| Bytes.dev | | | | |
| Pointer.io | | | | |
| TLDR | | | | |
| IH Daily | | | | |

---

## Week 4 — IH + social

### Indie Hackers

| Date posted | Title | Upvotes | Comments | Direct visits |
|-------------|-------|---------|----------|---------------|
| | | | | |

### Bluesky / Mastodon

| Date | Platform | Post type | Engagement | Notes |
|------|----------|-----------|------------|-------|
| | | Launch | | |
| | | Follow-up 1 | | |
| | | Follow-up 2 | | |
| | | Recap | | |

### Founder DMs

| Person | Sent date | Replied? | Result | Notes |
|--------|-----------|----------|--------|-------|
| | | | | |
| | | | | |
| | | | | |
| | | | | |
| | | | | |

---

## Channel ROI summary (fill at end of month)

| Channel | Hours spent | Visits driven | Pro conversions | Verdict |
|---------|-------------|---------------|-----------------|---------|
| Directories | | | | |
| Reddit | | | | |
| Hacker News | | | | |
| Newsletters | | | | |
| Indie Hackers | | | | |
| Bluesky | | | | |
| Mastodon | | | | |
| Founder DMs | | | | |

**Decision after Week 4:** Drop the bottom 50% of channels. Double-down on the top 2-3.

---

## Where to read traffic data

| Source | Where | What it shows |
|--------|-------|---------------|
| `/api/stats` | curl | Lifetime tables (truth) |
| `/api/admin/keys?key=...` | curl | Pro conversion count |
| Cloudflare Web Analytics | dash.cloudflare.com → Workers & Pages → table-share → Analytics | Per-day visits, referrers, top pages |
| Google Search Console | https://search.google.com/search-console | Impressions, clicks, queries, indexing status |
| Bing Webmaster Tools | https://www.bing.com/webmasters | Same as GSC for Bing |

---

## Red flags to watch for

| If you see | It means | Do |
|------------|----------|-----|
| Spike in /api/create errors | Bot abuse | Check rate limiter, may need to tighten |
| Spike in `pending_email:` records | Email delivery breaking | Check Resend dashboard |
| GSC "Crawled, not indexed" growing | New content failing Information Gain | Rewrite that page |
| KV writes approaching 1k/day | Free tier ceiling close | Plan D1 migration |
| Multiple identical Pro keys | Webhook idempotency broken | Audit `webhook:` and `pending_email:` records |

---

**Update this file every Friday for 4 weeks. After Week 4, decide which channels keep, which drop.**
