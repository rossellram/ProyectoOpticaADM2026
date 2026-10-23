const express = require("express");
const router = express.Router();
const { obtenerInventario, crearProducto, actualizarProducto, eliminarProducto } = require("../controllers/inventarioController");

router.get("/", obtenerInventario);
router.post("/", crearProducto);
router.put("/:id", actualizarProducto);
router.delete("/:id", eliminarProducto);

module.exports = router;
