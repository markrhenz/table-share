# Table Share — Invariants

This document defines non-negotiable product and architectural guarantees.
If behavior and this document disagree, the behavior is wrong.

---

## Free Tier Guarantees

- Tables MUST always be created for valid input.
- Default expiration is **7 days (604800 seconds)**.
- Hard limits:
  - 500 rows
  - 50 columns
- Free users MUST NEVER be blocked by Pro logic.
- Clicking “Generate” MUST succeed for Free usage.

---

## Pro Constraints

- Pro is a **one-time $5 purchase**.
- NO subscriptions.
- NO recurring billing.
- NO unlimited plans.
- Maximum expiration is **90 days (7776000 seconds)**.
- Pro features may enhance behavior but MUST NOT restrict Free usage.

---

## Backend Authority

- Backend behavior MUST NOT depend on frontend UI state.
- Frontend input is untrusted by default.
- All limits and enforcement occur server-side.
- `/api/create` is a stable contract, not an implementation detail.

---

## Change Policy

- Any change affecting pricing, limits, or expiration MUST update this file.
- Violating these invariants is a regression, not a feature.
