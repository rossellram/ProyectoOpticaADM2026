import React, { useState, useEffect, useRef } from "react";
import { obtenerOrdenes, registrarAbono, eliminarOrden } from "../services/api";

export default function HistorialOrdenes({ alEditarOrden, alCotizarOrden, usuarioActivo }) {
  const [ordenes, setOrdenes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(true);
  const iframeRef = useRef(null);

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
    if (!ordenSeleccionada || !iframeRef.current) return;

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument || iframe.contentWindow.document;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receta Médica - ${ordenSeleccionada.cliente_nombre || ordenSeleccionada.clienteNombre}</title>
          <style>
            @page { size: auto; margin: 10mm; }
            body { font-family: Arial, sans-serif; padding: 15px; color: #0f172a; margin: 0; }
            .header { text-align: center; border-bottom: 2px solid #1a365d; padding-bottom: 8px; margin-bottom: 12px; }
            .header h1 { margin: 0; color: #1a365d; font-size: 22px; }
            .header p { margin: 2px 0; font-size: 13px; color: #475569; }
            .grid-data { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px; margin-bottom: 12px; background: #f8fafc; padding: 8px; border-radius: 6px; border: 1px solid #e2e8f0; }
            table { width: 100%; border-collapse: collapse; text-align: center; font-size: 12px; margin-bottom: 12px; }
            th, td { border: 1px solid #cbd5e1; padding: 5px; }
            th { background: #e2e8f0; }
            .totals { margin-top: 10px; padding: 8px; background: #f1f5f9; text-align: center; border-radius: 6px; }
            .firma { margin-top: 35px; text-align: center; border-top: 1px solid #000; padding-top: 6px; width: 220px; margin-left: auto; margin-right: auto; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ÓPTICA ADM</h1>
            <p>Examen & Receta Médica Visual</p>
          </div>

          <div class="grid-data">
            <p style="margin:2px 0;"><strong>Paciente:</strong> ${ordenSeleccionada.cliente_nombre || ordenSeleccionada.clienteNombre}</p>
            <p style="margin:2px 0;"><strong>Fecha:</strong> ${ordenSeleccionada.fecha ? String(ordenSeleccionada.fecha).split("T")[0] : "-"}</p>
            <p style="margin:2px 0;"><strong>Teléfono:</strong> ${ordenSeleccionada.telefono || "N/A"}</p>
            <p style="margin:2px 0;"><strong>Edad:</strong> ${ordenSeleccionada.edad || "N/A"} años</p>
            <p style="margin:2px 0; grid-column: span 2;"><strong>Atendido Por:</strong> ${ordenSeleccionada.usuario_nombre || "SISTEMA"}</p>
          </div>

          <h4 style="margin: 8px 0;">Graduación Prescrita</h4>
          <table>
            <thead>
              <tr>
                <th>Ojo</th>
                <th>Esfera</th>
                <th>Cilindro</th>
                <th>Eje</th>
                <th>ADD</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>O.D.</strong></td>
                <td>${ordenSeleccionada.act_od_esfera || "-"}</td>
                <td>${ordenSeleccionada.act_od_cilindro || "-"}</td>
                <td>${ordenSeleccionada.act_od_eje || "-"}</td>
                <td>${ordenSeleccionada.act_od_add || "-"}</td>
              </tr>
              <tr>
                <td><strong>O.I.</strong></td>
                <td>${ordenSeleccionada.act_oi_esfera || "-"}</td>
                <td>${ordenSeleccionada.act_oi_cilindro || "-"}</td>
                <td>${ordenSeleccionada.act_oi_eje || "-"}</td>
                <td>${ordenSeleccionada.act_oi_add || "-"}</td>
              </tr>
            </tbody>
          </table>

          ${ordenSeleccionada.observaciones ? `<p style="font-size:12px; margin: 6px 0;"><strong>Observaciones:</strong> ${ordenSeleccionada.observaciones}</p>` : ""}

          <div class="totals">
            <p style="margin: 2px 0; font-size: 12px;">Total: <strong>L. ${parseFloat(ordenSeleccionada.total || 0).toFixed(2)}</strong></p>
            <p style="margin: 2px 0; font-size: 14px; font-weight: bold; color: ${parseFloat(ordenSeleccionada.saldo_pendiente || 0) > 0 ? "#dc2626" : "#16a34a"};">
              Saldo Pendiente: L. ${parseFloat(ordenSeleccionada.saldo_pendiente || 0).toFixed(2)}
            </p>
          </div>

          <div class="firma">
            <p style="margin:0; font-weight: bold; font-size: 11px;">FIRMA OPTOMETRISTA</p>
            <p style="margin: 2px 0; font-size: 11px; color: #475569;">${ordenSeleccionada.usuario_nombre || "SISTEMA"}</p>
          </div>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch (e) {
        console.error("Error imprimiendo:", e);
      }
    }, 250);
  };

  const esAdmin = usuarioActivo && (usuarioActivo.rol === "ADMIN" || usuarioActivo.rol === "DEV");

  const estiloBtn = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    fontWeight: "bold",
    fontSize: "12px",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
    transition: "transform 0.1s ease"
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1300px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      
      {/* Iframe oculto para manejar impresión sin ventana emergente defectuosa */}
      <iframe ref={iframeRef} style={{ position: "absolute", width: "0px", height: "0px", border: "none", visibility: "hidden" }} title="impresion_frame" />

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
        <p style={{ textAlign: "center" }}>Cargando registros...</p>
      ) : (
        <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
          
          {/* TABLA PRINCIPAL */}
          <div style={{ flex: 1, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderRadius: "8px", overflow: "hidden" }}>
              <thead>
                <tr style={{ background: "#0f172a", color: "#fff" }}>
                  <th style={{ padding: "12px 10px" }}>Fecha</th>
                  <th style={{ padding: "12px 10px" }}>Paciente</th>
                  <th style={{ padding: "12px 10px" }}>Atendido Por</th>
                  <th style={{ padding: "12px 10px" }}>Saldo</th>
                  <th style={{ padding: "12px 10px" }}>Acciones</th>
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
                    const seleccionada = ordenSeleccionada && ordenSeleccionada.id === o.id;

                    return (
                      <tr key={o.id} style={{ borderBottom: "1px solid #e2e8f0", textAlign: "center", background: seleccionada ? "#f0f9ff" : "#fff" }}>
                        <td style={{ padding: "10px", fontSize: "13px", fontWeight: "600" }}>{o.fecha ? String(o.fecha).split("T")[0] : "-"}</td>
                        <td style={{ padding: "10px", fontWeight: "bold", color: "#1e293b" }}>{nombre}</td>
                        <td style={{ padding: "10px", fontSize: "12px", color: "#64748b" }}>{o.usuario_nombre || "SISTEMA"}</td>
                        <td style={{ padding: "10px", fontWeight: "bold", color: saldo > 0 ? "#dc2626" : "#16a34a" }}>
                          L. {saldo.toFixed(2)}
                        </td>
                        <td style={{ padding: "8px 10px" }}>
                          <div style={{ display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap" }}>
                            <button onClick={() => setOrdenSeleccionada(o)} style={{ ...estiloBtn, background: "#0284c7", color: "#fff" }}>👁️ Ver</button>
                            <button onClick={() => alCotizarOrden(o)} style={{ ...estiloBtn, background: "#0d9488", color: "#fff" }}>💲 Cobro</button>
                            <button onClick={() => handleAbonar(o)} style={{ ...estiloBtn, background: "#16a34a", color: "#fff" }}>💵 Abono</button>
                            <button onClick={() => alEditarOrden(o)} style={{ ...estiloBtn, background: "#f59e0b", color: "#fff" }}>✏️ Editar</button>
                            <button onClick={() => enviarWhatsApp(o.telefono, nombre)} style={{ ...estiloBtn, background: "#25D366", color: "#fff" }}>💬 WhatsApp</button>
                            {esAdmin && (
                              <button onClick={() => handleEliminar(o.id, nombre)} style={{ ...estiloBtn, background: "#ef4444", color: "#fff" }}>🗑️</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* VISTA PREVIA DETALLADA EN PANTALLA */}
          {ordenSeleccionada && (
            <div style={{ width: "420px", background: "#fff", padding: "20px", borderRadius: "8px", border: "2px solid #0284c7", boxShadow: "0 4px 15px rgba(0,0,0,0.15)", position: "sticky", top: "20px" }}>
              
              <div style={{ textAlign: "center", borderBottom: "2px solid #1a365d", paddingBottom: "10px", marginBottom: "12px" }}>
                <h3 style={{ margin: 0, color: "#1a365d" }}>ÓPTICA ADM</h3>
                <p style={{ margin: "2px 0", fontSize: "13px", color: "#64748b" }}>Examen & Receta Médica Visual</p>
              </div>

              <div style={{ display: "flex", gap: "6px", marginBottom: "15px" }}>
                <button onClick={handleImprimir} style={{ flex: 1, background: "#16a34a", color: "#fff", border: "none", padding: "8px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "12px" }}>
                  🖨️ Imprimir Receta
                </button>
                <button onClick={() => alCotizarOrden(ordenSeleccionada)} style={{ flex: 1, background: "#0d9488", color: "#fff", border: "none", padding: "8px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "12px" }}>
                  💲 Cobrar
                </button>
                <button onClick={() => setOrdenSeleccionada(null)} style={{ background: "#64748b", color: "#fff", border: "none", padding: "8px 12px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
                  ✕
                </button>
              </div>

              <div style={{ fontSize: "13px", marginBottom: "12px", background: "#f8fafc", padding: "10px", borderRadius: "6px" }}>
                <p style={{ margin: "3px 0" }}><strong>Paciente:</strong> {ordenSeleccionada.cliente_nombre || ordenSeleccionada.clienteNombre}</p>
                <p style={{ margin: "3px 0" }}><strong>Fecha:</strong> {ordenSeleccionada.fecha ? String(ordenSeleccionada.fecha).split("T")[0] : "-"}</p>
                <p style={{ margin: "3px 0" }}><strong>Teléfono:</strong> {ordenSeleccionada.telefono || "N/A"}</p>
                <p style={{ margin: "3px 0" }}><strong>Edad:</strong> {ordenSeleccionada.edad || "N/A"} años</p>
                <p style={{ margin: "3px 0" }}><strong>Atendido Por:</strong> {ordenSeleccionada.usuario_nombre || "SISTEMA"}</p>
              </div>
              
              <h4 style={{ borderBottom: "1px solid #cbd5e1", paddingBottom: "4px", margin: "10px 0", color: "#0f172a", fontSize: "14px" }}>Graduación Prescrita</h4>
              <table style={{ width: "100%", fontSize: "12px", borderCollapse: "collapse", textAlign: "center", marginBottom: "12px" }}>
                <thead>
                  <tr style={{ background: "#e2e8f0" }}>
                    <th style={{ padding: "4px", border: "1px solid #cbd5e1" }}>Ojo</th>
                    <th style={{ padding: "4px", border: "1px solid #cbd5e1" }}>Esfera</th>
                    <th style={{ padding: "4px", border: "1px solid #cbd5e1" }}>Cilindro</th>
                    <th style={{ padding: "4px", border: "1px solid #cbd5e1" }}>Eje</th>
                    <th style={{ padding: "4px", border: "1px solid #cbd5e1" }}>ADD</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "4px", border: "1px solid #cbd5e1" }}><strong>O.D.</strong></td>
                    <td style={{ padding: "4px", border: "1px solid #cbd5e1" }}>{ordenSeleccionada.act_od_esfera || "-"}</td>
                    <td style={{ padding: "4px", border: "1px solid #cbd5e1" }}>{ordenSeleccionada.act_od_cilindro || "-"}</td>
                    <td style={{ padding: "4px", border: "1px solid #cbd5e1" }}>{ordenSeleccionada.act_od_eje || "-"}</td>
                    <td style={{ padding: "4px", border: "1px solid #cbd5e1" }}>{ordenSeleccionada.act_od_add || "-"}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "4px", border: "1px solid #cbd5e1" }}><strong>O.I.</strong></td>
                    <td style={{ padding: "4px", border: "1px solid #cbd5e1" }}>{ordenSeleccionada.act_oi_esfera || "-"}</td>
                    <td style={{ padding: "4px", border: "1px solid #cbd5e1" }}>{ordenSeleccionada.act_oi_cilindro || "-"}</td>
                    <td style={{ padding: "4px", border: "1px solid #cbd5e1" }}>{ordenSeleccionada.act_oi_eje || "-"}</td>
                    <td style={{ padding: "4px", border: "1px solid #cbd5e1" }}>{ordenSeleccionada.act_oi_add || "-"}</td>
                  </tr>
                </tbody>
              </table>

              {ordenSeleccionada.observaciones && (
                <div style={{ marginBottom: "12px" }}>
                  <h5 style={{ margin: "5px 0", color: "#0f172a" }}>Observaciones:</h5>
                  <p style={{ margin: 0, fontSize: "12px", color: "#475569" }}>{ordenSeleccionada.observaciones}</p>
                </div>
              )}

              <div style={{ padding: "10px", background: "#f1f5f9", borderRadius: "6px", textAlign: "center" }}>
                <p style={{ margin: "2px 0", fontSize: "12px" }}>Total: <strong>L. {parseFloat(ordenSeleccionada.total || 0).toFixed(2)}</strong></p>
                <p style={{ margin: "2px 0", fontSize: "14px", fontWeight: "bold", color: parseFloat(ordenSeleccionada.saldo_pendiente || 0) > 0 ? "#dc2626" : "#16a34a" }}>
                  Saldo: L. {parseFloat(ordenSeleccionada.saldo_pendiente || 0).toFixed(2)}
                </p>
              </div>

              <div style={{ marginTop: "20px", textAlign: "center", paddingTop: "8px", borderTop: "1px solid #cbd5e1" }}>
                <p style={{ margin: 0, fontWeight: "bold", fontSize: "11px" }}>FIRMA OPTOMETRISTA</p>
                <p style={{ margin: "2px 0", fontSize: "11px", color: "#64748b" }}>{ordenSeleccionada.usuario_nombre || "SISTEMA"}</p>
              </div>

            </div>
          )}

        </div>
      )}
    </div>
  );
}
