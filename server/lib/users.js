const { log } = require("./log.js");
const { query } = require("./db.js");

async function userHandler(req, res) {
  try {
    const { user_id } = req.authData.user;
    const {
      rows: [userRecord],
    } = await query("SELECT user_id, name, email FROM users WHERE user_id = $1", [user_id]);
    res.status(200).json(userRecord);
  } catch (err) {
    log(error);
    res.status(500).send("Something went wrong.");
  }
}

async function usersHandler(req, res) {
  try {
    const { rows } = await query("SELECT user_id, name, email FROM users ORDER BY user_id ASC");
    res.status(200).json(rows);
  } catch (err) {
    log(error);
    res.status(500).send("Something went wrong.");
  }
}

module.exports = { usersHandler, userHandler };
