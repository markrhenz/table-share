# Table Share Product Rules

## CORE PRINCIPLES
1. **Minimalism First**: Every feature must pass the test: "Does this make sharing tables faster?" If no, reject it.
2. **Zero Friction**: No accounts, no signups, no complexity. Free tier must be fully functional.
3. **Speed Target**: <5 second workflow from paste to shareable link.
4. **Free Tier Limits**: 500 rows, 50 cols, 7-day expiry, 1MB size.
5. **Pro Tier Limits**: 5000 rows, 100 cols, 90-day expiry, 5MB size.

## TECHNICAL CONSTRAINTS
1. **Platform**: Cloudflare Workers only. No Node.js-specific APIs.
2. **Storage**: Cloudflare KV only. 25MB per value limit, 1GB total.
3. **No npm installs**: All dependencies via CDN (PapaParse).
4. **File imports**: Cannot import HTML/CSS files in Workers. Use template literals only.
5. **Syntax**: Always close braces. Always complete try-catch blocks.

## VALIDATION RULES
1. All table data must pass `validateInput()` in sanitizer.js
2. All cells must be sanitized with `sanitizeCell()` before storage
3. All user input must be XSS-escaped
4. Rate limit: 5 requests/minute per IP

## FILE ORGANIZATION
```
src/
├── index.js (main router, all HTML constants here)
├── handlers/
│   ├── create.js (table creation)
│   ├── view.js (table viewing)
│   └── kofi-webhook.js (payment webhook)
└── utils/
    ├── id-generator.js (8-char base62 IDs)
    ├── sanitizer.js (XSS prevention, validation)
    └── rate-limiter.js (IP-based rate limiting)
```

## BANNED PATTERNS
1. ❌ `import X from './file.html'` - Workers can't import HTML
2. ❌ Unclosed braces in if/try blocks
3. ❌ Duplicate utility files (pick ONE implementation)
4. ❌ Features that require accounts/login
5. ❌ localStorage (causes GDPR issues)
6. ❌ External APIs except payment processors

## REQUIRED PATTERNS
1. ✅ All HTML in template literals inside index.js
2. ✅ All routes inside `export default { async fetch() {}}` block
3. ✅ Error handling in all async functions
4. ✅ CORS headers on all responses
5. ✅ TTL on all KV writes (7 days free, 90 days pro)

## WHEN ASKED TO ADD FEATURES
Ask these questions BEFORE implementing:
1. Does this violate minimalism? (If yes, reject)
2. Does this slow down the <5s workflow? (If yes, reject)
3. Does this require accounts? (If yes, reject)
4. Does this fit free tier or pro tier?
5. Can this be done client-side instead of server-side?

## ERROR HANDLING
Always return proper error messages to frontend:
```javascript
throw new Error(result.error || 'Failed to generate link');
```
Never return generic "Error" - be specific.

## CURRENT ISSUES TO AVOID
1. Don't create duplicate files (id-generator vs idGenerator)
2. Don't put routes outside export default block
3. Don't forget to close HTML template literals
4. Don't import files that Workers can't load