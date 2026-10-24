import React, { useState, useEffect } from "react";
import { guardarOrden, actualizarOrden } from "../services/api";

export default function OrdenGraduacion({ ordenAEditar, alFinalizarEdicion, irACotizar, usuarioActivo }) {
  const obtenerFechaLocal = () => new Date().toLocaleDateString("sv-SE");

  const estadoInicial = {
    fecha: obtenerFechaLocal(),
    clienteNombre: "", edad: "", telefono: "", ocupacion: "",
    padeceHta: false, padeceDiabetes: false, padeceMigrana: false, padeceOtros: "",
    antOdEsfera: "", antOdCilindro: "", antOdEje: "", antOdAdd: "", antOdDp: "", antOdAltura: "",
    antOiEsfera: "", antOiCilindro: "", antOiEje: "", antOiAdd: "", antOiDp: "", antOiAltura: "",
    observaciones: "",
    actOdEsfera: "", actOdCilindro: "", actOdEje: "", actOdAdd: "", actOdDp: "", actOdAltura: "",
    actOiEsfera: "", actOiCilindro: "", actOiEje: "", actOiAdd: "", actOiDp: "", actOiAltura: ""
  };

  const [formData, setFormData] = useState(estadoInicial);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ordenAEditar) {
      setFormData({
        fecha: ordenAEditar.fecha ? String(ordenAEditar.fecha).split("T")[0] : obtenerFechaLocal(),
        clienteNombre: (ordenAEditar.cliente_nombre || ordenAEditar.clienteNombre || "").toUpperCase(),
        edad: ordenAEditar.edad || "",
        telefono: ordenAEditar.telefono || "",
        ocupacion: (ordenAEditar.ocupacion || "").toUpperCase(),
        padeceHta: ordenAEditar.padece_hta || false,
        padeceDiabetes: ordenAEditar.padece_diabetes || false,
        padeceMigrana: ordenAEditar.padece_migrana || false,
        padeceOtros: (ordenAEditar.padece_otros || "").toUpperCase(),
        antOdEsfera: (ordenAEditar.ant_od_esfera || "").toUpperCase(), antOdCilindro: (ordenAEditar.ant_od_cilindro || "").toUpperCase(), antOdEje: (ordenAEditar.ant_od_eje || "").toUpperCase(), antOdAdd: (ordenAEditar.ant_od_add || "").toUpperCase(), antOdDp: (ordenAEditar.ant_od_dp || "").toUpperCase(), antOdAltura: (ordenAEditar.ant_od_altura || "").toUpperCase(),
        antOiEsfera: (ordenAEditar.ant_oi_esfera || "").toUpperCase(), antOiCilindro: (ordenAEditar.ant_oi_cilindro || "").toUpperCase(), antOiEje: (ordenAEditar.ant_oi_eje || "").toUpperCase(), antOiAdd: (ordenAEditar.ant_oi_add || "").toUpperCase(), antOiDp: (ordenAEditar.ant_oi_dp || "").toUpperCase(), antOiAltura: (ordenAEditar.ant_oi_altura || "").toUpperCase(),
        observaciones: (ordenAEditar.observaciones || "").toUpperCase(),
        actOdEsfera: (ordenAEditar.act_od_esfera || "").toUpperCase(), actOdCilindro: (ordenAEditar.act_od_cilindro || "").toUpperCase(), actOdEje: (ordenAEditar.act_od_eje || "").toUpperCase(), actOdAdd: (ordenAEditar.act_od_add || "").toUpperCase(), actOdDp: (ordenAEditar.act_od_dp || "").toUpperCase(), actOdAltura: (ordenAEditar.act_od_altura || "").toUpperCase(),
        actOiEsfera: (ordenAEditar.act_oi_esfera || "").toUpperCase(), actOiCilindro: (ordenAEditar.act_oi_cilindro || "").toUpperCase(), actOiEje: (ordenAEditar.act_oi_eje || "").toUpperCase(), actOiAdd: (ordenAEditar.act_oi_add || "").toUpperCase(), actOiDp: (ordenAEditar.act_oi_dp || "").toUpperCase(), actOiAltura: (ordenAEditar.act_oi_altura || "").toUpperCase()
      });
    } else {
      setFormData((prev) => ({ ...prev, fecha: obtenerFechaLocal() }));
    }
  }, [ordenAEditar]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const valorFinal = type === "checkbox" ? checked : (typeof value === "string" ? value.toUpperCase() : value);
    setFormData((prev) => ({ ...prev, [name]: valorFinal }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.clienteNombre) {
      alert("Por favor ingrese el nombre del paciente.");
      return;
    }

    setLoading(true);
    let result;

    const datosFinales = {
      ...formData,
      usuarioNombre: usuarioActivo ? usuarioActivo.nombre : "SISTEMA"
    };

    if (ordenAEditar && ordenAEditar.id) {
      result = await actualizarOrden(ordenAEditar.id, datosFinales);
    } else {
      result = await guardarOrden(datosFinales);
    }

    setLoading(false);

    if (result.success) {
      const ordenGuardada = result.data || ordenAEditar;
      setFormData({ ...estadoInicial, fecha: obtenerFechaLocal() });
      if (window.confirm("¡Examen visual y graduación guardados exitosamente!\n\n¿Desea pasar inmediatamente a Cotizar / Cobrar para este paciente?")) {
        if (irACotizar) irACotizar(ordenGuardada);
      } else if (alFinalizarEdicion) {
        alFinalizarEdicion();
      }
    } else {
      alert("Error al procesar la receta médica: " + result.error);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", color: "#1a365d", marginBottom: "20px" }}>
        {ordenAEditar ? "Modificar Examen y Graduación Visual" : "ÓPTICA ADM - Examen y Graduación Visual"}
      </h2>
      
      <form onSubmit={handleSubmit} style={{ background: "#f8fafc", padding: "25px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", position: "relative" }}>
        
        {/* Etiqueta discreta en la esquina superior derecha */}
        <div style={{ position: "absolute", top: "15px", right: "20px", fontSize: "11px", color: "#64748b", background: "#e2e8f0", padding: "3px 8px", borderRadius: "4px" }}>
          👨‍⚕️ Atendido por: <strong>{usuarioActivo ? usuarioActivo.nombre.toUpperCase() : "SISTEMA"}</strong>
        </div>

        {/* Encabezado Paciente & Enfermedades */}
        <fieldset style={{ marginBottom: "20px", padding: "15px", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
          <legend style={{ fontWeight: "bold", color: "#0f172a" }}>Datos Generales y Antecedentes</legend>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: "15px", marginBottom: "10px" }}>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "bold" }}>FECHA:</label>
              <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} style={{ width: "100%", padding: "6px" }} />
            </div>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "bold" }}>NOMBRE*:</label>
              <input type="text" name="clienteNombre" value={formData.clienteNombre} onChange={handleChange} required style={{ width: "100%", padding: "6px", textTransform: "uppercase" }} />
            </div>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "bold" }}>EDAD:</label>
              <input type="number" name="edad" value={formData.edad} onChange={handleChange} style={{ width: "100%", padding: "6px" }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: "15px", alignItems: "center" }}>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "bold" }}>TEL.:</label>
              <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} style={{ width: "100%", padding: "6px" }} />
            </div>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "bold" }}>OCUPACIÓN:</label>
              <input type="text" name="ocupacion" value={formData.ocupacion} onChange={handleChange} style={{ width: "100%", padding: "6px", textTransform: "uppercase" }} />
            </div>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "bold", display: "block", marginBottom: "4px" }}>ENFERMEDADES QUE PADECE:</label>
              <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", fontSize: "13px" }}>
                <label><input type="checkbox" name="padeceHta" checked={formData.padeceHta} onChange={handleChange} /> HTA</label>
                <label><input type="checkbox" name="padeceDiabetes" checked={formData.padeceDiabetes} onChange={handleChange} /> DIABETES</label>
                <label><input type="checkbox" name="padeceMigrana" checked={formData.padeceMigrana} onChange={handleChange} /> MIGRAÑA</label>
                <input type="text" name="padeceOtros" placeholder="OTROS..." value={formData.padeceOtros} onChange={handleChange} style={{ padding: "4px", fontSize: "12px", flex: 1, textTransform: "uppercase" }} />
              </div>
            </div>
          </div>
        </fieldset>

        {/* Graduación Anterior */}
        <fieldset style={{ marginBottom: "20px", padding: "15px", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
          <legend style={{ fontWeight: "bold", color: "#0f172a" }}>GRADUACIÓN ANTERIOR</legend>
          <table style={{ width: "100%", textAlign: "center", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#e2e8f0" }}>
                <th>OJO</th><th>ESFERA</th><th>CILINDRO</th><th>EJE</th><th>ADD</th><th>DP</th><th>ALTURA</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>OD</strong></td>
                <td><input type="text" name="antOdEsfera" value={formData.antOdEsfera} onChange={handleChange} style={{ width: "90%", padding: "4px", textTransform: "uppercase" }} /></td>
                <td><input type="text" name="antOdCilindro" value={formData.antOdCilindro} onChange={handleChange} style={{ width: "90%", padding: "4px", textTransform: "uppercase" }} /></td>
                <td><input type="text" name="antOdEje" value={formData.antOdEje} onChange={handleChange} style={{ width: "90%", padding: "4px", textTransform: "uppercase" }} /></td>
                <td><input type="text" name="antOdAdd" value={formData.antOdAdd} onChange={handleChange} style={{ width: "90%", padding: "4px", textTransform: "uppercase" }} /></td>
                <td><input type="text" name="antOdDp" value={formData.antOdDp} onChange={handleChange} style={{ width: "90%", padding: "4px", textTransform: "uppercase" }} /></td>
                <td><input type="text" name="antOdAltura" value={formData.antOdAltura} onChange={handleChange} style={{ width: "90%", padding: "4px", textTransform: "uppercase" }} /></td>
              </tr>
              <tr>
                <td><strong>OI</strong></td>
                <td><input type="text" name="antOiEsfera" value={formData.antOiEsfera} onChange={handleChange} style={{ width: "90%", padding: "4px", textTransform: "uppercase" }} /></td>
                <td><input type="text" name="antOiCilindro" value={formData.antOiCilindro} onChange={handleChange} style={{ width: "90%", padding: "4px", textTransform: "uppercase" }} /></td>
                <td><input type="text" name="antOiEje" value={formData.antOiEje} onChange={handleChange} style={{ width: "90%", padding: "4px", textTransform: "uppercase" }} /></td>
                <td><input type="text" name="antOiAdd" value={formData.antOiAdd} onChange={handleChange} style={{ width: "90%", padding: "4px", textTransform: "uppercase" }} /></td>
                <td><input type="text" name="antOiDp" value={formData.antOiDp} onChange={handleChange} style={{ width: "90%", padding: "4px", textTransform: "uppercase" }} /></td>
                <td><input type="text" name="antOiAltura" value={formData.antOiAltura} onChange={handleChange} style={{ width: "90%", padding: "4px", textTransform: "uppercase" }} /></td>
              </tr>
            </tbody>
          </table>
        </fieldset>

        {/* Actividades y Observaciones */}
        <fieldset style={{ marginBottom: "20px", padding: "15px", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
          <legend style={{ fontWeight: "bold", color: "#0f172a" }}>ACTIVIDADES QUE REALIZA, COMENTARIOS PARTICULARES Y OBSERVACIONES</legend>
          <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} rows="3" style={{ width: "100%", padding: "8px", textTransform: "uppercase" }} placeholder="Comentarios clínicos, uso de computador, conducción, etc..."></textarea>
        </fieldset>

        {/* Graduación Actual */}
        <fieldset style={{ marginBottom: "20px", padding: "15px", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
          <legend style={{ fontWeight: "bold", color: "#0f172a" }}>GRADUACIÓN ACTUAL</legend>
          <table style={{ width: "100%", textAlign: "center", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#e2e8f0" }}>
                <th>OJO</th><th>ESFERA</th><th>CILINDRO</th><th>EJE</th><th>ADD</th><th>DP</th><th>ALTURA</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>OD</strong></td>
                <td><input type="text" name="actOdEsfera" value={formData.actOdEsfera} onChange={handleChange} style={{ width: "90%", padding: "4px", textTransform: "uppercase" }} /></td>
                <td><input type="text" name="actOdCilindro" value={formData.actOdCilindro} onChange={handleChange} style={{ width: "90%", padding: "4px", textTransform: "uppercase" }} /></td>
                <td><input type="text" name="actOdEje" value={formData.actOdEje} onChange={handleChange} style={{ width: "90%", padding: "4px", textTransform: "uppercase" }} /></td>
                <td><input type="text" name="actOdAdd" value={formData.actOdAdd} onChange={handleChange} style={{ width: "90%", padding: "4px", textTransform: "uppercase" }} /></td>
                <td><input type="text" name="actOdDp" value={formData.actOdDp} onChange={handleChange} style={{ width: "90%", padding: "4px", textTransform: "uppercase" }} /></td>
                <td><input type="text" name="actOdAltura" value={formData.actOdAltura} onChange={handleChange} style={{ width: "90%", padding: "4px", textTransform: "uppercase" }} /></td>
              </tr>
              <tr>
                <td><strong>OI</strong></td>
                <td><input type="text" name="actOiEsfera" value={formData.actOiEsfera} onChange={handleChange} style={{ width: "90%", padding: "4px", textTransform: "uppercase" }} /></td>
                <td><input type="text" name="actOiCilindro" value={formData.actOiCilindro} onChange={handleChange} style={{ width: "90%", padding: "4px", textTransform: "uppercase" }} /></td>
                <td><input type="text" name="actOiEje" value={formData.actOiEje} onChange={handleChange} style={{ width: "90%", padding: "4px", textTransform: "uppercase" }} /></td>
                <td><input type="text" name="actOiAdd" value={formData.actOiAdd} onChange={handleChange} style={{ width: "90%", padding: "4px", textTransform: "uppercase" }} /></td>
                <td><input type="text" name="actOiDp" value={formData.actOiDp} onChange={handleChange} style={{ width: "90%", padding: "4px", textTransform: "uppercase" }} /></td>
                <td><input type="text" name="actOiAltura" value={formData.actOiAltura} onChange={handleChange} style={{ width: "90%", padding: "4px", textTransform: "uppercase" }} /></td>
              </tr>
            </tbody>
          </table>
        </fieldset>

        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit" disabled={loading} style={{ flex: 1, padding: "12px", background: ordenAEditar ? "#16a34a" : "#0284c7", color: "#fff", border: "none", borderRadius: "6px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}>
            {loading ? "Guardando..." : (ordenAEditar ? "Guardar Cambios en Receta" : "📋 Guardar Examen y Graduación Visual")}
          </button>
          {ordenAEditar && (
            <button type="button" onClick={alFinalizarEdicion} style={{ padding: "12px 20px", background: "#64748b", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
