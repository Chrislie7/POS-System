import { useEffect, useMemo, useState } from "react";
import ProductPicker from "./ProductPicker";

function TransactionForm({ products, onSubmit, submitting }) {
  const [selectedProductId, setSelectedProductId] = useState("custom");
  const [form, setForm] = useState(createInitialState());
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (!products.length) {
      setSelectedProductId("custom");
      setForm(createInitialState());
      return;
    }

    if (selectedProductId === "custom" && !form.nama_barang && !form.harga) {
      const firstProduct = products[0];
      setSelectedProductId(firstProduct.id);
      setForm(createInitialState(firstProduct));
      return;
    }

    if (selectedProductId !== "custom") {
      const activeProduct = products.find((item) => item.id === selectedProductId) || products[0];
      setSelectedProductId(activeProduct.id);
      setForm((current) => ({
        ...current,
        nama_barang: activeProduct.nama_barang,
        harga: String(activeProduct.harga)
      }));
    }
  }, [products]);

  const isCustomOrder = selectedProductId === "custom";
  const total = useMemo(() => {
    const harga = Number(form.harga) || 0;
    const jumlah = Number(form.jumlah) || 0;
    return harga * jumlah;
  }, [form.harga, form.jumlah]);

  function handleSelectProduct(productId) {
    setSelectedProductId(productId);
    setLocalError("");

    if (productId === "custom") {
      setForm((current) => ({
        ...current,
        nama_barang: "",
        harga: ""
      }));
      return;
    }

    const selectedProduct = products.find((item) => item.id === productId);

    if (!selectedProduct) {
      return;
    }

    setForm((current) => ({
      ...current,
      nama_barang: selectedProduct.nama_barang,
      harga: String(selectedProduct.harga)
    }));
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.nama_barang.trim() || !form.harga || !form.jumlah || !form.tanggal) {
      setLocalError("Semua field wajib diisi.");
      return;
    }

    if (Number(form.harga) <= 0 || Number(form.jumlah) <= 0) {
      setLocalError("Harga dan jumlah harus lebih dari 0.");
      return;
    }

    try {
      setLocalError("");
      await onSubmit({
        nama_barang: form.nama_barang.trim(),
        harga: Number(form.harga),
        jumlah: Number(form.jumlah),
        tanggal: new Date(form.tanggal).toISOString()
      });
      const firstProduct = products[0];
      setSelectedProductId(firstProduct?.id || "custom");
      setForm(createInitialState(firstProduct));
    } catch (_error) {
      setLocalError("Gagal menambahkan transaksi.");
    }
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <p className="panel-kicker">Input</p>
        <h2>Tambah transaksi</h2>
      </div>

      <ProductPicker products={products} selectedProductId={selectedProductId} onSelect={handleSelectProduct} />

      <form className="form-grid" onSubmit={handleSubmit}>
        <label className="field">
          <span>Nama barang</span>
          <input
            type="text"
            name="nama_barang"
            placeholder="Contoh: Es Kopi"
            value={form.nama_barang}
            onChange={handleChange}
            disabled={!isCustomOrder}
          />
        </label>

        <label className="field">
          <span>Harga</span>
          <input
            type="number"
            min="1"
            name="harga"
            placeholder="18000"
            value={form.harga}
            onChange={handleChange}
            disabled={!isCustomOrder}
          />
        </label>

        <label className="field">
          <span>Jumlah</span>
          <input type="number" min="1" name="jumlah" value={form.jumlah} onChange={handleChange} />
        </label>

        <label className="field">
          <span>Tanggal</span>
          <input type="datetime-local" name="tanggal" value={form.tanggal} onChange={handleChange} />
        </label>

        <div className="total-box">
          <span>Total otomatis</span>
          <strong>Rp {formatCurrency(total)}</strong>
        </div>

        {localError ? <p className="helper-error">{localError}</p> : null}

        <button className="primary-button" type="submit" disabled={submitting || !products.length}>
          {submitting ? "Menyimpan..." : "Tambah ke list"}
        </button>
      </form>
    </section>
  );
}

function createInitialState(product) {
  return {
    nama_barang: product?.nama_barang || "",
    harga: product ? String(product.harga) : "",
    jumlah: "1",
    tanggal: new Date().toISOString().slice(0, 16)
  };
}

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID").format(value);
}

export default TransactionForm;
