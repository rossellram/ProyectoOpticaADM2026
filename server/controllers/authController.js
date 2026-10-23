const pool = require("../config/db");

// Iniciar Sesión
const login = async (req, res) => {
  try {
    const { usuario, password } = req.body;

    const result = await pool.query(
      "SELECT id, nombre, usuario, rol FROM usuarios WHERE usuario = $1 AND password = $2;",
      [usuario, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, error: "Usuario o contraseña incorrectos." });
    }

    res.json({ success: true, usuario: result.rows[0] });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtener lista de usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, nombre, usuario, rol, creado_en FROM usuarios ORDER BY id ASC;");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Crear nuevo usuario
const crearUsuario = async (req, res) => {
  try {
    const { nombre, usuario, password, rol } = req.body;

    const result = await pool.query(
      "INSERT INTO usuarios (nombre, usuario, password, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, usuario, rol;",
      [nombre, usuario, password, rol || "RECEPCION"]
    );

    res.status(201).json({ success: true, usuario: result.rows[0] });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    if (error.code === "23505") {
      return res.status(400).json({ success: false, error: "El nombre de usuario ya existe." });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

// Eliminar usuario
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM usuarios WHERE id = $1;", [id]);
    res.json({ success: true, message: "Usuario eliminado correctamente." });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { login, obtenerUsuarios, crearUsuario, eliminarUsuario };
