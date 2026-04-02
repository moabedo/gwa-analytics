/**
 * Token store — persists in module-level Map (survives warm container).
 * Seeds from SHOPIFY_TOKENS env var (JSON string) on cold start.
 * After OAuth, tokens are both stored here AND returned to the admin.
 */

const tokens = new Map();

// Seed from env var on startup  (set via Vercel dashboard for persistence)
if (process.env.SHOPIFY_TOKENS) {
  try {
    const seeded = JSON.parse(process.env.SHOPIFY_TOKENS);
    for (const [shop, token] of Object.entries(seeded)) {
      tokens.set(normalizeShop(shop), token);
    }
    console.log(`[store] Seeded ${tokens.size} tokens from env`);
  } catch (e) {
    console.error('[store] Failed to parse SHOPIFY_TOKENS env var:', e.message);
  }
}

function normalizeShop(shop) {
  if (!shop) return '';
  shop = shop.toLowerCase().trim();
  if (!shop.includes('.')) shop = shop + '.myshopify.com';
  return shop;
}

export function setToken(shop, token) {
  tokens.set(normalizeShop(shop), token);
}

export function getToken(shop) {
  return tokens.get(normalizeShop(shop));
}

export function getAllStores() {
  return Object.fromEntries(tokens);
}

export function hasStore(shop) {
  return tokens.has(normalizeShop(shop));
}

export { normalizeShop };
