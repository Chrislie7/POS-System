const express = require("express");
const cors = require("cors");
const transactionRoutes = require("./routes/transactionRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "POS Porto API aktif"
  });
});

app.use("/api/transaksi", transactionRoutes);

app.use(errorHandler);

module.exports = app;
