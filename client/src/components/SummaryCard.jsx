function SummaryCard({ total, count }) {
  return (
    <div className="summary-card">
      <p>Ringkasan</p>
      <strong>Rp {formatCurrency(total)}</strong>
      <span>{count} order</span>
    </div>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID").format(Number(value) || 0);
}

export default SummaryCard;
