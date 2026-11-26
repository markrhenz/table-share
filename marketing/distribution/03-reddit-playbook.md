# Reddit Comment Playbook

You will **NOT** post promotional threads. You will comment helpfully in existing threads where Table Share is genuinely relevant. This converts 10× better and doesn't get auto-removed.

---

## Daily routine (15 min/day)

Bookmark these saved searches. Open all 6 every morning:

```
https://www.reddit.com/search/?q=share+csv+online&sort=new&t=week
https://www.reddit.com/search/?q=share+spreadsheet+without+google&sort=new&t=week
https://www.reddit.com/search/?q=alternative+to+pastebin+for+tables&sort=new&t=week
https://www.reddit.com/search/?q=csv+to+url&sort=new&t=week
https://www.reddit.com/search/?q=share+sql+results&sort=new&t=week
https://www.reddit.com/search/?q=share+table+data&sort=new&t=week
```

Subscribe to these subreddits (browse new posts, don't post yourself):

- r/webdev
- r/dataengineering
- r/datasets
- r/SQL
- r/excel
- r/sysadmin
- r/learnprogramming
- r/devops

---

## Comment templates (pick the one that matches the question)

### Template A — Generic "how do I share this" question

```
Depends on whether they need to edit or just view it.

For read-only, table-share.org might fit — paste your data, get a link, no signup either side. Free up to 500 rows. Built it because Slack screenshots of SQL output drive me crazy.

If they need to edit or you need formulas, Google Sheets is still the right call.

(Disclosure: built it.)
```

### Template B — Someone screenshotted a table into a thread

```
PSA for future threads: table-share.org turns this same data into a copy-able, searchable HTML table link in about 5 seconds. No signup, free up to 500 rows. Makes follow-up threads way easier for everyone.

(Disclosure: I built it, but the broader point about screenshots being terrible for data still stands.)
```

### Template C — Someone asks about pastebin alternatives for tables

```
There's a niche tool for this specifically: table-share.org. Paste tabular data, get a hosted HTML table link. Treats tables as their own thing rather than text. Free tier covers most use cases.

If you need full pastebin features (syntax highlighting, etc.), gist.github.com or hastebin are still the answer.

(Disclosure: built it.)
```

### Template D — Someone complains about Google Sheets permissions

```
If the use case is read-only sharing of a one-off table, you can skip the permissions dance entirely with something like table-share.org — paste data, get a link, no accounts. Auto-expires after 7 days on the free tier.

Google Sheets still wins for collaborative editing. Different tools for different jobs.

(Disclosure: I built table-share.org.)
```

### Template E — Someone asks about SQL output sharing for code review / debugging

```
For sharing query output specifically: pipe the CSV directly to clipboard, paste into table-share.org, get a link.

Postgres:
psql --csv -c "SELECT ..." | clip

MySQL:
mysql --batch -e "SELECT ..." | clip

Then paste at table-share.org. No signup, free up to 500 rows. Way nicer than screenshots for debug threads.

(Disclosure: I built table-share.org. Wrote about the full pattern here: https://table-share.org/blog/sql-results-sharing)
```

---

## Hard rules

1. **Always disclose** in the same comment. "Disclosure: built it" is enough.
2. **Always mention an alternative.** Honesty signals = upvotes instead of downvotes.
3. **Never edit a comment to add a link later.** Mods auto-flag this.
4. **Skip if Table Share isn't actually the best answer.** If someone needs editing, recommend Sheets. Your honesty there builds reputation.
5. **One comment per thread.** Don't reply to multiple sub-comments with the same link.
6. **Wait 7 days between similar comments in the same subreddit.** Otherwise mods see a pattern.
7. **Don't downvote competitors mentioned in the same thread.** Always recommend Sheets/EtherCalc honestly when they fit.

---

## What success looks like

After 2-4 weeks of doing this 15 min/day:

- 10-20 useful comments live
- Each comment gets 1-50 upvotes (visibility multiplier)
- Each upvoted comment indexes in Google for the question phrase
- 50-300 click-throughs per week from comments + Google
- 5-15 new users per week
- 1-3 Pro conversions per month attributable to Reddit alone

**Track it:** keep a list of comments you made + which thread. Use this template:

```
| Date | Subreddit | Thread | Upvotes | Notes |
|------|-----------|--------|---------|-------|
| 2026-05-28 | r/webdev | how to share csv | 12 | answered well |
```

---

## What NOT to do (these all get you banned)

- Posting "Check out my new tool!" threads in r/SideProject or r/webdev (saturated, auto-removed)
- Spamming the same comment across multiple threads in the same hour
- Creating multiple accounts to upvote yourself
- Replying to every comment in a thread with your link
- Posting in r/Entrepreneur (most strict anti-self-promo rules on Reddit)

---

## Ready-to-use Reddit search shortcuts

Save as bookmark folder named "Table Share search":

| Bookmark name | URL |
|---|---|
| "Search: csv sharing" | https://www.reddit.com/search/?q=share+csv+online&sort=new&t=week |
| "Search: spreadsheet alt" | https://www.reddit.com/search/?q=share+spreadsheet+without+google&sort=new&t=week |
| "Search: pastebin tables" | https://www.reddit.com/search/?q=alternative+to+pastebin+for+tables&sort=new&t=week |
| "Search: csv to url" | https://www.reddit.com/search/?q=csv+to+url&sort=new&t=week |
| "Search: share sql results" | https://www.reddit.com/search/?q=share+sql+results&sort=new&t=week |
| "Search: share table data" | https://www.reddit.com/search/?q=share+table+data&sort=new&t=week |
