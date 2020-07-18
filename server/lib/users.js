const { log } = require("./log.js");
const { query } = require("./db.js");
const bcrypt = require("bcrypt");
const fs = require("fs");

async function userHandler(req, res) {
  try {
    const { user_id: current_user_id, masquerading } = req.authData.user;
    const { user_id } = req.body;

    let uid = current_user_id;
    if (user_id) uid = user_id;

    const {
      rows: [userRecord],
    } = await query("SELECT user_id, name, email, admin, premium, profile_pic_url FROM users WHERE user_id = $1", [
      uid,
    ]);
    res.status(200).json({ ...userRecord, masquerading: !!masquerading });
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

async function allUsersHandler(req, res) {
  try {
    const { rows } = await query("SELECT user_id, name, email FROM users ORDER BY name ASC");
    res.status(200).json(rows);
  } catch (err) {
    log(err);
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
    log(err);
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
    log(err);
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
    log(err);
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
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

async function userVocabularyHandler(req, res) {
  try {
    const { user_id } = req.body;

    const {
      rows: vocabulary,
    } = await query(
      "SELECT users_words.word_id, words.word, users_words.known, users_words.certainty, users_words.encounters, users_words.last_seen \
        FROM users_words \
          LEFT JOIN words ON words.word_id = users_words.word_id \
        WHERE users_words.user_id = $1",
      [user_id]
    );

    res.status(200).json(vocabulary);
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

async function uploadProfilePictureHandler(req, res) {
  try {
    const { user_id } = req.authData.user;

    const {
      rows: [{ profile_pic_url }],
    } = await query("SELECT profile_pic_url FROM users WHERE user_id = $1", [user_id]);
    if (profile_pic_url) {
      try {
        fs.unlinkSync(profile_pic_url);
      } catch (err) {
        log(err);
      }
    }

    await query("UPDATE users SET profile_pic_url = $1 WHERE user_id = $2", [req.file.path, user_id]);

    res.sendStatus(201);
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

async function deleteProfilePictureHandler(req, res) {
  try {
    const { user_id } = req.authData.user;

    const {
      rows: [{ profile_pic_url }],
    } = await query("SELECT profile_pic_url FROM users WHERE user_id = $1", [user_id]);
    if (profile_pic_url) {
      try {
        fs.unlinkSync(profile_pic_url);
      } catch (err) {
        log(err);
      }
    }

    await query("UPDATE users SET profile_pic_url = NULL WHERE user_id = $1", [user_id]);

    res.sendStatus(201);
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

async function getUser(req, res) {
  try {
    const user_id = req.query.id;
    const { rows } = await query("SELECT users.name FROM users WHERE users.user_id = $1", [user_id]);
    res.status(200).json(rows);
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

module.exports = {
  userHandler,
  allUsersHandler,
  setPremiumHandler,
  setNameHandler,
  setEmailHandler,
  setPasswordHandler,
  userVocabularyHandler,
  uploadProfilePictureHandler,
  deleteProfilePictureHandler,
  getUser,
};
