import React, { useState } from "react";
import { loginUsuario } from "../services/api";

export default function Login({ onLoginExitoso }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    const res = await loginUsuario(usuario, password);
    setCargando(false);

    if (res.success) {
      onLoginExitoso(res.usuario);
    } else {
      setError(res.error || "Datos de acceso incorrectos.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#0f172a", fontFamily: "Arial, sans-serif" }}>
      <form onSubmit={handleSubmit} style={{ background: "#fff", padding: "40px", borderRadius: "10px", boxShadow: "0 4px 20px rgba(0,0,0,0.3)", width: "350px" }}>
        <h2 style={{ textAlign: "center", color: "#1a365d", marginBottom: "5px" }}>ÓPTICA ADM</h2>
        <p style={{ textAlign: "center", color: "#64748b", marginBottom: "25px", fontSize: "14px" }}>Control de Acceso</p>

        {error && <div style={{ background: "#fee2e2", color: "#dc2626", padding: "10px", borderRadius: "6px", marginBottom: "15px", fontSize: "14px", textAlign: "center" }}>{error}</div>}

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>Usuario:</label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}
          />
        </div>

        <button
          type="submit"
          disabled={cargando}
          style={{ width: "100%", padding: "12px", background: "#0284c7", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}
        >
          {cargando ? "Iniciando Sesión..." : "Ingresar al Sistema"}
        </button>
      </form>
    </div>
  );
}
