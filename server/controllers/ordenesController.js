const pool = require("../config/db");

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
      total, prima, saldoPendiente, usuarioNombre
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
        aro_descripcion, aro_precio, lentes_descripcion, lentes_precio, otros_descripcion, otros_precio,
        total, prima, saldo_pendiente, usuario_nombre
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22,
        $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40,
        $41, $42, $43, $44
      ) RETURNING *;
    `;

    const values = [
      fecha || new Date().toISOString().split("T")[0], clienteNombre, edad || null, telefono, ocupacion,
      padeceHta, padeceDiabetes, padeceMigrana, padeceOtros,
      antOdEsfera, antOdCilindro, antOdEje, antOdAdd, antOdDp, antOdAltura,
      antOiEsfera, antOiCilindro, antOiEje, antOiAdd, antOiDp, antOiAltura,
      observaciones,
      actOdEsfera, actOdCilindro, actOdEje, actOdAdd, actOdDp, actOdAltura,
      actOiEsfera, actOiCilindro, actOiEje, actOiAdd, actOiDp, actOiAltura,
      aroDescripcion, aroPrecio || 0, lentesDescripcion, lentesPrecio || 0, otrosDescripcion, otrosPrecio || 0,
      total || 0, prima || 0, saldoPendiente !== undefined ? saldoPendiente : (total || 0), usuarioNombre || "SISTEMA"
    ];

    const result = await pool.query(query, values);
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error al crear orden:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const obtenerOrdenes = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM ordenes_graduacion ORDER BY id DESC;");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const actualizarOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      clienteNombre, edad, telefono, ocupacion,
      padeceHta, padeceDiabetes, padeceMigrana, padeceOtros,
      observaciones,
      actOdEsfera, actOdCilindro, actOdEje, actOdAdd, actOdDp, actOdAltura,
      actOiEsfera, actOiCilindro, actOiEje, actOiAdd, actOiDp, actOiAltura,
      aroDescripcion, aroPrecio, aroId, lentesDescripcion, lentesPrecio, otrosDescripcion, otrosPrecio,
      total, prima, saldoPendiente
    } = req.body;

    const query = `
      UPDATE ordenes_graduacion SET
        cliente_nombre = $1, edad = $2, telefono = $3, ocupacion = $4,
        padece_hta = $5, padece_diabetes = $6, padece_migrana = $7, padece_otros = $8,
        observaciones = $9,
        act_od_esfera = $10, act_od_cilindro = $11, act_od_eje = $12, act_od_add = $13, act_od_dp = $14, act_od_altura = $15,
        act_oi_esfera = $16, act_oi_cilindro = $17, act_oi_eje = $18, act_oi_add = $19, act_oi_dp = $20, act_oi_altura = $21,
        aro_descripcion = $22, aro_precio = $23, aro_id = $24, lentes_descripcion = $25, lentes_precio = $26, otros_descripcion = $27, otros_precio = $28,
        total = $29, prima = $30, saldo_pendiente = $31
      WHERE id = $32 RETURNING *;
    `;

    const values = [
      clienteNombre, edad || null, telefono, ocupacion,
      padeceHta, padeceDiabetes, padeceMigrana, padeceOtros,
      observaciones,
      actOdEsfera, actOdCilindro, actOdEje, actOdAdd, actOdDp, actOdAltura,
      actOiEsfera, actOiCilindro, actOiEje, actOiAdd, actOiDp, actOiAltura,
      aroDescripcion, aroPrecio || 0, aroId || null, lentesDescripcion, lentesPrecio || 0, otrosDescripcion, otrosPrecio || 0,
      total || 0, prima || 0, saldoPendiente || 0, id
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
    const { montoAbono, monto, usuarioNombre } = req.body;
    const abonoValor = parseFloat(montoAbono || monto || 0);

    if (isNaN(abonoValor) || abonoValor <= 0) {
      return res.status(400).json({ success: false, error: "Monto de abono no válido." });
    }

    const ordenRes = await pool.query("SELECT * FROM ordenes_graduacion WHERE id = $1;", [id]);
    if (ordenRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Orden no encontrada." });
    }

    const orden = ordenRes.rows[0];
    const primaActual = parseFloat(orden.prima || 0);
    const saldoActual = parseFloat(orden.saldo_pendiente || 0);

    const nuevaPrima = primaActual + abonoValor;
    const nuevoSaldo = Math.max(0, saldoActual - abonoValor);
    const nuevoEstado = nuevoSaldo <= 0 ? "PAGADO" : "PENDIENTE";

    await pool.query(
      "INSERT INTO abonos (orden_id, monto, usuario_nombre) VALUES ($1, $2, $3);",
      [parseInt(id, 10), abonoValor, usuarioNombre || "SISTEMA"]
    );

    const updateQuery = `
      UPDATE ordenes_graduacion SET
        prima = $1::numeric,
        saldo_pendiente = $2::numeric,
        estado_trabajo = $3::varchar
      WHERE id = $4::integer RETURNING *;
    `;

    const result = await pool.query(updateQuery, [nuevaPrima, nuevoSaldo, nuevoEstado, parseInt(id, 10)]);
    res.json({
      success: true,
      data: result.rows[0],
      montoAbonado: abonoValor,
      saldoAnterior: saldoActual,
      nuevoSaldo: nuevoSaldo
    });
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

module.exports = { crearOrden, obtenerOrdenes, actualizarOrden, registrarAbono, eliminarOrden };
