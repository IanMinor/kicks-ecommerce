const pool = require("../db/config");

const addToCart = async (req, res) => {
  const { id_usuario, id_producto, cantidad } = req.body;

  try {
    // Buscar carrito activo
    const [carrito] = await pool.query(
      "SELECT id_carrito FROM carritos WHERE id_usuario = ? AND estado_carrito = 1",
      [id_usuario]
    );

    let id_carrito;

    if (carrito.length === 0) {
      // Crear carrito nuevo
      const [result] = await pool.query(
        "INSERT INTO carritos (id_usuario, estado_carrito) VALUES (?, 1)",
        [id_usuario]
      );
      id_carrito = result.insertId;
    } else {
      id_carrito = carrito[0].id_carrito;
    }

    // Verificar si ya existe el producto en el carrito
    const [existe] = await pool.query(
      "SELECT * FROM carritos_productos WHERE id_carrito = ? AND id_producto = ?",
      [id_carrito, id_producto]
    );

    if (existe.length > 0) {
      // Ya está, actualizar cantidad
      await pool.query(
        "UPDATE carritos_productos SET cantidad = cantidad + ? WHERE id_carrito = ? AND id_producto = ?",
        [cantidad, id_carrito, id_producto]
      );
    } else {
      // Agregar nuevo producto
      await pool.query(
        "INSERT INTO carritos_productos (id_carrito, id_producto, cantidad) VALUES (?, ?, ?)",
        [id_carrito, id_producto, cantidad]
      );
    }

    // ✅ Aquí está lo que faltaba
    res.status(200).json({ message: "Producto agregado al carrito" });
  } catch (error) {
    console.error("Error al agregar producto:", error);
    res.status(500).json({ message: "Error al agregar producto al carrito" });
  }
};

module.exports = { addToCart };
