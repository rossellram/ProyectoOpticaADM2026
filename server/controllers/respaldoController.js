const pool = require("../config/db");
const path = require("path");
const fs = require("fs");

const generarRespaldo = async (req, res) => {
  try {
    const fecha = new Date();
    const fechaStr = fecha.getFullYear() + "-" + String(fecha.getMonth() + 1).padStart(2, "0") + "-" + String(fecha.getDate()).padStart(2, "0");
    const nombreArchivo = "respaldo_optica_adm_" + fechaStr + ".sql";
    const carpetaRespaldos = path.join(__dirname, "../../respaldos");

    if (!fs.existsSync(carpetaRespaldos)) {
      fs.mkdirSync(carpetaRespaldos, { recursive: true });
    }

    const rutaArchivo = path.join(carpetaRespaldos, nombreArchivo);

    const tablas = ["ordenes_graduacion", "inventario", "usuarios"];
    let dumpSql = "-- RESPALDO OPTICA ADM - " + new Date().toLocaleString() + "\n\n";

    for (const tabla of tablas) {
      const data = await pool.query("SELECT * FROM " + tabla + ";");
      if (data.rows.length > 0) {
        dumpSql += "-- TABLA: " + tabla + "\n";
        for (const row of data.rows) {
          const keys = Object.keys(row).join(", ");
          const values = Object.values(row).map(val => {
            if (val === null) return "NULL";
            if (typeof val === "string") return "'" + val.replace(/'/g, "''") + "'";
            if (val instanceof Date) return "'" + val.toISOString() + "'";
            return val;
          }).join(", ");
          dumpSql += "INSERT INTO " + tabla + " (" + keys + ") VALUES (" + values + ") ON CONFLICT DO NOTHING;\n";
        }
        dumpSql += "\n";
      }
    }

    fs.writeFileSync(rutaArchivo, dumpSql, "utf8");

    res.json({
      success: true,
      message: "Respaldo generado con éxito.",
      archivo: nombreArchivo,
      contenidoSql: dumpSql
    });
  } catch (error) {
    console.error("Error al generar respaldo:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { generarRespaldo };
