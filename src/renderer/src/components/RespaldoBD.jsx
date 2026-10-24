import React, { useState } from "react";
import { generarRespaldoBD } from "../services/api";

export default function RespaldoBD() {
  const [cargando, setCargando] = useState(false);
  const [ultimoRespaldo, setUltimoRespaldo] = useState(null);

  const handleGenerar = async () => {
    setCargando(true);
    const res = await generarRespaldoBD();
    setCargando(false);

    if (res.success) {
      setUltimoRespaldo(res);
      alert("✅ Respaldo generado y guardado exitosamente.");
    } else {
      alert("❌ Error al generar respaldo: " + res.error);
    }
  };

  const descargarArchivo = () => {
    if (!ultimoRespaldo) return;
    const blob = new Blob([ultimoRespaldo.contenidoSql], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = ultimoRespaldo.archivo;
    link.click();
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", color: "#1a365d", marginBottom: "20px" }}>💾 Copias de Seguridad y Respaldo de Base de Datos</h2>

      <div style={{ background: "#fff", padding: "25px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", textAlign: "center" }}>
        <h3 style={{ margin: "0 0 10px 0", color: "#0f172a" }}>Generar Copia de Seguridad Completa (1-Clic)</h3>
        <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>
          Esta función creará una copia de seguridad en formato SQL de todos los pacientes, recetas de graduación, inventario de aros y usuarios de Óptica ADM.
        </p>

        <button
          onClick={handleGenerar}
          disabled={cargando}
          style={{
            padding: "12px 25px",
            background: cargando ? "#94a3b8" : "#16a34a",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: cargando ? "wait" : "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
          }}
        >
          {cargando ? "⏳ Generando Respaldo..." : "💾 Generar Respaldo Ahora"}
        </button>

        {ultimoRespaldo && (
          <div style={{ marginTop: "25px", padding: "15px", background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "6px" }}>
            <p style={{ margin: "0 0 8px 0", fontWeight: "bold", color: "#166534" }}>✅ Respaldo Creado Correctamente</p>
            <p style={{ margin: "0 0 12px 0", fontSize: "13px", color: "#374151" }}>Archivo: <code>{ultimoRespaldo.archivo}</code></p>
            <button
              onClick={descargarArchivo}
              style={{ padding: "8px 15px", background: "#0284c7", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
            >
              📥 Descargar Archivo .SQL
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
