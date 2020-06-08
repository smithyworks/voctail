const { log } = require("./log.js");
const { query } = require("./db.js");
const { createAccessToken, createRefreshToken, u } = require("./auth.js");

async function usersHandler(req, res) {
  try {
    if (!req.authData.user.admin) throw new Error("User must be an admin.");

    const { rows } = await query("SELECT user_id, name, email, admin FROM users ORDER BY user_id ASC");
    res.status(200).json(rows);
  } catch (err) {
    log(error);
    res.status(500).send("Something went wrong.");
  }
}

async function masqueradeHandler(req, res) {
  try {
    const { user_id: admin_id, admin } = req.authData.user;
    if (!admin) throw new Error("User must be an admin.");

    const { masquerade_as_id } = req.body;
    const {
      rows: [userRecord],
    } = await query("SELECT * FROM users WHERE user_id = $1", [masquerade_as_id]);

    const userObj = { ...u(userRecord), masquerading: true, admin_id };
    const accessToken = createAccessToken(userObj);
    const refreshToken = createAccessToken(userObj);
    await query("UPDATE users SET refresh_token = $1 WHERE user_id = $2", [refreshToken, admin_id]);

    res.status(201).json({ accessToken, refreshToken });
  } catch {
    log(error);
    res.status(500).send("Something went wrong.");
  }
}

async function endMasqueradeHandler(req, res) {
  try {
    const { admin_id, masquerading } = req.authData.user;
    if (!masquerading || !admin_id) throw new Error("User must be a masquerading admin.");

    const {
      rows: [userRecord],
    } = await query("SELECT * FROM users WHERE user_id = $1", [admin_id]);
    const userObj = u(userRecord);
    const accessToken = createAccessToken(userObj);
    const refreshToken = createAccessToken(userObj);
    await query("UPDATE users SET refresh_token = $1 WHERE user_id = $2", [refreshToken, admin_id]);

    res.status(201).json({ accessToken, refreshToken });
  } catch {
    log(error);
    res.status(500).send("Something went wrong.");
  }
}

module.exports = {
  usersHandler,
  masqueradeHandler,
  endMasqueradeHandler,
};
