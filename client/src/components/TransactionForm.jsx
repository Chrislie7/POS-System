import { useMemo, useState } from "react";
import AppIcon from "./AppIcon";
import ProductPicker from "./ProductPicker";

function TransactionForm({ products, onSubmit, submitting }) {
  const [customerName, setCustomerName] = useState("");
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 16));
  const [items, setItems] = useState([]);
  const [customName, setCustomName] = useState("");
  const [customPrice, setCustomPrice] = useState("");
  const [customOpen, setCustomOpen] = useState(false);
  const [localError, setLocalError] = useState("");

  const total = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.harga) * Number(item.jumlah), 0),
    [items]
  );

  function addOrMergeItem(item) {
    setItems((current) => {
      const existing = current.find((entry) => entry.nama_barang === item.nama_barang && entry.harga === item.harga);

      if (existing) {
        return current.map((entry) =>
          entry.nama_barang === item.nama_barang && entry.harga === item.harga
            ? { ...entry, jumlah: entry.jumlah + 1 }
            : entry
        );
      }

      return [...current, { ...item, jumlah: item.jumlah || 1 }];
    });
  }

  function handleAddProduct(product) {
    setCustomOpen(false);
    setLocalError("");
    addOrMergeItem({
      nama_barang: product.nama_barang,
      harga: Number(product.harga),
      jumlah: 1,
      icon: product.icon || "coffee"
    });
  }

  function handleAddCustom() {
    if (!customName.trim() || Number(customPrice) <= 0) {
      setLocalError("Isi nama dan harga custom dulu.");
      return;
    }

    addOrMergeItem({
      nama_barang: customName.trim(),
      harga: Number(customPrice),
      jumlah: 1,
      icon: "sparkles"
    });
    setCustomName("");
    setCustomPrice("");
    setLocalError("");
  }

  function updateQty(index, delta) {
    setItems((current) =>
      current
        .map((item, itemIndex) =>
          itemIndex === index ? { ...item, jumlah: Math.max(0, item.jumlah + delta) } : item
        )
        .filter((item) => item.jumlah > 0)
    );
  }

  function removeItem(index) {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!customerName.trim()) {
      setLocalError("Nama order wajib diisi.");
      return;
    }

    if (!items.length) {
      setLocalError("Tambahkan minimal satu minuman atau item.");
      return;
    }

    try {
      setLocalError("");
      await onSubmit({
        customer_name: customerName.trim(),
        tanggal: new Date(tanggal).toISOString(),
        items: items.map(({ nama_barang, harga, jumlah }) => ({ nama_barang, harga, jumlah }))
      });
      setCustomerName("");
      setTanggal(new Date().toISOString().slice(0, 16));
      setItems([]);
      setCustomName("");
      setCustomPrice("");
      setCustomOpen(false);
    } catch (_error) {
      setLocalError("Order gagal dibuat.");
    }
  }

  return (
    <section className="panel builder-panel">
      <div className="panel-header row-between">
        <div>
          <p className="panel-kicker">Order</p>
          <h2>Per orang</h2>
        </div>
        <div className="mini-badge icon-badge">
          <AppIcon name="package" size={16} />
          <span>{items.length}</span>
        </div>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="inline-grid two-col">
          <label className="field compact-field card-field">
            <span className="field-icon"><AppIcon name="user" size={18} /></span>
            <input
              type="text"
              name="customer_name"
              placeholder="Nama / Meja / Order"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
            />
          </label>

          <label className="field compact-field card-field">
            <span className="field-icon"><AppIcon name="clock" size={18} /></span>
            <input type="datetime-local" value={tanggal} onChange={(event) => setTanggal(event.target.value)} />
          </label>
        </div>

        <ProductPicker products={products} onAddProduct={handleAddProduct} onSelectCustom={() => setCustomOpen(true)} />

        {customOpen ? (
          <div className="custom-builder soft-card">
            <div className="inline-grid two-col">
              <label className="field compact-field card-field">
                <span className="field-icon"><AppIcon name="sparkles" size={18} /></span>
                <input value={customName} onChange={(event) => setCustomName(event.target.value)} placeholder="Custom item" />
              </label>
              <label className="field compact-field card-field">
                <span className="field-icon"><AppIcon name="wallet" size={18} /></span>
                <input
                  type="number"
                  min="1"
                  value={customPrice}
                  onChange={(event) => setCustomPrice(event.target.value)}
                  placeholder="Harga"
                />
              </label>
            </div>
            <button className="secondary-button icon-button" type="button" onClick={handleAddCustom}>
              <AppIcon name="plus" size={16} />
              <strong>Tambah</strong>
            </button>
          </div>
        ) : null}

        <div className="cart-shell">
          {items.length === 0 ? <p className="empty-state">Pilih produk untuk mulai order.</p> : null}
          {items.map((item, index) => (
            <div key={`${item.nama_barang}-${index}`} className="cart-item">
              <div className="cart-icon icon-surface warm-surface">
                <AppIcon name={item.icon || "coffee"} size={20} />
              </div>
              <div className="cart-meta">
                <strong>{item.nama_barang}</strong>
                <span>Rp {formatCurrency(item.harga)}</span>
              </div>
              <div className="qty-box">
                <button className="qty-button" type="button" onClick={() => updateQty(index, -1)}>
                  <AppIcon name="minus" size={14} />
                </button>
                <span>{item.jumlah}</span>
                <button className="qty-button" type="button" onClick={() => updateQty(index, 1)}>
                  <AppIcon name="plus" size={14} />
                </button>
              </div>
              <strong className="cart-total">Rp {formatCurrency(item.harga * item.jumlah)}</strong>
              <button className="ghost-button small-button icon-only-button" type="button" onClick={() => removeItem(index)}>
                <AppIcon name="trash" size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="total-box large-total">
          <span className="total-label"><AppIcon name="wallet" size={18} /> Total</span>
          <strong>Rp {formatCurrency(total)}</strong>
        </div>

        {localError ? <p className="helper-error">{localError}</p> : null}

        <button className="primary-button large-button icon-button" type="submit" disabled={submitting || !products.length}>
          <AppIcon name="receipt" size={18} />
          <strong>{submitting ? "Menyimpan..." : "Simpan Order"}</strong>
        </button>
      </form>
    </section>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID").format(Number(value) || 0);
}

export default TransactionForm;
