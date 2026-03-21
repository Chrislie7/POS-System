import AppIcon from "./AppIcon";

function TransactionList({ transactions, loading, onDelete, onPrint, summary }) {
  const topProducts = summary?.topProducts || [];

  return (
    <section className="history-panel panel">
      <div className="history-head row-between">
        <div>
          <p className="section-label">Recent Orders</p>
          <h3>History</h3>
        </div>
        <div className="mini-badge icon-badge">
          <AppIcon name="order" size={16} />
          <span>{transactions.length}</span>
        </div>
      </div>

      <div className="history-top-strip">
        {topProducts.slice(0, 4).map((item) => (
          <div key={item.nama_barang} className="top-strip-card">
            <span>{item.nama_barang}</span>
            <strong>{item.total_jumlah}x</strong>
          </div>
        ))}
      </div>

      {loading ? <p className="empty-state">Memuat order...</p> : null}
      {!loading && transactions.length === 0 ? <p className="empty-state">Belum ada order.</p> : null}

      <div className="history-grid">
        {transactions.map((order) => (
          <article key={order.id} className="history-card">
            <div className="history-card-top">
              <div>
                <strong>{order.customer_name}</strong>
                <span>{order.order_code}</span>
              </div>
              <strong>Rp {formatCurrency(order.total)}</strong>
            </div>

            <div className="history-items-line">
              {order.items.map((item) => (
                <span key={item.id} className="history-pill">
                  {item.nama_barang} x{item.jumlah}
                </span>
              ))}
            </div>

            <div className="history-card-foot">
              <small>{formatDate(order.tanggal)}</small>
              <div className="table-actions">
                <button className="secondary-button small-button icon-only-button" type="button" onClick={() => onPrint(order)}>
                  <AppIcon name="printer" size={16} />
                </button>
                <button className="ghost-button small-button icon-only-button" type="button" onClick={() => onDelete(order.id)}>
                  <AppIcon name="trash" size={16} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID").format(Number(value) || 0);
}

function formatDate(value) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export default TransactionList;
