import React, { useState, useEffect } from "react";
import { obtenerUsuarios, crearUsuario, eliminarUsuario } from "../services/api";

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("RECEPCION");

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    const data = await obtenerUsuarios();
    setUsuarios(data);
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    const res = await crearUsuario({ nombre, usuario, password, rol });
    if (res.success) {
      alert("Usuario creado correctamente.");
      setNombre(""); setUsuario(""); setPassword("");
      cargar();
    } else {
      alert("Error: " + res.error);
    }
  };

  const handleEliminar = async (id, usr) => {
    if (usr === "admin") {
      alert("No se puede eliminar el usuario Administrador principal.");
      return;
    }
    if (window.confirm(`¿Eliminar usuario "${usr}"?`)) {
      await eliminarUsuario(id);
      cargar();
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", color: "#1a365d" }}>Gestión de Usuarios y Permisos</h2>

      <form onSubmit={handleCrear} style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", marginBottom: "20px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: "10px", alignItems: "end" }}>
        <div>
          <label style={{ fontSize: "12px", fontWeight: "bold" }}>Nombre Completo:</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required style={{ width: "100%", padding: "8px" }} />
        </div>
        <div>
          <label style={{ fontSize: "12px", fontWeight: "bold" }}>Usuario:</label>
          <input type="text" value={usuario} onChange={(e) => setUsuario(e.target.value)} required style={{ width: "100%", padding: "8px" }} />
        </div>
        <div>
          <label style={{ fontSize: "12px", fontWeight: "bold" }}>Contraseña:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: "100%", padding: "8px" }} />
        </div>
        <div>
          <label style={{ fontSize: "12px", fontWeight: "bold" }}>Rol:</label>
          <select value={rol} onChange={(e) => setRol(e.target.value)} style={{ width: "100%", padding: "8px" }}>
            <option value="RECEPCION">Recepción / Optometrista</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>
        <button type="submit" style={{ background: "#16a34a", color: "#fff", border: "none", padding: "10px 15px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
          ➕ Crear
        </button>
      </form>

      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderRadius: "8px", overflow: "hidden" }}>
        <thead>
          <tr style={{ background: "#0f172a", color: "#fff" }}>
            <th style={{ padding: "10px" }}>Nombre</th>
            <th style={{ padding: "10px" }}>Usuario</th>
            <th style={{ padding: "10px" }}>Rol</th>
            <th style={{ padding: "10px" }}>Acción</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id} style={{ borderBottom: "1px solid #e2e8f0", textAlign: "center" }}>
              <td style={{ padding: "10px" }}>{u.nombre}</td>
              <td style={{ padding: "10px", fontWeight: "bold" }}>{u.usuario}</td>
              <td style={{ padding: "10px" }}>
                <span style={{ background: u.rol === "ADMIN" ? "#dbeafe" : "#f1f5f9", color: u.rol === "ADMIN" ? "#1e40af" : "#475569", padding: "4px 8px", borderRadius: "4px", fontWeight: "bold", fontSize: "12px" }}>
                  {u.rol}
                </span>
              </td>
              <td style={{ padding: "10px" }}>
                {u.usuario !== "admin" && (
                  <button onClick={() => handleEliminar(u.id, u.usuario)} style={{ background: "#ef4444", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "4px", cursor: "pointer" }}>
                    🗑️ Eliminar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
