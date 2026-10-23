const express = require("express");
const router = express.Router();
const { crearOrden, obtenerOrdenes, actualizarOrden, registrarAbono, eliminarOrden } = require("../controllers/ordenesController");

router.post("/", crearOrden);
router.get("/", obtenerOrdenes);
router.put("/:id", actualizarOrden);
router.put("/:id/abono", registrarAbono);
router.delete("/:id", eliminarOrden);

module.exports = router;
