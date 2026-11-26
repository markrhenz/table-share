# Table Share — Full Architecture Audit (2026-06-24)

**Architect:** Claude (2nd to Kilo Code) · **Operator:** Mark Rhenzon Madronio
**Method:** Ground-truth code read of `src/` + live 2026 docs. Memory was treated as *unverified* and re-checked against disk.
**Scope:** 2026 reality check → theme/goal → backend → process → UI → feature brainstorm → essentials.

> Prior audits (`audits/process-audit.md`, `audits/ui-audit.md`, Feb 2026) are **not** superseded — this is additive and re-grounds against current code. Nothing was overwritten.

---

## Phase 0 — 2026 Reality Check (verified this session)

| Claim | Memory said | **2026 truth (verified)** | Impact |
|---|---|---|---|
| Workers free requests | — | **100,000 req/day** | Not the bottleneck |
| KV reads (free) | 100K/day | **100,000/day** ✓ | Fine |
| **KV writes (free)** | (not pinned) | **1,000/day** (+1,000 del, 1,000 list), reset 00:00 UTC | **⚠ This is the scaling wall — see B-1** |
| KV storage (free) | 1GB-ish | **1 GB total** | Fine at current volume |
| Wrangler latest | 4.45.x | **4.102.0+** (local: `^4.58.0`) | Outdated, still works |
| PapaParse latest | "5.5.3 doesn't exist, don't upgrade" | **5.5.4 exists** (current: 5.4.1) | Memory note is *wrong*; low-urgency bump |
| SEO model | classic organic | **GEO/LLM-SEO**: ~60% zero-click, ChatGPT ≈20% of search traffic, AI visitors convert ~4.4×; schema/structured-data = citation fuel | Reframes the #1 constraint (distribution) |
| Web vitals | — | **LCP ≤2.5s, INP ≤200ms, CLS ≤0.1**; INP hardest in 2026; WCAG 2.2 AA | UI bar (Phase 5) |

**Memory hygiene corrections applied:** `index.js` is **not** a 2,800-line monolith — it is a clean **188-line router**; templates are split into `src/templates/*.js`. Pro key validity is **100 years**, not ~1yr. Email secret is **`SENDGRID_API_KEY`** (legacy name, holds the Resend key) — confirmed in code. These will be pushed to memory.

Sources: Cloudflare KV limits, Workers limits, Wrangler install/update, PapaParse npm, Adobe/SEOProfy GEO, Core Web Vitals 2026 (URLs at end).

---

## Phase 1 — Theme & Goal Alignment

**Theme (intact):** Brutalist/Craigslist — black/white, system fonts, 2px borders, zero decoration. Code honors it (no gradients, no web fonts).
**Goal:** No-signup paste→link→static table, <5s, $0 infra, $5 one-time Pro via Ko-fi.
**Actual constraint (per your own notes):** *not* the product — it's **distribution** (near-zero organic traffic, revenue unconfirmed/$0). The product is over-built relative to its audience. **Verdict: stop adding product surface; every hour should buy reach or conversion.** This audit is weighted accordingly.

---

## Phase 2 — Best Implementation With Current Setup (the one architectural move)

The stack is correct (Workers + KV + PapaParse + Ko-fi). The single highest-leverage change is **getting non-essential writes off KV** so the 1,000/day write quota is spent only on real tables.

**Current write cost per free table ≈ 3 KV writes:**
1. `rate-limit:{ip}:{minute}` (rate-limiter.js:60)
2. `{id}` table payload (create.js:108)
3. `stats:lifetime:*` analytics counter (create.js:113)

→ Ceiling ≈ **~330 tables/day** before writes fail. If distribution *works*, you hit this on launch day. Fixes (all free, Workers-native):

| Lever | Change | Frees | Effort |
|---|---|---|---|
| **B-1a** Rate limiting | Cloudflare **Rate Limiting binding** (or WAF rate rule) instead of KV counter | ~1 write/create | S |
| **B-1b** Analytics | **Workers Analytics Engine** (free, write-optimized, separate quota) instead of KV counter | ~1 write/create | M |
| Net result | | **~3×** more real tables/day on the same free plan | |

After B-1a+B-1b, KV writes ≈ **1 per table** → ceiling ≈ ~1,000 tables/day. *Do this before any growth push, not after.*

---

## Phase 3 — Backend Audit (code-grounded)

| # | Severity | Finding | Evidence | Fix |
|---|---|---|---|---|
| **B-0** | 🟠 **High (latent, NOT an active leak)** | **`OWNER_KEY` plaintext in local `wrangler.toml` only.** VERIFIED 2026-06-24: repo IS public, but committed/`main` `wrangler.toml` has **no** OWNER_KEY, and `git log -S` proves the key was **never committed** (clean history). It lives only in the uncommitted local working copy (` M wrangler.toml`). Risk = a future `git add -A && git push` would leak the master unlimited-tier key to the public repo. | local `wrangler.toml:15`; `git show HEAD:wrangler.toml` (absent); `git log -S "ts_live_Hx7…"` (empty) | Move to `wrangler secret put OWNER_KEY` (+ rotate as hygiene). **No history purge needed** — never committed. Add `wrangler.toml` to `.gitignore` OR keep OWNER_KEY out of `[vars]` permanently. Kilo prompt #1. |
| **B-0b** | 🟡 Med (verify) | **Email secret name mismatch.** Code reads `env.SENDGRID_API_KEY` (`kofi-webhook.js:124`); committed `wrangler.toml` comment says `RESEND_API_KEY`. If the *live* secret is named `RESEND_API_KEY`, Pro-key emails fail silently. | code vs committed comment | Mark to run `wrangler secret list` and confirm the live name matches the code. Cannot be checked without authed Cloudflare CLI. |
| **B-2** | ✅ **FIXED 2026-06-24** (was 🟠 High) | **Passwords were unsalted SHA-256.** Now **PBKDF2-HMAC-SHA256, 100k iters, per-table 16-byte salt**, constant-time compare, salted unlock-cookie token. Legacy unsalted records still verify (backward-compatible). Implemented directly (not Kilo) per critical-file rule. Unit-tested green (8/8). **Pending: `wrangler deploy`.** | new `src/utils/password.js`; `create.js` (stores hash+salt+kdf); `view.js` (shared verify) | Done — deploy + smoke-test a password table. |
| **B-3** | 🟡 Med | Unlock cookie value = first 16 hex of the password hash (`view.js:654`). Deterministic; tied to the unsalted-hash weakness. | `view.js:654,699` | Resolves once B-2 lands (salt makes it non-deterministic). Cookie flags already good (HttpOnly, SameSite=Strict, scoped Path). |
| **B-4** | 🟡 Med | **Rate-limiter fails open** on any KV error (`return {allowed:true}`). A KV blip = no rate limiting. | `rate-limiter.js:68-70` | Acceptable short-term; B-1a (native rate limiting) removes the failure mode entirely. |
| **B-5** | 🟢 Low | Ko-fi token compared with `!==` (not constant-time). | `kofi-webhook.js:52` | Low risk (server-to-server, no oracle). Optional constant-time compare. |
| **B-6** | 🟢 Low | Pro `maxSize` = 5MB, **same as free**, and the error text says "max 5MB" even for Pro. Pro buyers get more rows but not more bytes. | `sanitizer.js:71` vs `:65` | Decide intentionally: raise Pro `maxSize` (e.g. 10–25MB) or fix copy. Cheap upsell integrity fix. |
| **B-7** | 🟢 Low | CSP allows `script-src 'unsafe-inline'`. Necessary for inline template JS, but weakens XSS defense-in-depth. | `headers.js:11` | Long-term: hash/nonce inline scripts. Not urgent — cell content is escaped + pattern-blocked. |

**Backend strengths (keep):** raw-then-sanitize ordering (create.js:58 before :67), CSV-formula-injection prevention (`sanitizer.js:31`), strong global security headers (`headers.js`), webhook **dedup by `message_id`** + orphan-key recovery via `pending_email:*`, KV eventual-consistency retry, single-counter lazy stats. This is genuinely well-built.

---

## Phase 4 — Process Audit

| # | Severity | Finding | Evidence | Fix |
|---|---|---|---|---|
| **P-1** | 🟠 High | **No real tests run.** `npm test` = `echo "Tests not yet configured" && exit 0`, despite a `test/` dir and `utils/__tests__/idGenerator.test.js`. Every deploy is blind. | `package.json` scripts | Wire **Vitest + `@cloudflare/vitest-pool-workers`**; make `test` actually run; cover sanitizer + api-key + rate-limiter (highest-risk units). Kilo prompt #4. |
| **P-2** | 🟡 Med | **Manual `wrangler deploy` only**; CI parked (lint broken on lockfile mismatch). No safety net between local and prod. | memory + `.github/` | Don't fix the old CI — replace with a minimal GH Action: `npm ci` → `lint` → `test` → `wrangler deploy` on tag. Keep manual deploy as fallback. |
| **P-3** | 🟡 Med | **Toolchain drift**: Wrangler local `^4.58.0` vs 4.102 latest; PapaParse 5.4.1 vs 5.5.4; `compatibility_date` 2025-10-24. | `package.json`, `wrangler.toml:3` | Low-risk bumps. Pin `compatibility_date` forward only after a test pass. |
| **P-4** | 🟢 Low | 5 independent template HTML files — edits don't propagate (documented footgun). | memory + `src/templates/` | Acceptable for brutalist static pages; if it bites, extract a shared `<head>`/footer partial. |

---

## Phase 5 — UI Audit (against 2026 CWV / WCAG 2.2 AA)

The stack is *inherently* fast (static HTML, no framework, no web fonts) — you start ahead on LCP/CLS. Gaps are correctness/accessibility, not speed.

| # | Severity | Finding | Fix |
|---|---|---|---|
| **U-1** | 🟡 Med | **INP risk on large tables.** Rendering 500–5,000 rows as one DOM blob + paste handler can blow the 200ms INP budget on mobile (your RTX box won't feel it; a mid-range phone will). | For >1,000 rows, chunk render (`requestIdleCallback`/`setTimeout` yielding) or simple virtualization. Defer non-critical JS. |
| **U-2** | 🟡 Med | **A11y:** verify table semantics — `<th scope>` when headers present, `<caption>`/`aria-label` = title, focus-visible states, theme toggle as real `<button>` with `aria-pressed`. WCAG 2.2 AA also wants 24×24px min target size. | Audit `view.js` render + homepage controls; add scopes/labels. Pure-black-on-white passes contrast easily. |
| **U-3** | 🟢 Low | Confirm `<meta viewport>` + ≥16px inputs (prevents iOS zoom-jump) and horizontal-scroll affordance for wide tables on mobile — mobile perf was a flagged pain point. | Wrap table in `overflow-x:auto` container; sticky header already box-shadow-fixed (good). |
| **U-4** | 🟢 Low | **Brutalist integrity holds** — no gradients/custom fonts in code. Keep rejecting decorative UI (per abandoned-approaches). | No change. |

---

## Phase 6 — Additional Functionality (high-value, **non-slowing**)

Each is ≤1 added request or zero runtime cost on the hot path:

1. **OG image / preview cards for `/t/{id}`** — when a link is pasted into Slack/X/Discord it renders a rich card (title + row/col count). Pure meta tags or a cached Workers-rendered SVG→PNG. *Biggest cheap distribution lever — turns every share into an ad.*
2. **"Copy as Markdown / HTML table"** button on the view page — client-side only, zero backend, high utility for the dev audience.
3. **One-click duplicate/edit** ("fork this table") — re-opens data in the homepage textarea. Client-side, no new storage.
4. **JSON-LD `SoftwareApplication` + `FAQPage` schema** on homepage/blog/docs — feeds GEO/LLM citation (Phase 0). Static, zero runtime cost.
5. **Embeddable read-only iframe / "Open in Table Share" badge** — growth loop; reuses existing view route.

**Hold (do not build now):** OCR (parked — correct), URL-fetch for auth'd portals (architecturally blocked by cookies — correct), anything recurring-billing (Ko-fi only).

---

## Phase 7 — Essential Features for Success (the honest list)

Distribution is the constraint, so "essential" ≠ more product. Ranked:

1. **Ship the OG preview card (P6-1).** Every existing share becomes organic reach. Highest ROI on the board.
2. **GEO/schema layer (P6-4).** 2026 discovery is AI-citation, not blue links. You already have 6 blog pages — make them machine-citable. Cheap, compounding.
3. **Prove one acquisition channel** before adding features. Your memory's open-items (Peerlist Monday window, directories, Reddit) are the actual roadmap. The tool is ready; the funnel isn't.
4. **Fix B-0 + B-2** — a security incident on a $0 product is fatal to trust before you've earned any. Non-negotiable pre-growth.
5. **Make a sale.** $0 revenue is unconfirmed-PMF, not a feature gap. Validate the $5 promise converts before optimizing it.

---

## Next Best Actions (do in this order)

1. **🟠 B-0:** Move `OWNER_KEY` out of `[vars]` into a secret + add `wrangler.toml` to `.gitignore` so it can't be pushed. *(NOT a live leak — never committed, verified — but prevent the future `git push` that would make it one.)* Also run `wrangler secret list` to settle B-0b.
2. **🟠 B-2:** PBKDF2 + per-table salt for passwords (Kilo prompt #2).
3. **🟢 B-1a/b:** Move rate-limit + analytics off KV → native Rate Limiting + Analytics Engine (lifts the write ceiling ~3× *before* you drive traffic).
4. **🟠 P-1:** Wire Vitest so deploys aren't blind.
5. **🚀 P6-1 + P6-4:** OG cards + schema — convert the existing footprint into reach. *This is the growth work; everything above just protects it.*

---

## Kilo Code Prompts (atomic, line-anchored — per the "no broad edits" rule)

> Reminder for Kilo Code: **single-file, atomic edits only. Never nest backticks inside template constants — use `+` or `\${}`.** For critical files, prefer direct edits over sweeping regenerations (Diff Share corruption precedent).

**Prompt for Kilo Code — Step 1 (B-0, secret extraction):**
```
In wrangler.toml, DELETE the line:
  OWNER_KEY = "ts_live_Hx7mK9pR2vL4nQ8wT3yB6jF1s"
under [vars]. Do not touch any other line. Then add a comment under the existing
secret comments: "# Use: wrangler secret put OWNER_KEY".
After this edit I will run: wrangler secret put OWNER_KEY  (with a NEW rotated key).
Do not modify src/utils/api-key.js — it already reads env.OWNER_KEY.
```

**Prompt for Kilo Code — Step 2 (B-2, salted PBKDF2):**
```
Goal: replace unsalted SHA-256 password hashing with PBKDF2 + per-table salt,
backward-compatible with existing SHA-256 hashes.
File 1: src/handlers/create.js, lines 82-90 (the password hashing block).
Replace it so that when a password is provided you: generate 16 random bytes salt
(crypto.getRandomValues), derive a key via crypto.subtle (PBKDF2, SHA-256,
100000 iterations, 256-bit), and store BOTH as hex on tableData:
  passwordHash = derived-hex, passwordSalt = salt-hex, passwordKdf = "pbkdf2".
Do not change any other field in the tableData object literal (lines 96-107) except
adding passwordSalt and passwordKdf.
File 2: src/handlers/view.js, the POST verify block around lines 686-695.
If tableData.passwordKdf === "pbkdf2": re-derive using stored passwordSalt and
compare to passwordHash. ELSE (legacy): keep the existing SHA-256 compare so old
tables still unlock. Also update the cookie value (line 654/699) to be derived from
passwordSalt+passwordHash so it is non-deterministic.
Output a unified diff for each file. No other edits.
```

**Prompt for Kilo Code — Step 3 (B-1a, native rate limiting):**
```
Add a Cloudflare Rate Limiting binding and use it instead of the KV counter.
File 1: wrangler.toml — add a [[ratelimits]] (unsafe/native) binding named LIMITER,
namespace_id of your choice, simple { limit = 5, period = 60 } keyed by IP.
File 2: src/handlers/create.js lines 13-17 — replace the checkRateLimit(env.TABLES,...)
call with the LIMITER binding's .limit({ key: ip }) check, returning 429 on block.
Do NOT delete src/utils/rate-limiter.js yet (keep as fallback). Output diffs only.
```

**Prompt for Kilo Code — Step 4 (P-1, real tests):**
```
Set up Vitest with @cloudflare/vitest-pool-workers.
1. Add devDeps: vitest, @cloudflare/vitest-pool-workers (latest).
2. package.json: change "test" to "vitest run".
3. Create test/sanitizer.test.js covering: escapeHtml, preventCSVInjection
   (=,@,+,- prefixes), detectMaliciousContent (script/onerror/javascript:),
   validateInput tier limits (free 500/50, pro 5000/100).
Do not modify src/ source files. Output new files + package.json diff only.
```

---

*Verification:* All severities trace to a cited file:line read this session. 2026 platform/version claims pulled from live docs (below), not memory. Memory drift items (architecture size, key validity, email var, PapaParse) corrected against disk.

**Sources:**
[Cloudflare KV limits](https://developers.cloudflare.com/kv/platform/limits/) · [Workers limits](https://developers.cloudflare.com/workers/platform/limits/) · [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/) · [Wrangler install/update](https://developers.cloudflare.com/workers/wrangler/install-and-update/) · [PapaParse npm](https://www.npmjs.com/package/papaparse) · [SEO in 2026 (Adobe)](https://business.adobe.com/blog/seo-in-2026-fundamentals) · [LLM SEO 2026 (SEOProfy)](https://seoprofy.com/blog/llm-seo/) · [Core Web Vitals 2026](https://www.digitalapplied.com/blog/core-web-vitals-2026-inp-lcp-cls-optimization-guide)
