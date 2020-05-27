const { Pool } = require("pg");

let pool;

function createPool() {
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
  });

  return pool;
}

function getPool() {
  return pool;
}

async function checkConnection() {
  const res = await pool.query("SELECT NOW()");
  return res && res.rowCount === 1 && res.rows[0].now && res.rows[0].now.length > 0;
}

module.exports = {
  createPool,
  getPool,
  checkConnection,
};
