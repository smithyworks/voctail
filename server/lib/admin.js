const { log } = require("./log.js");
const { query } = require("./db.js");
const jwt = require("jsonwebtoken");
const { createAccessToken, createRefreshToken, u, createTokens } = require("./auth.js");

async function usersHandler(req, res) {
  try {
    if (!req.authData.user.admin) throw new Error("User must be an admin.");

    const { rows } = await query("SELECT * FROM users ORDER BY user_id ASC");
    rows.forEach(async (r) => {
      let valid_token = true;
      try {
        jwt.verify(r.refresh_token, process.env.REFRESH_TOKEN_SECRET);
      } catch {
        valid_token = false;
      }
      r.valid_token = valid_token;
    });

    res.status(200).json(rows);
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

async function deleteUser(req, res) {
  try {
    if (!req.authData.user.admin) throw new Error("User must be an admin.");

    const { user_id } = req.body;
    log("delete", user_id);
    await query("DELETE FROM users WHERE user_id = $1", [user_id]);
    res.sendStatus(200);
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

async function revokeTokenHandler(req, res) {
  try {
    if (!req.authData.user.admin) throw new Error("User must be an admin.");

    const { user_id } = req.body;
    log("revoke", user_id);
    await query("UPDATE users SET refresh_token = NULL WHERE user_id = $1", [user_id]);
    res.sendStatus(200);
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

async function masqueradeHandler(req, res) {
  try {
    const { user_id: admin_id, admin } = req.authData.user;
    if (!admin) throw new Error("User must be an admin.");

    const { user_id: masquerade_as_id } = req.body;
    const {
      rows: [userRecord],
    } = await query("SELECT * FROM users WHERE user_id = $1", [masquerade_as_id]);

    const [accessToken, refreshToken] = createTokens(userRecord, false, { masquerading: true, admin_id });
    await query("UPDATE users SET refresh_token = $1 WHERE user_id = $2", [refreshToken, admin_id]);

    res.status(201).json({ accessToken, refreshToken });
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

async function endMasqueradeHandler(req, res) {
  try {
    const { admin_id, masquerading } = req.authData.user;
    if (!masquerading || !admin_id) throw new Error("User must be a masquerading admin.");

    await query("UPDATE users SET refresh_token = NULL WHERE user_id = $1", [admin_id]);

    const {
      rows: [userRecord],
    } = await query("SELECT * FROM users WHERE user_id = $1", [admin_id]);
    const [accessToken, refreshToken] = createTokens(userRecord, false);
    await query("UPDATE users SET refresh_token = $1 WHERE user_id = $2", [refreshToken, admin_id]);

    res.status(201).json({ accessToken, refreshToken });
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

module.exports = {
  usersHandler,
  deleteUser,
  revokeTokenHandler,
  masqueradeHandler,
  endMasqueradeHandler,
};
