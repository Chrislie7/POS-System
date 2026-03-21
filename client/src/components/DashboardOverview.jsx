import AppIcon from "./AppIcon";

function DashboardOverview({ summary, onExport, onLogout, exporting }) {
  const totals = summary?.totals || {};
  const today = summary?.today || {};

  const cards = [
    { icon: "wallet", value: `Rp ${formatCurrency(totals.total_penjualan)}`, label: "Total" },
    { icon: "order", value: totals.total_order || 0, label: "Order" },
    { icon: "package", value: totals.total_item || 0, label: "Item" },
    { icon: "calendar", value: `Rp ${formatCurrency(today.penjualan_hari_ini)}`, label: "Hari ini" }
  ];

  return (
    <section className="dashboard-shell">
      <div className="dashboard-head panel icon-first-head">
        <div>
          <p className="eyebrow">POS Porto</p>
          <h1>Kasir Visual</h1>
          <p className="hero-text">Klik ikon menu. Susun order. Cetak struk.</p>
        </div>

        <div className="top-actions">
          <button className="ghost-button icon-button" type="button" onClick={onExport} disabled={exporting}>
            <AppIcon name="sheet" size={18} />
            <strong>{exporting ? "Export..." : "Excel"}</strong>
          </button>
          <button className="secondary-button icon-button" type="button" onClick={onLogout}>
            <AppIcon name="logout" size={18} />
            <strong>Keluar</strong>
          </button>
        </div>
      </div>

      <div className="stats-grid">
        {cards.map((card) => (
          <article key={card.label} className="stat-card visual-stat">
            <div className="stat-icon icon-surface warm-surface">
              <AppIcon name={card.icon} size={22} />
            </div>
            <strong>{card.value}</strong>
            <span>{card.label}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(Number(value) || 0);
}

export default DashboardOverview;
