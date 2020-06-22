const { Pool } = require("pg");

const { log } = require("./log.js");

const pool = new Pool({
  user: process.env.VOCTAIL_DB_USER,
  host: process.env.VOCTAIL_DB_HOST,
  database: process.env.VOCTAIL_DB_NAME,
  password: process.env.VOCTAIL_DB_PASS,
  port: process.env.VOCTAIL_DB_PORT,
});

function checkConnection(cb) {
  pool
    .query("SELECT NOW()")
    .then((res) => {
      cb(res && res.rowCount === 1 && res.rows[0].now);
    })
    .catch((err) => {
      log(err);
      cb(false);
    });
}

function query(text, params) {
  return pool.query(text, params);
}

function disconnect() {
  pool.end();
}

module.exports = {
  checkConnection,
  query,
  disconnect,
};
