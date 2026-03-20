import { useMemo, useState } from "react";

const initialState = {
  nama_barang: "",
  harga: "",
  jumlah: "",
  tanggal: new Date().toISOString().slice(0, 16)
};

function TransactionForm({ onSubmit, submitting }) {
  const [form, setForm] = useState(initialState);
  const [localError, setLocalError] = useState("");

  const total = useMemo(() => {
    const harga = Number(form.harga) || 0;
    const jumlah = Number(form.jumlah) || 0;
    return harga * jumlah;
  }, [form.harga, form.jumlah]);

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
        ...form,
        harga: Number(form.harga),
        jumlah: Number(form.jumlah),
        tanggal: new Date(form.tanggal).toISOString()
      });
      setForm({
        ...initialState,
        tanggal: new Date().toISOString().slice(0, 16)
      });
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

      <form className="form-grid" onSubmit={handleSubmit}>
        <label className="field">
          <span>Nama barang</span>
          <input
            type="text"
            name="nama_barang"
            placeholder="Contoh: Es Kopi"
            value={form.nama_barang}
            onChange={handleChange}
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
          />
        </label>

        <label className="field">
          <span>Jumlah</span>
          <input
            type="number"
            min="1"
            name="jumlah"
            placeholder="2"
            value={form.jumlah}
            onChange={handleChange}
          />
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

        <button className="primary-button" type="submit" disabled={submitting}>
          {submitting ? "Menyimpan..." : "Tambah ke list"}
        </button>
      </form>
    </section>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID").format(value);
}

export default TransactionForm;
