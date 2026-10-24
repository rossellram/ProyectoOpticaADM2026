const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const ordenesRoutes = require("./routes/ordenesRoutes");
const authRoutes = require("./routes/authRoutes");
const inventarioRoutes = require("./routes/inventarioRoutes");
const respaldoRoutes = require("./routes/respaldoRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Rutas API
app.use("/api/ordenes", ordenesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/inventario", inventarioRoutes);
app.use("/api/respaldo", respaldoRoutes);

pool.connect((err, client, release) => {
  if (err) {
    console.error("Error de conexión a PostgreSQL:", err.message);
  } else {
    console.log("Conexión exitosa a la base de datos OpticaADM2026");
    release();
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor Backend Express corriendo en http://localhost:${PORT}`);
});
