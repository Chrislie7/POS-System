const transactionService = require("../services/transactionService");

async function getSummary(_req, res, next) {
  try {
    const summary = await transactionService.getDashboardSummary();

    res.json({
      message: "Ringkasan dashboard berhasil diambil",
      data: summary
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSummary
};
