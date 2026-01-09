# Security Documentation - Table Share

## Threat Model

This document outlines the security measures implemented in Table Share and explicitly states what threats we protect against and what is outside our scope.

---

## What We Protect Against

### 1. Cross-Site Scripting (XSS)
**Protection:** All user-provided content (table data, titles) is escaped before rendering in HTML.
- `escapeHtml()` function sanitizes `<`, `>`, `&`, `"`, `'` characters
- Malicious patterns like `<script>`, `javascript:`, `onerror=` are detected and rejected
- Content-Security-Policy header restricts script execution to trusted sources

### 2. CSV Injection (Formula Injection)
**Protection:** Cell values starting with `=`, `+`, `-`, `@`, `\t`, `\r` are prefixed with a single quote.
- Prevents malicious formulas from executing when users download and open CSV in Excel/Sheets
- Example: `=HYPERLINK("http://evil.com")` becomes `'=HYPERLINK("http://evil.com")`

### 3. Rate Limiting / DoS
**Protection:** IP-based rate limiting via Cloudflare KV
- Maximum 5 table creations per minute per IP
- Honeypot field for basic bot detection
- Rate limit counters reset automatically via KV TTL

### 4. Brute Force (Password-Protected Tables)
**Protection:** SHA-256 hashed passwords
- Passwords are hashed before storage; plaintext never stored
- HttpOnly, SameSite=Strict cookies for session management
- Future improvement: Consider Argon2 for better brute-force resistance

### 5. Clickjacking
**Protection:** HTTP headers prevent embedding
- `X-Frame-Options: DENY`
- `Content-Security-Policy: frame-ancestors 'none'`

### 6. Webhook Replay Attacks
**Protection:** Transaction deduplication for Ko-fi webhooks
- Each transaction ID is stored in KV with 30-day TTL
- Duplicate webhooks return 200 but don't process again

### 7. Data Exposure
**Protection:** Privacy by default
- Links use unguessable 8-character base62 IDs (~218 trillion combinations)
- Data auto-expires (7 days free, 90 days Pro)
- No user accounts = minimal PII stored

---

## What We DON'T Protect Against

### 1. Distributed Denial of Service (DDoS)
**Mitigation:** Cloudflare's network provides basic DDoS protection at the infrastructure level. Application-level DDoS is not explicitly handled beyond rate limiting.

### 2. Data-at-Rest Encryption
**Status:** Data is stored in Cloudflare KV without application-level encryption. Cloudflare provides infrastructure-level encryption, but we don't add an additional layer.

### 3. End-to-End Encryption
**Status:** Data is encrypted in transit (HTTPS) but not end-to-end encrypted. Operators with KV access could theoretically read table contents.

### 4. Advanced Bot Detection
**Status:** Simple honeypot field only. Sophisticated bots or AI-generated spam could bypass this. Consider adding CAPTCHA for high-risk scenarios.

### 5. Content Moderation
**Status:** No automated content scanning for illegal/harmful material. "Report Abuse" link available but moderation is manual.

### 6. Audit Logging
**Status:** No comprehensive audit trail. Basic analytics tracking exists but not security-focused audit logs.

---

## Security Headers

All responses include:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' cdn.jsdelivr.net scripts.simpleanalyticscdn.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://api.simpleanalytics.io; frame-ancestors 'none'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
```

---

## Recommendations for Users

1. **Sensitive Data:** Use password protection (Pro feature) for any data that shouldn't be publicly accessible
2. **Temporary Sharing:** Rely on auto-expiration for ephemeral data sharing
3. **No PII:** Avoid sharing personally identifiable information in unprotected tables
4. **Verify Links:** Always verify table-share.org domain before entering passwords

---

## Reporting Security Issues

Email: markrhenz@table-share.org

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact

We aim to respond within 48 hours.

---

## Version History

| Date | Change |
|------|--------|
| 2026-01-09 | Initial threat model documentation |
| 2026-01-09 | Added CSP headers |
| 2026-01-09 | Added webhook deduplication |
