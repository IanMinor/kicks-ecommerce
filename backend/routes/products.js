const express = require("express");
const router = express.Router();
const pool = require("../db/config");

router.get("/", async (req, res) => {
  function normalizeParam(param) {
    if (!param) return [];
    return Array.isArray(param) ? param : [param];
  }

  const minPrice = parseFloat(req.query.minPrice) || 0;
  const gender = normalizeParam(req.query.gender);
  const size = normalizeParam(req.query.size);
  const color = normalizeParam(req.query.color);
  const category = normalizeParam(req.query.category);
  let query = `SELECT * FROM productos WHERE precio >= ?`;
  let params = [minPrice];

  // Manejo de arrays en query (si vienen del frontend como múltiples ?key=value)
  const handleArrayFilter = (key, values) => {
    if (Array.isArray(values) && values.length > 0) {
      query += ` AND LOWER(${key}) IN (${values.map(() => "?").join(",")})`;
      params.push(...values.map((v) => v.toLowerCase()));
    }
  };

  handleArrayFilter("genero", gender);
  handleArrayFilter("color", color);
  handleArrayFilter("categoria", category);

  if (Array.isArray(size) && size.length > 0) {
    query += ` AND talla IN (${size.map(() => "?").join(",")})`;
    params.push(...size);
  }

  try {
    const [rows] = await pool.query(query, params);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error al obtener productos filtrados:", error);
    res.status(500).json({ message: "No se pudieron obtener los productos", error: error.message, db: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT
    }});
  }
});

// Obtener un solo producto por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {    const [rows] = await pool.query(
      "SELECT * FROM productos WHERE id_producto = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ message: "No se pudo obtener el producto" });
  }
});

// Obtener filtros únicos desde Productos
router.get("/filters/options", async (req, res) => {  try {
    const [categories] = await pool.query(
      "SELECT DISTINCT categoria FROM productos"
    );
    const [colors] = await pool.query("SELECT DISTINCT color FROM productos");
    const [sizes] = await pool.query("SELECT DISTINCT talla FROM productos");

    res.status(200).json({
      categories: categories.map((c) => c.categoria),
      colors: colors.map((c) => c.color),
      sizes: sizes.map((s) => s.talla),
    });
  } catch (error) {
    console.error("Error al obtener filtros:", error);
    res.status(500).json({ message: "No se pudieron obtener los filtros" });
  }
});

module.exports = router;
