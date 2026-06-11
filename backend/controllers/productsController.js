const pool = require("../db/config");

const getAllProducts = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM productos");

    res.json(rows);
  } catch (err) {
    console.error("Error al obtener productos:", err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

module.exports = { getAllProducts };
