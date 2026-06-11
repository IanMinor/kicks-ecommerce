const express = require("express");
const router = express.Router();
const pool = require("../db/config");

router.post("/create", async (req, res) => {
  const { id_usuario, entrega_estimada } = req.body;

  if (!Number.isInteger(Number(id_usuario)) || Number(id_usuario) < 1) {
    return res.status(400).json({ message: "ID de usuario inválido" });
  }

  if (!entrega_estimada || Number.isNaN(Date.parse(entrega_estimada))) {
    return res.status(400).json({ message: "Fecha de entrega inválida" });
  }

  try {
    const [cartRows] = await pool.query(
      `SELECT C.id_carrito
       FROM carritos C
       JOIN carritos_productos CP ON C.id_carrito = CP.id_carrito
       WHERE C.id_usuario = ? AND C.estado_carrito = 1
       LIMIT 1`,
      [id_usuario]
    );

    if (cartRows.length === 0) {
      return res.status(400).json({ message: "No hay productos en el carrito" });
    }

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
