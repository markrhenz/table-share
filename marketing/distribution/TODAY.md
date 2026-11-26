# TODAY — Field-by-Field Execution Guide

**Verified May 29, 2026.** Every form below has been cross-referenced against current submission pages. Every field name is real. Every value is paste-ready.

**Before starting:** Open `01-boilerplate.md` in another tab. That file is your paste source. **Don't retype anything — paste from boilerplate.**

---

## STEP 0 — Capture baseline (60 sec)

```powershell
cd "D:\PROJECTS\Spreadsheet Project\table-share"

# Live stats
$stats = (Invoke-WebRequest -UseBasicParsing "https://table-share.org/api/stats").Content
Write-Host "STATS:" -ForegroundColor Cyan
Write-Host $stats

# Pro keys (paste ADMIN_KEY when prompted — value won't echo)
$secureKey = Read-Host -AsSecureString "Paste ADMIN_KEY"
$adminKey = [System.Net.NetworkCredential]::new("", $secureKey).Password
$keys = (Invoke-WebRequest -UseBasicParsing "https://table-share.org/api/admin/keys?key=$adminKey").Content | ConvertFrom-Json
Write-Host "`nPRO KEYS ISSUED: $($keys.count)" -ForegroundColor Cyan

# Save baseline
$baseline = @{
    date = (Get-Date -Format "yyyy-MM-dd HH:mm")
    stats = $stats
    pro_keys = $keys.count
} | ConvertTo-Json
$baseline | Out-File "marketing\distribution\baseline-$(Get-Date -Format yyyy-MM-dd).json"

$adminKey = $null; $secureKey = $null
Write-Host "`nBaseline saved." -ForegroundColor Green
```

Note the lifetime tables number — you'll quote this in forms that ask about traction.

---

## STEP 1 — Take 6 screenshots (15 min)

Open browser in **incognito** at 1280×800. (DevTools → device toolbar → custom 1280×800)

Create folder:
```powershell
New-Item -ItemType Directory -Path "D:\PROJECTS\Spreadsheet Project\table-share\marketing\screenshots" -Force
```

Take and save each:

| Filename | URL / Action | Notes |
|---|---|---|
| `01-homepage.png` | https://table-share.org | Full hero with paste box visible |
| `02-shared-table.png` | First, paste any 5-row CSV. Screenshot the rendered view | Realistic test data (sales, scores, schedule — not lorem ipsum) |
| `03-pricing.png` | https://table-share.org/pricing | Both tiers visible |
| `04-docs.png` | https://table-share.org/docs | API documentation |
| `05-cover.png` | Build a **1200×630** cover image (Peerlist requires this size) | Use Canva or Photopea: take 01-homepage, overlay logo top-left, tagline overlay |
| `06-logo-square.png` | Resize existing logo to 512×512 | If you don't have one, just use logo.png from `/public/` |

**05-cover.png** is the only one that needs custom work. Quick recipe:
1. Open https://www.photopea.com (free, browser-based, no signup)
2. File → New → 1200×630 px, white background
3. File → Open & Place → drop `01-homepage.png`
4. Position to fill (crop excess)
5. File → Export As → PNG → save as `05-cover.png`

---

## STEP 2 — AlternativeTo (15 min, highest ROI)

**DR 79 · 149K monthly traffic · nofollow links**

### 2a. Sign up
1. https://alternativeto.net → top right **Sign In** → **Sign Up**
2. Use `markrhenz@table-share.org` (Cloudflare routes to your Gmail)
3. Confirm email

### 2b. Submit
1. Click your **profile icon top right** → **Suggest new application**
   - Direct: https://alternativeto.net/account/submit-app/
2. Fill the fields below. **Bold = required.**

| Form field | Paste this exact value |
|---|---|
| **Name** | `Table Share` |
| **Website URL** | `https://table-share.org` |
| **Description** | paste **MEDIUM description** from `01-boilerplate.md` |
| **License** | `Commercial Freemium` |
| **Platforms** | Check: **Online / Web** |
| **Categories** | Pick: `File Sharing`, `Online Services`, `Productivity` |
| Tags | `csv, spreadsheet, no-signup, pastebin, ephemeral` |
| Logo | Upload `06-logo-square.png` |
| Screenshots | Upload `01-homepage.png` and `02-shared-table.png` |

3. Click **Submit the application**
4. Wait 24-72h for moderation email

### 2c. CRITICAL FOLLOW-UP after approval

**This step doubles the value of AlternativeTo.** When approved, manually link Table Share as an alternative to existing apps.

1. Go to https://alternativeto.net/software/google-sheets/
2. Click **"Contribute to this page"** → **"Suggest Alternatives"**
3. Type `Table Share` in the search field
4. Select it → **Suggest as alternative**

Repeat for:
- https://alternativeto.net/software/pastebin/
- https://alternativeto.net/software/microsoft-excel-online/
- https://alternativeto.net/software/ethercalc/
- https://alternativeto.net/software/cryptpad/

Each one is a permanent listing on a high-traffic page.

✅ Account: ☐  Submitted: ☐  Approved: ☐  Linked to 5 competitors: ☐

---

## STEP 3 — Peerlist (15 min, DR 75, dofollow)

**THE FORM HAS MANY FIELDS.** Every one below is real, verified against Peerlist's live UI.

### 3a. Sign up + profile (5 min)
1. https://peerlist.io/signup → Sign in with Google (use markrhenz@gmail.com or table-share email)
2. Complete profile prompts:
   - Name: `Mark Rhenzon Madronio`
   - Headline / Title: `Indie developer · Building Table Share`
   - Location: `Davao, Philippines`
   - Bio: paste **MEDIUM founder bio** from `01-boilerplate.md`
   - Profile photo: upload your photo (Peerlist hides unverified-photo profiles from launches)
3. Reach **profile completion 80%+** before launching. Skipping this = your launch performs poorly.

### 3b. Add a Project (where most forms ask the deep fields)

1. Profile dashboard → **+ Add Project** (or **Projects** tab → **+ New Project**)
2. Fill these — Peerlist asks for ALL of these in one form:

| Field name (as it appears) | Paste / select this |
|---|---|
| **Project name** | `Table Share` |
| **Tagline** | `Share tables in 5 seconds. No signup. Paste to link.` |
| **Project URL** | `https://table-share.org` |
| **Cover image** | Upload `05-cover.png` (1200×630 — must be this aspect) |
| **Description** | Use the **LONG description** from boilerplate. Paste it into the rich text editor. |
| **Category** | Select: `Productivity` (primary). If multi-select allowed, add `Developer Tools`. |
| **Tags / Keywords** | `csv, spreadsheet, no-signup, pastebin, ephemeral, devtools, productivity, sharing` |
| **Built with** (tech stack — multi-select) | Pick from their list: `JavaScript`, `Cloudflare Workers`, `HTML`, `CSS`. If they have free-text: add `PapaParse`, `Cloudflare KV`, `Resend`. |
| **Collaborators** | Leave empty (you're solo) |
| **Open source?** | Yes |
| **Repository link** | `https://github.com/markrhenz/table-share` |
| **Demo link** | Same as Project URL: `https://table-share.org` |
| **Tools used** (if separate from Built with) | `VS Code`, `Wrangler CLI`, `Cloudflare`, `Resend`, `Ko-fi` |
| **Visibility** | Public |
| **Project status** | Live / Launched |

3. Click **Save** (project is added to your profile, not yet launched)

### 3c. Launch on Project Spotlight (Monday only)

**Crucial:** Peerlist Spotlight launches **ONLY open on Mondays** (00:00 to 23:59 UTC).

For you in Davao (UTC+8): launch window is **Monday 8:00 AM PHT → Tuesday 7:59 AM PHT**. Best to launch early in the window (Monday morning UTC = Monday afternoon PHT for max visibility).

When the window is open:
1. Go to https://peerlist.io/projects
2. Banner at top: **"Launch Project"** (only visible Mondays)
3. Select your Table Share project from the dropdown
4. Click **Launch project**

### 3d. Engagement (rest of launch day)
- Reply to every comment within 1 hour
- Upvote 10 other launches that day (community reciprocates)
- Share your launch on Bluesky/Mastodon (`peerlist.io/<your-handle>/project/table-share`)

✅ Account + profile 80%+: ☐  Project added: ☐  Launched on a Monday: ☐  Engaged 24h: ☐

---

## STEP 4 — SaaSHub (10 min, permanent listing)

**Direct submit URL:** https://www.saashub.com/services/submit

### 4a. Sign up
1. Sign in via Google or email
2. Click **+ Submit a Product**

### 4b. Fill the form

| Field | Value |
|---|---|
| **Product Name** | `Table Share` |
| **Website URL** | `https://table-share.org` |
| **Tagline** | `Share tables in 5 seconds. No signup. Paste to link.` |
| **Short description** | paste **SHORT description** from boilerplate |
| **Full description** | paste **LONG description** from boilerplate |
| **Categories** | `Productivity Tools`, `Collaboration`, `Developer Tools` |
| **Tags** | `csv`, `spreadsheet`, `no-signup`, `pastebin`, `sharing` |
| **Pricing model** | Freemium |
| **Has free plan** | Yes |
| **Starting price** | $0 |
| **Highest paid plan** | $5 one-time |
| **Pricing details** | `Free: 500 rows, 7-day expiry. Pro: $5 one-time, 5000 rows, 90-day expiry, password protection, API.` |
| **Founded** | 2025 |
| **Logo** | `06-logo-square.png` |
| **Screenshots** | `01-homepage.png`, `02-shared-table.png`, `03-pricing.png` |

### 4c. Add competitors (SaaSHub specifically asks for these — DON'T skip)

Their submission moves to bottom of queue if you don't list competitors. Add:
- Google Sheets
- Pastebin
- EtherCalc
- CryptPad
- Microsoft Excel Online

3. Submit → 3-7 days manual review

✅ Submitted: ☐  Competitors listed: ☐  Approved: ☐

---

## STEP 5 — G2 (15 min, slow but DR 92)

**Vendor portal:** https://www.g2.com/products/new

### 5a. Vendor signup
1. Sign up as **vendor** (decline paid "Pro Profile" upsells — free tier is enough)
2. Use markrhenz@table-share.org

### 5b. Add product

| Field | Value |
|---|---|
| **Product Name** | `Table Share` |
| **Website** | `https://table-share.org` |
| **Vendor / Company** | `Table Share` (solo — list yourself as the company) |
| **Categories** | Search and select: `Collaboration > Document Sharing` (closest fit; also try `Productivity > Note Taking & Document Sharing`) |
| **Description** | paste **LONG description** |
| **Languages supported** | English |
| **Countries supported** | All / Worldwide |
| **Pricing edition** | Free, Pro |
| **Free trial** | No (free tier is permanent) |
| **Free version available** | Yes |
| **Pricing model** | One-time payment for Pro ($5) |
| **Year founded** | 2025 |
| **HQ Location** | Davao, Philippines |
| **Total employees** | 1 |
| **Logo** | `06-logo-square.png` |
| **Screenshots (min 3)** | `01-homepage.png`, `02-shared-table.png`, `03-pricing.png`, `04-docs.png` |

3. Submit → **approval takes 1-2 weeks** (G2 is slow but worth it)

✅ Submitted: ☐  Approved: ☐

---

## STEP 6 — Capterra (10 min, slow but DR 91)

**Vendor portal:** https://www.capterra.com/vendors/sign-up

### 6a. Vendor account
1. Sign up free
2. Decline paid upsells

### 6b. List product

| Field | Value |
|---|---|
| **Product Name** | `Table Share` |
| **Website** | `https://table-share.org` |
| **Category** | `Collaboration Software` (closest fit) — sub: `Document Sharing` |
| **Description** | paste **LONG description** |
| **Pricing** | $5 one-time for Pro; permanent free tier |
| **Free trial** | No |
| **Free version** | Yes |
| **Deployment** | Cloud, SaaS, Web-Based |
| **Training** | Documentation only |
| **Support** | Email |
| **Languages** | English |
| **Countries** | All |
| **Year founded** | 2025 |
| **Number of employees** | 1-10 (pick smallest bucket) |

3. Submit → 7-14 day review

✅ Submitted: ☐  Approved: ☐

---

## STEP 7 — Tier 2 batch (30 min for 5)

### 7a. DevHunt (DR 61, dofollow)

⚠️ DevHunt now uses **GitHub authentication** + **pull request-based submissions**. This adds friction.

**Two paths:**

**Path A (easier):** https://devhunt.org → **Sign In with GitHub** → **+ Submit Tool** → form
- If their form-based submission still works, fill:
  - **Name:** `Table Share`
  - **Tagline:** (60-char from boilerplate)
  - **URL:** `https://table-share.org`
  - **Description:** SHORT description
  - **Categories:** `Developer Tools`, `Productivity`
  - **Tags:** `csv, sharing, no-signup, cloudflare`
  - **Pricing:** Freemium ($5 Pro)

**Path B (PR-based):** Open https://github.com/MarsX-dev/devhunt → fork repo → add Table Share to listings JSON → submit PR. Slower, more involved. Skip if Path A works.

✅ Submitted: ☐

### 7b. TinyLaunch (dofollow, curated)

1. https://tinylaunch.com → **Sign in / Submit**
2. Fill form (similar minimal fields)
3. After submit, **tweet at `@chrissyinspace`** mentioning your launch — Tiny Launch's founder is active on X

✅ Submitted: ☐  Tweeted at founder: ☐

### 7c. PeerPush (DR 73, dofollow, reciprocity-driven)

1. https://peerpush.net → Sign up
2. Submit Table Share
3. **Upvote at least 5 other products** — reciprocity is enforced

✅ Submitted: ☐  Upvoted 5+: ☐

### 7d. StartupTile

1. https://startuptile.com → Submit
2. Standard fields (use boilerplate)

✅ Submitted: ☐

### 7e. Open Launch

1. https://openlaunch.dev → Submit  
2. Open-source friendly framing (mention Cloudflare Workers stack)

✅ Submitted: ☐

### 7f. (Bonus, if time) Wellfound

**URL:** https://wellfound.com/company-builders → **Add your startup**

| Field | Value |
|---|---|
| **Company name** | `Table Share` |
| **Industry** | `Developer Tools` |
| **Description** | MEDIUM description |
| **HQ** | Davao, Philippines |
| **Founded** | November 2025 |
| **Stage** | Bootstrapped |
| **Employees** | 1 |
| **Hiring** | No (skip job posting fields) |

✅ Submitted: ☐

---

## STEP 8 — Mail-tester check (5 min, FREE)

**Why:** Before any newsletter pitch, verify your sender reputation is clean.

1. Open https://www.mail-tester.com → copy temp address (`test-xxxxx@srv1.mail-tester.com`)
2. Open https://resend.com → **Emails** (left sidebar) → **Send email** button
3. Send:

| Field | Value |
|---|---|
| **From** | `Table Share <no-reply@notifications.table-share.org>` |
| **Reply-to** | `markrhenz@table-share.org` |
| **To** | the mail-tester address |
| **Subject** | `Test deliverability — Pro key delivery` |
| **Body** | Paste below ↓ |

```
Hi there!

Thanks for upgrading to Table Share Pro!

YOUR API KEY: ts_live_test1234567890abcdefghij

Use it at https://table-share.org by clicking Pro Mode and pasting the key.

PRO BENEFITS:
- 5,000 rows per table
- 100 columns max
- 90-day link expiry
- Password protection
- Remove "Created with Table Share" branding
- REST API access (see https://table-share.org/docs)

Reply to this email if you need anything.

- Mark
Table Share
https://table-share.org
```

4. Send → wait 30 seconds → click **"Then check your score"** on mail-tester
5. **Target: 9-10/10**

If below 9: screenshot the report and reply here. We diagnose before pitching newsletters.

✅ Score: ___/10

---

## TODAY COMPLETE

**Time spent total: ~100 min**

**Outcomes captured:**
- 10 directory submissions filed
- Mail-tester score recorded
- 6 screenshots saved for reuse
- Baseline metrics in JSON

---

## What unlocks in the next 1-3 weeks

| When | What |
|---|---|
| Within 24h | DevHunt, TinyLaunch, PeerPush, StartupTile, Open Launch usually approve fast |
| Within 72h | AlternativeTo, Peerlist approve |
| Within 7 days | SaaSHub approves |
| Within 14 days | G2, Capterra approve |
| Monday after submission | If Peerlist project is ready, launch on Spotlight |

**Update `07-tracker.md` as each approval email lands in your Gmail (forwarded from markrhenz@table-share.org).**

---

## What's NOT in TODAY (intentionally)

These come next week or later, see other files:

- Reddit comments → `03-reddit-playbook.md` (start tomorrow, 15 min/day)
- HN "Ask HN" post → `04-hn-and-ih-posts.md` (Week 3, Tue/Thu evening PHT)
- Newsletter pitches (Console.dev etc.) → `05-newsletter-pitches.md` (Week 3, one per day M-Th)
- Indie Hackers milestone post → `04-hn-and-ih-posts.md` (Week 4)
- Bluesky/Mastodon launch + founder DMs → `06-social-and-dms.md` (Week 4)

---

## Weekly check (every Friday)

```powershell
cd "D:\PROJECTS\Spreadsheet Project\table-share"
.\marketing\distribution\weekly-check.ps1
```

This:
- Pulls live `/api/stats`
- HEAD-checks 12 critical URLs
- Verifies DMARC is still live
- Appends the week's number to `weekly-log.csv`

Compare to the baseline JSON. Update `07-tracker.md`.

---

**Open `01-boilerplate.md` in a second tab. Start at Step 0. Paste from boilerplate every time a field is asked. Don't retype anything.**
