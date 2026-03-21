# POS Porto Backend + Frontend

Aplikasi POS sederhana dengan backend Express + PostgreSQL dan frontend React. Tampilan kini lebih visual, minim teks, kaya ikon, responsif untuk HP, iPad, dan desktop, serta memakai model order di mana satu order bisa berisi beberapa minuman atau item sekaligus.

## Fitur

- Login admin sederhana berbasis token
- Order per orang / per meja
- Satu order bisa berisi banyak item
- Produk preset bergambar ikon
- Custom order di kartu terakhir
- Dashboard ringkasan penjualan
- Export order ke Excel
- Print struk per order
- Layout responsif untuk mobile, tablet, dan desktop

## Kredensial Admin Default

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_TOKEN=pos-porto-admin-token
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

Contoh production:

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

## Payload Membuat Order

```json
{
  "customer_name": "Meja 3 / Budi",
  "tanggal": "2026-03-21T10:30:00.000Z",
  "items": [
    {
      "nama_barang": "Kopi Susu",
      "harga": 18000,
      "jumlah": 2
    },
    {
      "nama_barang": "Matcha Latte",
      "harga": 24000,
      "jumlah": 1
    }
  ]
}
```

## Schema Tabel Baru

Gunakan schema ini agar satu order bisa memiliki banyak item:

```sql
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  order_code VARCHAR(40) NOT NULL UNIQUE,
  customer_name VARCHAR(255) NOT NULL,
  total NUMERIC(14, 2) NOT NULL CHECK (total >= 0),
  tanggal TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  nama_barang VARCHAR(255) NOT NULL,
  harga NUMERIC(12, 2) NOT NULL CHECK (harga > 0),
  jumlah INTEGER NOT NULL CHECK (jumlah > 0),
  total NUMERIC(14, 2) GENERATED ALWAYS AS (harga * jumlah) STORED
);
```

## Catatan Migrasi

Karena model data berubah dari `transaksi` tunggal menjadi `orders` + `order_items`, untuk environment lama paling aman:
1. Backup data lama bila perlu.
2. Drop tabel lama `transaksi`.
3. Jalankan schema baru di atas.
4. Redeploy backend dan frontend.
