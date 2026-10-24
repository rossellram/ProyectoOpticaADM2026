import React, { useState, useEffect, useRef } from "react";
import { obtenerOrdenes, registrarAbono, eliminarOrden } from "../services/api";

export default function HistorialOrdenes({ alEditarOrden, alCotizarOrden, usuarioActivo }) {
  const [ordenes, setOrdenes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(true);

  const [ordenAbonar, setOrdenAbonar] = useState(null);
  const [montoAbonoInput, setMontoAbonoInput] = useState("");
  const [guardandoAbono, setGuardandoAbono] = useState(false);

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

  const abrirModalAbono = (orden) => {
    const saldoActual = parseFloat(orden.saldo_pendiente || 0);
    if (saldoActual <= 0) {
      alert("Esta orden ya está completamente pagada.");
      return;
    }
    setOrdenAbonar(orden);
    setMontoAbonoInput("");
  };

  const handleConfirmarAbono = async (e) => {
    e.preventDefault();
    if (!ordenAbonar) return;

    const saldoActual = parseFloat(ordenAbonar.saldo_pendiente || 0);
    const monto = parseFloat(montoAbonoInput);

    if (isNaN(monto) || monto <= 0) {
      alert("Por favor ingrese un monto válido mayor a 0.");
      return;
    }

    if (monto > saldoActual) {
      alert(`El monto ingresado (L. ${monto.toFixed(2)}) excede el saldo pendiente (L. ${saldoActual.toFixed(2)}).`);
      return;
    }

    setGuardandoAbono(true);
    const res = await registrarAbono(ordenAbonar.id, monto);
    setGuardandoAbono(false);

    if (res.success) {
      alert("✅ Abono registrado exitosamente.");
      setOrdenAbonar(null);
      setMontoAbonoInput("");
      cargarHistorial();
      if (ordenSeleccionada && ordenSeleccionada.id === ordenAbonar.id) {
        setOrdenSeleccionada(res.data);
      }
    } else {
      alert("❌ Error al registrar abono: " + (res.error || "Error de servidor"));
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

  const handleImprimirReceta = () => {
    if (!ordenSeleccionada || !iframeRef.current) return;

    const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receta - ${ordenSeleccionada.cliente_nombre || ordenSeleccionada.clienteNombre}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #0f172a; }
            .header { text-align: center; border-bottom: 2px solid #1a365d; padding-bottom: 10px; margin-bottom: 15px; }
            .header h2 { margin: 0; color: #1a365d; }
            .header p { margin: 2px 0; font-size: 13px; color: #64748b; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px; margin-bottom: 15px; background: #f8fafc; padding: 10px; border-radius: 6px; }
            table { width: 100%; border-collapse: collapse; text-align: center; font-size: 12px; margin-bottom: 15px; }
            th, td { border: 1px solid #cbd5e1; padding: 6px; }
            th { background: #e2e8f0; }
            .totals { padding: 10px; background: #f1f5f9; border-radius: 6px; text-align: center; margin-top: 15px; }
            .firma { margin-top: 35px; text-align: center; border-top: 1px solid #000; padding-top: 5px; width: 220px; margin-left: auto; margin-right: auto; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>ÓPTICA ADM</h2>
            <p>Examen & Receta Médica Visual</p>
          </div>

          <div class="info-grid">
            <p><strong>Paciente:</strong> ${ordenSeleccionada.cliente_nombre || ordenSeleccionada.clienteNombre}</p>
            <p><strong>Fecha:</strong> ${ordenSeleccionada.fecha ? String(ordenSeleccionada.fecha).split("T")[0] : "-"}</p>
            <p><strong>Teléfono:</strong> ${ordenSeleccionada.telefono || "N/A"}</p>
            <p><strong>Edad:</strong> ${ordenSeleccionada.edad || "N/A"} años</p>
          </div>

          <h3>Graduación Prescrita</h3>
          <table>
            <thead>
              <tr>
                <th>Ojo</th><th>Esfera</th><th>Cilindro</th><th>Eje</th><th>ADD</th><th>DP</th><th>Altura</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>O.D.</strong></td>
                <td>${ordenSeleccionada.act_od_esfera || "-"}</td>
                <td>${ordenSeleccionada.act_od_cilindro || "-"}</td>
                <td>${ordenSeleccionada.act_od_eje || "-"}</td>
                <td>${ordenSeleccionada.act_od_add || "-"}</td>
                <td>${ordenSeleccionada.act_od_dp || "-"}</td>
                <td>${ordenSeleccionada.act_od_altura || "-"}</td>
              </tr>
              <tr>
                <td><strong>O.I.</strong></td>
                <td>${ordenSeleccionada.act_oi_esfera || "-"}</td>
                <td>${ordenSeleccionada.act_oi_cilindro || "-"}</td>
                <td>${ordenSeleccionada.act_oi_eje || "-"}</td>
                <td>${ordenSeleccionada.act_oi_add || "-"}</td>
                <td>${ordenSeleccionada.act_oi_dp || "-"}</td>
                <td>${ordenSeleccionada.act_oi_altura || "-"}</td>
              </tr>
            </tbody>
          </table>

          <div class="totals">
            <p style="margin:2px 0;">Total Cotización: <strong>L. ${parseFloat(ordenSeleccionada.total || 0).toFixed(2)}</strong></p>
            <p style="margin:2px 0;">Prima / Abono Inicial: L. ${parseFloat(ordenSeleccionada.prima || 0).toFixed(2)}</p>
            <p style="margin:2px 0; font-weight:bold; color: ${parseFloat(ordenSeleccionada.saldo_pendiente || 0) > 0 ? "#dc2626" : "#16a34a"};">
              Saldo Pendiente: L. ${parseFloat(ordenSeleccionada.saldo_pendiente || 0).toFixed(2)}
            </p>
          </div>

          <div class="firma">
            <p style="margin:0; font-weight:bold; font-size:11px;">ATENDIDO POR</p>
            <p style="margin:2px 0; font-size:11px; color:#64748b;">${ordenSeleccionada.usuario_nombre || "SISTEMA"}</p>
          </div>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframeRef.current.contentWindow.focus();
      iframeRef.current.contentWindow.print();
    }, 250);
  };

  const ordenesFiltradas = ordenes.filter((o) => {
    const termino = busqueda.toLowerCase();
    const nombre = (o.cliente_nombre || o.clienteNombre || "").toLowerCase();
    const telefono = (o.telefono || "").toLowerCase();
    return nombre.includes(termino) || telefono.includes(termino);
  });

  const esAdmin = usuarioActivo && (usuarioActivo.rol === "ADMIN" || usuarioActivo.rol === "DEV");

  const estiloBtn = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    padding: "6px 10px",
    borderRadius: "6px",
    border: "none",
    fontWeight: "600",
    fontSize: "12px",
    cursor: "pointer",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12)"
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1300px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <iframe ref={iframeRef} style={{ display: "none", width: "0px", height: "0px", border: "none" }} title="iframe-impresion" />

      <div>
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
                            <button onClick={() => abrirModalAbono(o)} style={{ ...estiloBtn, background: "#16a34a", color: "#fff" }}>💵 Abono</button>
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

          {ordenSeleccionada && (
            <div style={{ width: "450px", background: "#fff", padding: "20px", borderRadius: "8px", border: "2px solid #0284c7", boxShadow: "0 4px 15px rgba(0,0,0,0.15)", position: "sticky", top: "20px" }}>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #1a365d", paddingBottom: "10px", marginBottom: "12px" }}>
                <div>
                  <h3 style={{ margin: 0, color: "#1a365d", fontSize: "16px" }}>ÓPTICA ADM</h3>
                  <p style={{ margin: "2px 0", fontSize: "12px", color: "#64748b" }}>Expediente de Examen & Cotización</p>
                </div>
                <button onClick={() => setOrdenSeleccionada(null)} style={{ background: "#64748b", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
                  ✕
                </button>
              </div>

              {/* DATOS GENERALES Y USUARIO */}
              <div style={{ fontSize: "12px", marginBottom: "12px", background: "#f8fafc", padding: "10px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                <p style={{ margin: "3px 0" }}><strong>Paciente:</strong> {(ordenSeleccionada.cliente_nombre || ordenSeleccionada.clienteNombre || "").toUpperCase()}</p>
                <p style={{ margin: "3px 0" }}><strong>Fecha de Examen:</strong> {ordenSeleccionada.fecha ? String(ordenSeleccionada.fecha).split("T")[0] : "-"}</p>
                <p style={{ margin: "3px 0" }}><strong>Teléfono:</strong> {ordenSeleccionada.telefono || "N/A"} | <strong>Edad:</strong> {ordenSeleccionada.edad || "N/A"} años</p>
                <p style={{ margin: "3px 0", color: "#0284c7" }}><strong>Atendido Por (Usuario):</strong> {ordenSeleccionada.usuario_nombre || "SISTEMA"}</p>
              </div>
              
              {/* GRADUACIÓN ACTUAL */}
              <h4 style={{ borderBottom: "1px solid #cbd5e1", paddingBottom: "4px", margin: "10px 0", color: "#0f172a", fontSize: "13px" }}>🎯 Graduación Actual Registrada</h4>
              <table style={{ width: "100%", fontSize: "11px", borderCollapse: "collapse", textAlign: "center", marginBottom: "12px" }}>
                <thead>
                  <tr style={{ background: "#e2e8f0" }}>
                    <th style={{ padding: "4px", border: "1px solid #cbd5e1" }}>Ojo</th>
                    <th style={{ padding: "4px", border: "1px solid #cbd5e1" }}>Esfera</th>
                    <th style={{ padding: "4px", border: "1px solid #cbd5e1" }}>Cilindro</th>
                    <th style={{ padding: "4px", border: "1px solid #cbd5e1" }}>Eje</th>
                    <th style={{ padding: "4px", border: "1px solid #cbd5e1" }}>ADD</th>
                    <th style={{ padding: "4px", border: "1px solid #cbd5e1" }}>DP</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "4px", border: "1px solid #cbd5e1" }}><strong>O.D.</strong></td>
                    <td style={{ padding: "4px", border: "1px solid #cbd5e1" }}>{ordenSeleccionada.act_od_esfera || "-"}</td>
                    <td style={{ padding: "4px", border: "1px solid #cbd5e1" }}>{ordenSeleccionada.act_od_cilindro || "-"}</td>
                    <td style={{ padding: "4px", border: "1px solid #cbd5e1" }}>{ordenSeleccionada.act_od_eje || "-"}</td>
                    <td style={{ padding: "4px", border: "1px solid #cbd5e1" }}>{ordenSeleccionada.act_od_add || "-"}</td>
                    <td style={{ padding: "4px", border: "1px solid #cbd5e1" }}>{ordenSeleccionada.act_od_dp || "-"}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "4px", border: "1px solid #cbd5e1" }}><strong>O.I.</strong></td>
                    <td style={{ padding: "4px", border: "1px solid #cbd5e1" }}>{ordenSeleccionada.act_oi_esfera || "-"}</td>
                    <td style={{ padding: "4px", border: "1px solid #cbd5e1" }}>{ordenSeleccionada.act_oi_cilindro || "-"}</td>
                    <td style={{ padding: "4px", border: "1px solid #cbd5e1" }}>{ordenSeleccionada.act_oi_eje || "-"}</td>
                    <td style={{ padding: "4px", border: "1px solid #cbd5e1" }}>{ordenSeleccionada.act_oi_add || "-"}</td>
                    <td style={{ padding: "4px", border: "1px solid #cbd5e1" }}>{ordenSeleccionada.act_oi_dp || "-"}</td>
                  </tr>
                </tbody>
              </table>

              {/* PRECIO / COTIZACIÓN Y SALDOS */}
              <h4 style={{ borderBottom: "1px solid #cbd5e1", paddingBottom: "4px", margin: "10px 0", color: "#0f172a", fontSize: "13px" }}>💲 Detalle de Cotización y Precios</h4>
              <div style={{ fontSize: "12px", marginBottom: "15px", background: "#f8fafc", padding: "10px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                <p style={{ margin: "3px 0" }}><strong>Aro:</strong> {ordenSeleccionada.aro_descripcion || "N/A"} - <span style={{ color: "#16a34a" }}>L. {parseFloat(ordenSeleccionada.aro_precio || 0).toFixed(2)}</span></p>
                <p style={{ margin: "3px 0" }}><strong>Lentes:</strong> {ordenSeleccionada.lentes_descripcion || "N/A"} - <span style={{ color: "#16a34a" }}>L. {parseFloat(ordenSeleccionada.lentes_precio || 0).toFixed(2)}</span></p>
                {ordenSeleccionada.otros_descripcion && (
                  <p style={{ margin: "3px 0" }}><strong>Otros:</strong> {ordenSeleccionada.otros_descripcion} - <span style={{ color: "#16a34a" }}>L. {parseFloat(ordenSeleccionada.otros_precio || 0).toFixed(2)}</span></p>
                )}
              </div>

              <div style={{ padding: "12px", background: "#f1f5f9", borderRadius: "6px", textAlign: "center", marginBottom: "15px" }}>
                <p style={{ margin: "2px 0", fontSize: "13px" }}>Total Cotización: <strong>L. {parseFloat(ordenSeleccionada.total || 0).toFixed(2)}</strong></p>
                <p style={{ margin: "2px 0", fontSize: "13px", color: "#166534" }}>Prima / Anticipo: <strong>L. {parseFloat(ordenSeleccionada.prima || 0).toFixed(2)}</strong></p>
                <p style={{ margin: "4px 0 0 0", fontSize: "15px", fontWeight: "bold", color: parseFloat(ordenSeleccionada.saldo_pendiente || 0) > 0 ? "#dc2626" : "#16a34a" }}>
                  Saldo Pendiente: L. {parseFloat(ordenSeleccionada.saldo_pendiente || 0).toFixed(2)}
                </p>
              </div>

              <div style={{ display: "flex", gap: "6px" }}>
                <button onClick={handleImprimirReceta} style={{ flex: 1, background: "#16a34a", color: "#fff", border: "none", padding: "8px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "12px" }}>
                  🖨️ Imprimir
                </button>
                <button onClick={() => alCotizarOrden(ordenSeleccionada)} style={{ flex: 1, background: "#0d9488", color: "#fff", border: "none", padding: "8px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "12px" }}>
                  💲 Cobro
                </button>
                <button onClick={() => abrirModalAbono(ordenSeleccionada)} style={{ flex: 1, background: "#16a34a", color: "#fff", border: "none", padding: "8px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "12px" }}>
                  💵 Abono
                </button>
              </div>

            </div>
          )}

        </div>
      )}

      {ordenAbonar && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          background: "rgba(15, 23, 42, 0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999
        }}>
          <div style={{ background: "#fff", padding: "25px", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.3)", width: "100%", maxWidth: "400px" }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#1a365d", textAlign: "center" }}>💵 Registrar Abono a Cuenta</h3>
            
            <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px", marginBottom: "15px", fontSize: "14px" }}>
              <p style={{ margin: "4px 0" }}><strong>Paciente:</strong> {(ordenAbonar.cliente_nombre || ordenAbonar.clienteNombre || "").toUpperCase()}</p>
              <p style={{ margin: "4px 0", color: "#dc2626", fontWeight: "bold" }}>
                Saldo Pendiente: L. {parseFloat(ordenAbonar.saldo_pendiente || 0).toFixed(2)}
              </p>
            </div>

            <form onSubmit={handleConfirmarAbono}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "6px" }}>Monto a Abonar (L.):</label>
                <input
                  type="number" step="0.01" autoFocus required
                  value={montoAbonoInput}
                  onChange={(e) => setMontoAbonoInput(e.target.value)}
                  placeholder="Ej: 500.00"
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "16px", fontWeight: "bold", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="submit" disabled={guardandoAbono}
                  style={{ flex: 1, padding: "10px", background: "#16a34a", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
                >
                  {guardandoAbono ? "Guardando..." : "💾 Confirmar Abono"}
                </button>
                <button
                  type="button" onClick={() => setOrdenAbonar(null)}
                  style={{ padding: "10px 15px", background: "#64748b", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
