/**
 * GET /api/query?shop=...&endpoint=orders.json&...
 * Proxy any Shopify Admin API call for a connected store.
 * Protected by ADMIN_SECRET.
 *
 * Examples:
 *   /api/query?shop=ricrac.myshopify.com&endpoint=orders.json&limit=50
 *   /api/query?shop=ricrac.myshopify.com&endpoint=customers.json
 *   /api/query?shop=ricrac.myshopify.com&endpoint=analytics/reports.json
 */

import { getToken, normalizeShop } from '../../lib/store';

const API_VERSION = '2024-01';

export default async function handler(req, res) {
  const secret = req.headers['x-admin-secret'] || req.query.secret;

  if (secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { shop, endpoint, secret: _s, ...params } = req.query;

  if (!shop || !endpoint) {
    return res.status(400).json({ error: 'Missing shop or endpoint parameter' });
  }

  const normalizedShop = normalizeShop(shop);
  const token = getToken(normalizedShop);

  if (!token) {
    // Try to find token in env var (for persisted tokens)
    const envKey = `SHOPIFY_TOKEN_${normalizedShop.replace(/\./g, '_').toUpperCase()}`;
    const envToken = process.env[envKey];
    if (!envToken) {
      return res.status(404).json({
        error: `Store not connected: ${normalizedShop}`,
        hint: `Install the app first: /api/install?shop=${normalizedShop}`,
      });
    }
    // Use env token
    return proxyRequest(res, normalizedShop, envToken, endpoint, params);
  }

  return proxyRequest(res, normalizedShop, token, endpoint, params);
}

async function proxyRequest(res, shop, token, endpoint, params) {
  const queryString = new URLSearchParams(params).toString();
  const url = `https://${shop}/admin/api/${API_VERSION}/${endpoint}${queryString ? '?' + queryString : ''}`;

  try {
    const response = await fetch(url, {
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    res.setHeader('X-Shop', shop);
    res.setHeader('X-Shopify-API-Version', API_VERSION);
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Shopify API request failed', message: err.message });
  }
}
