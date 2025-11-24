# Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability in Table Share, please report it responsibly:

- **Email**: markrhenz2@gmail.com
- **Subject**: "Security Vulnerability Report - Table Share"
- **Please include**: Detailed description, steps to reproduce, potential impact

We take security seriously and will respond to vulnerability reports within 48 hours.

## Security Measures

### 1. Environment Variables & Secrets

**❌ NEVER commit secrets to version control!**

All sensitive credentials are stored as Cloudflare Workers secrets:

- `ADMIN_KEY` - Analytics dashboard access key
- `SENDGRID_API_KEY` - SendGrid API for email delivery
- `KOFI_TOKEN` - Ko-fi webhook verification token

**How to set secrets:**

```bash
wrangler secret put ADMIN_KEY
wrangler secret put SENDGRID_API_KEY
wrangler secret put KOFI_TOKEN
```

### 2. XSS Prevention

All user-submitted data is sanitized before rendering:

- HTML entities are escaped
- Script tags are stripped
- Dangerous attributes are removed
- See: `src/utils/sanitizer.js`

### 3. Rate Limiting

API endpoints are protected by rate limiting:

- **Create endpoint**: 10 requests per minute per IP
- **View endpoint**: 60 requests per minute per IP
- Uses Cloudflare KV for distributed rate limiting
- See: `src/utils/rate-limiter.js`

### 4. Content Security

- **Input validation**: Row and column limits enforced
- **Honeypot field**: Bot detection on submission
- **Password hashing**: SHA-256 for password-protected tables
- **Auto-expiration**: Tables auto-delete after TTL

### 5. HTTPS Only

All traffic is served over HTTPS through Cloudflare's edge network.

### 6. No PII Collection

- No user accounts or authentication
- No personal information stored
- IP addresses used only for rate limiting (not logged)
- GDPR/CCPA compliant by design

## Security Checklist for Deployment

Before deploying to production:

- [ ] All secrets configured via `wrangler secret put`
- [ ] `.env` file is in `.gitignore` and not committed
- [ ] `wrangler.toml` contains no hardcoded secrets
- [ ] Admin key is strong (min 32 characters, random)
- [ ] SendGrid API key has minimum required permissions
- [ ] Ko-fi webhook token is verified in Ko-fi dashboard
- [ ] Rate limiting is enabled and tested
- [ ] XSS sanitization is working correctly
- [ ] CORS headers are configured properly
- [ ] Error messages don't expose sensitive information

## Dependency Security

Run security audits regularly:

```bash
npm audit
npm audit fix
```

Keep dependencies up to date:

```bash
npm outdated
npm update
```

## Incident Response

In case of a security incident:

1. **Isolate**: Take affected systems offline if necessary
2. **Investigate**: Determine scope and impact
3. **Rotate**: Change all affected secrets immediately
4. **Notify**: Inform affected users if data was compromised
5. **Document**: Record incident details and response
6. **Prevent**: Update code and processes to prevent recurrence

## Security Best Practices

### For Developers

- Review all pull requests for security issues
- Never log sensitive information (API keys, passwords, tokens)
- Use parameterized queries (prevent injection attacks)
- Validate all user input on both client and server
- Keep dependencies updated and patched
- Use ESLint security plugins (`eslint-plugin-security`)

### For Operators

- Rotate secrets every 90 days minimum
- Monitor analytics for unusual patterns
- Set up alerts for rate limit violations
- Review Cloudflare security logs regularly
- Keep backup of KV namespace data
- Test disaster recovery procedures

## Third-Party Services

Table Share uses these third-party services:

| Service | Purpose | Data Shared |
|---------|---------|-------------|
| Cloudflare Workers | Hosting | Request metadata (IP, headers) |
| Cloudflare KV | Storage | Table data (auto-expires) |
| SendGrid | Email delivery | Email addresses (Pro users only) |
| Ko-fi | Payments | Transaction data (handled by Ko-fi) |

## License

This security policy is part of the Table Share project and is licensed under the ISC license.

## Last Updated

January 2025
