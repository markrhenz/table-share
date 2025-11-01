# Table Share Launch Checklist

## Pre-Launch (1 day before)

- [ ] Verify site is live and fast: https://table-share.org
- [ ] Test core workflow 10 times (paste → link → view)
- [ ] Test Pro tier with Ko-fi (buy your own key, verify webhook)
- [ ] Check analytics dashboard works: /analytics?key=YOUR_KEY
- [ ] Have demo GIF ready (< 2MB, hosted on Imgur or Giphy)
- [ ] Have homepage screenshot ready
- [ ] Write answers to expected questions:
  - "How do you prevent abuse?"
  - "Why not use X instead?"
  - "Open source plans?"
  - "Roadmap?"

---

## Day 1: Product Hunt Launch (6 AM PT)

**Why 6 AM PT:** Product Hunt's day resets at midnight PT. Launch early to maximize upvotes during peak hours (6 AM - 12 PM PT).

**Steps:**
1. Create Product Hunt account (if new)
2. Go to: https://www.producthunt.com/posts/new
3. Fill in:
   - Name: Table Share
   - Tagline: The fastest way to share a table
   - Link: https://table-share.org
   - Upload: Logo (PNG, 240x240)
   - Upload: Screenshots (homepage + demo GIF)
   - Description: (use copy from social-media-copy.md)
   - Topics: Developer Tools, Productivity, Data & Analytics
4. Submit → Wait for approval (~30 mins)
5. Once live:
   - Share on Twitter/X with #ProductHunt
   - Post in relevant Slack/Discord communities
   - Respond to EVERY comment within 30 minutes
6. Monitor throughout day - engage actively
7. Target: Top 10 of the day = success

---

## Day 1: Hacker News (Show HN) (9 AM PT)

**Why 9 AM PT:** HN traffic peaks 9 AM - 2 PM PT (US morning).

**Steps:**
1. Create HN account (if new, needs to age ~2 weeks for max visibility)
2. Go to: https://news.ycombinator.com/submit
3. Fill in:
   - Title: Show HN: Table Share – Ephemeral table sharing with zero signup
   - URL: https://table-share.org
4. Submit
5. Post copy from social-media-copy.md as first comment
6. Monitor for 4-6 hours - respond to every question/comment
7. Be humble, technical, and transparent
8. Target: Front page (>50 upvotes) = huge traffic spike

**HN Tips:**
- Don't ask for upvotes (against rules)
- Focus on technical details in comments
- If someone criticizes, acknowledge and discuss
- Share architecture decisions openly

---

## Day 2-3: Reddit Launch

**Subreddits to post (stagger posts by 12+ hours):**

1. **r/webdev** (1.5M members)
   - Best time: 8 AM ET (early US morning)
   - Use "Built a zero-friction table sharing tool" copy
   - Tag: [Project]

2. **r/SideProject** (400K members)
   - Best time: 10 AM ET
   - Use "Launched my side project" copy
   - Be personal, share journey

3. **r/InternetIsBeautiful** (17M members)
   - Title: "A simple tool to share tables without signup"
   - Link-only post (no text)
   - Risk: Can be hit-or-miss, but huge reach

4. **r/dataisbeautiful** (21M members)
   - Only if you have impressive usage stats/analytics visualization
   - Wait 1 week post-launch to share growth data

**Reddit Tips:**
- Don't spam multiple subreddits same day
- Engage in comments for 24-48 hours
- Don't be overly promotional
- Share genuine challenges/learnings

---

## Day 7: Follow-Up Analytics Post

After 1 week, create follow-up posts:

**Title ideas:**
- "Table Share launch results: X users, Y tables created in first week"
- "What I learned launching on PH/HN/Reddit simultaneously"
- "Built a free tool, made $X in first week from Pro tiers"

**Where to post:**
- r/SideProject (loves launch retrospectives)
- IndieHackers.com
- Twitter/X thread

---

## Ongoing Promotion (Weeks 2-4)

- [ ] Post in relevant Discord/Slack communities (ask permission first)
- [ ] Reach out to developer newsletters (e.g., TLDR, Console)
- [ ] Add to tool directories:
  - AlternativeTo.net
  - Tools.new
  - ProductHunt alternatives lists
- [ ] Create SEO content:
  - Blog: "5 Ways to Share Tables Without Screenshots"
  - Tutorial: "Integrating Table Share API with Python/Node"

---

## Success Metrics (Week 1)

- [ ] 500+ tables created
- [ ] 2,000+ views
- [ ] 5+ Pro conversions ($25 revenue)
- [ ] 50+ upvotes on HN or PH
- [ ] 20+ quality comments/feedback

**If metrics hit, double down on successful channel.**
**If metrics miss, analyze feedback and iterate MVP.**

---

## Expected Questions & Answers

**Q: How do you prevent abuse?**
A: Rate limiting (5 req/min per IP), XSS prevention, malicious content detection, auto-expiration after 30 days, and a report abuse link on every table.

**Q: Why not just use Google Sheets?**
A: Table Share is for ephemeral snapshots, not collaborative editing. No accounts, instant links, auto-expires. Google Sheets is overkill for "here's a quick table."

**Q: Open source plans?**
A: Considering it! Want to clean up code first and add docs. Would love community feedback on what parts to open-source first.

**Q: Roadmap?**
A: Currently stable MVP. Considering: Excel file upload, JSON/XML output formats, embeddable tables, team analytics. Open to suggestions!

**Q: How do you make money?**
A: Pro tier ($5 one-time) for power users needing 5K rows, custom expiration, passwords, API access. Free tier covers 90% of uses.

**Q: Security concerns?**
A: All input sanitized (XSS prevention), data encrypted in transit (HTTPS), rate limiting, no PII collected, auto-delete after 30 days.

**Q: Tech stack details?**
A: Cloudflare Workers (edge functions), Cloudflare KV (storage), PapaParse (parsing), vanilla JS (<5KB). Zero cold starts, sub-100ms globally.
