const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // En Render, PostgreSQL exige SSL. Localmente podés quitar la línea SSL si no lo usás.
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  // Opcional: mantener la conexión viva para evitar timeouts
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

module.exports = pool;
