import { useState } from 'react';

export default function Home() {
  const [shop, setShop] = useState('');

  const handleInstall = (e) => {
    e.preventDefault();
    if (!shop) return;
    const clean = shop.replace(/https?:\/\//, '').replace(/\/$/, '');
    window.location.href = `/api/install?shop=${clean}`;
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>GWA</div>
        <h1 style={styles.title}>GWA Analytics</h1>
        <p style={styles.subtitle}>
          Connect any Shopify store to unlock full read access — orders, customers,
          analytics, marketing, inventory, and more.
        </p>

        <form onSubmit={handleInstall} style={styles.form}>
          <label style={styles.label}>Shopify Store URL</label>
          <div style={styles.inputRow}>
            <input
              type="text"
              value={shop}
              onChange={e => setShop(e.target.value)}
              placeholder="yourstore.myshopify.com"
              style={styles.input}
              required
            />
            <button type="submit" style={styles.btn}>Connect →</button>
          </div>
          <p style={styles.hint}>Enter the .myshopify.com domain or just the store name.</p>
        </form>

        <div style={styles.divider} />

        <div style={styles.scopeGrid}>
          {[
            ['📦', 'Orders & Drafts'],
            ['👥', 'Customers'],
            ['📊', 'Analytics'],
            ['📣', 'Marketing'],
            ['🎨', 'Themes & Content'],
            ['🏪', 'Inventory'],
            ['💰', 'Discounts & Pricing'],
            ['🚚', 'Fulfillment'],
          ].map(([icon, label]) => (
            <div key={label} style={styles.scopeItem}>
              <span>{icon}</span> {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: '#0a0a0a',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: '20px',
  },
  card: {
    background: '#141414',
    border: '1px solid #242424',
    borderRadius: '20px',
    padding: '48px',
    maxWidth: '520px',
    width: '100%',
  },
  logo: {
    background: '#2563eb',
    color: '#fff',
    fontWeight: '800',
    fontSize: '13px',
    letterSpacing: '0.1em',
    padding: '6px 12px',
    borderRadius: '8px',
    display: 'inline-block',
    marginBottom: '20px',
  },
  title: {
    color: '#fff',
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 10px',
  },
  subtitle: {
    color: '#777',
    fontSize: '15px',
    lineHeight: '1.6',
    margin: '0 0 32px',
  },
  form: { marginBottom: '32px' },
  label: {
    display: 'block',
    color: '#aaa',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  inputRow: { display: 'flex', gap: '10px' },
  input: {
    flex: 1,
    background: '#0d0d0d',
    border: '1px solid #2a2a2a',
    borderRadius: '10px',
    padding: '12px 16px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
  },
  btn: {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 20px',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  hint: {
    color: '#444',
    fontSize: '12px',
    marginTop: '8px',
  },
  divider: {
    borderTop: '1px solid #1f1f1f',
    margin: '0 0 24px',
  },
  scopeGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },
  scopeItem: {
    background: '#0d0d0d',
    border: '1px solid #1f1f1f',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '13px',
    color: '#888',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
};
