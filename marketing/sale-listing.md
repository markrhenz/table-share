# Table Share - Sale Listing (paste-ready)

Metrics verified live 2026-11-26 via execute-now.ps1.

Free marketplaces to post on (0% listing fee):
- Acquire.com: https://acquire.com  (sell side, create listing)
- SideProjectors: https://www.sideprojectors.com  (list a project)
- AcquireBase: https://acquirebase.com

---

## Title
Table Share - paste-to-link CSV/Excel table sharing, $0 hosting, Product Hunt launched

## One-liner (140 chars)
Paste CSV or Excel data, get a shareable table link in seconds. No signup. Runs on Cloudflare's free tier at $0/month.

## Asking price
Open to offers

## Business model
Freemium. Free: 500 rows, 7-day links. Pro: $5 one-time via Ko-fi (5,000 rows, 90-day links, password protection, branding removal, REST API). Pro keys are issued and emailed automatically.

## Description
Table Share (table-share.org) solves one recurring problem: showing someone a table (SQL result, Excel range, CSV) without attaching a file, taking a screenshot, or setting up a Google Sheet with permissions.

Paste data, get an 8-character link auto-copied to clipboard, recipient sees a clean mobile-friendly table and can download CSV. No accounts on either side. Links expire automatically.

What is built and working:
- Full create/view flow with password-protected tables and auto-expiry
- Automated payments: Ko-fi webhook issues a Pro API key and emails it via Resend (with retry-safe idempotency and a pending-email recovery queue)
- Public key-recovery page, admin endpoints (list/revoke keys, pending emails, funnel)
- REST API with docs at /docs
- 5 SEO blog posts, sitemap, robots, per-table social preview cards
- Dark mode, rate limiting, CSV-injection protection, XSS-hardened (full security audit completed and deployed 2026)
- Analytics Engine event tracking for create/view funnel

## Metrics (honest)
- Launched November 2025, featured on Product Hunt
- 712 tables created (lifetime counter, Nov 26 2026), up from 220 in early Sep 2026
- 2 Pro keys issued against Ko-fi transactions to date
- Hosting cost: $0/month (Cloudflare Workers + KV free tier). Only cost is domain renewal.
- No paid marketing has been done. Directory and community distribution plan is written but not executed, so there is clear untapped upside.

## Tech stack
Cloudflare Workers, Workers KV, Analytics Engine, vanilla JS/HTML/CSS, PapaParse, Ko-fi, Resend.

## What's included
- Domain table-share.org
- Full source code and deployment config (wrangler)
- Brand, logo, screenshots, demo GIF, written marketing and directory-submission kit
- Product Hunt listing
- 30 days of handover support by email

## Reason for selling
Focusing on other projects and want it in the hands of someone who will grow it.

## Note for buyers
Source is public under MIT license. The sale covers the domain, brand, live product, existing users and links, Product Hunt presence, and the payment/key-delivery setup (Ko-fi account is swapped to the buyer's).
