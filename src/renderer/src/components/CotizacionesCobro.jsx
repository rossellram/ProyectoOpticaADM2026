import React, { useState, useEffect } from "react";
import { actualizarOrden, obtenerInventario } from "../services/api";

export default function CotizacionesCobro({ ordenSeleccionada, alFinalizar }) {
  const [aroDescripcion, setAroDescripcion] = useState("");
  const [aroPrecio, setAroPrecio] = useState(0);
  const [lentesDescripcion, setLentesDescripcion] = useState("");
  const [lentesPrecio, setLentesPrecio] = useState(0);
  const [otrosDescripcion, setOtrosDescripcion] = useState("");
  const [otrosPrecio, setOtrosPrecio] = useState(0);
  const [prima, setPrima] = useState(0);
  
  const [inventario, setInventario] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarInventario();
    if (ordenSeleccionada) {
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
    if (!prodId) return;
    const prod = inventario.find((p) => String(p.id) === String(prodId));
    if (prod) {
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
      aroDescripcion: (aroDescripcion || "").toUpperCase(), aroPrecio,
      lentesDescripcion: (lentesDescripcion || "").toUpperCase(), lentesPrecio,
      otrosDescripcion: (otrosDescripcion || "").toUpperCase(), otrosPrecio,
      total,
      prima,
      saldoPendiente: saldo < 0 ? 0 : saldo,
      estadoTrabajo: saldo <= 0 ? "ENTREGADO" : "PENDIENTE"
    };

    const res = await actualizarOrden(ordenSeleccionada.id, payload);
    setCargando(false);

    if (res.success) {
      alert("¡Cotización y cobro registrados correctamente!");
      if (alFinalizar) alFinalizar();
    } else {
      alert("Error al guardar cotización: " + res.error);
    }
  };

  if (!ordenSeleccionada) {
    return <p style={{ textAlign: "center", padding: "40px" }}>Por favor seleccione un paciente del historial para cotizar.</p>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", color: "#1a365d" }}>💲 Cotización, Prima y Cobro</h2>
      <p style={{ textAlign: "center", color: "#64748b" }}>
        Paciente: <strong>{(ordenSeleccionada.cliente_nombre || ordenSeleccionada.clienteNombre || "").toUpperCase()}</strong> | Teléfono: {ordenSeleccionada.telefono || "N/A"}
      </p>

      <form onSubmit={handleGuardarCobro} style={{ background: "#fff", padding: "25px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        
        <div style={{ marginBottom: "15px", background: "#f1f5f9", padding: "10px", borderRadius: "6px" }}>
          <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "5px" }}>📦 Seleccionar Aro desde Inventario (Opcional):</label>
          <select onChange={handleSeleccionarAro} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1" }}>
            <option value="">-- Buscar en Inventario --</option>
            {inventario.map((p) => (
              <option key={p.id} value={p.id}>
                {p.marca.toUpperCase()} {p.modelo.toUpperCase()} | SKU: {p.codigo.toUpperCase()} - L. {parseFloat(p.precio_venta).toFixed(2)} (Stock: {p.stock})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "10px", marginBottom: "10px" }}>
          <div>
            <label style={{ fontSize: "12px", fontWeight: "bold" }}>Descripción Aro / Armazón:</label>
            <input type="text" value={aroDescripcion} onChange={(e) => setAroDescripcion(e.target.value.toUpperCase())} style={{ width: "100%", padding: "8px", textTransform: "uppercase" }} />
          </div>
          <div>
            <label style={{ fontSize: "12px", fontWeight: "bold" }}>Precio Aro (L.):</label>
            <input type="number" step="0.01" value={aroPrecio} onChange={(e) => setAroPrecio(e.target.value)} style={{ width: "100%", padding: "8px" }} />
          </div>
        </div>

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

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px", padding: "15px", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "8px", marginBottom: "20px", textAlign: "center" }}>
          <div>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "bold" }}>TOTAL A PAGAR</span>
            <h3 style={{ margin: "5px 0", color: "#0f172a" }}>L. {total.toFixed(2)}</h3>
          </div>
          <div>
            <label style={{ fontSize: "12px", color: "#166534", fontWeight: "bold", display: "block" }}>PRIMA / ABONO INICIAL (L.)</label>
            <input type="number" step="0.01" value={prima} onChange={(e) => setPrima(e.target.value)} style={{ width: "80%", padding: "6px", textAlign: "center", fontWeight: "bold", fontSize: "16px", borderRadius: "4px", border: "1px solid #cbd5e1" }} />
          </div>
          <div>
            <span style={{ fontSize: "12px", color: saldo > 0 ? "#dc2626" : "#16a34a", fontWeight: "bold" }}>SALDO PENDIENTE</span>
            <h3 style={{ margin: "5px 0", color: saldo > 0 ? "#dc2626" : "#16a34a" }}>L. {(saldo < 0 ? 0 : saldo).toFixed(2)}</h3>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit" disabled={cargando} style={{ flex: 1, padding: "12px", background: "#16a34a", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}>
            {cargando ? "Guardando..." : "💾 Guardar Cotización y Cobro"}
          </button>
          <button type="button" onClick={alFinalizar} style={{ padding: "12px 20px", background: "#64748b", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
            Volver
          </button>
        </div>

      </form>
    </div>
  );
}
