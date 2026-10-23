const express = require("express");
const router = express.Router();
const { login, obtenerUsuarios, crearUsuario, eliminarUsuario } = require("../controllers/authController");

router.post("/login", login);
router.get("/usuarios", obtenerUsuarios);
router.post("/usuarios", crearUsuario);
router.delete("/usuarios/:id", eliminarUsuario);

module.exports = router;
