const bcrypt = require("bcrypt");
const { validateEmail, validatePassword } = require("voctail-utils");
const { getPool } = require("./db");
const { log } = require("./log.js");
const jwt = require("jsonwebtoken");

function listUsers(req, res) {
  log(getPool());
  const pool = getPool();
  pool.query("SELECT user_id, name, email FROM users ORDER BY user_id ASC", (error, results) => {
    if (error) {
      log(error);
      res.status(500).send("Something went wrong.");
    }
    res.status(200).json(results.rows);
  });
}

async function register(req, res) {
  const pool = getPool();
  try {
    const { email, password, name } = req.body;

    if (!validateEmail(email) || !validatePassword(password) || !name | (name.length < 1)) {
      log(`Invalid registration data ${email} ${password} ${name}.`);
      res.status(400).send("Invalid request data.");
    }

    pool.query("SELECT * FROM users WHERE email = $1", [email], async (err, results) => {
      if (err) {
        log(error);
        res.status(500).send("Something went wrong.");
      } else if (results.rowCount > 0) {
        log(`Duplicate registration attempt for ${email}.`);
        res.status(403).send("Email already in system.");
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        pool.query(
          "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
          [name, email, hashedPassword],
          error => {
            if (error) {
              log("Insert error", err);
              res.status(500).send("Something went wrong.");
            }
            res.status(201).send(`Successfully registered user ${email}.`);
          }
        );
      }
    });
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

async function login(req, res) {
  const pool = getPool();
  try {
    const { email, password } = req.body;
    pool.query("SELECT * FROM users WHERE email = $1", [email], async (err, results) => {
      if (results.rowCount < 1) {
        log(`Inexistant email login attempt for`, email);
        res.status(412).send("Email not in the system.");
      } else if (await bcrypt.compare(password, results.rows[0].password)) {
        log("Password authenticated user", email);
        const accessToken = jwt.sign({ user: email }, process.env.ACCESS_TOKEN_SECRET);
        res.status(200).json({ accessToken });
      } else {
        log("Wrong password login for", email);
        res.status(412).send("Password incorrect.");
      }
    });
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

module.exports = {
  listUsers,
  register,
  login,
};
