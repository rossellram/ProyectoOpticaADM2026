import React, { useState } from "react";
import { loginUsuario } from "../services/api";

export default function Login({ alIniciarSesion, onLoginExitoso }) {
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
      const callback = alIniciarSesion || onLoginExitoso;
      if (typeof callback === "function") {
        callback(res.usuario);
      }
    } else {
      setError(res.error || "Usuario o contraseña incorrectos");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0f172a",
      fontFamily: "Arial, sans-serif"
    }}>
      <form onSubmit={handleSubmit} style={{
        background: "#fff",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
        width: "100%",
        maxWidth: "380px"
      }}>
        <h2 style={{ textAlign: "center", color: "#1a365d", margin: "0 0 5px 0" }}>ÓPTICA ADM</h2>
        <p style={{ textAlign: "center", color: "#64748b", margin: "0 0 25px 0", fontSize: "14px" }}>Control de Acceso al Sistema</p>

        {error && (
          <div style={{
            background: "#fee2e2",
            color: "#dc2626",
            padding: "10px",
            borderRadius: "6px",
            fontSize: "13px",
            marginBottom: "15px",
            textAlign: "center",
            fontWeight: "bold"
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", marginBottom: "5px" }}>Usuario:</label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}
            placeholder="Ingrese su usuario"
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", marginBottom: "5px" }}>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={cargando}
          style={{
            width: "100%",
            padding: "12px",
            background: cargando ? "#94a3b8" : "#0284c7",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            fontSize: "15px",
            cursor: cargando ? "wait" : "pointer"
          }}
        >
          {cargando ? "Verificando..." : "Ingresar al Sistema"}
        </button>
      </form>
    </div>
  );
}
