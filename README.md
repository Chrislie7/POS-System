# POS Porto Backend + Frontend

Backend Node.js menggunakan Express dan PostgreSQL untuk sistem POS sederhana, dilengkapi frontend React yang clean dan ringan.

## Fitur Backend

- Tambah transaksi
- Ambil semua transaksi
- Hapus transaksi
- Validasi input dasar
- Error handling dasar untuk request dan database

## Fitur Frontend

- Input nama barang
- Input harga
- Input jumlah
- Auto hitung total
- Tambah transaksi ke list
- Tampilkan list transaksi dari backend
- Tampilkan total keseluruhan
- Terhubung ke backend dengan `fetch`
- Menggunakan environment variable untuk URL API

## Struktur Folder

```text
.
|-- client
|   |-- src
|   |   |-- components
|   |   |   |-- SummaryCard.jsx
|   |   |   |-- TransactionForm.jsx
|   |   |   `-- TransactionList.jsx
|   |   |-- services
|   |   |   `-- transactionService.js
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |   `-- styles.css
|   |-- .env.example
|   |-- index.html
|   |-- package.json
|   `-- vite.config.js
|-- src
|   |-- config
|   |   `-- db.js
|   |-- controllers
|   |   `-- transactionController.js
|   |-- middlewares
|   |   `-- errorHandler.js
|   |-- models
|   |   `-- transactionModel.js
|   |-- routes
|   |   `-- transactionRoutes.js
|   `-- services
|       `-- transactionService.js
|-- sql
|   `-- schema.sql
|-- .env.example
|-- package.json
|-- README.md
`-- server.js
```

## Instalasi Backend

```bash
npm install
```

## Menjalankan Backend

```bash
npm run dev
```

atau

```bash
npm start
```

## Instalasi Frontend

Masuk ke folder `client`, lalu install dependency:

```bash
cd client
npm install
```

## Menjalankan Frontend

Di folder `client`:

```bash
npm run dev
```

Secara default Vite akan berjalan di `http://localhost:5173`.

## Environment Variable Backend

Salin `.env.example` menjadi `.env`, lalu isi sesuai database PostgreSQL kamu:

```env
PORT=3000
DB_HOST=aws-0-ap-southeast-1.pooler.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres.xxxxxxxxxxxxxxxx
DB_PASSWORD=your_database_password
DB_SSL=true
```

## Environment Variable Frontend

Salin `client/.env.example` menjadi `client/.env`:

```env
VITE_API_URL=http://localhost:3000/api/transaksi
```

Jika backend kamu berjalan di domain atau port lain, cukup ubah `VITE_API_URL` tanpa perlu mengubah kode React.

## Cara Kerja Koneksi Frontend ke Backend

- Frontend memanggil endpoint dari `VITE_API_URL`
- Saat tambah transaksi, React mengirim `POST` ke backend lalu me-refresh data dari database
- Saat hapus transaksi, React mengirim `DELETE` ke backend lalu me-refresh data dari database
- Saat halaman dibuka, React mengambil ulang semua transaksi dengan `GET`

Dengan alur ini, data yang tampil di frontend selalu mengikuti data terbaru yang tersimpan di PostgreSQL.

## Schema Tabel

Jalankan isi file `sql/schema.sql` di database PostgreSQL:

```sql
CREATE TABLE IF NOT EXISTS transaksi (
  id BIGSERIAL PRIMARY KEY,
  nama_barang VARCHAR(255) NOT NULL,
  harga NUMERIC(12, 2) NOT NULL CHECK (harga > 0),
  jumlah INTEGER NOT NULL CHECK (jumlah > 0),
  total NUMERIC(12, 2) NOT NULL CHECK (total > 0),
  tanggal TIMESTAMP NOT NULL
);
```

## API Endpoint

### 1. Tambah transaksi

`POST /api/transaksi`

Request body:

```json
{
  "nama_barang": "Kopi Susu",
  "harga": 18000,
  "jumlah": 2,
  "tanggal": "2026-03-20T10:00:00.000Z"
}
```

Catatan: field `total` akan dihitung otomatis oleh backend.

### 2. Ambil semua transaksi

`GET /api/transaksi`

### 3. Hapus transaksi

`DELETE /api/transaksi/:id`

## Cara Koneksi ke Supabase PostgreSQL

1. Buka project kamu di Supabase.
2. Masuk ke menu `Project Settings` > `Database`.
3. Ambil nilai berikut:
   - Host
   - Port
   - Database name
   - User
   - Password
4. Masukkan nilai tersebut ke file `.env`.
5. Jika memakai Supabase Pooler, biasanya gunakan:
   - `DB_HOST`: host pooler dari Supabase
   - `DB_PORT`: `6543`
   - `DB_SSL`: `true`
6. Jalankan schema `sql/schema.sql` di SQL Editor Supabase.
7. Jalankan backend dengan `npm run dev`.
8. Jalankan frontend dengan `cd client` lalu `npm run dev`.
