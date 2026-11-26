# Table Share Process & Security Audit

## Date: 2026-02-13
## Codebase Version: Post action-bar separation + auto-redirect update
## Files Audited: 14 files
- `src/index.js`
- `src/handlers/create.js`
- `src/handlers/view.js`
- `src/handlers/fetch-url.js`
- `src/handlers/analytics.js`
- `src/templates/homepage.js`
- `src/templates/pricing.js`
- `src/utils/sanitizer.js`
- `src/utils/id-generator.js`
- `src/utils/rate-limiter.js`
- `src/utils/api-key.js`
- `src/utils/headers.js`
- `src/utils/url-validator.js`
- `src/utils/analytics.js`

---

## CRITICAL (must fix before any promotion)

### SCENARIO 17: Owner key in source code
- **File:** [`src/utils/api-key.js`](src/utils/api-key.js:7)
- **Line/Function:** Line 7, `validateApiKey()`
- **Issue:** Hardcoded owner API key in plaintext source code
- **Detail:** The string `'ts_live_OWNER_MARK_ADMIN_KEY'` is hardcoded. If the GitHub repo is public, anyone can use this key to get owner-tier access (999,999 rows, 100MB, 10-year TTL). This bypasses all payment requirements.
- **Fix:** Move to environment variable via `wrangler.toml [vars]` or Cloudflare dashboard secrets. Access via `env.OWNER_KEY` instead of hardcoded string.

---

## HIGH (fix within 1 week)

### SCENARIO 9: Clipboard write race condition with auto-redirect
- **File:** [`src/templates/homepage.js`](src/templates/homepage.js:731)
- **Line/Function:** Lines 731-742, generate button click handler
- **Issue:** Async clipboard write may not complete before navigation
- **Detail:** `navigator.clipboard.writeText(result.url)` is called, then `window.location.href = result.url` is set immediately after without awaiting the clipboard promise. On slow devices or browsers, the navigation may cancel the pending clipboard write. The user sees "copied to clipboard" but the clipboard may be empty.
- **Fix:** Either await the clipboard write before redirect, or remove the auto-redirect and let users click the link. Consider: `await navigator.clipboard.writeText(result.url); window.location.href = result.url;`

### SCENARIO 12: Expired table page lacks theme support
- **File:** [`src/handlers/view.js`](src/handlers/view.js:560)
- **Line/Function:** Lines 560-571, table not found response
- **Issue:** "Table Not Found" and "Data Error" pages use inline hardcoded styles without dark mode support
- **Detail:** When a table expires (KV returns null), the error page uses `body style="font-family: sans-serif; text-align: center; padding: 50px;"` with white background assumptions. Compare to [`src/index.js`](src/index.js:39) `NOT_FOUND_HTML` which has proper CSS variables, theme detection, and logo styling. Users in dark mode see a jarring white page.
- **Fix:** Use the `NOT_FOUND_HTML` template from index.js, or create a shared error template with theme support.

### SCENARIO 10: Custom CSV parser doesn't handle embedded newlines in quoted fields
- **File:** [`src/handlers/fetch-url.js`](src/handlers/fetch-url.js:117)
- **Line/Function:** Lines 117-159, `parseCSV()` function
- **Issue:** URL fetch mode uses a custom CSV parser that splits by `\r?\n` first
- **Detail:** A CSV field like `"Line1\nLine2"` would be split across two "lines" and break parsing. PapaParse (used in paste mode) handles this correctly, but the server-side URL fetch uses a simplified parser. This causes data corruption for any CSV with embedded newlines in quoted fields.
- **Fix:** Either implement proper RFC 4180 CSV parsing that handles embedded newlines, or use a server-side CSV library. At minimum, document this limitation for URL fetch mode.

---

## MEDIUM (fix within 1 month)

### SCENARIO 4: Malicious content detection runs on sanitized data (dead code)
- **File:** [`src/handlers/create.js`](src/handlers/create.js:67)
- **Line/Function:** Lines 67-73, malicious content check loop
- **Issue:** `detectMaliciousContent()` runs AFTER `escapeHtml()`, making regex patterns ineffective
- **Detail:** XSS payloads like `<script>alert('xss')</script>` become `<script>alert('xss')</script>` before the check. The regex `/<script[\s>]/i` will NOT match escaped HTML. The malicious content filter gives false sense of security but XSS is still prevented by escaping.
- **Same issue in:** [`src/handlers/fetch-url.js`](src/handlers/fetch-url.js:179) lines 179-185
- **Note:** fetch-url.js step 8 (lines 108-114) correctly scans raw CSV text BEFORE sanitization - that check works.
- **Fix:** Either remove the dead code (post-sanitization check) or move it before sanitization. The pre-sanitization check in fetch-url.js is the correct pattern.

### SCENARIO 5: Unsalted SHA-256 password hashing
- **File:** [`src/handlers/create.js`](src/handlers/create.js:76)
- **Line/Function:** Lines 76-83, password hashing
- **Issue:** Password hashing uses SHA-256 without salt
- **Detail:** Same password always produces same hash. If an attacker gains access to KV data, they can rainbow-table common passwords. For a $5 ephemeral table sharing tool, this is acceptable but not ideal. The 1-hour cookie expiry limits exposure.
- **Fix:** Consider adding a pepper (server-side secret) or using bcrypt/scrypt. For Cloudflare Workers, consider `crypto.subtle.digest('SHA-256', encoder.encode(env.SECRET_PEPPER + password))`.

### SCENARIO 23: Empty column stripping treats `&` and `'` as "empty"
- **File:** [`src/handlers/view.js`](src/handlers/view.js:719)
- **Line/Function:** Lines 719-724, empty column detection
- **Issue:** Columns containing only `&` or `'` characters are silently removed
- **Detail:** The check `val === '&' || val === '''` treats escaped ampersand and single-quote as "empty". If a user's data legitimately has a column of `&` characters, that column gets stripped. This appears to be a bug from a previous sanitization issue.
- **Fix:** Remove the `&` and `''` checks. Only `val === ''` should indicate empty. Or document this as intentional behavior.

### SCENARIO 1: parseInt(undefined) edge case for expiry
- **File:** [`src/handlers/create.js`](src/handlers/create.js:34)
- **Line/Function:** Lines 33-44, expiry handling
- **Issue:** If `expiry` is undefined, `parseInt(undefined)` returns `NaN`
- **Detail:** The code checks `if (expiry)` before parsing, so this is guarded. However, if the frontend sends `expiry: undefined` in JSON (which becomes `undefined` in JS, not absent), the check passes but `parseInt` gets undefined. Actually, JSON.stringify omits undefined values, so this is not exploitable via API. But the hidden select always has a value (default "604800"), so this path is never hit in normal use.
- **Fix:** Add explicit validation: `if (expiry && !isNaN(parseInt(expiry)))`. Document that expiry is expected to be a string or number.

### SCENARIO 21: Size validation runs before sanitization
- **File:** [`src/utils/sanitizer.js`](src/utils/sanitizer.js:105)
- **Line/Function:** Lines 105-108, `validateInput()` size check
- **Issue:** 5MB limit checked on raw data, but sanitization can increase size
- **Detail:** A table with many `&`, `<`, `>`, `"`, `'` characters could pass the 5MB check but grow after HTML escaping (`&` → `&` is 5x larger). The KV limit is 25MB so this won't cause storage failure, but the user-facing error message says "max 5MB" while actual stored size could be larger.
- **Fix:** Either check size after sanitization, or account for worst-case expansion (5x for all ampersands) in the limit.

---

## LOW (track, fix when convenient)

### SCENARIO 2: Error message hardcoded color ignores dark mode
- **File:** [`src/utils/sanitizer.js`](src/utils/sanitizer.js:92)
- **Line/Function:** Line 92, validation error message
- **Issue:** Error HTML includes `style="color: #0066cc"` which ignores dark mode CSS variables
- **Detail:** In dark mode, the blue link `#0066cc` may have poor contrast against dark backgrounds. The error message is server-generated HTML injected via innerHTML, so it can't use CSS variables.
- **Fix:** Remove inline style and rely on the receiving page's CSS for link styling. Or use a class that the frontend can style.

### SCENARIO 7: Honeypot field not present in HTML form
- **File:** [`src/templates/homepage.js`](src/templates/homepage.js:702)
- **Line/Function:** Line 702, payload assembly
- **Issue:** Honeypot always sent as empty string `''`
- **Detail:** The honeypot check in [`create.js`](src/handlers/create.js:47) rejects submissions with truthy honeypot, but the frontend always sends `honeypot: ''`. There's no visible honeypot field in the HTML for bots to fill. This defense only works if bots auto-fill JSON fields named "honeypot" without a corresponding form field.
- **Fix:** Add a hidden honeypot field in the HTML: `<input type="text" name="website" id="honeypot" style="display:none" tabindex="-1" autocomplete="off">`. Or remove the check if not needed.

### SCENARIO 8: Rate limit boundary straddling
- **File:** [`src/utils/rate-limiter.js`](src/utils/rate-limiter.js:11)
- **Line/Function:** Line 11, minute bucket calculation
- **Issue:** Users can get 10 requests in 2 seconds by straddling minute boundary
- **Detail:** At 11:59:59.999, key is `rate-limit:{ip}:X`. At 12:00:00.001, key rolls to `rate-limit:{ip}:X+1`. A user sending 5 requests at second 59 and 5 more at second 00 gets 10 requests in 2 seconds.
- **Fix:** For a table-sharing tool, this is acceptable. If stricter enforcement needed, use sliding window or track per-second with per-minute aggregate.

### SCENARIO 13: Password cookie expires after 1 hour with no warning
- **File:** [`src/handlers/view.js`](src/handlers/view.js:650)
- **Line/Function:** Line 650, cookie Max-Age
- **Issue:** Password unlock cookie expires after 1 hour, user must re-enter password
- **Detail:** The cookie `ts_unlock_{id}` has `Max-Age=3600` (1 hour). After 1 hour of viewing a password-protected table, the user sees the password prompt again with no explanation. This may confuse users who just had the table open.
- **Fix:** Either extend cookie duration, show a "session expired" message, or refresh cookie on each view.

### SCENARIO 13: Cookie value is partial password hash
- **File:** [`src/handlers/view.js`](src/handlers/view.js:649)
- **Line/Function:** Line 649, cookie value generation
- **Issue:** Cookie contains first 16 chars of SHA-256 hash (64 bits of entropy)
- **Detail:** An attacker who obtains the cookie value has partial hash information. With 16 hex chars (64 bits), brute-forcing the remaining 192 bits is not trivial but the cookie is a weaker secret than the full hash. The cookie is HttpOnly and SameSite=Strict, limiting exposure.
- **Fix:** Consider using a random session token instead of hash-derived value, stored in KV with the table ID.

### SCENARIO 6: Row count grammar for single row
- **File:** [`src/handlers/view.js`](src/handlers/view.js:769)
- **Line/Function:** Line 769, rowCount calculation
- **Issue:** Single-row table shows "1 rows" (plural)
- **Detail:** When `noHeaders=true` and data has 1 row, the display shows "1 rows × X cols". Minor grammar issue.
- **Fix:** Use pluralization: `${rowCount} row${rowCount !== 1 ? 's' : ''}`.

### SCENARIO 19: Public stats endpoint exposes business intelligence
- **File:** [`src/handlers/analytics.js`](src/handlers/analytics.js:193)
- **Line/Function:** Lines 193-203, `handleStats()`
- **Issue:** `/api/stats` returns total table count without authentication
- **Detail:** Anyone can query the exact number of tables created in the last 30 days. This is displayed on the homepage anyway, so it's not secret. But it provides competitive intelligence.
- **Fix:** Acceptable for this product. If needed, add rate limiting or obscure the exact number (e.g., "10,000+ tables").

### SCENARIO 20: Theoretical KV key namespace collision
- **File:** [`src/utils/id-generator.js`](src/utils/id-generator.js:10)
- **Line/Function:** `generateId()` function
- **Issue:** 8-char alphanumeric ID could theoretically collide with rate-limit or key prefixes
- **Detail:** "rate-lim" is 8 chars and valid base62. If generated as an ID, `KV.get("rate-lim")` would return a rate limit string like "3", and `JSON.parse("3")` would crash the view handler. Probability: 1 in 62^8 (218 trillion). Negligible but not zero.
- **Fix:** Reserve certain ID patterns or use a different ID format (e.g., always start with a letter). Or add a prefix to table IDs like `tbl_`.

---

## PASSED (confirmed working correctly)

### SCENARIO 1: First-time free user pastes 10 rows
- **File:** [`src/handlers/create.js`](src/handlers/create.js)
- **Line/Function:** Full flow
- **Issue:** PASS
- **Detail:** Homepage loads with PapaParse from CDN. Theme detected from localStorage or prefers-color-scheme. Paste event triggers button display. Papa.parse auto-detects delimiter. Payload assembled correctly. POST to /api/create. Rate limit checked (5/min). Data validated (500 rows max for free). Cells sanitized. ID generated. KV stored with TTL. Response returned. Auto-redirect fires. History saved to localStorage. All steps work as expected.

### SCENARIO 3: CSV with quoted fields containing commas
- **File:** [`src/templates/homepage.js`](src/templates/homepage.js:687)
- **Line/Function:** Lines 687-693, PapaParse config
- **Issue:** PASS
- **Detail:** PapaParse config includes `quoteChar: '"'` and `escapeChar: '"'`. Input `"Smith, John",30,"New York, NY"` correctly parses to `[["Smith, John", "30", "New York, NY"]]`. Embedded newlines inside quotes are handled by `skipEmptyLines: true` which only skips entirely empty lines, not lines within quoted fields.

### SCENARIO 4: XSS attempt - script tag in cell
- **File:** [`src/utils/sanitizer.js`](src/utils/sanitizer.js:45)
- **Line/Function:** `sanitizeCell()` function
- **Issue:** PASS (XSS prevented, though malicious content filter is dead code)
- **Detail:** `<script>alert('xss')</script>` becomes `<script>alert('xss')</script>` via `escapeHtml()`. When rendered in view.js, it displays as literal text `<script>alert('xss')</script>`. XSS is blocked. The malicious content check in create.js step 10 is dead code but doesn't affect security.

### SCENARIO 14: CSV download correctly handles escaped content
- **File:** [`src/handlers/view.js`](src/handlers/view.js:400)
- **Line/Function:** Lines 400-430, `downloadCSV()` function
- **Issue:** PASS
- **Detail:** `cell.textContent` extracts text, auto-decoding HTML entities. Original `<script>` stored as `<script>` renders as `<script>` in textContent, downloads as `<script>` in CSV. CSV injection prevented by `preventCSVInjection()` which adds `'` prefix to cells starting with `=@+-`. The prefix is preserved through the download flow.

### SCENARIO 15: Mobile view CSS
- **File:** [`src/handlers/view.js`](src/handlers/view.js:218)
- **Line/Function:** Lines 218-336, mobile CSS
- **Issue:** PASS
- **Detail:** `.table-wrapper` has `overflow-x: auto`, `max-height: 60vh` on mobile. `th:first-child` is sticky at `left: 0`. Scroll gradients via `::before` and `::after` pseudo-elements. Expand button toggles `.expanded` class. Action bar has proper border styling. All mobile CSS works as designed.

### SCENARIO 16: CORS configuration
- **File:** [`src/utils/headers.js`](src/utils/headers.js:6)
- **Line/Function:** Lines 6-17, `corsHeaders` object
- **Issue:** PASS
- **Detail:** `Access-Control-Allow-Origin: *` allows any website to POST to /api/create. Rate limiting (5/min per IP) is the defense. Clipboard API requires user gesture and permission, preventing cross-origin clipboard theft. Open CORS is standard for public APIs.

### SCENARIO 18: CSP allows unsafe-inline
- **File:** [`src/utils/headers.js`](src/utils/headers.js:11)
- **Line/Function:** Line 11, Content-Security-Policy
- **Issue:** PASS (acceptable for current architecture)
- **Detail:** `script-src 'unsafe-inline'` would allow injected scripts to execute. However, all user content is HTML-escaped in create.js. The risk is if a future code change introduces an injection point. Currently safe but fragile. The CSP also includes `frame-ancestors 'none'` preventing clickjacking.

### SCENARIO 22: Unicode data handling
- **File:** [`src/utils/sanitizer.js`](src/utils/sanitizer.js:6)
- **Line/Function:** `escapeHtml()` function
- **Issue:** PASS
- **Detail:** `escapeHtml()` only replaces `&<>"'`. Unicode passes through unchanged. KV stores as UTF-8. JSON.stringify handles Unicode correctly. Font stack supports CJK and emoji on modern OS. Japanese, emoji, Arabic all work correctly.

### SCENARIO 24: Title with XSS
- **File:** [`src/handlers/create.js`](src/handlers/create.js:23)
- **Line/Function:** Line 23, title sanitization
- **Issue:** PASS
- **Detail:** `<img src=x onerror=alert(1)>` as title is escaped via `escapeHtml(title.trim().substring(0, 100))`. Result: `<img src=x onerror=alert(1)>`. Rendered safely in view.js template literal. Server-side sanitization always runs, even for direct API calls.

### SCENARIO 25: Concurrent table creation race condition
- **File:** [`src/utils/id-generator.js`](src/utils/id-generator.js:29)
- **Line/Function:** `generateUniqueId()` function
- **Issue:** PASS (probability negligible)
- **Detail:** Two simultaneous requests generate different IDs (probability: 1 in 218 trillion for collision). Both check KV, both get null, both write different IDs. No collision. If somehow same ID generated, second write overwrites first. Probability is astronomically low.

---

## SUMMARY

| Severity | Count | Description |
|----------|-------|-------------|
| CRITICAL | 1 | Owner key in source code |
| HIGH | 3 | Clipboard race condition, theme-less error pages, CSV parser limitation |
| MEDIUM | 5 | Dead code, unsalted hashes, column stripping bug, expiry edge case, size check timing |
| LOW | 7 | Minor UX issues, theoretical edge cases |
| PASSED | 10 | Core functionality working correctly |

### Priority Actions

1. **IMMEDIATE:** Move owner API key to environment variable
2. **THIS WEEK:** Fix clipboard race condition, add theme support to error pages, document CSV parser limitation
3. **THIS MONTH:** Clean up dead code, improve password hashing, fix column stripping logic

### Overall Assessment

The Table Share codebase is **well-structured and generally secure**. The core XSS prevention via HTML escaping is solid. The main concerns are:

1. **Security:** The hardcoded owner key is the only critical issue
2. **UX:** Error pages lack dark mode support, clipboard may fail silently
3. **Data Integrity:** URL fetch CSV parser has limitations with embedded newlines

The codebase follows good practices with centralized header management, consistent sanitization, and proper rate limiting. The identified issues are mostly edge cases and minor improvements rather than fundamental flaws.
