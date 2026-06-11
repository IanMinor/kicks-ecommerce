const express = require("express");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");

const app = express();

const corsOptions = {
  // Se modifico
  origin: ['https://emmit.castelancarpinteyro.com', 'http://emmit.castelancarpinteyro.com'],
  optionsSuccessStatus: 200,
  credentials: true //No estaba
};
app.use(cors(corsOptions));

app.use(express.json());

// rutas
app.use("/api/products", productRoutes);
app.use("/api", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Conexión a la base de datos
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
