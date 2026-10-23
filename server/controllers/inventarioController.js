const pool = require("../config/db");

// Obtener todo el inventario
const obtenerInventario = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM inventario ORDER BY id DESC;");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener inventario:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Crear producto en inventario
const crearProducto = async (req, res) => {
  try {
    const { codigo, marca, modelo, color, precioCosto, precioVenta, stock } = req.body;

    const query = `
      INSERT INTO inventario (codigo, marca, modelo, color, precio_costo, precio_venta, stock)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
    `;
    const values = [codigo, marca, modelo, color, precioCosto || 0, precioVenta || 0, stock || 0];

    const result = await pool.query(query, values);
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error al crear producto:", error);
    if (error.code === "23505") {
      return res.status(400).json({ success: false, error: "El código de producto ya existe." });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

// Actualizar producto
const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo, marca, modelo, color, precioCosto, precioVenta, stock } = req.body;

    const query = `
      UPDATE inventario SET
        codigo = $1, marca = $2, modelo = $3, color = $4,
        precio_costo = $5, precio_venta = $6, stock = $7
      WHERE id = $8 RETURNING *;
    `;
    const values = [codigo, marca, modelo, color, precioCosto || 0, precioVenta || 0, stock || 0, id];

    const result = await pool.query(query, values);
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Eliminar producto
const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM inventario WHERE id = $1;", [id]);
    res.json({ success: true, message: "Producto eliminado correctamente." });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { obtenerInventario, crearProducto, actualizarProducto, eliminarProducto };
