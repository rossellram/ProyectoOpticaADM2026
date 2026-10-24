import React, { useState, useEffect } from "react";
import { actualizarOrden, obtenerInventario, reducirStockInventario } from "../services/api";

export default function CotizacionesCobro({ ordenSeleccionada, alFinalizar }) {
  const [aroId, setAroId] = useState(null);
  const [aroDescripcion, setAroDescripcion] = useState("");
  const [aroPrecio, setAroPrecio] = useState(0);

  const [lentesDescripcion, setLentesDescripcion] = useState("");
  const [lentesPrecio, setLentesPrecio] = useState(0);
  const [otrosDescripcion, setOtrosDescripcion] = useState("");
  const [otrosPrecio, setOtrosPrecio] = useState(0);
  const [prima, setPrima] = useState(0);

  const [confirmarVenta, setConfirmarVenta] = useState(false);
  const [inventario, setInventario] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarInventario();
    if (ordenSeleccionada) {
      setAroId(ordenSeleccionada.aro_id || null);
      setAroDescripcion((ordenSeleccionada.aro_descripcion || "").toUpperCase());
      setAroPrecio(parseFloat(ordenSeleccionada.aro_precio || 0));
      setLentesDescripcion((ordenSeleccionada.lentes_descripcion || "").toUpperCase());
      setLentesPrecio(parseFloat(ordenSeleccionada.lentes_precio || 0));
      setOtrosDescripcion((ordenSeleccionada.otros_descripcion || "").toUpperCase());
      setOtrosPrecio(parseFloat(ordenSeleccionada.otros_precio || 0));
      setPrima(parseFloat(ordenSeleccionada.prima || 0));
    }
  }, [ordenSeleccionada]);

  const cargarInventario = async () => {
    const data = await obtenerInventario();
    setInventario(data);
  };

  const total = parseFloat(aroPrecio || 0) + parseFloat(lentesPrecio || 0) + parseFloat(otrosPrecio || 0);
  const saldo = total - parseFloat(prima || 0);

  const handleSeleccionarAro = (e) => {
    const prodId = e.target.value;
    if (!prodId) {
      setAroId(null);
      return;
    }
    const prod = inventario.find((p) => String(p.id) === String(prodId));
    if (prod) {
      setAroId(prod.id);
      setAroDescripcion(`${prod.marca} ${prod.modelo} (${prod.codigo})`.toUpperCase());
      setAroPrecio(parseFloat(prod.precio_venta || 0));
    }
  };

  const handleGuardarCobro = async (e) => {
    e.preventDefault();
    setCargando(true);

    const payload = {
      ...ordenSeleccionada,
      clienteNombre: (ordenSeleccionada.cliente_nombre || ordenSeleccionada.clienteNombre || "").toUpperCase(),
      aroId,
      aroDescripcion: (aroDescripcion || "").toUpperCase(),
      aroPrecio,
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
      let mensajeExtra = "";
      if (confirmarVenta && aroId) {
        const resStock = await reducirStockInventario(aroId);
        if (resStock.success) {
          mensajeExtra = "\n\n📦 ¡Se descontó exitosamente 1 unidad del inventario!";
        } else {
          mensajeExtra = "\n\n⚠️ Cotización guardada, pero ocurrió un detalle al descontar el inventario: " + resStock.error;
        }
      }

      setCargando(false);
      alert("¡Cotización y cobro procesados correctamente!" + mensajeExtra);
      if (alFinalizar) alFinalizar();
    } else {
      setCargando(false);
      alert("Error al guardar cotización: " + res.error);
    }
  };

  if (!ordenSeleccionada) {
    return <p style={{ textAlign: "center", padding: "40px" }}>Por favor seleccione un paciente del historial para cotizar.</p>;
  }

  const aroSeleccionadoObj = inventario.find((p) => String(p.id) === String(aroId));

  return (
    <div style={{ padding: "20px", maxWidth: "850px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", color: "#1a365d", marginBottom: "5px" }}>💲 Cotización y Cobro</h2>
      <p style={{ textAlign: "center", color: "#64748b", marginTop: 0, marginBottom: "20px" }}>
        Paciente: <strong>{(ordenSeleccionada.cliente_nombre || ordenSeleccionada.clienteNombre || "").toUpperCase()}</strong> | Teléfono: {ordenSeleccionada.telefono || "N/A"}
      </p>

      <form onSubmit={handleGuardarCobro} style={{ background: "#fff", padding: "25px", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        
        {/* BLOQUE DE SELECCIÓN DE ARO DESTACADO */}
        <fieldset style={{ marginBottom: "20px", padding: "15px", borderRadius: "8px", border: "2px solid #0284c7", background: "#f0f9ff" }}>
          <legend style={{ fontWeight: "bold", color: "#0369a1", padding: "0 8px" }}>📦 Seleccionar Aro del Inventario</legend>
          
          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "4px" }}>Cátalogo de Aros Disponibles:</label>
            <select value={aroId || ""} onChange={handleSeleccionarAro} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #0284c7", fontWeight: "bold" }}>
              <option value="">-- Buscar y seleccionar aro existente --</option>
              {inventario.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.marca.toUpperCase()} {p.modelo.toUpperCase()} | SKU: {p.codigo.toUpperCase()} - L. {parseFloat(p.precio_venta).toFixed(2)} (Stock: {p.stock} pcs)
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "10px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "bold" }}>Descripción Aro / Armazón:</label>
              <input type="text" value={aroDescripcion} onChange={(e) => setAroDescripcion(e.target.value.toUpperCase())} style={{ width: "100%", padding: "8px", textTransform: "uppercase" }} />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "bold" }}>Precio Aro (L.):</label>
              <input type="number" step="0.01" value={aroPrecio} onChange={(e) => setAroPrecio(e.target.value)} style={{ width: "100%", padding: "8px" }} />
            </div>
          </div>

          {/* CHECKBOX DESTACADO DE CONFIRMACIÓN DE VENTA */}
          {aroId && (
            <div style={{ marginTop: "12px", padding: "10px", background: "#dcfce7", border: "1px solid #16a34a", borderRadius: "6px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", fontWeight: "bold", color: "#15803d", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={confirmarVenta}
                  onChange={(e) => setConfirmarVenta(e.target.checked)}
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
                🛒 CONFIRMAR COMPRA: Descontar 1 unidad del inventario ahora (Stock Actual: {aroSeleccionadoObj ? aroSeleccionadoObj.stock : "-"} pcs)
              </label>
            </div>
          )}
        </fieldset>

        {/* DETALLE DE LENTES Y OTROS */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "10px", marginBottom: "10px" }}>
          <div>
            <label style={{ fontSize: "12px", fontWeight: "bold" }}>Descripción de Lentes / Tratamiento:</label>
            <input type="text" value={lentesDescripcion} onChange={(e) => setLentesDescripcion(e.target.value.toUpperCase())} style={{ width: "100%", padding: "8px", textTransform: "uppercase" }} placeholder="EJ: MONOFOCAL CR-39 ANTI-REFLEJO" />
          </div>
          <div>
            <label style={{ fontSize: "12px", fontWeight: "bold" }}>Precio Lentes (L.):</label>
            <input type="number" step="0.01" value={lentesPrecio} onChange={(e) => setLentesPrecio(e.target.value)} style={{ width: "100%", padding: "8px" }} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "10px", marginBottom: "20px" }}>
          <div>
            <label style={{ fontSize: "12px", fontWeight: "bold" }}>Otros Servicios / Accesorios:</label>
            <input type="text" value={otrosDescripcion} onChange={(e) => setOtrosDescripcion(e.target.value.toUpperCase())} style={{ width: "100%", padding: "8px", textTransform: "uppercase" }} />
          </div>
          <div>
            <label style={{ fontSize: "12px", fontWeight: "bold" }}>Precio Otros (L.):</label>
            <input type="number" step="0.01" value={otrosPrecio} onChange={(e) => setOtrosPrecio(e.target.value)} style={{ width: "100%", padding: "8px" }} />
          </div>
        </div>

        {/* RESUMEN FINANCIERO */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px", padding: "15px", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "8px", marginBottom: "20px", textAlign: "center" }}>
          <div>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "bold" }}>TOTAL A PAGAR</span>
            <h3 style={{ margin: "5px 0", color: "#0f172a" }}>L. {total.toFixed(2)}</h3>
          </div>
          <div>
            <label style={{ fontSize: "12px", color: "#166534", fontWeight: "bold", display: "block" }}>PRIMA / ABONO (L.)</label>
            <input type="number" step="0.01" value={prima} onChange={(e) => setPrima(e.target.value)} style={{ width: "80%", padding: "6px", textAlign: "center", fontWeight: "bold", fontSize: "16px", borderRadius: "4px", border: "1px solid #cbd5e1" }} />
          </div>
          <div>
            <span style={{ fontSize: "12px", color: saldo > 0 ? "#dc2626" : "#16a34a", fontWeight: "bold" }}>SALDO PENDIENTE</span>
            <h3 style={{ margin: "5px 0", color: saldo > 0 ? "#dc2626" : "#16a34a" }}>L. {(saldo < 0 ? 0 : saldo).toFixed(2)}</h3>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit" disabled={cargando} style={{ flex: 1, padding: "12px", background: "#16a34a", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}>
            {cargando ? "Procesando..." : "💾 Guardar Cotización y Cobro"}
          </button>
          <button type="button" onClick={alFinalizar} style={{ padding: "12px 20px", background: "#64748b", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
            Volver
          </button>
        </div>

      </form>
    </div>
  );
}
