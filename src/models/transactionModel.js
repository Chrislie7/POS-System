const pool = require("../config/db");

async function create({ nama_barang, harga, jumlah, tanggal }) {
  const query = `
    INSERT INTO transaksi (nama_barang, harga, jumlah, tanggal)
    VALUES ($1, $2, $3, $4)
    RETURNING id, nama_barang, harga, jumlah, total, tanggal
  `;

  const values = [nama_barang, harga, jumlah, tanggal];
  const result = await pool.query(query, values);

  return result.rows[0];
}

async function findAll() {
  const query = `
    SELECT id, nama_barang, harga, jumlah, total, tanggal
    FROM transaksi
    ORDER BY tanggal DESC, id DESC
  `;

  const result = await pool.query(query);
  return result.rows;
}

async function remove(id) {
  const query = `
    DELETE FROM transaksi
    WHERE id = $1
    RETURNING id, nama_barang, harga, jumlah, total, tanggal
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
}

async function getDashboardSummary() {
  const totalsQuery = `
    SELECT
      COUNT(*)::int AS total_transaksi,
      COALESCE(SUM(total), 0)::numeric AS total_penjualan,
      COALESCE(SUM(jumlah), 0)::int AS total_item,
      COALESCE(AVG(total), 0)::numeric AS rata_rata_transaksi
    FROM transaksi
  `;

  const todayQuery = `
    SELECT
      COUNT(*)::int AS transaksi_hari_ini,
      COALESCE(SUM(total), 0)::numeric AS penjualan_hari_ini
    FROM transaksi
    WHERE DATE(tanggal) = CURRENT_DATE
  `;

  const topProductsQuery = `
    SELECT
      nama_barang,
      COUNT(*)::int AS frekuensi,
      COALESCE(SUM(jumlah), 0)::int AS total_jumlah,
      COALESCE(SUM(total), 0)::numeric AS total_penjualan
    FROM transaksi
    GROUP BY nama_barang
    ORDER BY total_penjualan DESC, total_jumlah DESC
    LIMIT 5
  `;

  const recentQuery = `
    SELECT id, nama_barang, harga, jumlah, total, tanggal
    FROM transaksi
    ORDER BY tanggal DESC, id DESC
    LIMIT 5
  `;

  const [totalsResult, todayResult, topProductsResult, recentResult] = await Promise.all([
    pool.query(totalsQuery),
    pool.query(todayQuery),
    pool.query(topProductsQuery),
    pool.query(recentQuery)
  ]);

  return {
    totals: totalsResult.rows[0],
    today: todayResult.rows[0],
    topProducts: topProductsResult.rows,
    recentTransactions: recentResult.rows
  };
}

module.exports = {
  create,
  findAll,
  remove,
  getDashboardSummary
};
