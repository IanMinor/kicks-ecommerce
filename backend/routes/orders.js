const express = require("express");
const router = express.Router();
const pool = require("../db/config");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);

router.post("/create", async (req, res) => {
  const { entrega_estimada, shipping_address } = req.body;
  const id_usuario = req.user.id_usuario;

  if (!entrega_estimada || Number.isNaN(Date.parse(entrega_estimada))) {
    return res.status(400).json({ message: "Fecha de entrega inválida" });
  }

  if (
    shipping_address &&
    (typeof shipping_address.address !== "string" ||
      shipping_address.address.trim().length < 5)
  ) {
    return res.status(400).json({ message: "Dirección de envío inválida" });
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

    if (shipping_address) {
      await pool.query(
        `INSERT INTO direcciones (id_usuario, pais, estado, codigo_postal, ciudad, domicilio)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          id_usuario,
          shipping_address.country || "",
          shipping_address.state || "",
          shipping_address.zipCode || "",
          shipping_address.city || "",
          shipping_address.address.trim(),
        ]
      );
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

router.get("/:id_pedido", async (req, res) => {
  const { id_pedido } = req.params;
  const id_usuario = req.user.id_usuario;

  if (!Number.isInteger(Number(id_pedido)) || Number(id_pedido) < 1) {
    return res.status(400).json({ message: "ID de pedido inválido" });
  }

  try {
    const [orderRows] = await pool.query(
      `SELECT P.id_pedido, P.fecha_pedido, P.entrega_estimada, P.subtotal, P.total,
        DP.estado_pedido
       FROM pedidos P
       LEFT JOIN detalles_pedido DP ON P.id_pedido = DP.id_pedido
       WHERE P.id_pedido = ? AND P.id_usuario = ?`,
      [id_pedido, id_usuario]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    const [items] = await pool.query(
      `SELECT PR.id_producto, PR.nombre_producto, PR.descripcion, PR.precio,
        PR.color, PR.talla, PR.imagen, CP.cantidad
       FROM pedidos P
       JOIN carritos_productos CP ON P.id_carrito = CP.id_carrito
       JOIN productos PR ON CP.id_producto = PR.id_producto
       WHERE P.id_pedido = ? AND P.id_usuario = ?`,
      [id_pedido, id_usuario]
    );

    res.status(200).json({ ...orderRows[0], items });
  } catch (error) {
    console.error("Error al obtener pedido:", error);
    res.status(500).json({ message: "No se pudo obtener el pedido" });
  }
});

module.exports = router;
