CREATE TABLE IF NOT EXISTS transaksi (
  id BIGSERIAL PRIMARY KEY,
  nama_barang VARCHAR(255) NOT NULL,
  harga NUMERIC(12, 2) NOT NULL CHECK (harga > 0),
  jumlah INTEGER NOT NULL CHECK (jumlah > 0),
  total NUMERIC(14, 2) GENERATED ALWAYS AS (harga * jumlah) STORED,
  tanggal TIMESTAMP NOT NULL
);
