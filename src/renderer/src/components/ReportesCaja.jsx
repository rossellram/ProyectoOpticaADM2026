import React, { useState, useEffect } from "react";
import { obtenerOrdenes } from "../services/api";

export default function ReportesCaja() {
  const [ordenes, setOrdenes] = useState([]);
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split("T")[0]);
  const [fechaFin, setFechaFin] = useState(new Date().toISOString().split("T")[0]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    const data = await obtenerOrdenes();
    setOrdenes(data);
    setCargando(false);
  };

  // Filtrar órdenes por rango de fechas seleccionado
  const ordenesFiltradas = ordenes.filter((o) => {
    if (!o.fecha) return false;
    const f = String(o.fecha).split("T")[0];
    return f >= fechaInicio && f <= fechaFin;
  });

  // Cálculos de métricas
  const totalVentas = ordenesFiltradas.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
  const totalOrdenes = ordenesFiltradas.length;
  const promedioVenta = totalOrdenes > 0 ? totalVentas / totalOrdenes : 0;

  const handleImprimirCierre = () => {
    window.print();
  };

  const setHoy = () => {
    const hoy = new Date().toISOString().split("T")[0];
    setFechaInicio(hoy);
    setFechaFin(hoy);
  };

  const setEsteMes = () => {
    const ahora = new Date();
    const primerDia = new Date(ahora.getFullYear(), ahora.getMonth(), 1).toISOString().split("T")[0];
    const hoy = ahora.toISOString().split("T")[0];
    setFechaInicio(primerDia);
    setFechaFin(hoy);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      
      <style>{`
        @media print {
          nav, .no-print, button, input { display: none !important; }
          body { background: #fff !important; }
          .reporte-container { border: 1px solid #000 !important; padding: 20px !important; box-shadow: none !important; }
        }
      `}</style>

      {/* Filtros de Fecha */}
      <div className="no-print" style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", marginBottom: "20px" }}>
        <h2 style={{ textAlign: "center", color: "#1a365d", marginTop: 0 }}>📊 Reportes de Ventas & Cierre de Caja</h2>
        
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "15px" }}>
          <button onClick={setHoy} style={{ background: "#0284c7", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
            📅 Cierre de Hoy
          </button>
          <button onClick={setEsteMes} style={{ background: "#0f172a", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
            🗓️ Ventas del Mes
          </button>
          <button onClick={handleImprimirCierre} style={{ background: "#16a34a", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
            🖨️ Imprimir Cierre
          </button>
        </div>

        <div style={{ display: "flex", gap: "15px", justifyContent: "center", alignItems: "center" }}>
          <div>
            <label style={{ fontSize: "14px", fontWeight: "bold", display: "block" }}>Desde:</label>
            <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1" }} />
          </div>
          <div>
            <label style={{ fontSize: "14px", fontWeight: "bold", display: "block" }}>Hasta:</label>
            <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1" }} />
          </div>
        </div>
      </div>

      {/* Contenedor Imprimible del Cierre */}
      <div className="reporte-container" style={{ background: "#fff", padding: "25px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        
        <div style={{ textAlign: "center", borderBottom: "2px solid #1a365d", paddingBottom: "10px", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, color: "#1a365d" }}>ÓPTICA ADM</h2>
          <p style={{ margin: "4px 0", fontSize: "14px", color: "#64748b" }}>Reporte de Cierre de Caja & Ingresos</p>
          <p style={{ margin: "2px 0", fontSize: "13px", fontWeight: "bold" }}>Rango: {fechaInicio} al {fechaFin}</p>
        </div>

        {/* Tarjetas de Métricas */}
        <div className="no-print" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px", marginBottom: "25px" }}>
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "15px", borderRadius: "8px", textAlign: "center" }}>
            <span style={{ fontSize: "13px", color: "#166534", fontWeight: "bold" }}>TOTAL COBRADO</span>
            <h2 style={{ margin: "5px 0", color: "#15803d" }}>L. {totalVentas.toFixed(2)}</h2>
          </div>
          <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "15px", borderRadius: "8px", textAlign: "center" }}>
            <span style={{ fontSize: "13px", color: "#1e40af", fontWeight: "bold" }}>ÓRDENES ATENDIDAS</span>
            <h2 style={{ margin: "5px 0", color: "#1d4ed8" }}>{totalOrdenes}</h2>
          </div>
          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "15px", borderRadius: "8px", textAlign: "center" }}>
            <span style={{ fontSize: "13px", color: "#475569", fontWeight: "bold" }}>PROMEDIO POR VENTA</span>
            <h2 style={{ margin: "5px 0", color: "#334155" }}>L. {promedioVenta.toFixed(2)}</h2>
          </div>
        </div>

        {/* Tabla Detallada de Ventas */}
        <h4 style={{ color: "#0f172a", marginBottom: "10px" }}>Detalle de Transacciones</h4>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", textAlign: "center" }}>
          <thead>
            <tr style={{ background: "#0f172a", color: "#fff" }}>
              <th style={{ padding: "8px" }}>Fecha</th>
              <th style={{ padding: "8px" }}>Paciente</th>
              <th style={{ padding: "8px" }}>Aro / Lentes</th>
              <th style={{ padding: "8px" }}>Monto Total</th>
            </tr>
          </thead>
          <tbody>
            {ordenesFiltradas.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: "20px" }}>No hay registros de ventas en el rango de fechas seleccionado.</td>
              </tr>
            ) : (
              ordenesFiltradas.map((o) => (
                <tr key={o.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "8px" }}>{o.fecha ? String(o.fecha).split("T")[0] : "-"}</td>
                  <td style={{ padding: "8px", fontWeight: "bold" }}>{o.cliente_nombre || o.clienteNombre}</td>
                  <td style={{ padding: "8px", fontSize: "12px", color: "#475569" }}>
                    {o.aro_descripcion || o.lentes_descripcion ? `${o.aro_descripcion || ""} / ${o.lentes_descripcion || ""}` : "Graduación completa"}
                  </td>
                  <td style={{ padding: "8px", fontWeight: "bold", color: "#15803d" }}>L. {parseFloat(o.total || 0).toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Resumen Total al Final para Impresión */}
        <div style={{ marginTop: "20px", paddingTop: "10px", borderTop: "2px solid #0f172a", textAlign: "right" }}>
          <p style={{ margin: "4px 0", fontSize: "18px", fontWeight: "bold", color: "#0f172a" }}>
            TOTAL DE CAJA: L. {totalVentas.toFixed(2)}
          </p>
        </div>

      </div>
    </div>
  );
}
