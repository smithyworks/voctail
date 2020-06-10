const { log } = require("./log.js");
const { query } = require("./db.js");

async function userHandler(req, res) {
  try {
    const { user_id, masquerading } = req.authData.user;
    const {
      rows: [userRecord],
    } = await query("SELECT user_id, name, email, admin FROM users WHERE user_id = $1", [user_id]);
    res.status(200).json({ ...userRecord, masquerading: !!masquerading });
  } catch (err) {
    log(error);
    res.status(500).send("Something went wrong.");
  }
}

module.exports = { userHandler };
