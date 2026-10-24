import React, { useState, useEffect, useRef } from "react";
import { actualizarOrden, obtenerOrdenes, obtenerInventario, reducirStockInventario } from "../services/api";

export default function CotizacionesCobro({ ordenSeleccionadaProp, alFinalizar, usuarioActivo }) {
  const [ordenes, setOrdenes] = useState([]);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(ordenSeleccionadaProp || null);
  
  const [aroDescripcion, setAroDescripcion] = useState("");
  const [aroPrecio, setAroPrecio] = useState(0);
  const [aroIdSeleccionado, setAroIdSeleccionado] = useState(null);
  const [descontarStock, setDescontarStock] = useState(false);

  const [lentesDescripcion, setLentesDescripcion] = useState("");
  const [lentesPrecio, setLentesPrecio] = useState(0);
  const [otrosDescripcion, setOtrosDescripcion] = useState("");
  const [otrosPrecio, setOtrosPrecio] = useState(0);
  const [prima, setPrima] = useState(0);

  const [inventario, setInventario] = useState([]);
  const [cargando, setCargando] = useState(false);

  const iframeRef = useRef(null);

  useEffect(() => {
    cargarListaOrdenes();
    cargarInventario();
  }, []);

  useEffect(() => {
    if (ordenSeleccionadaProp) {
      cargarDatosOrden(ordenSeleccionadaProp);
    }
  }, [ordenSeleccionadaProp]);

  const cargarListaOrdenes = async () => {
    const data = await obtenerOrdenes();
    setOrdenes(data || []);
  };

  const cargarInventario = async () => {
    const data = await obtenerInventario();
    setInventario(data || []);
  };

  const cargarDatosOrden = (orden) => {
    setOrdenSeleccionada(orden);
    setAroDescripcion((orden.aro_descripcion || "").toUpperCase());
    setAroPrecio(parseFloat(orden.aro_precio || 0));
    setLentesDescripcion((orden.lentes_descripcion || "").toUpperCase());
    setLentesPrecio(parseFloat(orden.lentes_precio || 0));
    setOtrosDescripcion((orden.otros_descripcion || "").toUpperCase());
    setOtrosPrecio(parseFloat(orden.otros_precio || 0));
    setPrima(parseFloat(orden.prima || 0));
    setAroIdSeleccionado(orden.aro_id || null);
  };

  const handleCambiarPaciente = (e) => {
    const id = e.target.value;
    if (!id) {
      setOrdenSeleccionada(null);
      return;
    }
    const encontrada = ordenes.find((o) => String(o.id) === String(id));
    if (encontrada) {
      cargarDatosOrden(encontrada);
    }
  };

  const total = parseFloat(aroPrecio || 0) + parseFloat(lentesPrecio || 0) + parseFloat(otrosPrecio || 0);
  const saldo = total - parseFloat(prima || 0);

  const handleSeleccionarAro = (e) => {
    const prodId = e.target.value;
    if (!prodId) {
      setAroIdSeleccionado(null);
      return;
    }
    const prod = inventario.find((p) => String(p.id) === String(prodId));
    if (prod) {
      setAroIdSeleccionado(prod.id);
      setAroDescripcion(`${prod.marca} ${prod.modelo} (${prod.codigo})`.toUpperCase());
      setAroPrecio(parseFloat(prod.precio_venta || 0));
    }
  };

  const handleImprimirCotizacion = () => {
    if (!ordenSeleccionada || !iframeRef.current) return;
    const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cotizacion - ${ordenSeleccionada.cliente_nombre || ordenSeleccionada.clienteNombre}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #0f172a; width: 300px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 12px; }
            .header h2 { margin: 0; color: #1a365d; }
            .row { display: flex; justify-content: space-between; font-size: 13px; margin: 6px 0; }
            .section-title { font-weight: bold; border-bottom: 1px solid #cbd5e1; margin-top: 10px; padding-bottom: 2px; font-size: 12px; }
            .totals { border-top: 2px dashed #000; border-bottom: 2px dashed #000; padding: 8px 0; margin-top: 12px; }
            .footer { margin-top: 25px; text-align: center; font-size: 11px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>ÓPTICA ADM</h2>
            <p style="margin:2px 0; font-size:12px;">Documento de Cotización / Cobro</p>
            <p style="margin:2px 0; font-size:11px;">Fecha: ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="row"><span><strong>Paciente:</strong></span> <span>${(ordenSeleccionada.cliente_nombre || ordenSeleccionada.clienteNombre || "").toUpperCase()}</span></div>
          <div class="row"><span><strong>Teléfono:</strong></span> <span>${ordenSeleccionada.telefono || "N/A"}</span></div>
          
          <div class="section-title">DETALLE DE PRODUCTOS & SERVICIOS</div>
          ${aroDescripcion ? `<div class="row"><span>Aro: ${aroDescripcion}</span> <span>L. ${parseFloat(aroPrecio || 0).toFixed(2)}</span></div>` : ""}
          ${lentesDescripcion ? `<div class="row"><span>Lentes: ${lentesDescripcion}</span> <span>L. ${parseFloat(lentesPrecio || 0).toFixed(2)}</span></div>` : ""}
          ${otrosDescripcion ? `<div class="row"><span>Otros: ${otrosDescripcion}</span> <span>L. ${parseFloat(otrosPrecio || 0).toFixed(2)}</span></div>` : ""}

          <div class="totals">
            <div class="row" style="font-size:14px; font-weight:bold;"><span>TOTAL GENERAL:</span> <span>L. ${total.toFixed(2)}</span></div>
            <div class="row" style="color:#15803d; font-weight:bold;"><span>Prima / Anticipo:</span> <span>L. ${parseFloat(prima || 0).toFixed(2)}</span></div>
            <div class="row" style="color:${saldo > 0 ? '#dc2626' : '#16a34a'}; font-weight:bold;"><span>Saldo Pendiente:</span> <span>L. ${(saldo < 0 ? 0 : saldo).toFixed(2)}</span></div>
          </div>

          <div class="footer">
            <p style="margin:2px 0;">¡Gracias por preferir Óptica ADM!</p>
            <p style="margin:0;">Atendido por: ${usuarioActivo ? usuarioActivo.nombre : "SISTEMA"}</p>
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

  const handleGuardarCobro = async (e) => {
    e.preventDefault();
    if (!ordenSeleccionada) {
      alert("Por favor seleccione un paciente.");
      return;
    }
    setCargando(true);

    const payload = {
      ...ordenSeleccionada,
      clienteNombre: (ordenSeleccionada.cliente_nombre || ordenSeleccionada.clienteNombre || "").toUpperCase(),
      aroDescripcion: (aroDescripcion || "").toUpperCase(),
      aroPrecio,
      aroId: aroIdSeleccionado,
      lentesDescripcion: (lentesDescripcion || "").toUpperCase(),
      lentesPrecio,
      otrosDescripcion: (otrosDescripcion || "").toUpperCase(),
      otrosPrecio,
      total,
      prima,
      saldoPendiente: saldo < 0 ? 0 : saldo,
      estadoTrabajo: saldo <= 0 ? "ENTREGADO" : "PENDIENTE"
    };

    const res = await actualizarOrden(ordenSeleccionada.id, payload);

    if (res.success) {
      if (descontarStock && aroIdSeleccionado) {
        await reducirStockInventario(aroIdSeleccionado);
      }

      setCargando(false);
      alert("✅ ¡Cotización y cobro registrados correctamente!" + (descontarStock ? "\n(Se descontó 1 unidad del inventario)" : ""));
      cargarListaOrdenes();
      if (alFinalizar) alFinalizar();
    } else {
      setCargando(false);
      alert("Error al guardar cotización: " + res.error);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      
      <iframe ref={iframeRef} style={{ display: "none", width: "0px", height: "0px", border: "none" }} title="iframe-cotizacion" />

      <h2 style={{ textAlign: "center", color: "#1a365d", marginBottom: "20px" }}>💲 Cotización, Prima y Cobro</h2>

      {/* SELECTOR DE PACIENTE */}
      <div style={{ background: "#fff", padding: "18px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", marginBottom: "20px", borderLeft: "5px solid #0284c7" }}>
        <label style={{ fontSize: "13px", fontWeight: "bold", display: "block", marginBottom: "8px", color: "#0f172a" }}>
          👤 Seleccionar Paciente a Cotizar / Cobrar:
        </label>
        <select
          value={ordenSeleccionada ? ordenSeleccionada.id : ""}
          onChange={handleCambiarPaciente}
          style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "15px", fontWeight: "bold", background: "#f8fafc" }}
        >
          <option value="">-- Buscar paciente registrado --</option>
          {ordenes.map((o) => (
            <option key={o.id} value={o.id}>
              {(o.cliente_nombre || o.clienteNombre || "").toUpperCase()} | Fecha: {o.fecha ? String(o.fecha).split("T")[0] : "-"} | Saldo: L. {parseFloat(o.saldo_pendiente || 0).toFixed(2)}
            </option>
          ))}
        </select>
      </div>

      {ordenSeleccionada ? (
        <form onSubmit={handleGuardarCobro} style={{ background: "#fff", padding: "25px", borderRadius: "10px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
          
          {/* ENCABEZADO PACIENTE */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f1f5f9", padding: "12px 18px", borderRadius: "8px", marginBottom: "20px" }}>
            <div>
              <h3 style={{ margin: 0, color: "#1a365d" }}>{(ordenSeleccionada.cliente_nombre || ordenSeleccionada.clienteNombre || "").toUpperCase()}</h3>
              <span style={{ fontSize: "12px", color: "#64748b" }}>Teléfono: {ordenSeleccionada.telefono || "N/A"}</span>
            </div>
            <button
              type="button"
              onClick={handleImprimirCotizacion}
              style={{ background: "#0284c7", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "6px", fontWeight: "bold", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
            >
              🖨️ Imprimir Cotización
            </button>
          </div>

          {/* BUSCADOR DE AROS */}
          <div style={{ marginBottom: "20px", background: "#f8fafc", padding: "15px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
            <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "6px", color: "#0f172a" }}>📦 Seleccionar Aro desde Inventario (Opcional):</label>
            <select onChange={handleSeleccionarAro} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", marginBottom: "8px", fontSize: "13px" }}>
              <option value="">-- Buscar Armazón por Código o Marca --</option>
              {inventario.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.marca.toUpperCase()} {p.modelo.toUpperCase()} | SKU: {p.codigo.toUpperCase()} - L. {parseFloat(p.precio_venta).toFixed(2)} (Stock: {p.stock})
                </option>
              ))}
            </select>

            {aroIdSeleccionado && (
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: "bold", color: "#15803d", cursor: "pointer", marginTop: "8px" }}>
                <input type="checkbox" checked={descontarStock} onChange={(e) => setDescontarStock(e.target.checked)} />
                ✅ Cliente confirmó compra: Descontar 1 unidad del inventario automáticamente
              </label>
            )}
          </div>

          {/* CAMPOS DE DESCRIPCIÓN Y PRECIOS */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "bold", color: "#334155" }}>Descripción Aro / Armazón:</label>
              <input type="text" value={aroDescripcion} onChange={(e) => setAroDescripcion(e.target.value.toUpperCase())} style={{ width: "100%", padding: "10px", textTransform: "uppercase", borderRadius: "6px", border: "1px solid #cbd5e1" }} placeholder="EJ: RAY BAN NEGRO MATE" />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "bold", color: "#334155" }}>Precio Aro (L.):</label>
              <input type="number" step="0.01" value={aroPrecio} onChange={(e) => setAroPrecio(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "bold", color: "#334155" }}>Descripción Lentes / Tratamientos:</label>
              <input type="text" value={lentesDescripcion} onChange={(e) => setLentesDescripcion(e.target.value.toUpperCase())} style={{ width: "100%", padding: "10px", textTransform: "uppercase", borderRadius: "6px", border: "1px solid #cbd5e1" }} placeholder="EJ: MONOFOCAL CR-39 ANTI-REFLEJO BLUE BLOCK" />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "bold", color: "#334155" }}>Precio Lentes (L.):</label>
              <input type="number" step="0.01" value={lentesPrecio} onChange={(e) => setLentesPrecio(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px", marginBottom: "25px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "bold", color: "#334155" }}>Otros Servicios / Accesorios:</label>
              <input type="text" value={otrosDescripcion} onChange={(e) => setOtrosDescripcion(e.target.value.toUpperCase())} style={{ width: "100%", padding: "10px", textTransform: "uppercase", borderRadius: "6px", border: "1px solid #cbd5e1" }} placeholder="EJ: ESTUCHE + PAÑO LIMPIADOR" />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "bold", color: "#334155" }}>Precio Otros (L.):</label>
              <input type="number" step="0.01" value={otrosPrecio} onChange={(e) => setOtrosPrecio(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
            </div>
          </div>

          {/* CAJAS RESUMEN DE SALDOS */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px", padding: "18px", background: "#f8fafc", border: "2px solid #e2e8f0", borderRadius: "10px", marginBottom: "25px", textAlign: "center" }}>
            <div>
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "bold" }}>TOTAL GENERAL</span>
              <h3 style={{ margin: "6px 0", color: "#0f172a", fontSize: "20px" }}>L. {total.toFixed(2)}</h3>
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "#166534", fontWeight: "bold", display: "block" }}>PRIMA / ANTICIPO (L.)</label>
              <input type="number" step="0.01" value={prima} onChange={(e) => setPrima(e.target.value)} style={{ width: "85%", padding: "8px", textAlign: "center", fontWeight: "bold", fontSize: "18px", borderRadius: "6px", border: "2px solid #16a34a", color: "#166534" }} />
            </div>
            <div>
              <span style={{ fontSize: "12px", color: saldo > 0 ? "#dc2626" : "#16a34a", fontWeight: "bold" }}>SALDO RESTANTE</span>
              <h3 style={{ margin: "6px 0", color: saldo > 0 ? "#dc2626" : "#16a34a", fontSize: "20px" }}>L. {(saldo < 0 ? 0 : saldo).toFixed(2)}</h3>
            </div>
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button type="submit" disabled={cargando} style={{ flex: 1, padding: "14px", background: "#16a34a", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "16px", cursor: "pointer", boxShadow: "0 2px 8px rgba(22, 163, 74, 0.3)" }}>
              {cargando ? "Guardando..." : "💾 Guardar Cotización y Cobro"}
            </button>
            {alFinalizar && (
              <button type="button" onClick={alFinalizar} style={{ padding: "14px 24px", background: "#64748b", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
                Volver
              </button>
            )}
          </div>

        </form>
      ) : (
        <div style={{ background: "#f8fafc", padding: "50px 20px", textAlign: "center", borderRadius: "10px", border: "2px dashed #cbd5e1", color: "#64748b" }}>
          👈 Seleccione un paciente del menú desplegable superior para cargar su ficha y cotización.
        </div>
      )}
    </div>
  );
}
