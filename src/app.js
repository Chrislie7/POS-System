const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const { requireAdmin } = require("./middlewares/authMiddleware");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "POS Porto API aktif"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", requireAdmin, productRoutes);
app.use("/api/dashboard", requireAdmin, dashboardRoutes);
app.use("/api/transaksi", requireAdmin, transactionRoutes);

app.use(errorHandler);

module.exports = app;
