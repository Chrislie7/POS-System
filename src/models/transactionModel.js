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

module.exports = {
  create,
  findAll,
  remove
};
