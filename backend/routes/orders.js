const express = require("express");
const router = express.Router();
const pool = require("../db/config"); // ajusta según tu proyecto

router.post("/create", async (req, res) => {
  const { id_usuario, entrega_estimada } = req.body;

  try {
    const [rows] = await pool.query("CALL sp_CrearPedido(?, ?)", [
      id_usuario,
      entrega_estimada,
    ]);

    const id_pedido = rows[0][0].id_pedido;

    res.status(200).json({ id_pedido });
  } catch (error) {
    console.error("Error al crear pedido:", error);
    res.status(500).json({ message: "No se pudo crear el pedido" });
  }
});

module.exports = router;
