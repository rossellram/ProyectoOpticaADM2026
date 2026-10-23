const pool = require("../config/db");

// Crear Orden
const crearOrden = async (req, res) => {
  try {
    const {
      fecha, clienteNombre, edad, telefono, ocupacion,
      padeceHta, padeceDiabetes, padeceMigrana, padeceOtros,
      antOdEsfera, antOdCilindro, antOdEje, antOdAdd, antOdDp, antOdAltura,
      antOiEsfera, antOiCilindro, antOiEje, antOiAdd, antOiDp, antOiAltura,
      observaciones,
      actOdEsfera, actOdCilindro, actOdEje, actOdAdd, actOdDp, actOdAltura,
      actOiEsfera, actOiCilindro, actOiEje, actOiAdd, actOiDp, actOiAltura,
      aroDescripcion, aroPrecio, lentesDescripcion, lentesPrecio, otrosDescripcion, otrosPrecio,
      total, prima, estadoTrabajo
    } = req.body;

    const totalNum = parseFloat(total || 0);
    const primaNum = parseFloat(prima || 0);
    const saldo = totalNum - primaNum;
    const estado = estadoTrabajo || (saldo <= 0 ? "ENTREGADO" : "PENDIENTE");

    const query = `
      INSERT INTO ordenes_graduacion (
        fecha, cliente_nombre, edad, telefono, ocupacion,
        padece_hta, padece_diabetes, padece_migrana, padece_otros,
        ant_od_esfera, ant_od_cilindro, ant_od_eje, ant_od_add, ant_od_dp, ant_od_altura,
        ant_oi_esfera, ant_oi_cilindro, ant_oi_eje, ant_oi_add, ant_oi_dp, ant_oi_altura,
        observaciones,
        act_od_esfera, act_od_cilindro, act_od_eje, act_od_add, act_od_dp, act_od_altura,
        act_oi_esfera, act_oi_cilindro, act_oi_eje, act_oi_add, act_oi_dp, act_oi_altura,
        aro_descripcion, aro_precio, lentes_descripcion, lentes_precio, otros_descripcion, otros_precio,
        total, prima, saldo_pendiente, estado_trabajo
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22,
        $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40,
        $41, $42, $43, $44
      ) RETURNING *;
    `;

    const values = [
      fecha, clienteNombre, edad || null, telefono, ocupacion,
      padeceHta, padeceDiabetes, padeceMigrana, padeceOtros,
      antOdEsfera, antOdCilindro, antOdEje, antOdAdd, antOdDp, antOdAltura,
      antOiEsfera, antOiCilindro, antOiEje, antOiAdd, antOiDp, antOiAltura,
      observaciones,
      actOdEsfera, actOdCilindro, actOdEje, actOdAdd, actOdDp, actOdAltura,
      actOiEsfera, actOiCilindro, actOiEje, actOiAdd, actOiDp, actOiAltura,
      aroDescripcion, aroPrecio || 0, lentesDescripcion, lentesPrecio || 0, otrosDescripcion, otrosPrecio || 0,
      totalNum, primaNum, saldo < 0 ? 0 : saldo, estado
    ];

    const result = await pool.query(query, values);
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error al crear orden:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtener todas las órdenes
const obtenerOrdenes = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM ordenes_graduacion ORDER BY id DESC;");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Actualizar Orden
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
      aroDescripcion, aroPrecio, lentesDescripcion, lentesPrecio, otrosDescripcion, otrosPrecio,
      total, prima, estadoTrabajo
    } = req.body;

    const totalNum = parseFloat(total || 0);
    const primaNum = parseFloat(prima || 0);
    const saldo = totalNum - primaNum;
    const estado = estadoTrabajo || (saldo <= 0 ? "ENTREGADO" : "PENDIENTE");

    const query = `
      UPDATE ordenes_graduacion SET
        fecha = $1, cliente_nombre = $2, edad = $3, telefono = $4, ocupacion = $5,
        padece_hta = $6, padece_diabetes = $7, padece_migrana = $8, padece_otros = $9,
        ant_od_esfera = $10, ant_od_cilindro = $11, ant_od_eje = $12, ant_od_add = $13, ant_od_dp = $14, ant_od_altura = $15,
        ant_oi_esfera = $16, ant_oi_cilindro = $17, ant_oi_eje = $18, ant_oi_add = $19, ant_oi_dp = $20, ant_oi_altura = $21,
        observaciones = $22,
        act_od_esfera = $23, act_od_cilindro = $24, act_od_eje = $25, act_od_add = $26, act_od_dp = $27, act_od_altura = $28,
        act_oi_esfera = $29, act_oi_cilindro = $30, act_oi_eje = $31, act_oi_add = $32, act_oi_dp = $33, act_oi_altura = $34,
        aro_descripcion = $35, aro_precio = $36, lentes_descripcion = $37, lentes_precio = $38, otros_descripcion = $39, otros_precio = $40,
        total = $41, prima = $42, saldo_pendiente = $43, estado_trabajo = $44
      WHERE id = $45 RETURNING *;
    `;

    const values = [
      fecha, clienteNombre, edad || null, telefono, ocupacion,
      padeceHta, padeceDiabetes, padeceMigrana, padeceOtros,
      antOdEsfera, antOdCilindro, antOdEje, antOdAdd, antOdDp, antOdAltura,
      antOiEsfera, antOiCilindro, antOiEje, antOiAdd, antOiDp, antOiAltura,
      observaciones,
      actOdEsfera, actOdCilindro, actOdEje, actOdAdd, actOdDp, actOdAltura,
      actOiEsfera, actOiCilindro, actOiEje, actOiAdd, actOiDp, actOiAltura,
      aroDescripcion, aroPrecio || 0, lentesDescripcion, lentesPrecio || 0, otrosDescripcion, otrosPrecio || 0,
      totalNum, primaNum, saldo < 0 ? 0 : saldo, estado,
      id
    ];

    const result = await pool.query(query, values);
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error al actualizar orden:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Registrar Abono Rápido
const registrarAbono = async (req, res) => {
  try {
    const { id } = req.params;
    const { montoAbono, nuevoEstado } = req.body;

    const ordenRes = await pool.query("SELECT total, prima, saldo_pendiente FROM ordenes_graduacion WHERE id = $1;", [id]);
    if (ordenRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Orden no encontrada." });
    }

    const ordenActual = ordenRes.rows[0];
    const nuevaPrima = parseFloat(ordenActual.prima || 0) + parseFloat(montoAbono || 0);
    const nuevoSaldo = parseFloat(ordenActual.total || 0) - nuevaPrima;
    const estado = nuevoEstado || (nuevoSaldo <= 0 ? "ENTREGADO" : "PENDIENTE");

    const query = `
      UPDATE ordenes_graduacion
      SET prima = $1, saldo_pendiente = $2, estado_trabajo = $3
      WHERE id = $4 RETURNING *;
    `;

    const result = await pool.query(query, [nuevaPrima, nuevoSaldo < 0 ? 0 : nuevoSaldo, estado, id]);
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error al registrar abono:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Eliminar Orden
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

module.exports = { crearOrden, obtenerOrdenes, actualizarOrden, registrarAbono, eliminarOrden };
