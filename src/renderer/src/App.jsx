import React, { useState } from "react";
import Login from "./components/Login";
import OrdenGraduacion from "./components/OrdenGraduacion";
import HistorialOrdenes from "./components/HistorialOrdenes";
import CotizacionesCobro from "./components/CotizacionesCobro";
import GestionUsuarios from "./components/GestionUsuarios";
import Notificaciones from "./components/Notificaciones";
import ReportesCaja from "./components/ReportesCaja";
import Inventario from "./components/Inventario";

function App() {
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [pestaña, setPestaña] = useState("nueva");
  const [ordenAEditar, setOrdenAEditar] = useState(null);
  const [ordenACotizar, setOrdenACotizar] = useState(null);

  if (!usuarioActivo) {
    return <Login onLoginExitoso={(usr) => setUsuarioActivo(usr)} />;
  }

  const handleEditarOrden = (orden) => {
    setOrdenAEditar(orden);
    setPestaña("nueva");
  };

  const handleCotizarOrden = (orden) => {
    setOrdenACotizar(orden);
    setPestaña("cobro");
  };

  const handleFinalizarEdicion = () => {
    setOrdenAEditar(null);
    setPestaña("historial");
  };

  const handleFinalizarCotizacion = () => {
    setOrdenACotizar(null);
    setPestaña("historial");
  };

  const esAdminODev = usuarioActivo.rol === "ADMIN" || usuarioActivo.rol === "DEV";

  return (
    <div className="App" style={{ minHeight: "100vh", backgroundColor: "#f1f5f9" }}>
      <nav style={{ background: "#0f172a", padding: "12px 30px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => { setOrdenAEditar(null); setPestaña("nueva"); }}
            style={{ padding: "8px 12px", background: pestaña === "nueva" ? "#0284c7" : "transparent", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
          >
            ➕ Examen / Receta
          </button>
          <button
            onClick={() => { setOrdenAEditar(null); setPestaña("historial"); }}
            style={{ padding: "8px 12px", background: pestaña === "historial" ? "#0284c7" : "transparent", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
          >
            📋 Historial
          </button>
          {ordenACotizar && (
            <button
              onClick={() => setPestaña("cobro")}
              style={{ padding: "8px 12px", background: pestaña === "cobro" ? "#16a34a" : "transparent", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
            >
              💲 Cotizar & Cobrar
            </button>
          )}
          <button
            onClick={() => { setOrdenAEditar(null); setPestaña("inventario"); }}
            style={{ padding: "8px 12px", background: pestaña === "inventario" ? "#0284c7" : "transparent", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
          >
            📦 Inventario
          </button>
          <button
            onClick={() => { setOrdenAEditar(null); setPestaña("notificaciones"); }}
            style={{ padding: "8px 12px", background: pestaña === "notificaciones" ? "#0284c7" : "transparent", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
          >
            📲 Notificaciones
          </button>

          {esAdminODev && (
            <button
              onClick={() => { setOrdenAEditar(null); setPestaña("reportes"); }}
              style={{ padding: "8px 12px", background: pestaña === "reportes" ? "#0284c7" : "transparent", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
            >
              📊 Reportes / Caja
            </button>
          )}

          {esAdminODev && (
            <button
              onClick={() => { setOrdenAEditar(null); setPestaña("usuarios"); }}
              style={{ padding: "8px 12px", background: pestaña === "usuarios" ? "#0284c7" : "transparent", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
            >
              👥 Usuarios
            </button>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "15px", color: "#fff" }}>
          <span style={{ fontSize: "14px" }}>
            👤 <strong>{usuarioActivo.nombre}</strong> ({usuarioActivo.rol})
          </span>
          <button
            onClick={() => setUsuarioActivo(null)}
            style={{ padding: "6px 12px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "12px" }}
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      </nav>

      <div style={{ marginTop: "20px" }}>
        {pestaña === "nueva" && (
          <OrdenGraduacion ordenAEditar={ordenAEditar} alFinalizarEdicion={handleFinalizarEdicion} irACotizar={handleCotizarOrden} usuarioActivo={usuarioActivo} />
        )}
        {pestaña === "historial" && (
          <HistorialOrdenes alEditarOrden={handleEditarOrden} alCotizarOrden={handleCotizarOrden} usuarioActivo={usuarioActivo} />
        )}
        {pestaña === "cobro" && (
          <CotizacionesCobro ordenSeleccionada={ordenACotizar} alFinalizar={handleFinalizarCotizacion} />
        )}
        {pestaña === "inventario" && (
          <Inventario usuarioActivo={usuarioActivo} />
        )}
        {pestaña === "notificaciones" && (
          <Notificaciones />
        )}
        {pestaña === "reportes" && esAdminODev && (
          <ReportesCaja />
        )}
        {pestaña === "usuarios" && esAdminODev && (
          <GestionUsuarios usuarioActivo={usuarioActivo} />
        )}
      </div>
    </div>
  );
}

export default App;
