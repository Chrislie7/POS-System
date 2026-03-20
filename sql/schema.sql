CREATE TABLE IF NOT EXISTS transaksi (
  id BIGSERIAL PRIMARY KEY,
  nama_barang VARCHAR(255) NOT NULL,
  harga NUMERIC(12, 2) NOT NULL CHECK (harga > 0),
  jumlah INTEGER NOT NULL CHECK (jumlah > 0),
  total NUMERIC(12, 2) NOT NULL CHECK (total > 0),
  tanggal TIMESTAMP NOT NULL
);
