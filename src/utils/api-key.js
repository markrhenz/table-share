export async function validateApiKey(key, kvNamespace, env) {
  if (!key || !key.startsWith('ts_live_')) {
    return { valid: false, tier: 'free' };
  }

  // Owner key check - reads from environment variable
  // Guard against an unset OWNER_KEY secret: without the length check, an
  // undefined env.OWNER_KEY compared against an undefined-ish key could grant
  // owner tier. Require a real, non-trivial secret to be configured.
  if (env && typeof env.OWNER_KEY === 'string' && env.OWNER_KEY.length >= 16 && key === env.OWNER_KEY) {
    return { valid: true, tier: 'owner' };
  }

  try {
    const keyData = await kvNamespace.get(`keys:${key}`);
    if (!keyData) {
      return { valid: false, tier: 'free' };
    }

    const parsed = JSON.parse(keyData);

    // Revoked keys are treated as free tier (existing tables they created remain accessible).
    if (parsed.revoked === true) {
      return { valid: false, tier: 'free' };
    }

    // Check if expired.
    // A record with a missing/garbage expiresAt yields an Invalid Date, and any
    // comparison against it is false — so the key would never expire. Fail CLOSED.
    const expiresAt = new Date(parsed.expiresAt);
    if (isNaN(expiresAt.getTime()) || expiresAt < new Date()) {
      return { valid: false, tier: 'free' };
    }

    // Only recognised tiers are honoured. A record missing 'tier' previously
    // returned tier: undefined, which produced TIER_LIMITS[undefined] downstream
    // and threw -> HTTP 500 on /api/create.
    if (parsed.tier !== 'pro' && parsed.tier !== 'owner') {
      return { valid: false, tier: 'free' };
    }

    return { valid: true, tier: parsed.tier };
  } catch (error) {
    console.error('API key validation error:', error);
    return { valid: false, tier: 'free' };
  }
}
