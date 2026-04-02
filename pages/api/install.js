/**
 * GET /api/install?shop=storename.myshopify.com
 * Kicks off the Shopify OAuth flow.
 */

const SCOPES = [
  'read_analytics','read_orders','read_customers','read_products',
  'read_inventory','read_price_rules','read_discounts','read_draft_orders',
  'read_fulfillments','read_shipping','read_locations','read_marketing_events',
  'read_themes','read_content','read_reports','read_checkouts',
  'read_customer_events','read_channels','read_markets','read_metaobjects',
  'read_online_store_pages','read_publications','read_product_listings'
].join(',');

export default function handler(req, res) {
  const { shop } = req.query;

  if (!shop) {
    return res.status(400).json({ error: 'Missing shop parameter. Usage: /api/install?shop=yourstore.myshopify.com' });
  }

  const cleanShop = shop.replace(/https?:\/\//, '').replace(/\/$/, '');
  const shopDomain = cleanShop.includes('.') ? cleanShop : `${cleanShop}.myshopify.com`;

  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const redirectUri = process.env.SHOPIFY_REDIRECT_URI;
  const state = Buffer.from(Date.now().toString()).toString('base64').slice(0, 16);

  const authUrl = `https://${shopDomain}/admin/oauth/authorize?` +
    `client_id=${clientId}` +
    `&scope=${encodeURIComponent(SCOPES)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${state}`;

  res.redirect(302, authUrl);
}
