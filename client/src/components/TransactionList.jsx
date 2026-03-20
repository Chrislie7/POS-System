function TransactionList({ transactions, loading, onDelete, grandTotal }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <p className="panel-kicker">Riwayat</p>
        <h2>List transaksi</h2>
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
                    <button className="ghost-button" type="button" onClick={() => onDelete(item.id)}>
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <div className="footer-total">
        <span>Total keseluruhan</span>
        <strong>Rp {formatCurrency(grandTotal)}</strong>
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
