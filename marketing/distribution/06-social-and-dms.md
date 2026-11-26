# Social Media + DM Templates — Bluesky, Mastodon, Direct Outreach

Lower volume than Reddit/HN but less spam-filtered. Each post takes 5 min. Run weekly until traction hits.

---

## BLUESKY (~30 min one-time setup, then weekly)

**Setup (one-time):**

1. Create account at https://bsky.app
2. Handle: `@markrhenz.bsky.social` or use your own domain as handle (free DNS verification via Cloudflare)
3. Profile bio:
```
Built table-share.org — share tables in 5 seconds, no signup. Solo dev. Davao, PH.
```
4. Profile pic: same logo as Table Share
5. Follow these accounts (high-signal, often boost indie tools):
   - `@simonwillison.net` (Datasette creator)
   - `@dhh.bsky.social` (Rails)
   - `@levelsio.bsky.social` (indie hacker)
   - `@swyx.io` (devtools community)
   - `@adamwathan.me` (Tailwind)
   - `@steve.dotnet.social` if developer-leaning
6. Reply to 3-5 of their posts thoughtfully BEFORE you post your tool. Build presence first.

**Your launch post (use after a few days of presence-building):**

```
Built table-share.org out of frustration with how hard it still is to share a one-off table.

Screenshot → Slack. CSV → email. Sheet → permissions hell.

Now: paste data, get a link, no signup either side. Free up to 500 rows. Auto-expires.

Feedback welcome.

[attach: homepage-hero.png]
```

**Weekly follow-up posts (one per week, don't spam):**

- Week 2 post:
```
A pattern I keep seeing: screenshots of SQL output in Slack threads.

The data is right there, just not in a shape anyone can search or copy.

If your team does this, try table-share.org instead — paste, link, share. Free up to 500 rows.

(Built it for exactly this.)
```

- Week 3 post (educational, not promotional):
```
CSV parsing edge case that broke my parser three times: cells with newlines inside.

A TEXT column containing line breaks splits the row unless properly quoted. PapaParse handles it correctly when the database emits quoted CSV. The pretty-print +---+ borders from psql do not.

Use psql --csv or mysql --batch.
```

- Week 4 post:
```
Distribution week recap. Solo dev, 6 months post-launch, going from 53 → 500 lifetime users.

What worked so far: directory submissions, Reddit comments on existing threads, this thread.

What didn't: trying to relaunch on ProductHunt, generic tweets.

Will share Pro conversion numbers when there's anything statistically meaningful.
```

---

## MASTODON (~15 min one-time setup)

**Choose server:** `fosstodon.org` (developer-focused, moderate)

**Setup:**

1. Create account
2. Bio:
```
Indie dev building table-share.org — share tables in 5 seconds, no signup. Cloudflare Workers + KV stack. Solo, Davao PH.
```

**First post:**

```
Built table-share.org because screenshotting SQL results into Slack is the default workflow in 2026 and that's absurd.

Paste data → instant shareable HTML table link → recipient sees a clean read-only page. No signup either side. Free up to 500 rows. Cloudflare Workers backend.

Feedback welcome.

#webdev #devtools #foss #SelfHosted

[attach: homepage-hero.png]
```

Hashtags matter on Mastodon — these get the post into hashtag feeds where people browse.

**Follow:**
- `@simon@fedi.simonwillison.net`
- Anyone in #devtools or #webdev hashtag feeds

---

## DIRECT DMs TO ADJACENT TOOL FOUNDERS

**Why this works:** founders of related tools are extremely likely to reply, sometimes to tweet about your thing. Free word-of-mouth from people with audience.

**Target list (5 people):**

| Person | Their tool | Why related | Find them on |
|---|---|---|---|
| Simon Willison | Datasette | Tables, data sharing | Bluesky / Twitter |
| Rauchg | Vercel | Edge compute, dev UX | Twitter |
| Levelsio | Nomad List, etc. | Indie maker spirit | Twitter |
| Adam Wathan | Tailwind | Single-purpose tool design | Twitter |
| Tobias Koppers | webpack | Build tools | Twitter |

**Don't pick competitors.** Pick adjacent tools whose audience overlaps with yours but where you're not stealing customers.

**DM template:**

```
Hi [name],

Big fan of [their tool] — specifically [one specific thing you actually appreciate about it].

Built table-share.org for an adjacent niche: read-only ephemeral table sharing, no signup. Different problem from yours but probably overlapping audience.

Curious if you'd take 30 seconds to look and tell me what's missing/wrong. Brutal honesty appreciated.

(No newsletter ask, no "could you tweet about it" ask — just feedback if you have a moment.)

Mark
markrhenz@table-share.org
```

**Critical rules:**
1. **Mention something specific you appreciate about their work.** Generic "love your stuff" gets ignored.
2. **Don't ask for anything except feedback.** No promotion ask up front. If they like it, they'll share unprompted.
3. **Don't follow up.** If they don't reply in 7 days, move on. Founders ignore follow-up DMs.
4. **Don't DM more than 5 people total in a month.** Saturates your name.

---

## EXPECTED OUTCOMES

After 4 weeks of consistent social + DM work:

| Channel | Expected new visits/mo | Expected pro conversions/mo |
|---|---|---|
| Bluesky | 50-300 | 0-1 |
| Mastodon | 20-100 | 0-1 |
| DM responses | 0-3 (counts as wins) | 0 |

Small numbers individually. **Add up to a baseline of consistent traffic.** Not the firehose, but the foundation that makes other channels (HN, IH, newsletters) hit harder when they do.

---

## TRACKING

Save in `marketing/distribution/social-tracker.md`:

```
| Week | Bluesky post | Mastodon post | DMs sent | Replies | Visits to TS |
|------|--------------|---------------|----------|---------|--------------|
| 1 | launch | launch | 2 | 0 | |
| 2 | follow-up 1 | (skip) | 1 | 1 | |
| 3 | follow-up 2 | educational | 1 | 0 | |
| 4 | recap | recap | 1 | 1 | |
```

The metric that matters: **visits to Table Share from social referrers** (visible in Cloudflare Web Analytics). If after 4 weeks that's flat, drop social and double-down on Reddit + directories.
