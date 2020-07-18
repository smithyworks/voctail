const { log } = require("./log.js");
const { query } = require("./db.js");

async function updateUserVocabHandler(req, res) {
  try {
    const { entries } = req.body;
    const { user_id } = req.authData.user;

    for (let i = 0; i < entries.length; i++) {
      const { word_id, known, certainty } = entries[i];

      const {
        rows: [record],
      } = await query("SELECT * FROM users_words WHERE word_id = $1", [word_id]);

      if (record) {
        if (record.known === !!known) {
          const newCertainty = record.certainty ? record.certainty + 1 : 1;
          await query(
            "UPDATE users_words SET certainty = $1, encounters = encounters + 1, last_seen = NOW() WHERE word_id = $2 AND user_id = $3",
            [newCertainty, word_id, user_id]
          );
        } else {
          const newCertainty = certainty ?? 1;
          await query(
            "UPDATE users_words SET known = $1, certainty = $2, encounters = encounters + 1, last_seen = NOW() WHERE word_id = $3 AND user_id = $4",
            [!!known, newCertainty, word_id, user_id]
          );
        }
      } else {
        const newCertainty = certainty ?? 1;
        await query(
          "INSERT INTO users_words (user_id, word_id, known, certainty, encounters, last_seen) VALUES ($1, $2, $3, $4, 1, NOW())",
          [user_id, word_id, !!known, newCertainty]
        );
      }
    }

    return res.sendStatus(200);
  } catch (err) {
    log("updateUserVocabHandler", err);
    return res.status(500).send("Something went wrong.");
  }
}

async function addTranslationHandler(req, res) {
  try {
    const { word_id, translation } = req.body;
    const { user_id } = req.authData.user;

    await query(
      "INSERT INTO translations (word_id, translation, contributor_id, language, approved) VALUES ($1, $2, $3, 'german', false)",
      [word_id, translation, user_id]
    );

    res.sendStatus(201);
  } catch (err) {
    log("addTranslationHandler", err);
    res.sendStatus(500);
  }
}

module.exports = { updateUserVocabHandler, addTranslationHandler };
