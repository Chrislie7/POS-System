function SummaryCard({ total, count }) {
  return (
    <div className="summary-card">
      <p>Ringkasan hari ini</p>
      <strong>Rp {formatCurrency(total)}</strong>
      <span>{count} transaksi tersimpan</span>
    </div>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID").format(Number(value) || 0);
}

export default SummaryCard;
