function TransactionList({ transactions, loading, onDelete, onPrint, summary }) {
  const topProducts = summary?.topProducts || [];
  const recentOrders = summary?.recentOrders || [];

  return (
    <section className="panel wide-panel order-panel">
      <div className="panel-header row-between">
        <div>
          <p className="panel-kicker">?? Orders</p>
          <h2>Semua pesanan</h2>
        </div>
        <div className="mini-badge">{transactions.length} order</div>
      </div>

      <div className="insight-grid mobile-stack">
        <div className="soft-card">
          <div className="section-head compact-head">
            <h3>??</h3>
            <span>Top</span>
          </div>
          <div className="mini-list">
            {topProducts.length === 0 ? (
              <p className="empty-state compact-state">Belum ada data.</p>
            ) : (
              topProducts.map((item) => (
                <div key={item.nama_barang} className="mini-list-item">
                  <span>{item.nama_barang}</span>
                  <strong>{item.total_jumlah}x</strong>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="soft-card">
          <div className="section-head compact-head">
            <h3>??</h3>
            <span>Baru</span>
          </div>
          <div className="mini-list">
            {recentOrders.length === 0 ? (
              <p className="empty-state compact-state">Belum ada order.</p>
            ) : (
              recentOrders.map((item) => (
                <div key={item.id} className="mini-list-item">
                  <span>{item.customer_name}</span>
                  <strong>Rp {formatCurrency(item.total)}</strong>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {loading ? <p className="empty-state">Memuat order...</p> : null}
      {!loading && transactions.length === 0 ? <p className="empty-state">Belum ada order.</p> : null}

      <div className="order-list">
        {transactions.map((order) => (
          <article key={order.id} className="order-card">
            <div className="order-head">
              <div>
                <strong>{order.customer_name}</strong>
                <span>{order.order_code}</span>
              </div>
              <div className="order-amount">Rp {formatCurrency(order.total)}</div>
            </div>

            <div className="order-items-preview">
              {order.items.map((item) => (
                <div key={item.id} className="item-pill">
                  <span>{item.nama_barang}</span>
                  <strong>{item.jumlah}x</strong>
                </div>
              ))}
            </div>

            <div className="order-foot">
              <small>{formatDate(order.tanggal)}</small>
              <div className="table-actions">
                <button className="secondary-button small-button" type="button" onClick={() => onPrint(order)}>
                  ???
                </button>
                <button className="ghost-button small-button" type="button" onClick={() => onDelete(order.id)}>
                  ???
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
