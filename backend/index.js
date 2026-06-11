const express = require("express");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");

const app = express();

const corsOptions = {
  origin: [
    "https://emmit.castelancarpinteyro.com",
    "http://emmit.castelancarpinteyro.com",
    "http://localhost:5173",
  ],
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

// rutas
app.use("/api/products", productRoutes);
app.use("/api", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
