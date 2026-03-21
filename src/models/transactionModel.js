const pool = require("../config/db");

function buildOrderCode() {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`;
}

function mapOrderRows(rows) {
  const orderMap = new Map();

  rows.forEach((row) => {
    if (!orderMap.has(row.order_id)) {
      orderMap.set(row.order_id, {
        id: row.order_id,
        order_code: row.order_code,
        customer_name: row.customer_name,
        total: row.order_total,
        tanggal: row.tanggal,
        items: []
      });
    }

    const order = orderMap.get(row.order_id);

    if (row.item_id) {
      order.items.push({
        id: row.item_id,
        nama_barang: row.nama_barang,
        harga: row.harga,
        jumlah: row.jumlah,
        total: row.item_total
      });
    }
  });

  return Array.from(orderMap.values());
}

async function create({ customer_name, tanggal, items }) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const orderTotal = items.reduce((sum, item) => sum + item.harga * item.jumlah, 0);
    const orderCode = buildOrderCode();

    const orderResult = await client.query(
      `
        INSERT INTO orders (order_code, customer_name, total, tanggal)
        VALUES ($1, $2, $3, $4)
        RETURNING id, order_code, customer_name, total, tanggal
      `,
      [orderCode, customer_name, orderTotal, tanggal]
    );

    const order = orderResult.rows[0];

    for (const item of items) {
      await client.query(
        `
          INSERT INTO order_items (order_id, nama_barang, harga, jumlah)
          VALUES ($1, $2, $3, $4)
        `,
        [order.id, item.nama_barang, item.harga, item.jumlah]
      );
    }

    const detailResult = await client.query(
      `
        SELECT
          o.id AS order_id,
          o.order_code,
          o.customer_name,
          o.total AS order_total,
          o.tanggal,
          i.id AS item_id,
          i.nama_barang,
          i.harga,
          i.jumlah,
          i.total AS item_total
        FROM orders o
        LEFT JOIN order_items i ON i.order_id = o.id
        WHERE o.id = $1
        ORDER BY i.id ASC
      `,
      [order.id]
    );

    await client.query("COMMIT");
    return mapOrderRows(detailResult.rows)[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function findAll() {
  const result = await pool.query(`
    SELECT
      o.id AS order_id,
      o.order_code,
      o.customer_name,
      o.total AS order_total,
      o.tanggal,
      i.id AS item_id,
      i.nama_barang,
      i.harga,
      i.jumlah,
      i.total AS item_total
    FROM orders o
    LEFT JOIN order_items i ON i.order_id = o.id
    ORDER BY o.tanggal DESC, o.id DESC, i.id ASC
  `);

  return mapOrderRows(result.rows);
}

async function remove(id) {
  const result = await pool.query(
    `
      DELETE FROM orders
      WHERE id = $1
      RETURNING id, order_code, customer_name, total, tanggal
    `,
    [id]
  );

  return result.rows[0] || null;
}

async function getDashboardSummary() {
  const totalsQuery = `
    SELECT
      COUNT(*)::int AS total_order,
      COALESCE(SUM(total), 0)::numeric AS total_penjualan,
      COALESCE(AVG(total), 0)::numeric AS rata_rata_order
    FROM orders
  `;

  const todayQuery = `
    SELECT
      COUNT(*)::int AS order_hari_ini,
      COALESCE(SUM(total), 0)::numeric AS penjualan_hari_ini
    FROM orders
    WHERE DATE(tanggal) = CURRENT_DATE
  `;

  const itemsQuery = `
    SELECT COALESCE(SUM(jumlah), 0)::int AS total_item
    FROM order_items
  `;

  const topProductsQuery = `
    SELECT
      nama_barang,
      COALESCE(SUM(jumlah), 0)::int AS total_jumlah,
      COALESCE(SUM(total), 0)::numeric AS total_penjualan
    FROM order_items
    GROUP BY nama_barang
    ORDER BY total_jumlah DESC, total_penjualan DESC
    LIMIT 6
  `;

  const recentOrdersQuery = `
    SELECT id, order_code, customer_name, total, tanggal
    FROM orders
    ORDER BY tanggal DESC, id DESC
    LIMIT 5
  `;

  const [totalsResult, todayResult, itemsResult, topProductsResult, recentOrdersResult] = await Promise.all([
    pool.query(totalsQuery),
    pool.query(todayQuery),
    pool.query(itemsQuery),
    pool.query(topProductsQuery),
    pool.query(recentOrdersQuery)
  ]);

  return {
    totals: {
      ...totalsResult.rows[0],
      total_item: itemsResult.rows[0].total_item
    },
    today: todayResult.rows[0],
    topProducts: topProductsResult.rows,
    recentOrders: recentOrdersResult.rows
  };
}

module.exports = {
  create,
  findAll,
  remove,
  getDashboardSummary
};
