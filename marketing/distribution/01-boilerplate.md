# Table Share — COMPLETE Field-by-Field Reference Pack

**Verified:** May 29, 2026. Every value below maps to real fields on real submission forms (Peerlist, AlternativeTo, SaaSHub, G2, Capterra, DevHunt, Wellfound, etc.).

Pull from this file. Don't rewrite anything per-form unless explicitly noted.

---

## ⚡ COPY-PASTE QUICK REFERENCE (single screen of truth)

| Field name (varies by site) | Paste this value |
|---|---|
| **Product name** | `Table Share` |
| **Tagline (≤60 chars)** | `Share tables in 5 seconds. No signup. Paste to link.` |
| **One-liner (≤140 chars)** | `Paste CSV or Excel data, get a shareable HTML table link in seconds. No signup, no accounts. Free up to 500 rows.` |
| **Website URL / Demo URL / Project URL** | `https://table-share.org` |
| **Pricing page** | `https://table-share.org/pricing` |
| **API docs** | `https://table-share.org/docs` |
| **Blog** | `https://table-share.org/blog` |
| **Logo URL** | `https://table-share.org/logo.png` |
| **Contact email** | `markrhenz@table-share.org` |
| **GitHub / Repository** | `https://github.com/markrhenz/table-share` |
| **Founder name** | `Mark Rhenzon Madronio` |
| **Founder location** | `Davao, Philippines` |
| **Twitter / X handle** | Leave blank (none yet) |
| **Launched** | `November 2025` |
| **Team size** | `1` (solo) |
| **Collaborators** | None (solo) |

---

## 📂 CATEGORIES (multi-select)

Pick whichever the form allows. Prioritize in this order:

1. **Productivity Tools**
2. **Developer Tools**
3. **File Sharing**
4. **Collaboration Software**
5. **Document Sharing**
6. **Web Apps / Online Services**
7. **Utilities**
8. **Data Tools**

**Skip:** AI, ML, Marketing, CRM, Analytics (none of these fit).

---

## 🏷️ TAGS / KEYWORDS (free-text, comma-separated)

Use up to whatever the form allows (most accept 5-10):

```
csv, spreadsheet, table-sharing, share-data, no-signup, pastebin, ephemeral, sql, devtools, productivity, lightweight, minimalist
```

---

## 🛠️ TECH STACK / "BUILT WITH" (Peerlist, DevHunt, StackShare all ask)

These are the actual technologies in production. Paste any/all:

```
JavaScript
Cloudflare Workers
Cloudflare KV
HTML
CSS
PapaParse
Resend
Ko-fi
```

If the form is a multi-select tag picker, all 8 of these are common selectable tags. If it's free-text comma-separated, paste exactly as above.

---

## 💰 PRICING / BUSINESS MODEL FIELDS

| Field | Value |
|---|---|
| **Pricing model** | Freemium |
| **Has free plan** | Yes |
| **Has free trial** | N/A — free tier is permanent (no trial needed) |
| **Starting price (free)** | $0 |
| **Paid tier price** | $5 |
| **Billing frequency** | One-time (lifetime, not subscription) |
| **Currency** | USD |
| **Money-back guarantee** | None offered |
| **Refund policy** | Per Ko-fi terms |

---

## 🔓 LICENSE / OPEN SOURCE FIELDS

| Field | Value |
|---|---|
| **License** | See repo `LICENSE` file (verify before submitting) |
| **Open source** | Yes — code public at `https://github.com/markrhenz/table-share` |
| **Source code URL** | `https://github.com/markrhenz/table-share` |
| **Self-hostable** | Possible (Cloudflare Workers required) |
| **Commercial** | Yes (freemium model) |
| **License type (AlternativeTo)** | Open Source + Commercial Freemium (hosted version) |

---

## 🌐 PLATFORMS (multi-select)

| Field | Value |
|---|---|
| **Platforms** | Web / Online only |
| **Desktop apps** | No (browser-based) |
| **Mobile apps** | No (responsive web — works on mobile browsers) |
| **Browser extension** | No |
| **API available** | Yes (Pro tier — see `/docs`) |
| **Available worldwide** | Yes |
| **Languages supported** | English only |

---

## 📝 DESCRIPTIONS — paste verbatim by length

### SHORT description (≤300 chars — for SaaSHub, G2 short fields, Capterra summary)

```
Table Share is the fastest way to share tabular data. Paste CSV, Excel, or spreadsheet rows; get an instant shareable HTML table link. No accounts for sender or recipient. Free tier: 500 rows / 7-day expiry. Pro: $5 one-time for 5,000 rows, password protection, and 90-day expiry.
```

### MEDIUM description (≤800 chars — for AlternativeTo, Wellfound, BetaList)

```
Table Share solves a small but constant problem: when you need to show someone a table — a SQL result, an Excel range, a CSV — and you don't want to attach a file, take a screenshot, or create a Google Sheet with permissions.

The workflow is paste → instant link → recipient sees a clean read-only HTML table. No accounts for either side. Free tier handles 500 rows; $5 one-time Pro lifts that to 5,000 rows and adds password protection, custom expiry up to 90 days, and a REST API.

Built on Cloudflare Workers + KV. Solo-founded November 2025. Designed for developers sharing query results, freelancers sending data to clients, and teams sharing meeting snapshots.
```

### LONG description (≤2000 chars — for Peerlist rich-text, G2 product description, Capterra)

```
Table Share is a single-purpose web utility that turns pasted tabular data into a clean, instantly shareable HTML table — no accounts required for sender or recipient.

THE PROBLEM
Existing options for sharing a one-off table all fail differently:
- Screenshots: not searchable, not copyable, useless on mobile
- Raw paste in chat: columns collapse, unreadable
- CSV attachments: force download before viewing
- Google Sheets: requires accounts, permission fiddling, overkill for snapshots

Table Share fills the gap with a workflow optimized for one-way data transmission.

HOW IT WORKS
1. Paste CSV, Excel range, TSV, or HTML table on the homepage
2. The data is parsed (PapaParse with autodetection of delimiters)
3. A unique 8-character URL is generated and auto-copied to clipboard
4. Recipients click the link and see a mobile-responsive HTML table
5. Free links auto-expire after 7 days; Pro after up to 90 days

TECH STACK
- Cloudflare Workers (edge serverless, no cold start)
- Workers KV (ephemeral storage with TTL)
- PapaParse (client-side parsing)
- Ko-fi + Resend (payment + Pro key delivery)
- Plain HTML/CSS frontend, no frameworks

PRICING
Free tier (no signup):
- 500 rows, 50 columns
- 7-day expiry
- Unlimited shares
- CSV download

Pro tier ($5 one-time, lifetime):
- 5,000 rows, 100 columns
- 90-day expiry, custom expiration windows
- Password protection
- Remove branding
- REST API access (see /docs)

DESIGNED FOR
Developers sharing query results, freelancers sending data to clients, teams sharing meeting snapshots, anyone tired of Google Sheets overhead for ad-hoc shares.

LINKS
- App: https://table-share.org
- Pricing: https://table-share.org/pricing
- API docs: https://table-share.org/docs
- Blog: https://table-share.org/blog
- Contact: markrhenz@table-share.org
```

---

## 🧑 FOUNDER BIO (for Wellfound, IH, Peerlist profile)

### SHORT (≤200 chars)
```
Solo indie developer in Davao, Philippines. Launched Table Share Nov 2025 on Product Hunt. Backend in Cloudflare Workers. Reach me at markrhenz@table-share.org.
```

### MEDIUM (≤500 chars)
```
Mark Rhenzon Madronio — solo indie developer based in Davao, Philippines. Built and launched Table Share in November 2025 as a single-purpose utility for ephemeral table sharing. Backend: Cloudflare Workers + KV. Approach: radical minimalism inspired by Craigslist — black text, white background, system fonts, sub-5-second workflow. Open to feedback and collaboration.
```

---

## 🎯 ELEVATOR PITCHES (for HN / IH / X / Bluesky / DMs)

### 1-sentence (for X posts, Bluesky)
```
Built table-share.org because screenshotting SQL results into Slack is still the default workflow in 2026.
```

### 3-sentence (for HN comments, IH posts)
```
Table Share is a no-signup utility for one-way table sharing — paste data, get a link, recipient sees a clean read-only HTML table. Free up to 500 rows, $5 one-time Pro for higher limits and password protection. Built on Cloudflare Workers because the whole thing should fit on a postcard.
```

### Problem-first framing (for newsletter pitches)
```
Sharing a one-off table is still surprisingly hard in 2026. The options all fail: screenshots aren't searchable, CSV attachments force a download, Google Sheets demands accounts and permission fiddling. Table Share fills the gap with paste → link → clean read-only HTML table. No accounts. Free tier covers 90% of use cases.
```

---

## 📸 SCREENSHOTS REQUIRED

| File name | Page | Resolution | Where used |
|---|---|---|---|
| `01-homepage.png` | https://table-share.org | 1280×800 | All directories (primary) |
| `02-shared-table.png` | Generate a fake table first, screenshot the rendered view | 1280×800 | All directories (secondary) |
| `03-pricing.png` | https://table-share.org/pricing | 1280×800 | Most directories |
| `04-docs.png` | https://table-share.org/docs | 1280×800 | DevHunt, technical directories |
| `05-cover.png` | Create a 1200×630 wide banner using `01-homepage` cropped + Table Share logo | 1200×630 | **Peerlist cover image** + OG card |
| `06-logo-square.png` | Existing `logo.png` resized | 512×512 | App icon fields |

**Take screenshots in INCOGNITO** (no dark mode, no Pro mode banner).

**Storage:** `D:\PROJECTS\Spreadsheet Project\table-share\marketing\screenshots\`

Create folder:
```powershell
New-Item -ItemType Directory -Path "D:\PROJECTS\Spreadsheet Project\table-share\marketing\screenshots" -Force
```

---

## 🔢 LIVE METRICS (refresh before submitting)

Run this to capture current numbers before filling forms — some sites ask for "monthly users" or "tables shared":

```powershell
$stats = (Invoke-WebRequest -UseBasicParsing "https://table-share.org/api/stats").Content | ConvertFrom-Json
Write-Host "Lifetime tables: $($stats.total)"
```

Use this in any "users" / "active customers" field:

| Field asks for | Honest answer |
|---|---|
| "Active users" | "53+ lifetime users (just past inflection)" |
| "Monthly active" | "Pre-product-market-fit. Tracking aggregate share count: 53+." |
| "Revenue" | Leave blank or "$0-100 MRR equivalent (one-time $5 Pro tier)" |
| "Customers" | Use lifetime tables figure |

**Never inflate numbers.** Verification gets done on G2/Capterra and inflation gets you delisted.

---

## ❓ COMMON FORM QUESTIONS — pre-written answers

### "What problem does this solve?"
```
Sharing a one-off table without account setup, file attachments, or screenshot mess. Recipients see a clean HTML table in their browser; senders click paste and copy a link. Eliminates the 30-second Google Sheets share dance for the 90% of cases that don't need collaboration.
```

### "Who is your target customer?"
```
Developers sharing SQL query results, data analysts sharing snapshots with non-technical stakeholders, freelancers sending deliverables to clients, small teams who need quick read-only data sharing without seat licenses on a full SaaS.
```

### "What makes you different?"
```
Radical minimalism. Single workflow: paste → link → done in under 5 seconds. No signup, no accounts, no permissions to configure. Other tools (Google Sheets, Airtable, EtherCalc) optimize for collaborative editing; Table Share optimizes for one-way transmission of a snapshot — which is what most users actually need.
```

### "Why should we feature you?"
```
Table Share is a genuinely free, no-signup utility for a real recurring pain point. Built solo, run on Cloudflare Workers' free tier so it has no risk of pivoting or going subscription-only. The free tier handles 90% of use cases — Pro is $5 one-time for power users. No VC pressure, no growth-at-all-costs roadmap. Just a tool that does one thing well.
```

### "Roadmap" / "What's next?"
```
1. Improve organic SEO via blog content and Information-Gain rewrites
2. Open OG image generator for shared links (better social previews)
3. Optional referral tracking for Pro conversions
4. Potential D1 migration if KV write quota becomes a bottleneck

Not on roadmap by design: collaborative editing, charts, formulas, multiple sheets, real-time sync. These would compromise the simplicity moat.
```

---

## 🚫 WHAT TO LEAVE BLANK

If a form asks for any of these, leave it empty (don't fabricate):

- LinkedIn company page (none)
- Facebook page (none)
- YouTube channel (none)
- Discord/Slack community (none)
- Investor list (bootstrapped, no investors)
- VC funding amount ($0 raised)
- Annual recurring revenue (don't disclose)
- Employee count beyond founder (just 1)

Honesty here matters more than ticking every box.

---

## ✅ Source-of-truth checklist

If a form asks something not covered above, default to:

1. Conservative honesty (lean smaller, not larger)
2. Use the LONG description and let them excerpt
3. Skip the field rather than fabricate
4. Email `markrhenz@table-share.org` is the answer to any "contact" question

Open this file in a tab while submitting forms. Don't re-write anything.
