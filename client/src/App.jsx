import { useEffect, useState } from "react";
import SidebarNav from "./components/SidebarNav";
import LoginPage from "./components/LoginPage";
import ProductPicker from "./components/ProductPicker";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import {
  clearSession,
  createTransaction,
  deleteTransaction,
  exportTransactionsExcel,
  getDashboardSummary,
  getProducts,
  getSession,
  getTransactions,
  loginAdmin,
  saveSession
} from "./services/transactionService";

function App() {
  const [session, setSession] = useState(() => getSession());
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 16));
  const [currentItems, setCurrentItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState("");
  const [authError, setAuthError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");
      const [orderData, productData, summaryData] = await Promise.all([
        getTransactions(),
        getProducts(),
        getDashboardSummary()
      ]);
      setOrders(orderData);
      setProducts(productData);
      setSummary(summaryData);
    } catch (err) {
      setError(err.message);
      if (err.message === "Akses admin dibutuhkan") {
        clearSession();
        setSession(null);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (session?.token) {
      loadDashboard();
    }
  }, [session?.token]);

  async function handleLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") || "").trim();
    const password = String(formData.get("password") || "").trim();

    if (!username || !password) {
      setAuthError("Username dan password wajib diisi.");
      return;
    }

    try {
      setAuthLoading(true);
      setAuthError("");
      const result = await loginAdmin({ username, password });
      saveSession(result);
      setSession(result);
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  }

  function addOrMergeItem(item) {
    setCurrentItems((current) => {
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
    addOrMergeItem({
      nama_barang: product.nama_barang,
      harga: Number(product.harga),
      jumlah: 1,
      icon: product.icon || "coffee"
    });
  }

  function handleAddCustom(item) {
    addOrMergeItem({
      nama_barang: item.nama_barang,
      harga: Number(item.harga),
      jumlah: 1,
      icon: item.icon || "sparkles"
    });
  }

  function handleUpdateQty(index, delta) {
    setCurrentItems((current) =>
      current
        .map((item, itemIndex) =>
          itemIndex === index ? { ...item, jumlah: Math.max(0, item.jumlah + delta) } : item
        )
        .filter((item) => item.jumlah > 0)
    );
  }

  function handleRemoveItem(index) {
    setCurrentItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  async function handleCreateOrder() {
    if (!customerName.trim()) {
      setError("Nama customer wajib diisi.");
      return;
    }

    if (currentItems.length === 0) {
      setError("Tambahkan item ke order terlebih dulu.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      await createTransaction({
        customer_name: customerName.trim(),
        tanggal: new Date(tanggal).toISOString(),
        items: currentItems.map(({ nama_barang, harga, jumlah }) => ({ nama_barang, harga, jumlah }))
      });
      setCustomerName("");
      setTanggal(new Date().toISOString().slice(0, 16));
      setCurrentItems([]);
      await loadDashboard();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteTransaction(id) {
    try {
      setError("");
      await deleteTransaction(id);
      await loadDashboard();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleExport() {
    try {
      const fileBlob = await exportTransactionsExcel();
      const url = URL.createObjectURL(fileBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `orders-${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    }
  }

  function handlePrint(order) {
    const printWindow = window.open("", "_blank", "width=420,height=720");

    if (!printWindow) {
      setError("Popup print diblokir browser.");
      return;
    }

    const itemsHtml = order.items
      .map(
        (item) => `
          <div class="line"><span>${item.nama_barang} x${item.jumlah}</span><span>Rp ${formatCurrency(item.total)}</span></div>
        `
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Struk ${order.order_code}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
            h1 { font-size: 22px; margin-bottom: 8px; }
            .line { display: flex; justify-content: space-between; margin: 8px 0; }
            .total { margin-top: 16px; padding-top: 12px; border-top: 1px dashed #999; font-weight: bold; }
            .muted { color: #666; margin-bottom: 12px; }
          </style>
        </head>
        <body>
          <h1>POS Porto</h1>
          <p class="muted">${order.order_code} | ${order.customer_name}</p>
          ${itemsHtml}
          <div class="line total"><span>Total</span><span>Rp ${formatCurrency(order.total)}</span></div>
          <div class="line"><span>Tanggal</span><span>${formatDate(order.tanggal)}</span></div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  if (!session?.token) {
    return <LoginPage onLogin={handleLogin} submitting={authLoading} error={authError} />;
  }

  return (
    <main className="tablet-shell">
      <SidebarNav />

      <section className="tablet-main">
        {error ? <div className="alert">{error}</div> : null}

        <section className="tablet-top-layout">
          <ProductPicker products={products} onAddProduct={handleAddProduct} onAddCustom={handleAddCustom} />
          <TransactionForm
            customerName={customerName}
            tanggal={tanggal}
            items={currentItems}
            submitting={submitting}
            onCustomerChange={setCustomerName}
            onDateChange={setTanggal}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveItem}
            onSubmit={handleCreateOrder}
          />
        </section>

        <div className="action-strip">
          <button className="ghost-button icon-button" type="button" onClick={handleExport}>
            Export Excel
          </button>
          <div className="summary-chip">Total sales: Rp {formatCurrency(summary?.totals?.total_penjualan)}</div>
        </div>

        <TransactionList transactions={orders} loading={loading} onDelete={handleDeleteTransaction} onPrint={handlePrint} summary={summary} />
      </section>
    </main>
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

export default App;
