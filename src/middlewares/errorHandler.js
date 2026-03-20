function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;

  if (err.code === "22P02") {
    return res.status(400).json({
      message: "Input tidak valid"
    });
  }

  if (err.code && err.code.startsWith("23")) {
    return res.status(400).json({
      message: "Data transaksi tidak valid"
    });
  }

  return res.status(statusCode).json({
    message: err.message || "Terjadi kesalahan pada server"
  });
}

module.exports = errorHandler;
