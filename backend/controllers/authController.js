const pool = require("../db/config");
const bcrypt = require("bcrypt");
const saltRounds = 10; // Número de rondas de hashing (mayor = más seguro, pero más lento)

const registerUser = async (req, res) => {
  const { nombre, apellido, numero_telefono, email, contraseña } = req.body;

  try {
    // Verificar si el email ya existe
    const [existing] = await pool.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res
        .status(400)
        .json({ message: "Este correo ya está registrado, intenta con otro." });
    }

    // Hash de la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

    await pool.query(
      `INSERT INTO usuarios (nombre, apellido, numero_telefono, email, contraseña)
       VALUES (?, ?, ?, ?, ?)`,
      [nombre, apellido, numero_telefono, email, hashedPassword] // Guardamos el hash, no la contraseña en texto plano
    );

    return res.status(201).json({ message: "Usuario registrado con éxito." });
  } catch (error) {
    console.error("Error en el registro:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const loginUser = async (req, res) => {
  const { email, contraseña } = req.body;

  try {
    // Buscar usuario por email
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const usuario = rows[0];
    
    // Comparar contraseña ingresada con el hash almacenado
    const match = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!match) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // Si coincide, devolver datos del usuario (sin contraseña)
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