const products = require("../constants/products");

async function getProducts(_req, res, next) {
  try {
    res.json({
      message: "Daftar produk berhasil diambil",
      data: products
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts
};
