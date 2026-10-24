import React, { useState, useEffect } from "react";
import { obtenerOrdenes, obtenerAbonos } from "../services/api";

export default function ReportesCaja() {
  const [ordenes, setOrdenes] = useState([]);
  const [abonos, setAbonos] = useState([]);
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split("T")[0]);
  const [fechaFin, setFechaFin] = useState(new Date().toISOString().split("T")[0]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    const dataOrdenes = await obtenerOrdenes();
    const dataAbonos = await obtenerAbonos();
    setOrdenes(dataOrdenes || []);
    setAbonos(dataAbonos || []);
    setCargando(false);
  };

  const ordenesFiltradas = ordenes.filter((o) => {
    if (!o.fecha) return false;
    const f = String(o.fecha).split("T")[0];
    return f >= fechaInicio && f <= fechaFin;
  });

  const abonosFiltrados = abonos.filter((a) => {
    if (!a.fecha) return false;
    const f = String(a.fecha).split("T")[0];
    return f >= fechaInicio && f <= fechaFin;
  });

  const totalVentasGeneradas = ordenesFiltradas.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
  const totalPrimasIniciales = ordenesFiltradas.reduce((sum, o) => sum + parseFloat(o.prima || 0), 0);
  const totalAbonosPosteriores = abonosFiltrados.reduce((sum, a) => sum + parseFloat(a.monto || 0), 0);
  const totalEfectivoCaja = totalPrimasIniciales + totalAbonosPosteriores;
  const totalSaldosPendientes = ordenesFiltradas.reduce((sum, o) => sum + parseFloat(o.saldo_pendiente || 0), 0);

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
    <div style={{ padding: "20px", maxWidth: "1100px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      
      <style>{`
        @media print {
          nav, .no-print, button, input { display: none !important; }
          body { background: #fff !important; }
          .reporte-container { border: 1px solid #000 !important; padding: 20px !important; box-shadow: none !important; }
        }
      `}</style>

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

      <div className="reporte-container" style={{ background: "#fff", padding: "25px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        
        <div style={{ textAlign: "center", borderBottom: "2px solid #1a365d", paddingBottom: "10px", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, color: "#1a365d" }}>ÓPTICA ADM</h2>
          <p style={{ margin: "4px 0", fontSize: "14px", color: "#64748b" }}>Reporte de Cierre de Caja & Ingresos</p>
          <p style={{ margin: "2px 0", fontSize: "13px", fontWeight: "bold" }}>Rango: {fechaInicio} al {fechaFin}</p>
        </div>

        {/* Tarjetas de Métricas de Caja */}
        <div className="no-print" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px", marginBottom: "25px" }}>
          <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
            <span style={{ fontSize: "11px", color: "#1e40af", fontWeight: "bold" }}>VENTAS TOTALES</span>
            <h3 style={{ margin: "4px 0", color: "#1d4ed8" }}>L. {totalVentasGeneradas.toFixed(2)}</h3>
          </div>
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
            <span style={{ fontSize: "11px", color: "#166534", fontWeight: "bold" }}>PRIMAS INICIALES</span>
            <h3 style={{ margin: "4px 0", color: "#15803d" }}>L. {totalPrimasIniciales.toFixed(2)}</h3>
          </div>
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
            <span style={{ fontSize: "11px", color: "#166534", fontWeight: "bold" }}>ABONOS COBRADOS</span>
            <h3 style={{ margin: "4px 0", color: "#15803d" }}>L. {totalAbonosPosteriores.toFixed(2)}</h3>
          </div>
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
            <span style={{ fontSize: "11px", color: "#991b1b", fontWeight: "bold" }}>SALDOS POR COBRAR</span>
            <h3 style={{ margin: "4px 0", color: "#dc2626" }}>L. {totalSaldosPendientes.toFixed(2)}</h3>
          </div>
        </div>

        {/* Detalle de Abonos Diarios con Totales y Saldos de la Orden */}
        <h4 style={{ color: "#0f172a", marginBottom: "8px" }}>💵 Detalle de Abonos Recibidos en la Jornada</h4>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "center", marginBottom: "20px" }}>
          <thead>
            <tr style={{ background: "#16a34a", color: "#fff" }}>
              <th style={{ padding: "8px" }}>Hora / Fecha</th>
              <th style={{ padding: "8px" }}>Paciente</th>
              <th style={{ padding: "8px" }}>Total de Orden</th>
              <th style={{ padding: "8px" }}>Saldo Pendiente</th>
              <th style={{ padding: "8px" }}>Cobrado Por</th>
              <th style={{ padding: "8px" }}>Monto Abonado</th>
            </tr>
          </thead>
          <tbody>
            {abonosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: "15px", color: "#64748b" }}>No se registraron abonos posteriores en esta fecha.</td>
              </tr>
            ) : (
              abonosFiltrados.map((a) => {
                const ordenAsociada = ordenes.find(o => String(o.id) === String(a.orden_id)) || {};
                const totalOrden = parseFloat(ordenAsociada.total || 0);
                const saldoPendienteOrden = parseFloat(ordenAsociada.saldo_pendiente || 0);

                return (
                  <tr key={a.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "8px" }}>{a.fecha ? new Date(a.fecha).toLocaleString() : "-"}</td>
                    <td style={{ padding: "8px", fontWeight: "bold" }}>{(a.cliente_nombre || ordenAsociada.cliente_nombre || "PACIENTE").toUpperCase()}</td>
                    <td style={{ padding: "8px" }}>L. {totalOrden.toFixed(2)}</td>
                    <td style={{ padding: "8px", fontWeight: "bold", color: saldoPendienteOrden > 0 ? "#dc2626" : "#16a34a" }}>
                      L. {saldoPendienteOrden.toFixed(2)}
                    </td>
                    <td style={{ padding: "8px" }}>{a.usuario_nombre || "SISTEMA"}</td>
                    <td style={{ padding: "8px", fontWeight: "bold", color: "#15803d", background: "#f0fdf4" }}>L. {parseFloat(a.monto || 0).toFixed(2)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Total General en Cierre */}
        <div style={{ marginTop: "20px", paddingTop: "12px", borderTop: "2px solid #0f172a", textAlign: "right" }}>
          <p style={{ margin: "4px 0", fontSize: "20px", fontWeight: "bold", color: "#15803d" }}>
            TOTAL EFECTIVO REAL EN CAJA: L. {totalEfectivoCaja.toFixed(2)}
          </p>
        </div>

      </div>
    </div>
  );
}
