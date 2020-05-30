const bcrypt = require("bcrypt");
const { validateEmail, validatePassword } = require("voctail-utils");
const { query } = require("./db");
const { log } = require("./log.js");
const { createTokens } = require("./jwt.js");

async function listUsers(req, res) {
  try {
    const { rows } = await query("SELECT user_id, name, email FROM users ORDER BY user_id ASC");
    res.status(200).json(rows);
  } catch (err) {
    log(error);
    res.status(500).send("Something went wrong.");
  }
}

async function register(req, res) {
  console.log("register", req, res);
  try {
    const { email, password, name } = req.body;

    if (!validateEmail(email) || !validatePassword(password) || !name | (name.length < 1)) {
      log(`Invalid registration data ${email} ${password} ${name}.`);
      res.status(400).send("Invalid request data.");
    }

    const { rowCount } = await query("SELECT * FROM users WHERE email = $1", [email]);

    if (rowCount) {
      log(`Duplicate registration attempt for ${email}.`);

      res.status(412).send("This email address is already in use.");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const {
        rows: [userRecord],
      } = await query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING (user_id, name, email)",
        [name, email, hashedPassword]
      );
      console.log(userRecord);

      res.status(201).send(`Successfully registered user ${email}.`);
    }
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const {
      rows: [userRecord],
    } = await query("SELECT * FROM users WHERE email = $1", [email]);

    if (userRecord) {
      if (await bcrypt.compare(password, userRecord.password)) {
        log("Password authenticated user", email);
        const [accessToken, refreshToken] = await createTokens(userRecord);
        await query("UPDATE users SET refresh_token = $1 WHERE user_id = $2", [refreshToken, userRecord.user_id]);

        res.status(200).json({ accessToken, refreshToken });
      } else {
        log("Wrong password login for", email);

        res.status(412).send("The entered password was incorrect.");
      }
    } else {
      log(`Inexistant email login attempt for`, email);

      res.status(412).send(`The email '${email}' is not in our system.`);
    }
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

async function logout(req, res) {
  console.log("log out.");
  try {
    const { user_id } = req.authData.user;
    await query("UPDATE users SET refresh_token = NULL WHERE user_id = $1", [user_id]);
  } catch (err) {
    log("Errpr logging out user", err);
  }
  res.status(200).send();
}

module.exports = {
  listUsers,
  register,
  login,
  logout,
};
