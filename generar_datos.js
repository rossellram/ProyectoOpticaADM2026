const pool = require("./server/config/db");

async function generarDatosPrueba() {
  try {
    console.log("🧹 Limpiando tablas de abonos y órdenes anteriores...");
    await pool.query("DELETE FROM abonos;");
    await pool.query("DELETE FROM ordenes_graduacion;");

    const nombresEjemplo = [
      "CARLOS ALBERTO MARTÍNEZ", "MARÍA ELENA GÓMEZ", "JOSÉ LUIS FLORES", 
      "ANA LUCÍA HERNÁNDEZ", "JUAN CARLOS PÉREZ", "ROSA MARÍA RODRÍGUEZ", 
      "PEDRO ANTONIO SÁNCHEZ", "CLAUDIA PATRICIA DÍAZ", "FRANCISCO JAVIER TORRES", 
      "SOFÍA ISABEL RAMÍREZ", "LUIS MIGUEL CASTRO", "GABRIELA FERNANDA ORTIZ", 
      "MIGUEL ÁNGEL FLORES", "DANIELA ALEXANDRA RIVERA", "RICARDO JOSÉ MEJÍA", 
      "BEATRIZ ADRIANA LÓPEZ", "SERGIO DANIEL VARGAS", "VALERIA SOFÍA MENDOZA", 
      "HÉCTOR MANUEL GUZMÁN", "LILIANA MARICELA NUÑEZ"
    ];

    const arosEjemplo = [
      { desc: "RAY BAN NEGRO MATE (SKU-RB01)", precio: 1800.00 },
      { desc: "OAKLEY SPORT TITANIUM (SKU-OK05)", precio: 2500.00 },
      { desc: "VOGUE CAT-EYE CAREY (SKU-VG12)", precio: 1500.00 },
      { desc: "TOM FORD DORADO LUJO (SKU-TF09)", precio: 3200.00 },
      { desc: "PRADA MODERNO ACETATO (SKU-PR03)", precio: 2800.00 },
      { desc: "ARMANI EXCHANGE METAL (SKU-AX02)", precio: 2100.00 },
      { desc: "GUCCI CLÁSICO HAVANA (SKU-GC07)", precio: 3500.00 },
      { desc: "MAUI JIM POLARIZADO (SKU-MJ10)", precio: 2900.00 }
    ];

    const lentesEjemplo = [
      "MONOFOCAL CR-39 ANTIRREFLEJO",
      "BIFOCAL FLAT-TOP 28 CR-39",
      "PROGRESSIVE DIGITAL BLUE BLOCK",
      "MONOFOCAL TRANSITION / FOTOCROMÁTICO",
      "ANTIRREFLEJO PREMIUM UV400"
    ];

    const usuarios = ["ADMINISTRADOR PRINCIPAL", "DR. CARLOS ROCHA", "LICDA. SOFÍA VALLADARES"];

    console.log("🌱 Generando 20 clientes de prueba...");

    for (let i = 0; i < 20; i++) {
      const nombre = nombresEjemplo[i];
      const telefono = "9" + Math.floor(1000000 + Math.random() * 9000000);
      const edad = Math.floor(18 + Math.random() * 55);
      
      const diasAtras = Math.floor(Math.random() * 15);
      const fecha = new Date();
      fecha.setDate(fecha.getDate() - diasAtras);
      const fechaStr = fecha.toISOString().split("T")[0];

      const aro = arosEjemplo[Math.floor(Math.random() * arosEjemplo.length)];
      const lenteDesc = lentesEjemplo[Math.floor(Math.random() * lentesEjemplo.length)];
      const lentePrecio = Math.floor(800 + Math.random() * 1200);

      const total = aro.precio + lentePrecio;
      const estadoCompleto = Math.random() > 0.5;
      const prima = estadoCompleto ? total : Math.floor(total * 0.5);
      const saldoPendiente = total - prima;
      const usuarioNombre = usuarios[Math.floor(Math.random() * usuarios.length)];

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
          $1, $2, $3, $4, $5, $6, $7, $8, $9,
          $10, $11, $12, $13, $14, $15,
          $16, $17, $18, $19, $20, $21,
          $22,
          $23, $24, $25, $26, $27, $28,
          $29, $30, $31, $32, $33, $34,
          $35, $36, $37, $38, $39, $40,
          $41, $42, $43, $44
        );
      `;

      const values = [
        fechaStr, nombre, edad, telefono, "OFICINISTA / PROFESIONAL",
        false, false, false, "",
        "-1.00", "-0.50", "90", "+1.50", "62", "20",
        "-1.25", "-0.75", "85", "+1.50", "62", "20",
        "USO PROLONGADO DE PANTALLAS Y COMPUTADORA.",
        "-1.50", "-0.75", "90", "+1.75", "64", "22",
        "-1.75", "-1.00", "85", "+1.75", "64", "22",
        aro.desc, aro.precio, lenteDesc, lentePrecio, "ESTUCHE Y LIQUIDO LIMPIADOR", 150.00,
        total + 150.00, prima, saldoPendiente > 0 ? saldoPendiente + 150.00 : 0, usuarioNombre
      ];

      await pool.query(query, values);
    }

    console.log("✅ ¡20 clientes de prueba generados exitosamente con éxito!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error al generar datos:", err);
    process.exit(1);
  }
}

generarDatosPrueba();

