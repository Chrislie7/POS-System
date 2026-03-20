const XLSX = require("xlsx");
const transactionService = require("../services/transactionService");

async function createTransaction(req, res, next) {
  try {
    const transaction = await transactionService.createTransaction(req.body);

    res.status(201).json({
      message: "Transaksi berhasil ditambahkan",
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
      message: "Daftar transaksi berhasil diambil",
      data: transactions
    });
  } catch (error) {
    next(error);
  }
}

async function exportTransactions(_req, res, next) {
  try {
    const transactions = await transactionService.getAllTransactions();
    const rows = transactions.map((item) => ({
      ID: item.id,
      "Nama Barang": item.nama_barang,
      Harga: Number(item.harga),
      Jumlah: item.jumlah,
      Total: Number(item.total),
      Tanggal: item.tanggal
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transaksi");

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx"
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="transaksi-${new Date().toISOString().slice(0, 10)}.xlsx"`
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
      message: "Transaksi berhasil dihapus",
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
