import React, { useState, useEffect } from "react";
import { obtenerOrdenes, registrarAbono, eliminarOrden } from "../services/api";

export default function HistorialOrdenes({ alEditarOrden, alCotizarOrden, usuarioActivo }) {
  const [ordenes, setOrdenes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async () => {
    setCargando(true);
    const data = await obtenerOrdenes();
    setOrdenes(data);
    setCargando(false);
  };

  const handleAbonar = async (orden) => {
    const saldoActual = parseFloat(orden.saldo_pendiente || 0);
    if (saldoActual <= 0) {
      alert("Esta orden ya está completamente pagada.");
      return;
    }

    const montoStr = window.prompt(`Registrar Abono para ${orden.cliente_nombre || orden.clienteNombre}\nSaldo Pendiente: L. ${saldoActual.toFixed(2)}\n\nIngrese la cantidad a abonar:`, saldoActual.toString());
    
    if (montoStr) {
      const monto = parseFloat(montoStr);
      if (isNaN(monto) || monto <= 0) {
        alert("Ingrese un monto válido.");
        return;
      }

      const res = await registrarAbono(orden.id, monto);
      if (res.success) {
        alert("Abono registrado exitosamente.");
        cargarHistorial();
        if (ordenSeleccionada && ordenSeleccionada.id === orden.id) {
          setOrdenSeleccionada(res.data);
        }
      } else {
        alert("Error al registrar abono: " + res.error);
      }
    }
  };

  const handleEliminar = async (id, nombre) => {
    const confirmar = window.confirm(`¿Está seguro de que desea eliminar la orden del paciente "${nombre}"?`);
    if (confirmar) {
      const res = await eliminarOrden(id);
      if (res.success) {
        alert("Orden eliminada exitosamente.");
        if (ordenSeleccionada && ordenSeleccionada.id === id) {
          setOrdenSeleccionada(null);
        }
        cargarHistorial();
      } else {
        alert("Error al eliminar la orden: " + res.error);
      }
    }
  };

  const enviarWhatsApp = (telefono, nombre) => {
    if (!telefono) {
      alert("El paciente no tiene número telefónico registrado.");
      return;
    }
    const numLimpio = telefono.replace(/\D/g, "");
    const msg = `Hola ${nombre}, le saludamos de Óptica ADM. Le informamos que sus lentes están listos. ¡Le esperamos!`;
    window.open(`https://wa.me/${numLimpio}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const ordenesFiltradas = ordenes.filter((o) => {
    const termino = busqueda.toLowerCase();
    const nombre = (o.cliente_nombre || o.clienteNombre || "").toLowerCase();
    const telefono = (o.telefono || "").toLowerCase();
    return nombre.includes(termino) || telefono.includes(termino);
  });

  const handleImprimir = () => {
    window.print();
  };

  const esAdmin = usuarioActivo && usuarioActivo.rol === "ADMIN";

  return (
    <div style={{ padding: "20px", maxWidth: "1150px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      
      <style>{`
        @media print {
          nav, .no-print, button, input { display: none !important; }
          body { background: #fff !important; }
          .ticket-container { border: 1px solid #000 !important; padding: 20px !important; box-shadow: none !important; }
        }
      `}</style>

      <div className="no-print">
        <h2 style={{ textAlign: "center", color: "#1a365d", marginBottom: "20px" }}>Historial de Pacientes - Óptica ADM</h2>

        <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="Buscar por nombre o teléfono..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ flex: 1, padding: "10px", fontSize: "16px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
          />
          <button onClick={cargarHistorial} style={{ padding: "10px 20px", background: "#0284c7", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
            🔄 Refrescar
          </button>
        </div>
      </div>

      {cargando ? (
        <p className="no-print" style={{ textAlign: "center" }}>Cargando registros...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: ordenSeleccionada ? "1fr 1fr" : "1fr", gap: "20px" }}>
          
          <div className="no-print">
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderRadius: "8px", overflow: "hidden" }}>
              <thead>
                <tr style={{ background: "#0f172a", color: "#fff" }}>
                  <th style={{ padding: "10px" }}>Fecha</th>
                  <th style={{ padding: "10px" }}>Paciente</th>
                  <th style={{ padding: "10px" }}>Total</th>
                  <th style={{ padding: "10px" }}>Saldo</th>
                  <th style={{ padding: "10px" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ordenesFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: "20px", textAlign: "center" }}>No se encontraron órdenes registradas.</td>
                  </tr>
                ) : (
                  ordenesFiltradas.map((o) => {
                    const nombre = o.cliente_nombre || o.clienteNombre;
                    const saldo = parseFloat(o.saldo_pendiente || 0);
                    return (
                      <tr key={o.id} style={{ borderBottom: "1px solid #e2e8f0", textAlign: "center" }}>
                        <td style={{ padding: "10px" }}>{o.fecha ? String(o.fecha).split("T")[0] : "-"}</td>
                        <td style={{ padding: "10px", fontWeight: "bold" }}>{nombre}</td>
                        <td style={{ padding: "10px" }}>L. {parseFloat(o.total || 0).toFixed(2)}</td>
                        <td style={{ padding: "10px", fontWeight: "bold", color: saldo > 0 ? "#dc2626" : "#16a34a" }}>
                          L. {saldo.toFixed(2)}
                        </td>
                        <td style={{ padding: "10px", display: "flex", gap: "4px", justifyContent: "center" }}>
                          <button onClick={() => setOrdenSeleccionada(o)} style={{ padding: "6px 8px", background: "#0284c7", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }} title="Ver Receta">👁️</button>
                          <button onClick={() => alCotizarOrden(o)} style={{ padding: "6px 8px", background: "#16a34a", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }} title="Cotizar / Cobrar">💲</button>
                          <button onClick={() => handleAbonar(o)} style={{ padding: "6px 8px", background: "#059669", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }} title="Abonar">💵</button>
                          <button onClick={() => alEditarOrden(o)} style={{ padding: "6px 8px", background: "#f59e0b", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }} title="Editar Receta">✏️</button>
                          <button onClick={() => enviarWhatsApp(o.telefono, nombre)} style={{ padding: "6px 8px", background: "#25D366", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }} title="WhatsApp">💬</button>
                          {esAdmin && (
                            <button onClick={() => handleEliminar(o.id, nombre)} style={{ padding: "6px 8px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>🗑️</button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {ordenSeleccionada && (
            <div className="ticket-container" style={{ background: "#f8fafc", padding: "20px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
              
              <div style={{ textAlign: "center", borderBottom: "2px solid #1a365d", paddingBottom: "10px", marginBottom: "15px" }}>
                <h2 style={{ margin: 0, color: "#1a365d" }}>ÓPTICA ADM</h2>
                <p style={{ margin: "2px 0", fontSize: "14px", color: "#475569" }}>Orden de Graduación & Receta Médica</p>
              </div>

              <div className="no-print" style={{ display: "flex", justifyContent: "space-between", gap: "6px", marginBottom: "15px" }}>
                <button onClick={handleImprimir} style={{ background: "#16a34a", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>🖨️ Imprimir</button>
                <button onClick={() => alCotizarOrden(ordenSeleccionada)} style={{ background: "#16a34a", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>💲 Cotizar/Cobrar</button>
                <button onClick={() => alEditarOrden(ordenSeleccionada)} style={{ background: "#f59e0b", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "4px", cursor: "pointer" }}>✏️ Editar</button>
                <button onClick={() => setOrdenSeleccionada(null)} style={{ background: "#64748b", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "4px", cursor: "pointer" }}>✕</button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "14px", marginBottom: "15px" }}>
                <p style={{ margin: "4px 0" }}><strong>Paciente:</strong> {ordenSeleccionada.cliente_nombre || ordenSeleccionada.clienteNombre}</p>
                <p style={{ margin: "4px 0" }}><strong>Fecha:</strong> {ordenSeleccionada.fecha ? String(ordenSeleccionada.fecha).split("T")[0] : "-"}</p>
                <p style={{ margin: "4px 0" }}><strong>Teléfono:</strong> {ordenSeleccionada.telefono || "N/A"}</p>
                <p style={{ margin: "4px 0" }}><strong>Edad:</strong> {ordenSeleccionada.edad || "N/A"} años</p>
              </div>
              
              <h4 style={{ borderBottom: "1px solid #cbd5e1", paddingBottom: "5px", marginTop: "15px", color: "#0f172a" }}>Graduación Prescrita</h4>
              <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse", textAlign: "center", marginBottom: "15px" }}>
                <thead>
                  <tr style={{ background: "#e2e8f0" }}>
                    <th style={{ padding: "6px", border: "1px solid #cbd5e1" }}>Ojo</th>
                    <th style={{ padding: "6px", border: "1px solid #cbd5e1" }}>Esfera</th>
                    <th style={{ padding: "6px", border: "1px solid #cbd5e1" }}>Cilindro</th>
                    <th style={{ padding: "6px", border: "1px solid #cbd5e1" }}>Eje</th>
                    <th style={{ padding: "6px", border: "1px solid #cbd5e1" }}>ADD</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "6px", border: "1px solid #cbd5e1" }}><strong>O.D.</strong></td>
                    <td style={{ padding: "6px", border: "1px solid #cbd5e1" }}>{ordenSeleccionada.act_od_esfera || "-"}</td>
                    <td style={{ padding: "6px", border: "1px solid #cbd5e1" }}>{ordenSeleccionada.act_od_cilindro || "-"}</td>
                    <td style={{ padding: "6px", border: "1px solid #cbd5e1" }}>{ordenSeleccionada.act_od_eje || "-"}</td>
                    <td style={{ padding: "6px", border: "1px solid #cbd5e1" }}>{ordenSeleccionada.act_od_add || "-"}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "6px", border: "1px solid #cbd5e1" }}><strong>O.I.</strong></td>
                    <td style={{ padding: "6px", border: "1px solid #cbd5e1" }}>{ordenSeleccionada.act_oi_esfera || "-"}</td>
                    <td style={{ padding: "6px", border: "1px solid #cbd5e1" }}>{ordenSeleccionada.act_oi_cilindro || "-"}</td>
                    <td style={{ padding: "6px", border: "1px solid #cbd5e1" }}>{ordenSeleccionada.act_oi_eje || "-"}</td>
                    <td style={{ padding: "6px", border: "1px solid #cbd5e1" }}>{ordenSeleccionada.act_oi_add || "-"}</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ marginTop: "15px", paddingTop: "10px", borderTop: "2px dashed #cbd5e1" }}>
                <p style={{ margin: "2px 0", fontSize: "14px" }}><strong>Total General:</strong> L. {parseFloat(ordenSeleccionada.total || 0).toFixed(2)}</p>
                <p style={{ margin: "2px 0", fontSize: "14px" }}><strong>Abonado / Prima:</strong> L. {parseFloat(ordenSeleccionada.prima || 0).toFixed(2)}</p>
                <p style={{ margin: "4px 0", fontSize: "16px", fontWeight: "bold", color: parseFloat(ordenSeleccionada.saldo_pendiente || 0) > 0 ? "#dc2626" : "#16a34a" }}>
                  SALDO PENDIENTE: L. {parseFloat(ordenSeleccionada.saldo_pendiente || 0).toFixed(2)}
                </p>
              </div>

            </div>
          )}

        </div>
      )}
    </div>
  );
}
