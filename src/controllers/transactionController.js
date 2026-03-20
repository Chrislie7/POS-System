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
  deleteTransaction
};
