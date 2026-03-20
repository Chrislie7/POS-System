import { useEffect, useState } from "react";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import SummaryCard from "./components/SummaryCard";
import { createTransaction, deleteTransaction, getTransactions } from "./services/transactionService";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function loadTransactions() {
    try {
      setLoading(true);
      setError("");
      const data = await getTransactions();
      setTransactions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  async function handleAddTransaction(formData) {
    try {
      setSubmitting(true);
      setError("");
      await createTransaction(formData);
      await loadTransactions();
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
      await loadTransactions();
    } catch (err) {
      setError(err.message);
    }
  }

  const grandTotal = transactions.reduce((sum, item) => sum + Number(item.total), 0);

  return (
    <main className="page-shell">
      <section className="hero-card">
        <div>
          <p className="eyebrow">POS Porto</p>
          <h1>Kelola transaksi dengan cepat dan rapi.</h1>
          <p className="hero-text">
            Input barang, hitung total otomatis, lalu simpan ke backend Express dan PostgreSQL.
          </p>
        </div>
        <SummaryCard total={grandTotal} count={transactions.length} />
      </section>

      {error ? <div className="alert">{error}</div> : null}

      <section className="content-grid">
        <TransactionForm onSubmit={handleAddTransaction} submitting={submitting} />
        <TransactionList
          transactions={transactions}
          loading={loading}
          onDelete={handleDeleteTransaction}
          grandTotal={grandTotal}
        />
      </section>
    </main>
  );
}

export default App;
