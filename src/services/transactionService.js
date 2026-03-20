const transactionModel = require("../models/transactionModel");

function createValidationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function validatePayload(payload) {
  const { nama_barang, harga, jumlah, tanggal } = payload;

  if (!nama_barang || harga === undefined || jumlah === undefined || !tanggal) {
    throw createValidationError("Field nama_barang, harga, jumlah, dan tanggal wajib diisi");
  }

  const parsedNamaBarang = String(nama_barang).trim();
  const parsedHarga = Number(harga);
  const parsedJumlah = Number(jumlah);
  const parsedTanggal = new Date(tanggal);

  if (!parsedNamaBarang) {
    throw createValidationError("Field nama_barang tidak boleh kosong");
  }

  if (Number.isNaN(parsedHarga) || parsedHarga <= 0) {
    throw createValidationError("Field harga harus berupa angka lebih dari 0");
  }

  if (!Number.isInteger(parsedJumlah) || parsedJumlah <= 0) {
    throw createValidationError("Field jumlah harus berupa bilangan bulat lebih dari 0");
  }

  if (Number.isNaN(parsedTanggal.getTime())) {
    throw createValidationError("Field tanggal harus berupa tanggal yang valid");
  }

  return {
    nama_barang: parsedNamaBarang,
    harga: parsedHarga,
    jumlah: parsedJumlah,
    tanggal: parsedTanggal.toISOString()
  };
}

async function createTransaction(payload) {
  const validPayload = validatePayload(payload);
  return transactionModel.create(validPayload);
}

async function getAllTransactions() {
  return transactionModel.findAll();
}

async function deleteTransaction(id) {
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    throw createValidationError("Parameter id harus berupa bilangan bulat lebih dari 0");
  }

  const deletedTransaction = await transactionModel.remove(parsedId);

  if (!deletedTransaction) {
    const error = new Error("Transaksi tidak ditemukan");
    error.statusCode = 404;
    throw error;
  }

  return deletedTransaction;
}

module.exports = {
  createTransaction,
  getAllTransactions,
  deleteTransaction
};
