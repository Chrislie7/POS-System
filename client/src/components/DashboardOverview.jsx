function DashboardOverview({ summary, onExport, onLogout, exporting }) {
  const totals = summary?.totals || {};
  const today = summary?.today || {};

  const cards = [
    { icon: "??", value: `Rp ${formatCurrency(totals.total_penjualan)}`, label: "Total" },
    { icon: "??", value: totals.total_order || 0, label: "Order" },
    { icon: "??", value: totals.total_item || 0, label: "Item" },
    { icon: "??", value: `Rp ${formatCurrency(today.penjualan_hari_ini)}`, label: "Hari ini" }
  ];

  return (
    <section className="dashboard-shell">
      <div className="dashboard-head panel icon-first-head">
        <div>
          <p className="eyebrow">POS Porto</p>
          <h1>Kasir Visual</h1>
          <p className="hero-text">Klik produk. Susun order. Cetak struk.</p>
        </div>

        <div className="top-actions">
          <button className="ghost-button icon-button" type="button" onClick={onExport} disabled={exporting}>
            <span>??</span>
            <strong>{exporting ? "Export..." : "Excel"}</strong>
          </button>
          <button className="secondary-button icon-button" type="button" onClick={onLogout}>
            <span>??</span>
            <strong>Keluar</strong>
          </button>
        </div>
      </div>

      <div className="stats-grid">
        {cards.map((card) => (
          <article key={card.label} className="stat-card visual-stat">
            <div className="stat-icon">{card.icon}</div>
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
