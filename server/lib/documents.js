const { log } = require("./log.js");
const { query } = require("./db.js");

async function documentHandler(req, res) {
  try {
    const { document_id } = req.body;
    const { user_id } = req.authData.user;

    const {
      rows: [document],
    } = await query("SELECT * FROM documents WHERE document_id = $1", [document_id]);

    const {
      rows: translations,
    } = await query(
      "SELECT documents_words.word_id, translations.translation_id, translations.translation \
         FROM documents_words \
           LEFT JOIN translations ON documents_words.word_id = translations.word_id \
         WHERE documents_words.document_id = $1;",
      [document_id]
    );
    document.translations = translations;

    const {
      rows: vocabulary,
    } = await query(
      "SELECT documents_words.word_id, words.word, documents_words.frequency, users_words.known \
         FROM documents_words \
           LEFT JOIN words ON documents_words.word_id = words.word_id \
           LEFT JOIN users_words ON documents_words.word_id = users_words.word_id AND users_words.user_id = $1 \
         WHERE documents_words.document_id = $2;",
      [user_id, document_id]
    );
    document.vocabulary = vocabulary;
    console.log(vocabulary.length);

    res.status(200).json(document);
  } catch (err) {
    log("documentHandler", err);
    res.status(500).send("Something went wrong.");
  }
}

async function dummyDataHandler(req, res) {
  try {
    const { rows: documents } = await query("SELECT * FROM documents ORDER BY title ASC");
    const { rows: newspaperArticles } = await query("SELECT * FROM documents WHERE category = 'Newspaper Article'");
    const { rows: fairyTales } = await query("SELECT * FROM documents WHERE category = 'Fairy Tale'");
    const { rows: shortStories } = await query("SELECT * FROM documents WHERE category = '(Short) Story'");
    const { rows: others } = await query("SELECT * FROM documents WHERE category = 'Others'");

    res.status(200).json({ documents, newspaperArticles, fairyTales, shortStories, others });
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong with the dummy documents.");
  }
}

async function deleteDocument(req, res) {
  try {
    const { document_id } = req.body;
    log("delete document", document_id);
    await query("DELETE FROM documents WHERE document_id = $1", [document_id]);
    res.sendStatus(200);
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

async function addDocument(req, res) {
  try {
    const { title, description, isPublic, content, author } = req.body;
    if (title.length < 1 || author.length < 1) {
      log(`"Invalid document data ${title} ${author}.`);
      res.status(400).send("Invalid document upload.");
    }
    const {
      rows: [documentData],
    } = await query(
      "INSERT INTO documents (title, description, isPublic, content, author) VALUES($1, $2, $3, $4, $5)",
      [title, description, isPublic, content, author]
    );
    res.status(201).send(`Successfully uploaded document ${title}.`);
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

async function usersHandler(req, res) {
  try {
    const { rows } = await query("SELECT * FROM users ORDER BY user_id ASC");
    res.status(200).json(rows);
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

module.exports = { documentHandler, usersHandler, dummyDataHandler, deleteDocument, addDocument };
