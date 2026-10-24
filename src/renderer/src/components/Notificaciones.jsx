import React, { useState, useEffect } from "react";
import { obtenerOrdenes } from "../services/api";

export default function Notificaciones() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [pestañaSub, setPestañaSub] = useState("listos");

  // Filtros
  const [busquedaNombre, setBusquedaNombre] = useState("");
  const [busquedaFecha, setBusquedaFecha] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    const data = await obtenerOrdenes();
    setOrdenes(data);
    setCargando(false);
  };

  const enviarWhatsApp = (telefono, mensaje) => {
    if (!telefono) {
      alert("El paciente no tiene un número de teléfono registrado.");
      return;
    }
    const numLimpio = telefono.replace(/\D/g, "");
    const url = `https://wa.me/${numLimpio}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  };

  // Ordenar de más reciente a más antiguo
  const ordenesOrdenadas = [...ordenes].sort((a, b) => {
    const fechaA = new Date(a.fecha || a.fecha_creacion || 0);
    const fechaB = new Date(b.fecha || b.fecha_creacion || 0);
    if (fechaB - fechaA !== 0) return fechaB - fechaA;
    return b.id - a.id;
  });

  // Filtrado por Nombre y por Fecha
  const filtrarOrdenes = (lista) => {
    return lista.filter((o) => {
      const nombre = (o.cliente_nombre || o.clienteNombre || "").toLowerCase();
      const coincideNombre = nombre.includes(busquedaNombre.toLowerCase());

      let coincideFecha = true;
      if (busquedaFecha) {
        const fechaOrdenStr = o.fecha ? String(o.fecha).split("T")[0] : "";
        coincideFecha = fechaOrdenStr === busquedaFecha;
      }

      return coincideNombre && coincideFecha;
    });
  };

  // Filtrar pacientes para examen anual (fecha de hace 365 días o más)
  const haceUnAño = new Date();
  haceUnAño.setFullYear(haceUnAño.getFullYear() - 1);

  const pacientesAnuales = ordenesOrdenadas.filter((o) => {
    if (!o.fecha) return false;
    const fechaOrden = new Date(o.fecha);
    return fechaOrden <= haceUnAño;
  });

  const ordenesListosFiltradas = filtrarOrdenes(ordenesOrdenadas);
  const pacientesAnualesFiltrados = filtrarOrdenes(pacientesAnuales);

  return (
    <div style={{ padding: "20px", maxWidth: "1050px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", color: "#1a365d", marginBottom: "20px" }}>
        📲 Notificaciones & Recordatorios WhatsApp
      </h2>

      {/* Navegación Secundaria */}
      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px" }}>
        <button
          onClick={() => setPestañaSub("listos")}
          style={{
            padding: "10px 20px",
            background: pestañaSub === "listos" ? "#16a34a" : "#e2e8f0",
            color: pestañaSub === "listos" ? "#fff" : "#334155",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          👓 Avisos de Entrega (Trabajo Listo)
        </button>
        <button
          onClick={() => setPestañaSub("anual")}
          style={{
            padding: "10px 20px",
            background: pestañaSub === "anual" ? "#0284c7" : "#e2e8f0",
            color: pestañaSub === "anual" ? "#fff" : "#334155",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          🗓️ Recordatorio Examen Anual
        </button>
      </div>

      {/* Panel de Búsqueda y Filtros */}
      <div style={{ background: "#fff", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: "20px", display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: "2", minWidth: "220px" }}>
          <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "4px" }}>🔎 Buscar por Nombre del Cliente:</label>
          <input
            type="text"
            placeholder="Escriba el nombre del paciente..."
            value={busquedaNombre}
            onChange={(e) => setBusquedaNombre(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
          />
        </div>

        <div style={{ flex: "1", minWidth: "180px" }}>
          <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "4px" }}>📅 Filtrar por Fecha:</label>
          <input
            type="date"
            value={busquedaFecha}
            onChange={(e) => setBusquedaFecha(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
          />
        </div>

        {(busquedaNombre || busquedaFecha) && (
          <div style={{ alignSelf: "flex-end" }}>
            <button
              onClick={() => { setBusquedaNombre(""); setBusquedaFecha(""); }}
              style={{ padding: "8px 12px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "12px" }}
            >
              🧹 Limpiar Filtros
            </button>
          </div>
        )}
      </div>

      {cargando ? (
        <p style={{ textAlign: "center" }}>Cargando información...</p>
      ) : pestañaSub === "listos" ? (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <h3 style={{ color: "#0f172a", margin: 0 }}>Notificar Entrega de Lentes (Ordenados por más reciente)</h3>
            <span style={{ fontSize: "13px", color: "#64748b" }}>Total encontrados: <strong>{ordenesListosFiltradas.length}</strong></span>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderRadius: "8px", overflow: "hidden" }}>
            <thead>
              <tr style={{ background: "#0f172a", color: "#fff" }}>
                <th style={{ padding: "10px" }}>Fecha</th>
                <th style={{ padding: "10px" }}>Paciente</th>
                <th style={{ padding: "10px" }}>Teléfono</th>
                <th style={{ padding: "10px" }}>Acción WhatsApp</th>
              </tr>
            </thead>
            <tbody>
              {ordenesListosFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: "20px", textAlign: "center" }}>No se encontraron pacientes que coincidan con la búsqueda.</td>
                </tr>
              ) : (
                ordenesListosFiltradas.map((o) => {
                  const nombre = o.cliente_nombre || o.clienteNombre;
                  const msg = `Hola ${nombre}, le saludamos de Óptica ADM. Sus lentes ya están listos para ser retirados. ¡Le esperamos!`;
                  return (
                    <tr key={o.id} style={{ borderBottom: "1px solid #e2e8f0", textAlign: "center" }}>
                      <td style={{ padding: "10px", fontWeight: "bold" }}>{o.fecha ? String(o.fecha).split("T")[0] : "-"}</td>
                      <td style={{ padding: "10px", fontWeight: "bold" }}>{nombre}</td>
                      <td style={{ padding: "10px" }}>{o.telefono || "Sin teléfono"}</td>
                      <td style={{ padding: "10px" }}>
                        <button
                          onClick={() => enviarWhatsApp(o.telefono, msg)}
                          style={{ background: "#25D366", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                        >
                          💬 Avisar por WhatsApp
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <h3 style={{ color: "#0f172a", margin: 0 }}>Pacientes Pendientes de Chequeo Anual</h3>
            <span style={{ fontSize: "13px", color: "#64748b" }}>Total encontrados: <strong>{pacientesAnualesFiltrados.length}</strong></span>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderRadius: "8px", overflow: "hidden" }}>
            <thead>
              <tr style={{ background: "#0f172a", color: "#fff" }}>
                <th style={{ padding: "10px" }}>Última Visita</th>
                <th style={{ padding: "10px" }}>Paciente</th>
                <th style={{ padding: "10px" }}>Teléfono</th>
                <th style={{ padding: "10px" }}>Enviar Recordatorio</th>
              </tr>
            </thead>
            <tbody>
              {pacientesAnualesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: "20px", textAlign: "center" }}>No hay pacientes que coincidan con la búsqueda.</td>
                </tr>
              ) : (
                pacientesAnualesFiltrados.map((o) => {
                  const nombre = o.cliente_nombre || o.clienteNombre;
                  const msg = `Hola ${nombre}, le saludamos de Óptica ADM. Ha transcurrido 1 año desde su última evaluación visual. Le invitamos a agendar su examen preventivo de la vista.`;
                  return (
                    <tr key={o.id} style={{ borderBottom: "1px solid #e2e8f0", textAlign: "center" }}>
                      <td style={{ padding: "10px", fontWeight: "bold" }}>{o.fecha ? String(o.fecha).split("T")[0] : "-"}</td>
                      <td style={{ padding: "10px", fontWeight: "bold" }}>{nombre}</td>
                      <td style={{ padding: "10px" }}>{o.telefono || "Sin teléfono"}</td>
                      <td style={{ padding: "10px" }}>
                        <button
                          onClick={() => enviarWhatsApp(o.telefono, msg)}
                          style={{ background: "#0284c7", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                        >
                          📲 Recordar Cita Anual
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
