const express = require("express");
const transactionController = require("../controllers/transactionController");

const router = express.Router();

router.get("/", transactionController.getAllTransactions);
router.post("/", transactionController.createTransaction);
router.get("/export/excel", transactionController.exportTransactions);
router.delete("/:id", transactionController.deleteTransaction);

module.exports = router;
