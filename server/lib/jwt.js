const { log } = require("./log.js");
const { query } = require("./db.js");
const jwt = require("jsonwebtoken");

function u({ user_id, email }) {
  return { user: { user_id, email, admin: false } };
}

function createAccessToken(userObj) {
  return jwt.sign(userObj, process.env.ACCESS_TOKEN_SECRET, { issuer: "voctail", subject: "webapp", expiresIn: "30s" });
}

async function createTokens(userRecord, isAdmin) {
  let accessToken, refreshToken;
  try {
    const userObj = u(userRecord);

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

function verifyToken(req, res, next) {
  try {
    const bearerToken = req.headers.authorization;
    console.log(bearerToken);
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

async function token(req, res) {
  try {
    const { refreshToken } = req.body;
    log(refreshToken);
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

async function clearToken(req, res) {
  try {
    const { refreshToken } = req.body;
    log(refreshToken);
    if (!refreshToken) res.status(403).send("Forbidden.");

    const {
      user: { user_id, email },
    } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    await query("UPDATE users SET refresh_token = NULL WHERE user_id = $1", [user_id]);
    log("Log out user", email);
    res.status(200).send("Successfully logged out.");
  } catch (err) {
    log("Error verifying token", err);
    res.status(403).send("Forbidden.");
  }
}

module.exports = {
  createTokens,
  verifyToken,
  token,
  clearToken,
};
