export async function validateApiKey(key, kvNamespace) {
  if (!key || !key.startsWith('ts_live_')) {
    return { valid: false, tier: 'free' };
  }
  
  try {
    const keyData = await kvNamespace.get(`keys:${key}`);
    if (!keyData) {
      return { valid: false, tier: 'free' };
    }
    
    const parsed = JSON.parse(keyData);
    
    // Check if expired
    if (new Date(parsed.expiresAt) < new Date()) {
      return { valid: false, tier: 'free' };
    }
    
    return { valid: true, tier: parsed.tier };
  } catch (error) {
    console.error('API key validation error:', error);
    return { valid: false, tier: 'free' };
  }
}