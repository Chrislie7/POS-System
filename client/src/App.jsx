import { useEffect, useState } from "react";
import DashboardOverview from "./components/DashboardOverview";
import LoginPage from "./components/LoginPage";
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
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [exporting, setExporting] = useState(false);
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

  async function handleAddTransaction(formData) {
    try {
      setSubmitting(true);
      setError("");
      await createTransaction(formData);
      await loadDashboard();
    } catch (err) {
      setError(err.message);
      throw err;
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
      setExporting(true);
      setError("");
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
    } finally {
      setExporting(false);
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

  function handleLogout() {
    clearSession();
    setSession(null);
    setOrders([]);
    setProducts([]);
    setSummary(null);
    setError("");
  }

  if (!session?.token) {
    return <LoginPage onLogin={handleLogin} submitting={authLoading} error={authError} />;
  }

  return (
    <main className="page-shell visual-page-shell">
      <DashboardOverview summary={summary} onExport={handleExport} onLogout={handleLogout} exporting={exporting} />

      {error ? <div className="alert">{error}</div> : null}

      <section className="content-grid app-grid responsive-grid">
        <TransactionForm products={products} onSubmit={handleAddTransaction} submitting={submitting} />
        <TransactionList
          transactions={orders}
          loading={loading}
          onDelete={handleDeleteTransaction}
          onPrint={handlePrint}
          summary={summary}
        />
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
