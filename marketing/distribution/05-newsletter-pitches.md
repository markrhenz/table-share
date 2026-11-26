# Newsletter Pitches — 5 Pre-Written Emails

**Strategy:** personalized cold outreach to 5 dev/tech newsletters. Send one at a time, over a week (not bulk). Wait 7 days between sends. If editor doesn't reply in 14 days, move on — don't follow up twice.

**Hit rate expectation:** 1 in 5 to 1 in 10 accepts. Even one feature = 500-2000 visits in 24h + a permanent backlink.

---

## PITCH 1 — Console.dev (highest fit)

**Who:** David Mytton's newsletter, specifically curates **free dev tools**. Best fit of any newsletter for Table Share.

**Submit:** https://console.dev/submit/

**If submit form doesn't work, email:** hello@console.dev

**Subject:**
```
Free tool for your readers — Table Share (paste tabular data → instant shareable link)
```

**Body:**
```
Hi David,

Long-time Console reader — really liked the recent issue covering [pick a recent tool they featured, e.g. "Skooner" or "Cyberchef"]. The criteria you use for picking tools matches the niche I built mine for.

Table Share is a free utility for one-way table sharing: paste CSV/Excel/TSV data, get an instant shareable HTML table link. No accounts for sender or recipient. Built on Cloudflare Workers, edge-deployed, no cold start.

Free tier (no signup) handles 500 rows / 7-day expiry. The whole tool exists because screenshotting SQL results into Slack is still somehow the default workflow in 2026.

URL: https://table-share.org
Pricing: https://table-share.org/pricing (free tier covers 90% of use; $5 one-time Pro for higher limits)
Tech stack: Cloudflare Workers + KV, PapaParse, Resend

Would it fit a future issue? Happy to write a 100-word blurb in your house style or just answer questions.

Mark Rhenzon Madronio
Davao, Philippines
markrhenz@table-share.org
```

---

## PITCH 2 — Bytes.dev (Jack Herrington)

**Who:** Frontend-focused newsletter, ~150k subscribers. Curates utilities and tools.

**Submit:** No formal submission form — DM Jack on Twitter `@jherr` or email `jack@bytes.dev`

**Subject:**
```
Quick utility for Bytes readers — Table Share
```

**Body:**
```
Hi Jack,

Bytes reader here. Built a small utility I think might fit your "free tools" segment.

Table Share takes pasted CSV/Excel/spreadsheet data and turns it into a clean, shareable HTML table link in 5 seconds. No signup, no accounts, auto-expires. Free up to 500 rows.

The reason it exists: every team I've worked on has people screenshotting SQL results into Slack. Tables deserve their own pastebin pattern, not the spreadsheet treatment.

Frontend angle: client-side parsing with PapaParse, static HTML output, mobile-responsive with sticky headers. Whole thing is under 200KB on the wire.

https://table-share.org

Open to writing a short guest blurb or just being mentioned. Either works.

Mark
```

---

## PITCH 3 — Pointer.io (engineering leadership angle)

**Who:** Senior engineering / EM-targeted newsletter, ~80k subscribers, Suraj Sehgal.

**Submit:** https://www.pointer.io/submit/

**Subject:**
```
Tool submission — Table Share (one-way table sharing for engineering teams)
```

**Body:**
```
Hi Suraj,

Submitting a small tool for consideration:

Table Share — free utility for the constant micro-task of "show me that data": paste CSV/Excel rows, get an instant shareable HTML table link. Aimed at engineering teams who currently default to screenshots in Slack/Teams for SQL results, deploy outputs, monitoring snapshots.

Free tier covers most cases (500 rows, 7-day expiry, no signup). The angle for engineering leaders: reduces the friction tax of those tiny "can you look at this?" interactions that compound across a team. Saves the 30-60 seconds per share that adds up.

Tech: Cloudflare Workers + KV, no servers to babysit, no cold start.

URL: https://table-share.org
API: https://table-share.org/docs

Mark
markrhenz@table-share.org
```

---

## PITCH 4 — TLDR Newsletter (Dan Ni)

**Who:** TLDR Tech, 1M+ subscribers across multiple verticals. Hardest to land but highest reach.

**Submit:** https://tldr.tech/submit

**Subject:**
```
Tool submission — Table Share
```

**Body:**
```
Hi TLDR team,

Submitting Table Share for the Tools & Resources section (TLDR Web Dev or TLDR Dev Tools fit best).

What it is: paste tabular data, get a shareable HTML table link in 5 seconds. No signup either side. Free up to 500 rows. Built on Cloudflare Workers.

Why it's interesting for TLDR readers: solves a tiny but constant frustration — sharing one-off tables with non-technical recipients without the Google Sheets overhead. Used by developers for SQL output sharing, freelancers for client deliverables, anyone tired of CSV email attachments.

URL: https://table-share.org
Pricing: $0 free / $5 one-time Pro
Source: Cloudflare Workers, built by a solo developer

Happy to send screenshots or a demo video if useful.

Mark
markrhenz@table-share.org
```

---

## PITCH 5 — Indie Hackers Daily (community-driven)

**Who:** IH Daily summarizes top community posts. Best path is to post a strong IH milestone (see `04-hn-and-ih-posts.md`) and let it bubble up organically.

**Action:** Skip cold pitch. Post the IH milestone post first, monitor for traction, then nudge if needed.

**If the IH post gets >100 upvotes, email:** community@indiehackers.com

**Subject:**
```
Story submission for IH Daily — Table Share milestone post performing well
```

**Body:**
```
Hi team,

My milestone post is gaining traction in the community:
[link to your IH post]

The angle: 6 months post-launch, diagnosing distribution problems as a solo dev. Transparent revenue numbers, structured 4-week recovery plan.

If it fits IH Daily, happy to provide any additional context or a fresh write-up.

Mark
markrhenz@table-share.org
```

---

## TRACKING SHEET

Save as `marketing/distribution/pitch-tracker.md` or a Google Sheet:

```
| Newsletter | Sent date | Response | Result | Notes |
|------------|-----------|----------|--------|-------|
| Console.dev | | | | |
| Bytes.dev | | | | |
| Pointer.io | | | | |
| TLDR | | | | |
| IH Daily | | | | |
```

---

## Sending schedule (one per day, M-F)

| Day | Send |
|---|---|
| Monday | Console.dev |
| Tuesday | Bytes.dev |
| Wednesday | Pointer.io |
| Thursday | TLDR |
| Friday | (Pause — post IH milestone instead, see file 04) |

Don't bulk-send. One per day keeps your inbox manageable for replies and prevents you from looking like you're spam-blasting.

---

## What to do if an editor accepts

1. Reply within 1 hour during their working hours
2. Ask exactly what they need: tagline length, screenshot dimensions, deadline
3. Send everything in ONE email, properly formatted
4. Don't ask "is there anything else you need?" three times — be self-sufficient
5. After publication, **send a thank-you note** + share their issue on your own social channels

The thank-you note is what gets you a second feature 6 months later.
