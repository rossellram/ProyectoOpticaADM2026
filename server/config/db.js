const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "OpticaADM2026",
  password: "admin123",
  port: 5433,
});

module.exports = pool;
