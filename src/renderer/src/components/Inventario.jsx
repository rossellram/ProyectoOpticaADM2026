import React, { useState, useEffect } from "react";
import { obtenerInventario, crearProductoInventario, actualizarProductoInventario, eliminarProductoInventario } from "../services/api";

export default function Inventario({ usuarioActivo }) {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  const [codigo, setCodigo] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [color, setColor] = useState("");
  const [precioCosto, setPrecioCosto] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");
  const [stock, setStock] = useState("");

  const esAdminODev = usuarioActivo && (usuarioActivo.rol === "ADMIN" || usuarioActivo.rol === "DEV");

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    const data = await obtenerInventario();
    setProductos(data);
  };

  const limpiarForm = () => {
    setEditandoId(null);
    setCodigo(""); setMarca(""); setModelo(""); setColor("");
    setPrecioCosto(""); setPrecioVenta(""); setStock("");
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!esAdminODev) {
      alert("Acceso denegado. Solo el administrador o soporte pueden modificar el inventario.");
      return;
    }

    const payload = {
      codigo: codigo.toUpperCase(),
      marca: marca.toUpperCase(),
      modelo: modelo.toUpperCase(),
      color: color.toUpperCase(),
      precioCosto: parseFloat(precioCosto || 0),
      precioVenta: parseFloat(precioVenta || 0),
      stock: parseInt(stock || 0)
    };

    let res;
    if (editandoId) {
      res = await actualizarProductoInventario(editandoId, payload);
    } else {
      res = await crearProductoInventario(payload);
    }

    if (res.success) {
      alert(editandoId ? "Producto actualizado." : "Producto registrado en el inventario.");
      limpiarForm();
      cargar();
    } else {
      alert("Error: " + res.error);
    }
  };

  const handleEditar = (p) => {
    setEditandoId(p.id);
    setCodigo((p.codigo || "").toUpperCase());
    setMarca((p.marca || "").toUpperCase());
    setModelo((p.modelo || "").toUpperCase());
    setColor((p.color || "").toUpperCase());
    setPrecioCosto(p.precio_costo || "");
    setPrecioVenta(p.precio_venta || "");
    setStock(p.stock || "");
  };

  const handleEliminar = async (id, marcaModelo) => {
    if (window.confirm(`¿Está seguro de eliminar el aro "${marcaModelo.toUpperCase()}"?`)) {
      await eliminarProductoInventario(id);
      cargar();
    }
  };

  const productosFiltrados = productos.filter((p) => {
    const term = busqueda.toLowerCase();
    return (
      (p.codigo || "").toLowerCase().includes(term) ||
      (p.marca || "").toLowerCase().includes(term) ||
      (p.modelo || "").toLowerCase().includes(term)
    );
  });

  return (
    <div style={{ padding: "20px", maxWidth: "1100px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", color: "#1a365d", marginBottom: "20px" }}>📦 Control de Inventario y Stock de Aros</h2>

      {/* Solo muestra formulario de alta/edición si es ADMIN o DEV */}
      {esAdminODev ? (
        <form onSubmit={handleGuardar} style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", marginBottom: "20px" }}>
          <h4 style={{ margin: "0 0 15px 0", color: "#0f172a" }}>{editandoId ? "✏️ Editar Producto" : "➕ Registrar Nuevo Aro / Producto"}</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px", marginBottom: "10px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "bold" }}>CÓDIGO / SKU*:</label>
              <input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value.toUpperCase())} required style={{ width: "100%", padding: "8px", textTransform: "uppercase" }} />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "bold" }}>MARCA*:</label>
              <input type="text" value={marca} onChange={(e) => setMarca(e.target.value.toUpperCase())} required style={{ width: "100%", padding: "8px", textTransform: "uppercase" }} />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "bold" }}>MODELO:</label>
              <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value.toUpperCase())} style={{ width: "100%", padding: "8px", textTransform: "uppercase" }} />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "bold" }}>COLOR:</label>
              <input type="text" value={color} onChange={(e) => setColor(e.target.value.toUpperCase())} style={{ width: "100%", padding: "8px", textTransform: "uppercase" }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto auto", gap: "10px", alignItems: "end" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "bold" }}>Precio Costo (L.):</label>
              <input type="number" step="0.01" value={precioCosto} onChange={(e) => setPrecioCosto(e.target.value)} style={{ width: "100%", padding: "8px" }} />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "bold" }}>Precio Venta (L.)*:</label>
              <input type="number" step="0.01" value={precioVenta} onChange={(e) => setPrecioVenta(e.target.value)} required style={{ width: "100%", padding: "8px" }} />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "bold" }}>Stock Disponibles*:</label>
              <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required style={{ width: "100%", padding: "8px" }} />
            </div>
            <button type="submit" style={{ background: editandoId ? "#16a34a" : "#0284c7", color: "#fff", border: "none", padding: "10px 15px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
              {editandoId ? "💾 Guardar" : "➕ Agregar"}
            </button>
            {editandoId && (
              <button type="button" onClick={limpiarForm} style={{ background: "#64748b", color: "#fff", border: "none", padding: "10px 15px", borderRadius: "6px", cursor: "pointer" }}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      ) : (
        <div style={{ background: "#fef3c7", color: "#92400e", padding: "10px 15px", borderRadius: "6px", marginBottom: "20px", fontWeight: "bold", textAlign: "center" }}>
          ℹ️ Modo Lectura de Inventario (Solo el Administrador / Soporte puede agregar o modificar aros).
        </div>
      )}

      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Buscar por Código, Marca o Modelo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
        />
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderRadius: "8px", overflow: "hidden" }}>
        <thead>
          <tr style={{ background: "#0f172a", color: "#fff" }}>
            <th style={{ padding: "10px" }}>Código</th>
            <th style={{ padding: "10px" }}>Marca / Modelo</th>
            <th style={{ padding: "10px" }}>Color</th>
            <th style={{ padding: "10px" }}>Precio Venta</th>
            <th style={{ padding: "10px" }}>Stock</th>
            {esAdminODev && <th style={{ padding: "10px" }}>Acción</th>}
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.length === 0 ? (
            <tr>
              <td colSpan={esAdminODev ? "6" : "5"} style={{ padding: "20px", textAlign: "center" }}>No hay aros en el inventario.</td>
            </tr>
          ) : (
            productosFiltrados.map((p) => {
              const stockNum = parseInt(p.stock || 0);
              const bajoStock = stockNum <= 2;
              return (
                <tr key={p.id} style={{ borderBottom: "1px solid #e2e8f0", textAlign: "center" }}>
                  <td style={{ padding: "10px", fontWeight: "bold" }}>{p.codigo.toUpperCase()}</td>
                  <td style={{ padding: "10px" }}>{p.marca.toUpperCase()} {p.modelo.toUpperCase()}</td>
                  <td style={{ padding: "10px" }}>{p.color ? p.color.toUpperCase() : "-"}</td>
                  <td style={{ padding: "10px", fontWeight: "bold", color: "#0369a1" }}>L. {parseFloat(p.precio_venta || 0).toFixed(2)}</td>
                  <td style={{ padding: "10px" }}>
                    <span style={{ background: bajoStock ? "#fee2e2" : "#dcfce7", color: bajoStock ? "#dc2626" : "#166534", padding: "4px 8px", borderRadius: "4px", fontWeight: "bold" }}>
                      {stockNum} {bajoStock ? "⚠️ Bajo" : "pcs"}
                    </span>
                  </td>
                  {esAdminODev && (
                    <td style={{ padding: "10px", display: "flex", gap: "6px", justifyContent: "center" }}>
                      <button onClick={() => handleEditar(p)} style={{ background: "#f59e0b", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "4px", cursor: "pointer" }}>
                        ✏️ Editar
                      </button>
                      <button onClick={() => handleEliminar(p.id, `${p.marca} ${p.modelo}`)} style={{ background: "#ef4444", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "4px", cursor: "pointer" }}>
                        🗑️ Eliminar
                      </button>
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
