import React, { useState } from "react";
import Login from "./components/Login";
import OrdenGraduacion from "./components/OrdenGraduacion";
import HistorialOrdenes from "./components/HistorialOrdenes";
import CotizacionesCobro from "./components/CotizacionesCobro";
import Notificaciones from "./components/Notificaciones";
import GestionUsuarios from "./components/GestionUsuarios";
import ReportesCaja from "./components/ReportesCaja";
import Inventario from "./components/Inventario";
import RespaldoBD from "./components/RespaldoBD";
import { generarRespaldoBD } from "./services/api";

export default function App() {
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [pestana, setPestana] = useState("orden");
  const [ordenAEditar, setOrdenAEditar] = useState(null);

  if (!usuarioActivo) {
    return <Login alIniciarSesion={(usr) => setUsuarioActivo(usr)} />;
  }

  const handleCerrarSesion = async () => {
    if (usuarioActivo.rol === "ADMIN" || usuarioActivo.rol === "DEV") {
      try {
        await generarRespaldoBD();
      } catch (err) {
        console.error("Respaldo silencioso al salir:", err);
      }
    }
    setUsuarioActivo(null);
    setPestana("orden");
    setOrdenAEditar(null);
  };

  const handleGuardarOrdenExito = (ordenGuardada, pasarACotizar) => {
    if (pasarACotizar && ordenGuardada) {
      setOrdenAEditar(ordenGuardada);
      setPestana("cotizacion");
    } else {
      setOrdenAEditar(null);
      setPestana("historial");
    }
  };

  const handleEditarOrden = (orden) => {
    setOrdenAEditar(orden);
    setPestana("orden");
  };

  const handleCotizarOrden = (orden) => {
    setOrdenAEditar(orden);
    setPestana("cotizacion");
  };

  const esAdmin = usuarioActivo.rol === "ADMIN" || usuarioActivo.rol === "DEV";
  const esDev = usuarioActivo.rol === "DEV";

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "Arial, sans-serif" }}>
      <header style={{ background: "#0f172a", color: "#fff", padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: "20px" }}>👓 ÓPTICA ADM</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span>👤 <strong>{usuarioActivo.nombre}</strong> ({usuarioActivo.rol})</span>
          <button onClick={handleCerrarSesion} style={{ background: "#ef4444", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
            🚪 Salir
          </button>
        </div>
      </header>

      <nav style={{ background: "#1e293b", padding: "10px", display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
        <button onClick={() => { setOrdenAEditar(null); setPestana("orden"); }} style={{ padding: "8px 16px", background: pestana === "orden" ? "#0284c7" : "#334155", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
          📝 Examen / Receta
        </button>
        <button onClick={() => setPestana("historial")} style={{ padding: "8px 16px", background: pestana === "historial" ? "#0284c7" : "#334155", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
          📋 Historial Pacientes
        </button>
        <button onClick={() => setPestana("cotizacion")} style={{ padding: "8px 16px", background: pestana === "cotizacion" ? "#0284c7" : "#334155", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
          💲 Cotizaciones & Cobro
        </button>
        <button onClick={() => setPestana("inventario")} style={{ padding: "8px 16px", background: pestana === "inventario" ? "#0284c7" : "#334155", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
          📦 Inventario
        </button>
        <button onClick={() => setPestana("notificaciones")} style={{ padding: "8px 16px", background: pestana === "notificaciones" ? "#0284c7" : "#334155", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
          📲 Alertas & Avisos
        </button>
        {esAdmin && (
          <button onClick={() => setPestana("reportes")} style={{ padding: "8px 16px", background: pestana === "reportes" ? "#0284c7" : "#334155", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
            📊 Reportes / Caja
          </button>
        )}
        {esAdmin && (
          <button onClick={() => setPestana("usuarios")} style={{ padding: "8px 16px", background: pestana === "usuarios" ? "#0284c7" : "#334155", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
            👥 Usuarios
          </button>
        )}
        {esDev && (
          <button onClick={() => setPestana("respaldo")} style={{ padding: "8px 16px", background: pestana === "respaldo" ? "#16a34a" : "#334155", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
            💾 Respaldo BD
          </button>
        )}
      </nav>

      <main style={{ padding: "10px" }}>
        {pestana === "orden" && <OrdenGraduacion ordenAEditar={ordenAEditar} alGuardarExito={handleGuardarOrdenExito} usuarioActivo={usuarioActivo} />}
        {pestana === "historial" && <HistorialOrdenes alEditarOrden={handleEditarOrden} alCotizarOrden={handleCotizarOrden} usuarioActivo={usuarioActivo} />}
        {pestana === "cotizacion" && <CotizacionesCobro ordenSeleccionadaProp={ordenAEditar} usuarioActivo={usuarioActivo} />}
        {pestana === "inventario" && <Inventario usuarioActivo={usuarioActivo} />}
        {pestana === "notificaciones" && <Notificaciones />}
        {pestana === "reportes" && esAdmin && <ReportesCaja />}
        {pestana === "usuarios" && esAdmin && <GestionUsuarios usuarioActivo={usuarioActivo} />}
        {pestana === "respaldo" && esDev && <RespaldoBD />}
      </main>
    </div>
  );
}
