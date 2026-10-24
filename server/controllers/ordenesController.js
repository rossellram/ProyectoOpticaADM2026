const pool = require("../config/db");

const obtenerOrdenes = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM ordenes_graduacion ORDER BY id DESC;");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const guardarOrden = async (req, res) => {
  try {
    const {
      fecha, clienteNombre, edad, telefono, ocupacion,
      padeceHta, padeceDiabetes, padeceMigrana, padeceOtros,
      antOdEsfera, antOdCilindro, antOdEje, antOdAdd, antOdDp, antOdAltura,
      antOiEsfera, antOiCilindro, antOiEje, antOiAdd, antOiDp, antOiAltura,
      observaciones,
      actOdEsfera, actOdCilindro, actOdEje, actOdAdd, actOdDp, actOdAltura,
      actOiEsfera, actOiCilindro, actOiEje, actOiAdd, actOiDp, actOiAltura,
      usuarioNombre
    } = req.body;

    const query = `
      INSERT INTO ordenes_graduacion (
        fecha, cliente_nombre, edad, telefono, ocupacion,
        padece_hta, padece_diabetes, padece_migrana, padece_otros,
        ant_od_esfera, ant_od_cilindro, ant_od_eje, ant_od_add, ant_od_dp, ant_od_altura,
        ant_oi_esfera, ant_oi_cilindro, ant_oi_eje, ant_oi_add, ant_oi_dp, ant_oi_altura,
        observaciones,
        act_od_esfera, act_od_cilindro, act_od_eje, act_od_add, act_od_dp, act_od_altura,
        act_oi_esfera, act_oi_cilindro, act_oi_eje, act_oi_add, act_oi_dp, act_oi_altura,
        usuario_nombre
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9,
        $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21,
        $22,
        $23, $24, $25, $26, $27, $28,
        $29, $30, $31, $32, $33, $34,
        $35
      ) RETURNING *;
    `;

    const values = [
      fecha || new Date().toLocaleDateString("sv-SE"),
      clienteNombre ? clienteNombre.toUpperCase() : "",
      edad || null, telefono || "",
      ocupacion ? ocupacion.toUpperCase() : "",
      padeceHta || false, padeceDiabetes || false, padeceMigrana || false,
      padeceOtros ? padeceOtros.toUpperCase() : "",
      antOdEsfera ? antOdEsfera.toUpperCase() : "", antOdCilindro ? antOdCilindro.toUpperCase() : "", antOdEje ? antOdEje.toUpperCase() : "", antOdAdd ? antOdAdd.toUpperCase() : "", antOdDp ? antOdDp.toUpperCase() : "", antOdAltura ? antOdAltura.toUpperCase() : "",
      antOiEsfera ? antOiEsfera.toUpperCase() : "", antOiCilindro ? antOiCilindro.toUpperCase() : "", antOiEje ? antOiEje.toUpperCase() : "", antOiAdd ? antOiAdd.toUpperCase() : "", antOiDp ? antOiDp.toUpperCase() : "", antOiAltura ? antOiAltura.toUpperCase() : "",
      observaciones ? observaciones.toUpperCase() : "",
      actOdEsfera ? actOdEsfera.toUpperCase() : "", actOdCilindro ? actOdCilindro.toUpperCase() : "", actOdEje ? actOdEje.toUpperCase() : "", actOdAdd ? actOdAdd.toUpperCase() : "", actOdDp ? actOdDp.toUpperCase() : "", actOdAltura ? actOdAltura.toUpperCase() : "",
      actOiEsfera ? actOiEsfera.toUpperCase() : "", actOiCilindro ? actOiCilindro.toUpperCase() : "", actOiEje ? actOiEje.toUpperCase() : "", actOiAdd ? actOiAdd.toUpperCase() : "", actOiDp ? actOiDp.toUpperCase() : "", actOiAltura ? actOiAltura.toUpperCase() : "",
      usuarioNombre ? usuarioNombre.toUpperCase() : "SISTEMA"
    ];

    const result = await pool.query(query, values);
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error al guardar orden:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const actualizarOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fecha, clienteNombre, edad, telefono, ocupacion,
      padeceHta, padeceDiabetes, padeceMigrana, padeceOtros,
      antOdEsfera, antOdCilindro, antOdEje, antOdAdd, antOdDp, antOdAltura,
      antOiEsfera, antOiCilindro, antOiEje, antOiAdd, antOiDp, antOiAltura,
      observaciones,
      actOdEsfera, actOdCilindro, actOdEje, actOdAdd, actOdDp, actOdAltura,
      actOiEsfera, actOiCilindro, actOiEje, actOiAdd, actOiDp, actOiAltura,
      aroId, aroDescripcion, aroPrecio, lentesDescripcion, lentesPrecio, otrosDescripcion, otrosPrecio,
      total, prima, saldoPendiente, estadoTrabajo, usuarioNombre
    } = req.body;

    const query = `
      UPDATE ordenes_graduacion SET
        fecha = $1, cliente_nombre = $2, edad = $3, telefono = $4, ocupacion = $5,
        padece_hta = $6, padece_diabetes = $7, padece_migrana = $8, padece_otros = $9,
        ant_od_esfera = $10, ant_od_cilindro = $11, ant_od_eje = $12, ant_od_add = $13, ant_od_dp = $14, ant_od_altura = $15,
        ant_oi_esfera = $16, ant_oi_cilindro = $17, ant_oi_eje = $18, ant_oi_add = $19, ant_oi_dp = $20, ant_oi_altura = $21,
        observaciones = $22,
        act_od_esfera = $23, act_od_cilindro = $24, act_od_eje = $25, act_od_add = $26, act_od_dp = $27, act_od_altura = $28,
        act_oi_esfera = $29, act_oi_cilindro = $30, act_oi_eje = $31, act_oi_add = $32, act_oi_dp = $33, act_oi_altura = $34,
        aro_id = $35, aro_descripcion = $36, aro_precio = $37, lentes_descripcion = $38, lentes_precio = $39, otros_descripcion = $40, otros_precio = $41,
        total = $42, prima = $43, saldo_pendiente = $44, estado_trabajo = $45,
        usuario_nombre = COALESCE($46, usuario_nombre)
      WHERE id = $47 RETURNING *;
    `;

    const values = [
      fecha,
      clienteNombre ? clienteNombre.toUpperCase() : "",
      edad || null, telefono || "",
      ocupacion ? ocupacion.toUpperCase() : "",
      padeceHta || false, padeceDiabetes || false, padeceMigrana || false,
      padeceOtros ? padeceOtros.toUpperCase() : "",
      antOdEsfera ? antOdEsfera.toUpperCase() : "", antOdCilindro ? antOdCilindro.toUpperCase() : "", antOdEje ? antOdEje.toUpperCase() : "", antOdAdd ? antOdAdd.toUpperCase() : "", antOdDp ? antOdDp.toUpperCase() : "", antOdAltura ? antOdAltura.toUpperCase() : "",
      antOiEsfera ? antOiEsfera.toUpperCase() : "", antOiCilindro ? antOiCilindro.toUpperCase() : "", antOiEje ? antOiEje.toUpperCase() : "", antOiAdd ? antOiAdd.toUpperCase() : "", antOiDp ? antOiDp.toUpperCase() : "", antOiAltura ? antOiAltura.toUpperCase() : "",
      observaciones ? observaciones.toUpperCase() : "",
      actOdEsfera ? actOdEsfera.toUpperCase() : "", actOdCilindro ? actOdCilindro.toUpperCase() : "", actOdEje ? actOdEje.toUpperCase() : "", actOdAdd ? actOdAdd.toUpperCase() : "", actOdDp ? actOdDp.toUpperCase() : "", actOdAltura ? actOdAltura.toUpperCase() : "",
      actOiEsfera ? actOiEsfera.toUpperCase() : "", actOiCilindro ? actOiCilindro.toUpperCase() : "", actOiEje ? actOiEje.toUpperCase() : "", actOiAdd ? actOiAdd.toUpperCase() : "", actOiDp ? actOiDp.toUpperCase() : "", actOiAltura ? actOiAltura.toUpperCase() : "",
      aroId || null,
      aroDescripcion ? aroDescripcion.toUpperCase() : "", aroPrecio || 0,
      lentesDescripcion ? lentesDescripcion.toUpperCase() : "", lentesPrecio || 0,
      otrosDescripcion ? otrosDescripcion.toUpperCase() : "", otrosPrecio || 0,
      total || 0, prima || 0, saldoPendiente || 0, estadoTrabajo || "PENDIENTE",
      usuarioNombre ? usuarioNombre.toUpperCase() : null,
      id
    ];

    const result = await pool.query(query, values);
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error al actualizar orden:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const registrarAbono = async (req, res) => {
  try {
    const { id } = req.params;
    const { montoAbono } = req.body;

    const ordenActual = await pool.query("SELECT * FROM ordenes_graduacion WHERE id = $1;", [id]);
    if (ordenActual.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Orden no encontrada." });
    }

    const orden = ordenActual.rows[0];
    const nuevaPrima = parseFloat(orden.prima || 0) + parseFloat(montoAbono);
    const nuevoSaldo = parseFloat(orden.total || 0) - nuevaPrima;
    const nuevoEstado = nuevoSaldo <= 0 ? "ENTREGADO" : "PENDIENTE";

    const result = await pool.query(
      "UPDATE ordenes_graduacion SET prima = $1, saldo_pendiente = $2, estado_trabajo = $3 WHERE id = $4 RETURNING *;",
      [nuevaPrima, nuevoSaldo < 0 ? 0 : nuevoSaldo, nuevoEstado, id]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error al registrar abono:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const eliminarOrden = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM ordenes_graduacion WHERE id = $1;", [id]);
    res.json({ success: true, message: "Orden eliminada correctamente." });
  } catch (error) {
    console.error("Error al eliminar orden:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { obtenerOrdenes, guardarOrden, actualizarOrden, registrarAbono, eliminarOrden };
