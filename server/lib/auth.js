const bcrypt = require("bcrypt");
const { validateEmail, validatePassword } = require("voctail-utils");
const { query } = require("./db");
const { log } = require("./log.js");
const { createTokens } = require("./jwt.js");
const jwt = require("jsonwebtoken");

function _u({ user_id, email }) {
  return { user: { user_id, email, admin: false } };
}

function createAccessToken(userObj) {
  return jwt.sign(userObj, process.env.ACCESS_TOKEN_SECRET, { issuer: "voctail", subject: "webapp", expiresIn: "30s" });
}

async function createTokens(userRecord) {
  try {
    const userObj = _u(userRecord);
    const accessToken = createAccessToken(userObj);
    const refreshToken = jwt.sign(userObj, process.env.REFRESH_TOKEN_SECRET, {
      issuer: "voctail",
      subject: "webapp",
      expiresIn: "3d",
    });

    return [accessToken, refreshToken];
  } catch (err) {
    log(err);
    return null;
  }
}

function tokenMiddleWare(req, res, next) {
  try {
    const bearerToken = req.headers.authorization;
    if (bearerToken) {
      const token = bearerToken.split(" ")[1];
      const authData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.authData = authData;
      next();
    } else {
      log("No token to verify.");
      res.status(401).send("Unauthorized.");
    }
  } catch (err) {
    log("Error verifying token", err);
    res.status(401).send("Unauthorized.");
  }
}

async function tokenHandler(req, res) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) res.status(403).send("Forbidden.");

    const {
      user: { user_id },
    } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const {
      rows: [userRecord],
    } = await query("SELECT * FROM users WHERE user_id = $1", [user_id]);

    if (userRecord.refresh_token === refreshToken) {
      const accessToken = createAccessToken(u(userRecord));
      res.status(200).json({ accessToken });
    } else {
      log("Bad token", user_id, refreshToken, userRecord.refresh_token);
      res.status(403).send("Forbidden.");
    }
  } catch (err) {
    log("Error verifying token", err);
    res.status(403).send("Forbidden.");
  }
}

async function registerHandler(req, res) {
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
      res.status(201).send(`Successfully registered user ${email}.`);
    }
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

async function loginHandler(req, res) {
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

async function logoutHandler(req, res) {
  try {
    const { user_id } = req.authData.user;
    await query("UPDATE users SET refresh_token = NULL WHERE user_id = $1", [user_id]);
  } catch (err) {
    log("Errpr logging out user", err);
  }
  res.status(200).send();
}

module.exports = {
  tokenMiddleWare,
  tokenHandler,
  registerHandler,
  loginHandler,
  logoutHandler,
};
