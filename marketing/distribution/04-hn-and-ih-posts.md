# Hacker News + Indie Hackers Posts — Pre-Written

Both posts ready to copy-paste. Edit personal details only.

---

## POST 1 — Hacker News "Ask HN"

**Posting time:** Tuesday or Wednesday, **6:00-8:00 AM Pacific** (when HN traffic peaks and US working hours haven't started crowding the front page). For you in Davao (PHT), that's **9:00-11:00 PM Tuesday or Wednesday night**.

**Where to post:** https://news.ycombinator.com/submit

**Title:**

```
Ask HN: What's your go-to method for sharing a one-off table in 2026?
```

**URL field:** Leave blank (this is an Ask HN, not a Show HN)

**Text:**

```
For context: 2026, billions invested in collaboration tools, and I still see developers screenshotting SQL results into Slack daily. Tried to figure out why.

The options all fail differently:
- Screenshot: not searchable, not copyable, useless on mobile
- Raw paste in chat: columns collapse the instant values vary in length
- CSV attachment: forces download before viewing, dies in Downloads folder
- Google Sheets: 5 minutes of file creation + permission fiddling for a 5-second task
- Markdown table generators: output code, not a hosted URL

The actual job seems clear: "show someone a 30-row table for 60 seconds, never again." But no tool I know of is built for exactly that. Everything assumes you want a living document.

What do you actually use? Genuinely curious if I'm solving a real problem or just my own.

Disclosure: I built table-share.org out of frustration with the above six months ago. Free tier handles 500 rows, no signup either side, links auto-expire. Open to brutal feedback on whether the niche is real.
```

**After posting:**

1. **Don't aggressively reply.** Let the discussion breathe.
2. Reply to substantive comments in **batches every 2-3 hours**, not in real time. Replying too fast looks like astroturfing.
3. **Address criticism honestly.** If someone points out a competitor, acknowledge it.
4. **Don't link-bomb.** Mention `table-share.org` once in the OP, then only when directly asked.
5. **Engage for ~24 hours** then let it die naturally.

**Realistic outcome:**
- Front page (top 30): 10% chance. If hit, 5,000-20,000 visits in 24h.
- Show HN sidebar / "new" section: high chance. 200-1,000 visits.
- Even if it sinks, the discussion is now indexed in Google forever.

---

## POST 2 — Indie Hackers Milestone Post

**Why this works:** IH community rewards transparency. Posts about struggles get 5-10× more engagement than "look at my win" posts. People bookmark transparency posters to follow the story.

**Where to post:** https://www.indiehackers.com/post (click "Milestone" or "Discussion" tag)

**Title:**

```
6 months post-launch. 53 lifetime users, ~$X revenue. Diagnosing my distribution problem.
```

(Replace X with your actual Pro purchase count × $5.)

**Tags:** `marketing`, `growth`, `milestone`, `solopreneur`

**Body:**

```
Built and launched table-share.org in November 2025. Solo project, Cloudflare Workers, ~500 lines of code. The pitch: paste a table, get a shareable link, no signup either side. Free up to 500 rows, $5 one-time Pro for higher limits + password protection.

6 months later:
- Lifetime tables created: 53
- Pro conversions: [your number]
- Revenue: $[your number]
- Total marketing spend: $0

Diagnosis I keep arriving at: 95% product, 5% marketing. I built a thing that works, polished it for months, then expected discovery to happen. It didn't. Producthunt launch in November was decent for a day, then silence.

The product side is genuinely solid now (full audit completed this week — fixed a perf bug on /api/stats that was nearly killing it, rewrote 5 blog posts for Google's 2026 information-gain requirements, added a /docs page, hardened the webhook). Tech debt is paid. The remaining gap is purely distribution.

This week I'm starting a 4-week structured push:
- Week 1: Submit to 10 directories (AlternativeTo, SaaSHub, G2, etc.)
- Week 2: Reddit comment strategy (NOT promotional posts — answer existing threads helpfully)
- Week 3: Ask HN reframe of the problem, plus newsletter pitches to Console.dev, Pointer, Bytes.dev
- Week 4: IH milestone posts (this one), Bluesky/Mastodon, direct DMs to adjacent dev tool founders

Goal: 53 → 500 lifetime users (the inflection point where shared links start creating their own loop).

Question for the community: at the 100-1000 user stage, what actually moved the needle for you? I keep reading "just keep building" and "your audience finds you" advice and I think both are wrong at this size. There has to be a more deliberate playbook.

Will report back in 4 weeks with results.
```

**After posting:**

1. Reply to every comment within 24h. IH community engagement is more intimate than HN — be conversational.
2. **Genuinely thank people for advice you'll use.** Don't dismiss things even if you disagree.
3. **DO follow up in 4 weeks** with the actual results — IH rewards follow-through. The "what happened" follow-up post often outperforms the original.

**Realistic outcome:**
- 50-200 upvotes, 20-80 comments
- 500-2000 visits to table-share.org from the post
- 5-15 IH community members will be following your story
- 1-3 of those will eventually convert to Pro out of solidarity + curiosity

---

## POST 3 (optional) — Show HN follow-up in 4 weeks

If after 4 weeks of the distribution push you have a real story, post a follow-up to HN:

**Title:**
```
Show HN: 4 weeks of distribution work after my Ask HN. Here's what worked.
```

This is a separate ticket — only write it when you have actual data. Don't write the post and then collect data to match it.

---

## Posting checklist (do this for each post)

- [ ] Logged in to HN / IH (use markrhenz username if you have one, not anonymous)
- [ ] Title under 80 chars
- [ ] No urgency words ("must read", "won't believe")
- [ ] Disclosure is explicit, not buried
- [ ] Tested all URLs work
- [ ] Posted at correct time zone
- [ ] Notification on for replies (so you can engage within 30 min of the first comments)
