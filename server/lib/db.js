const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

async function isConnected() {
  try {
    const res = await pool.query("SELECT NOW()");
    return res && res.rowCount === 1 && res.rows[0].now && res.rows[0].now.length > 0;
  } catch {
    return false;
  }
}

function query(text, params) {
  return pool.query(text, params);
}

function disconnect() {
  pool.end();
}

module.exports = {
  isConnected,
  query,
  disconnect,
};
