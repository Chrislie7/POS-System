function TransactionList({ transactions, loading, onDelete, onPrint, summary }) {
  const topProducts = summary?.topProducts || [];
  const recentTransactions = summary?.recentTransactions || [];

  return (
    <section className="panel wide-panel">
      <div className="panel-header row-between">
        <div>
          <p className="panel-kicker">Riwayat</p>
          <h2>List transaksi</h2>
        </div>
        <div className="mini-badge">{transactions.length} total transaksi</div>
      </div>

      <div className="insight-grid">
        <div className="soft-card">
          <h3>Produk terlaris</h3>
          {topProducts.length === 0 ? (
            <p className="empty-state compact-state">Belum ada produk terjual.</p>
          ) : (
            <div className="mini-list">
              {topProducts.map((item) => (
                <div key={item.nama_barang} className="mini-list-item">
                  <span>{item.nama_barang}</span>
                  <strong>Rp {formatCurrency(item.total_penjualan)}</strong>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="soft-card">
          <h3>Transaksi terbaru</h3>
          {recentTransactions.length === 0 ? (
            <p className="empty-state compact-state">Belum ada transaksi terbaru.</p>
          ) : (
            <div className="mini-list">
              {recentTransactions.map((item) => (
                <div key={item.id} className="mini-list-item">
                  <span>{item.nama_barang}</span>
                  <strong>Rp {formatCurrency(item.total)}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading ? <p className="empty-state">Memuat transaksi...</p> : null}

      {!loading && transactions.length === 0 ? (
        <p className="empty-state">Belum ada transaksi. Tambahkan transaksi pertama dari form di samping.</p>
      ) : null}

      {!loading && transactions.length > 0 ? (
        <div className="table-wrap">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Barang</th>
                <th>Harga</th>
                <th>Jumlah</th>
                <th>Total</th>
                <th>Tanggal</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((item) => (
                <tr key={item.id}>
                  <td>{item.nama_barang}</td>
                  <td>Rp {formatCurrency(item.harga)}</td>
                  <td>{item.jumlah}</td>
                  <td>Rp {formatCurrency(item.total)}</td>
                  <td>{formatDate(item.tanggal)}</td>
                  <td>
                    <div className="table-actions">
                      <button className="secondary-button small-button" type="button" onClick={() => onPrint(item)}>
                        Print
                      </button>
                      <button className="ghost-button small-button" type="button" onClick={() => onDelete(item.id)}>
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
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
