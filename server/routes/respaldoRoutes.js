const express = require("express");
const router = express.Router();
const { generarRespaldo } = require("../controllers/respaldoController");

router.post("/generar", generarRespaldo);

module.exports = router;
