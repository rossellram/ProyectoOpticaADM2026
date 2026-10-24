import React, { useState, useEffect } from "react";
import { obtenerUsuarios, crearUsuario, eliminarUsuario } from "../services/api";

export default function GestionUsuarios({ usuarioActivo }) {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("RECEPCION");

  const esDev = usuarioActivo && usuarioActivo.rol === "DEV";

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    const data = await obtenerUsuarios();
    setUsuarios(data);
  };

  const handleCrearOModificar = async (e) => {
    e.preventDefault();
    if (!nombre || !usuario || !password) {
      alert("Por favor complete todos los campos.");
      return;
    }

    const res = await crearUsuario({ nombre, usuario, password, rol });
    if (res.success) {
      alert("Usuario creado / actualizado correctamente.");
      setNombre(""); setUsuario(""); setPassword(""); setRol("RECEPCION");
      cargar();
    } else {
      alert("Error: " + res.error);
    }
  };

  const handleEliminar = async (id, nombreUsr) => {
    if (window.confirm(`¿Está seguro de eliminar al usuario ${nombreUsr}?`)) {
      await eliminarUsuario(id);
      cargar();
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "850px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", color: "#1a365d" }}>👥 Gestión de Usuarios y Permisos</h2>

      <form onSubmit={handleCrearOModificar} style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", marginBottom: "20px" }}>
        <h4 style={{ margin: "0 0 15px 0" }}>➕ Registrar o Actualizar Usuario</h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
          <div>
            <label style={{ fontSize: "12px", fontWeight: "bold" }}>Nombre Completo:</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value.toUpperCase())} required style={{ width: "100%", padding: "8px", textTransform: "uppercase" }} />
          </div>
          <div>
            <label style={{ fontSize: "12px", fontWeight: "bold" }}>Nombre de Usuario (Login):</label>
            <input type="text" value={usuario} onChange={(e) => setUsuario(e.target.value.toLowerCase())} required style={{ width: "100%", padding: "8px" }} placeholder="ej: admin, especialist1, digitador1" />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "15px" }}>
          <div>
            <label style={{ fontSize: "12px", fontWeight: "bold" }}>Contraseña:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: "100%", padding: "8px" }} placeholder="Nueva contraseña" />
          </div>
          <div>
            <label style={{ fontSize: "12px", fontWeight: "bold" }}>Rol de Acceso:</label>
            <select value={rol} onChange={(e) => setRol(e.target.value)} style={{ width: "100%", padding: "8px", fontWeight: "bold" }}>
              <option value="RECEPCION">RECEPCION (Atención y Cobro)</option>
              <option value="ESPECIALISTA">ESPECIALISTA (Optometrista / Evaluaciones)</option>
              <option value="DIGITADOR">DIGITADOR (Modifica Inventario)</option>
              <option value="ADMIN">ADMIN (Administrador Óptica)</option>
              {esDev && <option value="DEV">DEV (Soporte / Desarrollador)</option>}
            </select>
          </div>
        </div>

        <button type="submit" style={{ width: "100%", padding: "10px", background: "#0284c7", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
          💾 Guardar / Actualizar Usuario
        </button>
      </form>

      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderRadius: "8px", overflow: "hidden" }}>
        <thead>
          <tr style={{ background: "#0f172a", color: "#fff" }}>
            <th style={{ padding: "10px" }}>ID</th>
            <th style={{ padding: "10px" }}>Nombre</th>
            <th style={{ padding: "10px" }}>Usuario</th>
            <th style={{ padding: "10px" }}>Rol</th>
            <th style={{ padding: "10px" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id} style={{ borderBottom: "1px solid #e2e8f0", textAlign: "center" }}>
              <td style={{ padding: "10px" }}>{u.id}</td>
              <td style={{ padding: "10px", fontWeight: "bold" }}>{u.nombre}</td>
              <td style={{ padding: "10px" }}>{u.usuario}</td>
              <td style={{ padding: "10px" }}>
                <span style={{ 
                  background: u.rol === "DEV" ? "#fef08a" : (u.rol === "ADMIN" ? "#dbeafe" : (u.rol === "DIGITADOR" ? "#fed7aa" : (u.rol === "ESPECIALISTA" ? "#e9d5ff" : "#f1f5f9"))), 
                  color: "#0f172a",
                  padding: "4px 8px", 
                  borderRadius: "4px", 
                  fontWeight: "bold",
                  fontSize: "12px"
                }}>
                  {u.rol}
                </span>
              </td>
              <td style={{ padding: "10px" }}>
                <button onClick={() => { setNombre(u.nombre); setUsuario(u.usuario); setRol(u.rol); }} style={{ background: "#f59e0b", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", marginRight: "5px" }}>
                  ✏️ Editar
                </button>
                <button onClick={() => handleEliminar(u.id, u.nombre)} style={{ background: "#ef4444", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}>
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
