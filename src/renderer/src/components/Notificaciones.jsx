import React, { useState, useEffect } from "react";
import { obtenerOrdenes } from "../services/api";

export default function Notificaciones() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [pestañaSub, setPestañaSub] = useState("listos");

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

  // Filtrar pacientes para examen anual (fecha de hace 365 días o más)
  const haceUnAño = new Date();
  haceUnAño.setFullYear(haceUnAño.getFullYear() - 1);

  const pacientesAnuales = ordenes.filter((o) => {
    if (!o.fecha) return false;
    const fechaOrden = new Date(o.fecha);
    return fechaOrden <= haceUnAño;
  });

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", color: "#1a365d" }}>📲 Notificaciones & Recordatorios WhatsApp</h2>

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

      {cargando ? (
        <p style={{ textAlign: "center" }}>Cargando información...</p>
      ) : pestañaSub === "listos" ? (
        <div>
          <h3 style={{ color: "#0f172a" }}>Notificar Entrega de Lentes</h3>
          <p style={{ fontSize: "14px", color: "#64748b" }}>Seleccione un paciente para enviarle un aviso por WhatsApp informando que su trabajo está listo.</p>
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
              {ordenes.map((o) => {
                const nombre = o.cliente_nombre || o.clienteNombre;
                const msg = `Hola ${nombre}, le saludamos de Óptica ADM. Sus lentes ya están listos para ser retirados. ¡Le esperamos!`;
                return (
                  <tr key={o.id} style={{ borderBottom: "1px solid #e2e8f0", textAlign: "center" }}>
                    <td style={{ padding: "10px" }}>{o.fecha ? String(o.fecha).split("T")[0] : "-"}</td>
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
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <h3 style={{ color: "#0f172a" }}>Pacientes Pendientes de Chequeo Anual</h3>
          <p style={{ fontSize: "14px", color: "#64748b" }}>Pacientes que registraron su examen hace 1 año o más.</p>
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
              {pacientesAnuales.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: "20px", textAlign: "center" }}>No hay pacientes con un año o más desde su último examen.</td>
                </tr>
              ) : (
                pacientesAnuales.map((o) => {
                  const nombre = o.cliente_nombre || o.clienteNombre;
                  const msg = `Hola ${nombre}, le saludamos de Óptica ADM. Ha transcurrido 1 año desde su última evaluación visual. Le invitamos a agendar su examen preventivo de la vista.`;
                  return (
                    <tr key={o.id} style={{ borderBottom: "1px solid #e2e8f0", textAlign: "center" }}>
                      <td style={{ padding: "10px" }}>{o.fecha ? String(o.fecha).split("T")[0] : "-"}</td>
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
