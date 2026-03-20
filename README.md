# POS Porto Backend + Frontend

Aplikasi POS sederhana dengan backend Express + PostgreSQL dan frontend React. Fitur utamanya tetap ringan, tetapi sekarang sudah mencakup login admin sederhana, dashboard ringkasan penjualan, produk preset, export Excel, dan print struk.

## Fitur

- Login admin sederhana berbasis token
- Tambah transaksi
- Ambil semua transaksi
- Hapus transaksi
- Dashboard ringkasan penjualan
- Produk preset dengan harga otomatis
- Custom order di pilihan terakhir
- Export transaksi ke Excel
- Print struk per transaksi
- Validasi input dasar dan error handling dasar

## Kredensial Admin Default

Atur lewat environment variable backend:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_TOKEN=pos-porto-admin-token
```

## Struktur Folder

```text
.
|-- client
|   |-- src
|   |   |-- components
|   |   |   |-- DashboardOverview.jsx
|   |   |   |-- LoginPage.jsx
|   |   |   |-- ProductPicker.jsx
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
|   |-- constants
|   |   `-- products.js
|   |-- config
|   |   `-- db.js
|   |-- controllers
|   |   |-- authController.js
|   |   |-- dashboardController.js
|   |   |-- productController.js
|   |   `-- transactionController.js
|   |-- middlewares
|   |   |-- authMiddleware.js
|   |   `-- errorHandler.js
|   |-- models
|   |   `-- transactionModel.js
|   |-- routes
|   |   |-- authRoutes.js
|   |   |-- dashboardRoutes.js
|   |   |-- productRoutes.js
|   |   `-- transactionRoutes.js
|   `-- services
|       |-- authService.js
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

## Environment Variable Backend

```env
PORT=3000
DB_HOST=aws-0-ap-southeast-1.pooler.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres.xxxxxxxxxxxxxxxx
DB_PASSWORD=your_database_password
DB_SSL=true
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_TOKEN=pos-porto-admin-token
```

## Instalasi Frontend

```bash
cd client
npm install
```

## Environment Variable Frontend

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Untuk deployment production, contoh:

```env
VITE_API_BASE_URL=https://your-backend-domain.up.railway.app/api
```

## Menjalankan Frontend

```bash
cd client
npm run dev
```

## Endpoint Utama

- `POST /api/auth/login`
- `GET /api/products`
- `GET /api/dashboard/summary`
- `GET /api/transaksi`
- `POST /api/transaksi`
- `DELETE /api/transaksi/:id`
- `GET /api/transaksi/export/excel`

Semua endpoint selain login memerlukan header:

```http
Authorization: Bearer <ADMIN_TOKEN>
```

## Request Login

```json
{
  "username": "admin",
  "password": "admin123"
}
```

## Schema Tabel

Gunakan schema ini di PostgreSQL atau Supabase agar kolom `total` dihitung otomatis oleh database:

```sql
CREATE TABLE IF NOT EXISTS transaksi (
  id BIGSERIAL PRIMARY KEY,
  nama_barang VARCHAR(255) NOT NULL,
  harga NUMERIC(12, 2) NOT NULL CHECK (harga > 0),
  jumlah INTEGER NOT NULL CHECK (jumlah > 0),
  total NUMERIC(14, 2) GENERATED ALWAYS AS (harga * jumlah) STORED,
  tanggal TIMESTAMP NOT NULL
);
```

## Catatan Penggunaan

- Produk preset backend disimpan di `src/constants/products.js`
- Nilai `total` dihitung database, bukan dikirim dari frontend
- Print struk dilakukan dari browser melalui popup print sederhana
- Export Excel dihasilkan dari backend dan diunduh langsung dari frontend
