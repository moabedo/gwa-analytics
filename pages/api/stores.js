/**
 * GET /api/stores
 * Returns all connected stores. Protected by ADMIN_SECRET.
 */

import { getAllStores } from '../../lib/store';

export default function handler(req, res) {
  const secret = req.headers['x-admin-secret'] || req.query.secret;

  if (secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const stores = getAllStores();
  const list = Object.keys(stores).map(shop => ({
    shop,
    connected: true,
    token_prefix: stores[shop].slice(0, 10) + '...',
  }));

  return res.status(200).json({
    count: list.length,
    stores: list,
    // Full tokens only if explicitly requested
    ...(req.query.full === '1' ? { tokens: stores } : {}),
  });
}
