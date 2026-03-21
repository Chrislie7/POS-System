const transactionModel = require("../models/transactionModel");

function createValidationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function validateItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw createValidationError("Order harus memiliki minimal satu item");
  }

  return items.map((item) => {
    const namaBarang = String(item.nama_barang || "").trim();
    const harga = Number(item.harga);
    const jumlah = Number(item.jumlah);

    if (!namaBarang) {
      throw createValidationError("Nama item tidak boleh kosong");
    }

    if (Number.isNaN(harga) || harga <= 0) {
      throw createValidationError("Harga item harus lebih dari 0");
    }

    if (!Number.isInteger(jumlah) || jumlah <= 0) {
      throw createValidationError("Jumlah item harus bilangan bulat lebih dari 0");
    }

    return {
      nama_barang: namaBarang,
      harga,
      jumlah
    };
  });
}

function validatePayload(payload) {
  const customerName = String(payload.customer_name || "").trim();
  const tanggal = payload.tanggal ? new Date(payload.tanggal) : new Date();

  if (!customerName) {
    throw createValidationError("Nama order wajib diisi");
  }

  if (Number.isNaN(tanggal.getTime())) {
    throw createValidationError("Tanggal order tidak valid");
  }

  return {
    customer_name: customerName,
    tanggal: tanggal.toISOString(),
    items: validateItems(payload.items)
  };
}

async function createTransaction(payload) {
  const validPayload = validatePayload(payload);
  return transactionModel.create(validPayload);
}

async function getAllTransactions() {
  return transactionModel.findAll();
}

async function getDashboardSummary() {
  return transactionModel.getDashboardSummary();
}

async function deleteTransaction(id) {
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    throw createValidationError("Parameter id harus berupa bilangan bulat lebih dari 0");
  }

  const deletedTransaction = await transactionModel.remove(parsedId);

  if (!deletedTransaction) {
    const error = new Error("Order tidak ditemukan");
    error.statusCode = 404;
    throw error;
  }

  return deletedTransaction;
}

module.exports = {
  createTransaction,
  getAllTransactions,
  getDashboardSummary,
  deleteTransaction
};
