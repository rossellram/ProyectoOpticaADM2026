const express = require("express");
const router = express.Router();
const { obtenerOrdenes, guardarOrden, actualizarOrden, registrarAbono, eliminarOrden } = require("../controllers/ordenesController");

router.get("/", obtenerOrdenes);
router.post("/", guardarOrden);
router.put("/:id", actualizarOrden);
router.put("/:id/abono", registrarAbono);
router.delete("/:id", eliminarOrden);

module.exports = router;
