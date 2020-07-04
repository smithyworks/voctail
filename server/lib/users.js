const { log } = require("./log.js");
const { query } = require("./db.js");
const bcrypt = require("bcrypt");

async function userHandler(req, res) {
  try {
    const { user_id, masquerading } = req.authData.user;
    const {
      rows: [userRecord],
    } = await query("SELECT user_id, name, email, admin, premium FROM users WHERE user_id = $1", [user_id]);
    res.status(200).json({ ...userRecord, masquerading: !!masquerading });
  } catch (err) {
    log(error);
    res.status(500).send("Something went wrong.");
  }
}

async function setPremiumHandler(req, res) {
  try {
    const { user_id, masquerading } = req.authData.user;
    const { premium } = req.body;

    if (!masquerading) await query("UPDATE users SET premium = $1 WHERE user_id = $2", [premium, user_id]);

    res.sendStatus(200);
  } catch (err) {
    log(error);
    res.status(500).send("Something went wrong.");
  }
}

async function setNameHandler(req, res) {
  try {
    const { user_id, masquerading } = req.authData.user;
    const { name } = req.body;

    if (!masquerading) await query("UPDATE users SET name = $1 WHERE user_id = $2", [name, user_id]);

    res.sendStatus(200);
  } catch (err) {
    log(error);
    res.status(500).send("Something went wrong.");
  }
}

async function setEmailHandler(req, res) {
  try {
    const { user_id, masquerading } = req.authData.user;
    const { email } = req.body;

    if (!masquerading) await query("UPDATE users SET email = $1 WHERE user_id = $2", [email, user_id]);

    res.sendStatus(200);
  } catch (err) {
    log(error);
    res.status(500).send("Something went wrong.");
  }
}

async function setPasswordHandler(req, res) {
  try {
    const { user_id, masquerading } = req.authData.user;
    const { password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    if (!masquerading) await query("UPDATE users SET password = $1 WHERE user_id = $2", [hashedPassword, user_id]);

    res.sendStatus(200);
  } catch (err) {
    log(error);
    res.status(500).send("Something went wrong.");
  }
}

module.exports = { userHandler, setPremiumHandler, setNameHandler, setEmailHandler, setPasswordHandler };
