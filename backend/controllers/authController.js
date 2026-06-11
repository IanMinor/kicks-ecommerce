const pool = require("../db/config");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

const registerUser = async (req, res) => {
  const { nombre, apellido, numero_telefono, email, contraseña } = req.body;

  if (
    !isNonEmptyString(nombre) ||
    !isNonEmptyString(apellido) ||
    !isNonEmptyString(numero_telefono) ||
    !isNonEmptyString(email) ||
    !isNonEmptyString(contraseña)
  ) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Correo inválido" });
  }

  if (!/^\d{10}$/.test(numero_telefono)) {
    return res.status(400).json({ message: "El teléfono debe tener 10 dígitos" });
  }

  if (contraseña.length < 4) {
    return res.status(400).json({ message: "La contraseña debe tener al menos 4 caracteres" });
  }

  try {
    const [existing] = await pool.query(
      "SELECT id_usuario FROM usuarios WHERE email = ?",
      [email.trim().toLowerCase()]
    );

    if (existing.length > 0) {
      return res
        .status(400)
        .json({ message: "Este correo ya está registrado, intenta con otro." });
    }

    const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

    const [result] = await pool.query(
      `INSERT INTO usuarios (nombre, apellido, numero_telefono, email, contraseña)
       VALUES (?, ?, ?, ?, ?)`,
      [
        nombre.trim(),
        apellido.trim(),
        numero_telefono.trim(),
        email.trim().toLowerCase(),
        hashedPassword,
      ]
    );

    return res.status(201).json({
      id_usuario: result.insertId,
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      email: email.trim().toLowerCase(),
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const loginUser = async (req, res) => {
  const { email, contraseña } = req.body;

  if (!isNonEmptyString(email) || !isNonEmptyString(contraseña)) {
    return res.status(400).json({ message: "Email y contraseña son obligatorios" });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Correo inválido" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email.trim().toLowerCase()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const usuario = rows[0];
    const match = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!match) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    return res.status(200).json({
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
    });
  } catch (error) {
    console.error("Error en el login:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = { registerUser, loginUser };
