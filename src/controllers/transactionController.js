const XLSX = require("xlsx");
const transactionService = require("../services/transactionService");

async function createTransaction(req, res, next) {
  try {
    const transaction = await transactionService.createTransaction(req.body);

    res.status(201).json({
      message: "Order berhasil dibuat",
      data: transaction
    });
  } catch (error) {
    next(error);
  }
}

async function getAllTransactions(_req, res, next) {
  try {
    const transactions = await transactionService.getAllTransactions();

    res.json({
      message: "Daftar order berhasil diambil",
      data: transactions
    });
  } catch (error) {
    next(error);
  }
}

async function exportTransactions(_req, res, next) {
  try {
    const orders = await transactionService.getAllTransactions();
    const rows = orders.flatMap((order) =>
      order.items.map((item) => ({
        "Order Code": order.order_code,
        "Nama Order": order.customer_name,
        Tanggal: order.tanggal,
        Item: item.nama_barang,
        Harga: Number(item.harga),
        Jumlah: item.jumlah,
        "Total Item": Number(item.total),
        "Total Order": Number(order.total)
      }))
    );

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx"
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="orders-${new Date().toISOString().slice(0, 10)}.xlsx"`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (error) {
    next(error);
  }
}

async function deleteTransaction(req, res, next) {
  try {
    const deletedTransaction = await transactionService.deleteTransaction(req.params.id);

    res.json({
      message: "Order berhasil dihapus",
      data: deletedTransaction
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createTransaction,
  getAllTransactions,
  exportTransactions,
  deleteTransaction
};
