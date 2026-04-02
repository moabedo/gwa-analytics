/**
 * GET /api/callback?code=...&shop=...&state=...
 * Handles Shopify OAuth callback — exchanges code for access token.
 */

import { setToken } from '../../lib/store';

export default async function handler(req, res) {
  const { code, shop, hmac, state } = req.query;

  if (!code || !shop) {
    return res.status(400).json({ error: 'Missing code or shop' });
  }

  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

  try {
    // Exchange code for permanent access token
    const tokenRes = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return res.status(400).json({ error: 'Token exchange failed', detail: tokenData });
    }

    const accessToken = tokenData.access_token;
    const scopes = tokenData.scope;

    // Store the token
    setToken(shop, accessToken);

    console.log(`[callback] ✅ Connected: ${shop} | scopes: ${scopes}`);

    // Return success page with the token displayed
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GWA Analytics — Store Connected</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0a; color: #e5e5e5; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }
    .card { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 16px; padding: 40px; max-width: 600px; width: 100%; }
    .badge { display: inline-flex; align-items: center; gap: 8px; background: #052e16; border: 1px solid #16a34a; color: #4ade80; padding: 6px 14px; border-radius: 100px; font-size: 13px; font-weight: 600; margin-bottom: 24px; }
    h1 { font-size: 24px; font-weight: 700; color: #fff; margin-bottom: 8px; }
    p { color: #888; font-size: 14px; line-height: 1.6; margin-bottom: 20px; }
    .shop-name { color: #fff; font-weight: 600; }
    .token-box { background: #0d0d0d; border: 1px solid #333; border-radius: 10px; padding: 16px; margin: 20px 0; }
    .token-label { font-size: 11px; font-weight: 600; color: #555; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
    .token-value { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 12px; color: #4ade80; word-break: break-all; line-height: 1.6; }
    .scopes { font-size: 11px; color: #555; margin-top: 6px; }
    .warning { background: #1c1008; border: 1px solid #78350f; border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #fbbf24; margin-top: 20px; }
    .btn { display: inline-block; background: #2563eb; color: #fff; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">✅ Store Connected</div>
    <h1>GWA Analytics</h1>
    <p>Successfully connected to <span class="shop-name">${shop}</span></p>

    <div class="token-box">
      <div class="token-label">Access Token (save this)</div>
      <div class="token-value">${accessToken}</div>
      <div class="scopes">Scopes: ${scopes?.split(',').length || 0} permissions granted</div>
    </div>

    <div class="warning">
      ⚠️ Save this token. Add it to your Vercel env vars as:<br>
      <strong>SHOPIFY_TOKEN_${shop.replace(/\./g, '_').toUpperCase()}</strong>
    </div>

    <a class="btn" href="/">← Back to Dashboard</a>
  </div>
</body>
</html>
    `);

  } catch (err) {
    console.error('[callback] Error:', err);
    return res.status(500).json({ error: 'OAuth callback failed', message: err.message });
  }
}
