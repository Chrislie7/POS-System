import { useMemo, useState } from "react";
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
      icon: product.icon || "?"
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
      icon: "?"
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
          <p className="panel-kicker">???????? Order</p>
          <h2>Per orang</h2>
        </div>
        <div className="mini-badge">{items.length} item</div>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="inline-grid two-col">
          <label className="field compact-field card-field">
            <span>??</span>
            <input
              type="text"
              name="customer_name"
              placeholder="Nama / Meja / Order"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
            />
          </label>

          <label className="field compact-field card-field">
            <span>??</span>
            <input type="datetime-local" value={tanggal} onChange={(event) => setTanggal(event.target.value)} />
          </label>
        </div>

        <ProductPicker products={products} onAddProduct={handleAddProduct} onSelectCustom={() => setCustomOpen(true)} />

        {customOpen ? (
          <div className="custom-builder soft-card">
            <div className="inline-grid two-col">
              <label className="field compact-field card-field">
                <span>?</span>
                <input value={customName} onChange={(event) => setCustomName(event.target.value)} placeholder="Custom item" />
              </label>
              <label className="field compact-field card-field">
                <span>??</span>
                <input
                  type="number"
                  min="1"
                  value={customPrice}
                  onChange={(event) => setCustomPrice(event.target.value)}
                  placeholder="Harga"
                />
              </label>
            </div>
            <button className="secondary-button" type="button" onClick={handleAddCustom}>
              Tambah Custom
            </button>
          </div>
        ) : null}

        <div className="cart-shell">
          {items.length === 0 ? <p className="empty-state">Pilih produk untuk mulai order.</p> : null}
          {items.map((item, index) => (
            <div key={`${item.nama_barang}-${index}`} className="cart-item">
              <div className="cart-icon">{item.icon || "??"}</div>
              <div className="cart-meta">
                <strong>{item.nama_barang}</strong>
                <span>Rp {formatCurrency(item.harga)}</span>
              </div>
              <div className="qty-box">
                <button className="qty-button" type="button" onClick={() => updateQty(index, -1)}>
                  -
                </button>
                <span>{item.jumlah}</span>
                <button className="qty-button" type="button" onClick={() => updateQty(index, 1)}>
                  +
                </button>
              </div>
              <strong className="cart-total">Rp {formatCurrency(item.harga * item.jumlah)}</strong>
              <button className="ghost-button small-button" type="button" onClick={() => removeItem(index)}>
                ?
              </button>
            </div>
          ))}
        </div>

        <div className="total-box large-total">
          <span>?? Total</span>
          <strong>Rp {formatCurrency(total)}</strong>
        </div>

        {localError ? <p className="helper-error">{localError}</p> : null}

        <button className="primary-button large-button" type="submit" disabled={submitting || !products.length}>
          {submitting ? "Menyimpan..." : "Simpan Order"}
        </button>
      </form>
    </section>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID").format(Number(value) || 0);
}

export default TransactionForm;
