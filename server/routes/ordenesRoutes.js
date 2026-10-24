const express = require("express");
const router = express.Router();
const { crearOrden, obtenerOrdenes, actualizarOrden, registrarAbono, eliminarOrden } = require("../controllers/ordenesController");
const pool = require("../config/db");

// 1. Rutas específicas SIN parámetros dinámicos van PRIMERO
router.get("/abonos", async (req, res) => {
  try {
    const query = `
      SELECT a.*, o.cliente_nombre 
      FROM abonos a
      LEFT JOIN ordenes_graduacion o ON a.orden_id = o.id
      ORDER BY a.fecha DESC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener abonos:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/", crearOrden);
router.get("/", obtenerOrdenes);

// 2. Rutas específicas con sub-recurso
router.put("/:id/abono", registrarAbono);

// 3. Rutas con parámetros dinámicos :id van al FINAL
router.put("/:id", actualizarOrden);
router.delete("/:id", eliminarOrden);

module.exports = router;
