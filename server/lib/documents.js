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
    const { rows: documents } = await query("SELECT * FROM documents");
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
    const { publisher, title, author, description, category, isPublic, content } = req.body;
    const premium = true;
    if (title.length < 1 || author.length < 1) {
      log(`"Invalid document data ${title} ${author}.`);
      res.status(400).send("Invalid document upload.");
    }
    const {
      rows: [{ document_id }],
    } = await query(
      "INSERT INTO documents (publisher_id, title, author, description, category, public, premium, blocks) " +
        "VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING document_id",
      [publisher, title, author, description, category, isPublic, premium, content]
    );
    res.status(201).json(document_id);
    return document_id;
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

async function findWordId(req, res) {
  try {
    const word = req.query.word;
    const {
      rows: [word_id],
    } = await query("SELECT word_id FROM words WHERE words.word = $1", [word]);
    log("find word id: word ", word);
    log("find word id: word_id", word_id);
    res.status(200).json(word_id);
  } catch (e) {
    log(e);
    res.status(500).send("Something went wrong.");
  }
}

async function addNewWord(req, res) {
  try {
    const { newWord } = req.body;
    const ignore = false;
    const language = "english";
    const { word_id } = await query("INSERT INTO words(word, ignore, language) VALUES ($1, $2, $3) RETURNING word_id", [
      newWord,
      ignore,
      language,
    ]);
    res.status(200).json(word_id);
    //    return word_id;
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

async function addWordsToDocument(req, res) {
  try {
    const { document_id, word_id, frequency } = req.body;
    const {
      rows: documentWords,
    } = await query("INSERT INTO document_words(document_id, word_id, frequency) VALUES ($1,$2, $3)", [
      document_id,
      word_id,
      frequency,
    ]);
    res.status(200).json(documentWords);
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

module.exports = {
  documentHandler,
  usersHandler,
  dummyDataHandler,
  deleteDocument,
  addDocument,
  findWordId,
  addNewWord,
  addWordsToDocument,
};
