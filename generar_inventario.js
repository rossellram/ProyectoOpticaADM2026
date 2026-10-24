const pool = require("./server/config/db");

async function generarInventarioPrueba() {
  try {
    console.log("🧹 Limpiando el inventario anterior...");
    await pool.query("DELETE FROM inventario;");

    const arosEjemplo = [
      { codigo: "RB-001", marca: "RAY-BAN", modelo: "WAYFARER CLASSIC", color: "NEGRO MATE", costo: 900.00, venta: 1800.00, stock: 8 },
      { codigo: "RB-002", marca: "RAY-BAN", modelo: "AVIATOR METAL", color: "DORADO / VERDE", costo: 1200.00, venta: 2400.00, stock: 5 },
      { codigo: "RB-003", marca: "RAY-BAN", modelo: "CLUBMASTER", color: "CAREY / ORO", costo: 1100.00, venta: 2200.00, stock: 6 },
      { codigo: "OK-010", marca: "OAKLEY", modelo: "CROSSHAIR", color: "PLATA / AZUL", costo: 1300.00, venta: 2600.00, stock: 4 },
      { codigo: "OK-011", marca: "OAKLEY", modelo: "HOLBROOK SPORT", color: "AZUL MATE", costo: 1250.00, venta: 2500.00, stock: 7 },
      { codigo: "VG-101", marca: "VOGUE", modelo: "CAT-EYE GLAMOUR", color: "ROSA TRANSLÚCIDO", costo: 750.00, venta: 1500.00, stock: 10 },
      { codigo: "VG-102", marca: "VOGUE", modelo: "OVAL FASHION", color: "VINO / DORADO", costo: 800.00, venta: 1600.00, stock: 5 },
      { codigo: "TF-501", marca: "TOM FORD", modelo: "LUXE TITANIUM", color: "NEGRO BRILLANTE", costo: 1600.00, venta: 3200.00, stock: 3 },
      { codigo: "TF-502", marca: "TOM FORD", modelo: "RECTANGULAR VINTAGE", color: "HAVANA OSCURO", costo: 1550.00, venta: 3100.00, stock: 4 },
      { codigo: "PR-301", marca: "PRADA", modelo: "MODERN ACETATE", color: "BLANCO / NEGRO", costo: 1400.00, venta: 2800.00, stock: 5 },
      { codigo: "PR-302", marca: "PRADA", modelo: "LINEA ROSSA SPORT", color: "GRIS TITANIO", costo: 1450.00, venta: 2900.00, stock: 4 },
      { codigo: "AX-201", marca: "ARMANI EXCHANGE", modelo: "URBAN METALLIC", color: "PLOMO", costo: 1050.00, venta: 2100.00, stock: 9 },
      { codigo: "AX-202", marca: "ARMANI EXCHANGE", modelo: "FLEX SQUARE", color: "AZUL MARINO", costo: 1000.00, venta: 2000.00, stock: 6 },
      { codigo: "GC-701", marca: "GUCCI", modelo: "CLASSIC WEB", color: "HAVANA CLÁSICO", costo: 1750.00, venta: 3500.00, stock: 2 },
      { codigo: "GC-702", marca: "GUCCI", modelo: "OVERSIZED LUXURY", color: "ORO ROSA", costo: 1800.00, venta: 3600.00, stock: 3 },
      { codigo: "MJ-401", marca: "MAUI JIM", modelo: "POLARIZED EDGE", color: "BRonce", costo: 1450.00, venta: 2900.00, stock: 5 },
      { codigo: "CA-111", marca: "CARRERA", modelo: "SPEEDWAY AVIATOR", color: "NEGRO / ROJO", costo: 1150.00, venta: 2300.00, stock: 6 },
      { codigo: "LA-888", marca: "LACOSTE", modelo: "CROCODILE SPORT", color: "VERDE MILITAR", costo: 950.00, venta: 1900.00, stock: 7 },
      { codigo: "NI-050", marca: "NIKE VISION", modelo: "FLEXON RUNNING", color: "AZUL ELECTRIC", costo: 850.00, venta: 1700.00, stock: 8 },
      { codigo: "HU-909", marca: "HUGO BOSS", modelo: "EXECUTIVE SUITE", color: "GUNMETAL", costo: 1500.00, venta: 3000.00, stock: 4 }
    ];

    console.log("📦 Insertando 20 aros de ejemplo en el inventario...");

    for (const aro of arosEjemplo) {
      const query = `
        INSERT INTO inventario (codigo, marca, modelo, color, precio_costo, precio_venta, stock)
        VALUES ($1, $2, $3, $4, $5, $6, $7);
      `;
      const values = [aro.codigo, aro.marca, aro.modelo, aro.color, aro.costo, aro.venta, aro.stock];
      await pool.query(query, values);
    }

    console.log("✅ ¡Inventario limpiado y actualizado con 20 aros de ejemplo exitosamente!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error al poblar el inventario:", err);
    process.exit(1);
  }
}

generarInventarioPrueba();

