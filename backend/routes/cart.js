const express = require("express");
const router = express.Router();
const { addToCart } = require("../controllers/cartController");
const pool = require("../db/config");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);

router.post("/add", addToCart);

router.get("/:id_usuario", async (req, res) => {
  const { id_usuario } = req.params;

  if (!Number.isInteger(Number(id_usuario)) || Number(id_usuario) < 1) {
    return res.status(400).json({ message: "ID de usuario inválido" });
  }

  if (Number(id_usuario) !== Number(req.user.id_usuario)) {
    return res.status(403).json({ message: "No tienes acceso a este carrito" });
  }

  try {
    const [rows] = await pool.query(
      `SELECT CP.id_producto, P.nombre_producto, P.descripcion, P.precio, 
        CP.cantidad, P.color, P.talla, P.imagen      FROM carritos C
      JOIN carritos_productos CP ON C.id_carrito = CP.id_carrito
      JOIN productos P ON CP.id_producto = P.id_producto
       WHERE C.id_usuario = ? AND C.estado_carrito = 1`,
      [id_usuario]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    res.status(500).json({ message: "No se pudo obtener el carrito" });
  }
});

router.delete("/:id_usuario/:id_producto", async (req, res) => {
  const { id_usuario, id_producto } = req.params;

  if (
    !Number.isInteger(Number(id_usuario)) ||
    Number(id_usuario) < 1 ||
    !Number.isInteger(Number(id_producto)) ||
    Number(id_producto) < 1
  ) {
    return res.status(400).json({ message: "Datos de carrito inválidos" });
  }

  if (Number(id_usuario) !== Number(req.user.id_usuario)) {
    return res.status(403).json({ message: "No tienes acceso a este carrito" });
  }

  try {
    // Obtener el carrito activo del usuario
    const [carritoRows] = await pool.query(
      "SELECT id_carrito FROM carritos WHERE id_usuario = ? AND estado_carrito = 1",
      [id_usuario]
    );

    if (carritoRows.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontró un carrito activo" });
    }

    const id_carrito = carritoRows[0].id_carrito;

    // Eliminar producto del carrito
    await pool.query(
      "DELETE FROM carritos_productos WHERE id_carrito = ? AND id_producto = ?",
      [id_carrito, id_producto]
    );

    res.status(200).json({ message: "Producto eliminado del carrito." });
  } catch (error) {
    console.error("Error al eliminar del carrito:", error);
    res.status(500).json({ message: "Error al eliminar producto del carrito" });
  }
});

router.put("/:id_usuario/:id_producto", async (req, res) => {
  const { id_usuario, id_producto } = req.params;
  const { cantidad } = req.body;

  if (
    !Number.isInteger(Number(id_usuario)) ||
    Number(id_usuario) < 1 ||
    !Number.isInteger(Number(id_producto)) ||
    Number(id_producto) < 1 ||
    !Number.isInteger(Number(cantidad)) ||
    Number(cantidad) < 1
  ) {
    return res.status(400).json({ message: "Datos de carrito inválidos" });
  }

  if (Number(id_usuario) !== Number(req.user.id_usuario)) {
    return res.status(403).json({ message: "No tienes acceso a este carrito" });
  }

  try {
    const [carritoRows] = await pool.query(
      "SELECT id_carrito FROM carritos WHERE id_usuario = ? AND estado_carrito = 1",
      [id_usuario]
    );

    if (carritoRows.length === 0) {
      return res.status(404).json({ message: "No se encontró un carrito activo" });
    }

    const id_carrito = carritoRows[0].id_carrito;
    const [result] = await pool.query(
      "UPDATE carritos_productos SET cantidad = ? WHERE id_carrito = ? AND id_producto = ?",
      [cantidad, id_carrito, id_producto]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Producto no encontrado en el carrito" });
    }

    res.status(200).json({ message: "Cantidad actualizada" });
  } catch (error) {
    console.error("Error al actualizar carrito:", error);
    res.status(500).json({ message: "Error al actualizar producto del carrito" });
  }
});

module.exports = router;
