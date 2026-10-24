import React, { useState, useEffect } from "react";
import { guardarOrden, actualizarOrden } from "../services/api";

export default function OrdenGraduacion({ ordenAEditar, alGuardarExito, usuarioActivo }) {
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [clienteNombre, setClienteNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ocupacion, setOcupacion] = useState("");

  const [padeceHta, setPadeceHta] = useState(false);
  const [padeceDiabetes, setPadeceDiabetes] = useState(false);
  const [padeceMigrana, setPadeceMigrana] = useState(false);
  const [padeceOtros, setPadeceOtros] = useState("");

  // Graduación Anterior
  const [antOdEsfera, setAntOdEsfera] = useState("");
  const [antOdCilindro, setAntOdCilindro] = useState("");
  const [antOdEje, setAntOdEje] = useState("");
  const [antOdAdd, setAntOdAdd] = useState("");
  const [antOdDp, setAntOdDp] = useState("");
  const [antOdAltura, setAntOdAltura] = useState("");

  const [antOiEsfera, setAntOiEsfera] = useState("");
  const [antOiCilindro, setAntOiCilindro] = useState("");
  const [antOiEje, setAntOiEje] = useState("");
  const [antOiAdd, setAntOiAdd] = useState("");
  const [antOiDp, setAntOiDp] = useState("");
  const [antOiAltura, setAntOiAltura] = useState("");

  const [observaciones, setObservaciones] = useState("");

  // Graduación Actual
  const [actOdEsfera, setActOdEsfera] = useState("");
  const [actOdCilindro, setActOdCilindro] = useState("");
  const [actOdEje, setActOdEje] = useState("");
  const [actOdAdd, setActOdAdd] = useState("");
  const [actOdDp, setActOdDp] = useState("");
  const [actOdAltura, setActOdAltura] = useState("");

  const [actOiEsfera, setActOiEsfera] = useState("");
  const [actOiCilindro, setActOiCilindro] = useState("");
  const [actOiEje, setActOiEje] = useState("");
  const [actOiAdd, setActOiAdd] = useState("");
  const [actOiDp, setActOiDp] = useState("");
  const [actOiAltura, setActOiAltura] = useState("");

  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (ordenAEditar) {
      setFecha(ordenAEditar.fecha ? String(ordenAEditar.fecha).split("T")[0] : new Date().toISOString().split("T")[0]);
      setClienteNombre((ordenAEditar.cliente_nombre || ordenAEditar.clienteNombre || "").toUpperCase());
      setEdad(ordenAEditar.edad || "");
      setTelefono(ordenAEditar.telefono || "");
      setOcupacion((ordenAEditar.ocupacion || "").toUpperCase());

      setPadeceHta(!!ordenAEditar.padece_hta);
      setPadeceDiabetes(!!ordenAEditar.padece_diabetes);
      setPadeceMigrana(!!ordenAEditar.padece_migrana);
      setPadeceOtros((ordenAEditar.padece_otros || "").toUpperCase());

      setAntOdEsfera(ordenAEditar.ant_od_esfera || "");
      setAntOdCilindro(ordenAEditar.ant_od_cilindro || "");
      setAntOdEje(ordenAEditar.ant_od_eje || "");
      setAntOdAdd(ordenAEditar.ant_od_add || "");
      setAntOdDp(ordenAEditar.ant_od_dp || "");
      setAntOdAltura(ordenAEditar.ant_od_altura || "");

      setAntOiEsfera(ordenAEditar.ant_oi_esfera || "");
      setAntOiCilindro(ordenAEditar.ant_oi_cilindro || "");
      setAntOiEje(ordenAEditar.ant_oi_eje || "");
      setAntOiAdd(ordenAEditar.ant_oi_add || "");
      setAntOiDp(ordenAEditar.ant_oi_dp || "");
      setAntOiAltura(ordenAEditar.ant_oi_altura || "");

      setObservaciones((ordenAEditar.observaciones || "").toUpperCase());

      setActOdEsfera(ordenAEditar.act_od_esfera || "");
      setActOdCilindro(ordenAEditar.act_od_cilindro || "");
      setActOdEje(ordenAEditar.act_od_eje || "");
      setActOdAdd(ordenAEditar.act_od_add || "");
      setActOdDp(ordenAEditar.act_od_dp || "");
      setActOdAltura(ordenAEditar.act_od_altura || "");

      setActOiEsfera(ordenAEditar.act_oi_esfera || "");
      setActOiCilindro(ordenAEditar.act_oi_cilindro || "");
      setActOiEje(ordenAEditar.act_oi_eje || "");
      setActOiAdd(ordenAEditar.act_oi_add || "");
      setActOiDp(ordenAEditar.act_oi_dp || "");
      setActOiAltura(ordenAEditar.act_oi_altura || "");
    }
  }, [ordenAEditar]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clienteNombre) {
      alert("Por favor ingrese el nombre del paciente.");
      return;
    }

    setCargando(true);

    const payload = {
      fecha,
      clienteNombre: clienteNombre.toUpperCase(),
      edad: edad ? parseInt(edad, 10) : null,
      telefono,
      ocupacion: ocupacion.toUpperCase(),
      padeceHta,
      padeceDiabetes,
      padeceMigrana,
      padeceOtros: padeceOtros.toUpperCase(),
      antOdEsfera, antOdCilindro, antOdEje, antOdAdd, antOdDp, antOdAltura,
      antOiEsfera, antOiCilindro, antOiEje, antOiAdd, antOiDp, antOiAltura,
      observaciones: observaciones.toUpperCase(),
      actOdEsfera, actOdCilindro, actOdEje, actOdAdd, actOdDp, actOdAltura,
      actOiEsfera, actOiCilindro, actOiEje, actOiAdd, actOiDp, actOiAltura,
      usuarioNombre: usuarioActivo ? usuarioActivo.nombre : "SISTEMA"
    };

    let res;
    if (ordenAEditar && ordenAEditar.id) {
      res = await actualizarOrden(ordenAEditar.id, payload);
    } else {
      res = await guardarOrden(payload);
    }

    setCargando(false);

    if (res.success) {
      const ordenGuardada = res.data || ordenAEditar || { ...payload, id: Date.now() };
      const deseaCotizar = window.confirm("¡Examen visual y graduación guardados exitosamente!\n\n¿Desea pasar inmediatamente a Cotizar / Cobrar para este paciente?");
      
      if (alGuardarExito) {
        alGuardarExito(ordenGuardada, deseaCotizar);
      }
    } else {
      alert("Error al guardar la orden: " + (res.error || "Error de servidor"));
    }
  };

  const estiloHeader = { background: "#f8fafc", padding: "10px 15px", borderRadius: "6px", fontWeight: "bold", fontSize: "14px", color: "#0f172a", marginBottom: "15px", borderLeft: "4px solid #0284c7", display: "flex", justifyContent: "space-between", alignItems: "center" };
  const estiloInput = { width: "100%", padding: "9px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box", fontSize: "14px" };

  // Estilo dinámico: Si tiene valor, fondo blanco puro y texto negrita azul oscuro. Si está vacío, texto guía claro y sutil.
  const obtenerEstiloCelda = (valor) => ({
    width: "100%",
    padding: "8px",
    textAlign: "center",
    borderRadius: "4px",
    border: valor ? "2px solid #0284c7" : "1px solid #cbd5e1",
    fontSize: "14px",
    fontWeight: valor ? "bold" : "normal",
    color: valor ? "#0f172a" : "#94a3b8",
    background: valor ? "#f0f9ff" : "#f8fafc",
    outline: "none"
  });

  return (
    <div style={{ maxWidth: "1050px", margin: "0 auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      
      {/* Estilos CSS incrustados para atenuar los placeholders y resaltar al escribir */}
      <style>{`
        input::placeholder {
          color: #cbd5e1 !important;
          font-weight: normal !important;
          font-size: 12px;
        }
        input:focus {
          border-color: #0284c7 !important;
          background: #fff !important;
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
        }
      `}</style>

      <form onSubmit={handleSubmit} style={{ background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
        
        <div style={{ textAlign: "center", marginBottom: "25px", borderBottom: "2px solid #e2e8f0", paddingBottom: "15px" }}>
          <h2 style={{ color: "#1a365d", margin: "0 0 5px 0" }}>ÓPTICA ADM</h2>
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>Expediente Clínico de Examen y Graduación Visual</p>
        </div>

        {/* DATOS GENERALES */}
        <fieldset style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "20px", marginBottom: "25px", background: "#fff" }}>
          <legend style={{ width: "100%" }}>
            <div style={estiloHeader}>
              <span>📋 Datos Generales y Antecedentes</span>
              <span style={{ fontSize: "12px", background: "#e2e8f0", padding: "4px 12px", borderRadius: "6px", color: "#1e293b" }}>
                🧑‍⚕️ Atendido por: <strong>{usuarioActivo ? usuarioActivo.nombre.toUpperCase() : "SISTEMA"}</strong>
              </span>
            </div>
          </legend>
          
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 2.5fr 0.8fr", gap: "15px", marginBottom: "15px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "5px" }}>FECHA:</label>
              <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} style={estiloInput} />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "5px" }}>NOMBRE DEL PACIENTE*:</label>
              <input type="text" required placeholder="NOMBRE COMPLETO" value={clienteNombre} onChange={(e) => setClienteNombre(e.target.value.toUpperCase())} style={{ ...estiloInput, textTransform: "uppercase" }} />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "5px" }}>EDAD:</label>
              <input type="number" placeholder="AÑOS" value={edad} onChange={(e) => setEdad(e.target.value)} style={estiloInput} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.5fr 2fr", gap: "15px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "5px" }}>TELÉFONO:</label>
              <input type="text" placeholder="NÚMERO" value={telefono} onChange={(e) => setTelefono(e.target.value)} style={estiloInput} />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "5px" }}>OCUPACIÓN:</label>
              <input type="text" placeholder="OCUPACIÓN" value={ocupacion} onChange={(e) => setOcupacion(e.target.value.toUpperCase())} style={{ ...estiloInput, textTransform: "uppercase" }} />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "bold", color: "#334155", display: "block", marginBottom: "5px" }}>ENFERMEDADES QUE PADECE:</label>
              <div style={{ display: "flex", gap: "10px", alignItems: "center", fontSize: "12px", paddingTop: "5px" }}>
                <label style={{ cursor: "pointer" }}><input type="checkbox" checked={padeceHta} onChange={(e) => setPadeceHta(e.target.checked)} /> HTA</label>
                <label style={{ cursor: "pointer" }}><input type="checkbox" checked={padeceDiabetes} onChange={(e) => setPadeceDiabetes(e.target.checked)} /> DIAB.</label>
                <label style={{ cursor: "pointer" }}><input type="checkbox" checked={padeceMigrana} onChange={(e) => setPadeceMigrana(e.target.checked)} /> MIGRAÑA</label>
                <input type="text" placeholder="OTROS..." value={padeceOtros} onChange={(e) => setPadeceOtros(e.target.value.toUpperCase())} style={{ ...estiloInput, width: "100px", padding: "7px", fontSize: "12px", textTransform: "uppercase" }} />
              </div>
            </div>
          </div>
        </fieldset>

        {/* GRADUACIÓN ANTERIOR */}
        <fieldset style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "20px", marginBottom: "25px", background: "#fff" }}>
          <legend style={{ background: "#f8fafc", padding: "8px 15px", borderRadius: "6px", fontWeight: "bold", fontSize: "14px", color: "#0f172a", borderLeft: "4px solid #0284c7" }}>👓 GRADUACIÓN ANTERIOR</legend>
          <table style={{ width: "100%", textTransform: "uppercase", fontSize: "13px", marginTop: "12px", borderCollapse: "separate", borderSpacing: "0 8px" }}>
            <thead>
              <tr style={{ background: "#f1f5f9", color: "#334155" }}>
                <th style={{ padding: "8px", width: "8%" }}>OJO</th>
                <th style={{ padding: "8px" }}>ESFERA</th>
                <th style={{ padding: "8px" }}>CILINDRO</th>
                <th style={{ padding: "8px" }}>EJE</th>
                <th style={{ padding: "8px" }}>ADD</th>
                <th style={{ padding: "8px" }}>DP</th>
                <th style={{ padding: "8px" }}>ALTURA</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: "bold", textAlign: "center", background: "#e2e8f0", borderRadius: "4px 0 0 4px" }}>OD</td>
                <td><input type="text" placeholder="-0.00" value={antOdEsfera} onChange={(e) => setAntOdEsfera(e.target.value)} style={obtenerEstiloCelda(antOdEsfera)} /></td>
                <td><input type="text" placeholder="-0.00" value={antOdCilindro} onChange={(e) => setAntOdCilindro(e.target.value)} style={obtenerEstiloCelda(antOdCilindro)} /></td>
                <td><input type="text" placeholder="0°" value={antOdEje} onChange={(e) => setAntOdEje(e.target.value)} style={obtenerEstiloCelda(antOdEje)} /></td>
                <td><input type="text" placeholder="+0.00" value={antOdAdd} onChange={(e) => setAntOdAdd(e.target.value)} style={obtenerEstiloCelda(antOdAdd)} /></td>
                <td><input type="text" placeholder="mm" value={antOdDp} onChange={(e) => setAntOdDp(e.target.value)} style={obtenerEstiloCelda(antOdDp)} /></td>
                <td><input type="text" placeholder="mm" value={antOdAltura} onChange={(e) => setAntOdAltura(e.target.value)} style={{ ...obtenerEstiloCelda(antOdAltura), borderRadius: "0 4px 4px 0" }} /></td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold", textAlign: "center", background: "#e2e8f0", borderRadius: "4px 0 0 4px" }}>OI</td>
                <td><input type="text" placeholder="-0.00" value={antOiEsfera} onChange={(e) => setAntOiEsfera(e.target.value)} style={obtenerEstiloCelda(antOiEsfera)} /></td>
                <td><input type="text" placeholder="-0.00" value={antOiCilindro} onChange={(e) => setAntOiCilindro(e.target.value)} style={obtenerEstiloCelda(antOiCilindro)} /></td>
                <td><input type="text" placeholder="0°" value={antOiEje} onChange={(e) => setAntOiEje(e.target.value)} style={obtenerEstiloCelda(antOiEje)} /></td>
                <td><input type="text" placeholder="+0.00" value={antOiAdd} onChange={(e) => setAntOiAdd(e.target.value)} style={obtenerEstiloCelda(antOiAdd)} /></td>
                <td><input type="text" placeholder="mm" value={antOiDp} onChange={(e) => setAntOiDp(e.target.value)} style={obtenerEstiloCelda(antOiDp)} /></td>
                <td><input type="text" placeholder="mm" value={antOiAltura} onChange={(e) => setAntOiAltura(e.target.value)} style={{ ...obtenerEstiloCelda(antOiAltura), borderRadius: "0 4px 4px 0" }} /></td>
              </tr>
            </tbody>
          </table>
        </fieldset>

        {/* ACTIVIDADES Y COMENTARIOS */}
        <fieldset style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "20px", marginBottom: "25px", background: "#fff" }}>
          <legend style={{ background: "#f8fafc", padding: "8px 15px", borderRadius: "6px", fontWeight: "bold", fontSize: "14px", color: "#0f172a", borderLeft: "4px solid #0284c7" }}>📝 ACTIVIDADES, SÍNTOMAS Y OBSERVACIONES CLÍNICAS</legend>
          <textarea
            rows="3"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value.toUpperCase())}
            placeholder="EJ: USO PROLONGADO DE COMPUTADORA, ASTENOPIA, TRABAJO DE OFICINA..."
            style={{ ...estiloInput, resize: "vertical", textTransform: "uppercase", marginTop: "10px" }}
          />
        </fieldset>

        {/* GRADUACIÓN ACTUAL */}
        <fieldset style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "20px", marginBottom: "25px", background: "#fff" }}>
          <legend style={{ background: "#f8fafc", padding: "8px 15px", borderRadius: "6px", fontWeight: "bold", fontSize: "14px", color: "#0f172a", borderLeft: "4px solid #0284c7" }}>🎯 GRADUACIÓN ACTUAL (RECETA MÉDICA)</legend>
          <table style={{ width: "100%", textTransform: "uppercase", fontSize: "13px", marginTop: "12px", borderCollapse: "separate", borderSpacing: "0 8px" }}>
            <thead>
              <tr style={{ background: "#f1f5f9", color: "#334155" }}>
                <th style={{ padding: "8px", width: "8%" }}>OJO</th>
                <th style={{ padding: "8px" }}>ESFERA</th>
                <th style={{ padding: "8px" }}>CILINDRO</th>
                <th style={{ padding: "8px" }}>EJE</th>
                <th style={{ padding: "8px" }}>ADD</th>
                <th style={{ padding: "8px" }}>DP</th>
                <th style={{ padding: "8px" }}>ALTURA</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: "bold", textAlign: "center", background: "#e2e8f0", borderRadius: "4px 0 0 4px" }}>OD</td>
                <td><input type="text" placeholder="-0.00" value={actOdEsfera} onChange={(e) => setActOdEsfera(e.target.value)} style={obtenerEstiloCelda(actOdEsfera)} /></td>
                <td><input type="text" placeholder="-0.00" value={actOdCilindro} onChange={(e) => setActOdCilindro(e.target.value)} style={obtenerEstiloCelda(actOdCilindro)} /></td>
                <td><input type="text" placeholder="0°" value={actOdEje} onChange={(e) => setActOdEje(e.target.value)} style={obtenerEstiloCelda(actOdEje)} /></td>
                <td><input type="text" placeholder="+0.00" value={actOdAdd} onChange={(e) => setActOdAdd(e.target.value)} style={obtenerEstiloCelda(actOdAdd)} /></td>
                <td><input type="text" placeholder="mm" value={actOdDp} onChange={(e) => setActOdDp(e.target.value)} style={obtenerEstiloCelda(actOdDp)} /></td>
                <td><input type="text" placeholder="mm" value={actOdAltura} onChange={(e) => setActOdAltura(e.target.value)} style={{ ...obtenerEstiloCelda(actOdAltura), borderRadius: "0 4px 4px 0" }} /></td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold", textAlign: "center", background: "#e2e8f0", borderRadius: "4px 0 0 4px" }}>OI</td>
                <td><input type="text" placeholder="-0.00" value={actOiEsfera} onChange={(e) => setActOiEsfera(e.target.value)} style={obtenerEstiloCelda(actOiEsfera)} /></td>
                <td><input type="text" placeholder="-0.00" value={actOiCilindro} onChange={(e) => setActOiCilindro(e.target.value)} style={obtenerEstiloCelda(actOiCilindro)} /></td>
                <td><input type="text" placeholder="0°" value={actOiEje} onChange={(e) => setActOiEje(e.target.value)} style={obtenerEstiloCelda(actOiEje)} /></td>
                <td><input type="text" placeholder="+0.00" value={actOiAdd} onChange={(e) => setActOiAdd(e.target.value)} style={obtenerEstiloCelda(actOiAdd)} /></td>
                <td><input type="text" placeholder="mm" value={actOiDp} onChange={(e) => setActOiDp(e.target.value)} style={obtenerEstiloCelda(actOiDp)} /></td>
                <td><input type="text" placeholder="mm" value={actOiAltura} onChange={(e) => setActOiAltura(e.target.value)} style={{ ...obtenerEstiloCelda(actOiAltura), borderRadius: "0 4px 4px 0" }} /></td>
              </tr>
            </tbody>
          </table>
        </fieldset>

        <button
          type="submit"
          disabled={cargando}
          style={{ width: "100%", padding: "14px", background: "#0284c7", color: "#fff", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "bold", cursor: cargando ? "wait" : "pointer", boxShadow: "0 4px 12px rgba(2, 132, 199, 0.3)" }}
        >
          {cargando ? "Guardando..." : "📋 Guardar Examen y Graduación Visual"}
        </button>

      </form>
    </div>
  );
}
