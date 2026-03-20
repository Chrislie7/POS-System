function DashboardOverview({ summary, onExport, onLogout, exporting }) {
  const totals = summary?.totals || {};
  const today = summary?.today || {};

  return (
    <section className="dashboard-shell">
      <div className="dashboard-head panel">
        <div>
          <p className="eyebrow">POS Porto</p>
          <h1>Dashboard ringkasan penjualan</h1>
          <p className="hero-text">Pantau transaksi, pilih produk preset, export Excel, dan print struk dari satu layar.</p>
        </div>

        <div className="top-actions">
          <button className="ghost-button" type="button" onClick={onExport} disabled={exporting}>
            {exporting ? "Menyiapkan Excel..." : "Export Excel"}
          </button>
          <button className="secondary-button" type="button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <article className="stat-card dark-card">
          <span>Total penjualan</span>
          <strong>Rp {formatCurrency(totals.total_penjualan)}</strong>
          <small>{totals.total_transaksi || 0} transaksi tersimpan</small>
        </article>
        <article className="stat-card">
          <span>Penjualan hari ini</span>
          <strong>Rp {formatCurrency(today.penjualan_hari_ini)}</strong>
          <small>{today.transaksi_hari_ini || 0} transaksi hari ini</small>
        </article>
        <article className="stat-card">
          <span>Total item terjual</span>
          <strong>{formatCurrency(totals.total_item || 0)}</strong>
          <small>Akumulasi semua item</small>
        </article>
        <article className="stat-card">
          <span>Rata-rata transaksi</span>
          <strong>Rp {formatCurrency(totals.rata_rata_transaksi)}</strong>
          <small>Tiket rata-rata penjualan</small>
        </article>
      </div>
    </section>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(Number(value) || 0);
}

export default DashboardOverview;
