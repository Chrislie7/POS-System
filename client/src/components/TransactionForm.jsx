import AppIcon from "./AppIcon";

function TransactionForm({ customerName, tanggal, items, submitting, onCustomerChange, onDateChange, onUpdateQty, onRemoveItem, onSubmit }) {
  const subtotal = items.reduce((sum, item) => sum + Number(item.harga) * Number(item.jumlah), 0);
  const serviceCharge = 0;
  const tax = 0;
  const total = subtotal + serviceCharge + tax;

  return (
    <section className="current-order-panel panel">
      <div className="current-order-head">
        <h2>Current Order</h2>
        <div className="current-order-user">
          <div className="avatar-chip icon-surface cool-surface">
            <AppIcon name="user" size={16} />
          </div>
          <input value={customerName} onChange={(event) => onCustomerChange(event.target.value)} placeholder="Nama customer" />
        </div>
        <label className="search-box compact-search small-search">
          <AppIcon name="clock" size={16} />
          <input type="datetime-local" value={tanggal} onChange={(event) => onDateChange(event.target.value)} />
        </label>
      </div>

      <div className="current-order-items">
        {items.length === 0 ? <p className="empty-state">Belum ada item di order.</p> : null}
        {items.map((item, index) => (
          <div key={`${item.nama_barang}-${index}`} className="current-order-item">
            <div className="current-order-item-art icon-surface warm-surface">
              <AppIcon name={item.icon || "coffee"} size={20} />
            </div>
            <div className="current-order-item-meta">
              <strong>{item.nama_barang}</strong>
              <span>Rp {formatCurrency(item.harga)}</span>
            </div>
            <div className="current-order-controls">
              <button className="qty-button" type="button" onClick={() => onUpdateQty(index, -1)}>
                <AppIcon name="minus" size={14} />
              </button>
              <span>{item.jumlah}</span>
              <button className="qty-button" type="button" onClick={() => onUpdateQty(index, 1)}>
                <AppIcon name="plus" size={14} />
              </button>
            </div>
            <button className="ghost-button small-button icon-only-button" type="button" onClick={() => onRemoveItem(index)}>
              <AppIcon name="trash" size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="order-summary-card">
        <div className="summary-line"><span>Subtotal</span><strong>Rp {formatCurrency(subtotal)}</strong></div>
        <div className="summary-line"><span>Service</span><strong>Rp {formatCurrency(serviceCharge)}</strong></div>
        <div className="summary-line"><span>Tax</span><strong>Rp {formatCurrency(tax)}</strong></div>
        <div className="summary-line total-line"><span>Total</span><strong>Rp {formatCurrency(total)}</strong></div>
      </div>

      <button className="continue-button" type="button" disabled={submitting || !customerName.trim() || items.length === 0} onClick={onSubmit}>
        {submitting ? "Menyimpan..." : "Continue"}
      </button>
    </section>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID").format(Number(value) || 0);
}

export default TransactionForm;
