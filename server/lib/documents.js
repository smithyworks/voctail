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

async function documentDataHandler(req, res) {
  try {
    const { user_id } = req.authData.user;
    const { rows: documents } = await query("SELECT * FROM documents ORDER BY title ASC");
    const {
      rows: newspaperArticles,
    } = await query(
      "SELECT * FROM documents WHERE category = 'Newspaper Article' AND (public=true OR publisher_id = $1) ORDER BY title ASC",
      [user_id]
    );
    const {
      rows: fairyTales,
    } = await query(
      "SELECT * FROM documents WHERE category = 'Fairy Tale' AND (public=true OR publisher_id = $1) ORDER BY title ASC",
      [user_id]
    );
    const {
      rows: shortStories,
    } = await query(
      "SELECT * FROM documents WHERE category = '(Short) Story' AND (public=true OR publisher_id = $1) ORDER BY title ASC",
      [user_id]
    );
    const {
      rows: others,
    } = await query(
      "SELECT * FROM documents WHERE category = 'Others' AND (public=true OR publisher_id = $1) ORDER BY title ASC",
      [user_id]
    );
    const {
      rows: usersDocuments,
    } = await query("SELECT * FROM documents WHERE publisher_id = $1 ORDER BY document_id ASC", [user_id]);

    res.status(200).json({ documents, newspaperArticles, fairyTales, shortStories, others, usersDocuments });
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
  function clean(word) {
    try {
      word = word.replace(/[ \t\r\n]/g, "");
      return word
        .toLowerCase()
        .replace(/[.,;:"()?!><’‘”“`]/g, "")
        .replace(/[^a-z]s$/g, "")
        .replace(/(^'|'$)/g, "");
    } catch (err) {
      console.log(err);
      return "";
    }
  }
  function myIndexOf(arr, id) {
    for (let j = 0; j < arr.length; j++) {
      if (arr[j].wordId == id) return j;
    }
    return -1;
  }
  const premium = true;
  const newDocumentWords = [];
  let word_id = 0;
  let word = "";
  let frequency = 0;
  const ignore = false;
  const language = "english";

  try {
    log("in add document try block");
    const { publisher, title, author, description, category, isPublic, content, blocks } = req.body;

    log("req body done");
    const {
      rows: [{ document_id }],
    } = await query(
      "INSERT INTO documents (publisher_id, title, author, description, category, public, premium, blocks) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING document_id",
      [publisher, title, author, description, category, isPublic, premium, content]
    );

    log("insert into docs done");

    const contentData = blocks.map((b) => b.content).join(" ");
    const words = contentData
      .split(/\s/)
      .map((token) => clean(token))
      .filter((word) => word !== "");

    // go through all words from the new documents
    for (let wi = 0; wi < words.length; wi++) {
      word = words[wi];
      if (word === "") continue;
      // If the word doesn't exist, we need to add it to the database.

      const {
        // search for the word in the database
        rows,
      } = await query("SELECT word_id FROM words WHERE words.word = $1 AND words.language=$2", [word, language]);
      word_id = rows[0]?.word_id;
      if (word_id) {
        //word is already in database
        let index = myIndexOf(newDocumentWords, word_id);
        if (index >= 0) {
          // word is already in document words
          frequency = newDocumentWords[index].frequency;
          newDocumentWords[index] = { wordId: word_id, frequency: frequency + 1 };
        } else {
          //word is only in database, not in document words
          newDocumentWords.push({ wordId: word_id, frequency: 1 }); //added to new Document Words
        }
      } else {
        // word is not in database
        const {
          rows: words,
        } = await query("INSERT INTO words(word, ignore, language) VALUES ($1, $2, $3) RETURNING word_id", [
          word,
          ignore,
          language,
        ]);
        newDocumentWords.push({ wordId: words.word_id, frequency: 1 }); //added to new Document Words
      }
      frequency = 0;
    }
    log("inser into words done");

    for (let ndw = 0; ndw < newDocumentWords.length; ndw++) {
      const {
        documentWords,
      } = await query("INSERT INTO documents_words(document_id, word_id, frequency) VALUES ($1,$2, $3)", [
        document_id,
        newDocumentWords[ndw].wordId,
        newDocumentWords[ndw].frequency,
      ]);
    }
    log("insert into doc words done");

    res.status(200).json({ document_id });
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

async function editDocument(req, res) {
  try {
    const { document_id, title, author, description, category, isPublic } = req.body;
    log("id", document_id);
    log("title", title);
    log("author", author);
    log("description", description);
    log("categoryy", category);
    log("isPublic", isPublic);

    await query(
      "UPDATE documents SET title = $1, author = $2, description = $3, category = $4, public = $5  WHERE documents.document_id = $6 ",
      [title, author, description, category, isPublic, document_id]
    );
    res.status(200).send("Successfully edited your document.");
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

async function documentTitleHandler(req, res) {
  try {
    const { document_id } = req.query;

    const {
      rows: [{ title }],
    } = await query("SELECT title FROM documents WHERE document_id = $1", [document_id]);

    res.status(200).send(title);
  } catch (err) {
    log(err);
    res.status(500).send("Somethign went wrong.");
  }
}

module.exports = {
  documentHandler,
  usersHandler,
  documentDataHandler,
  deleteDocument,
  addDocument,
  editDocument,
  documentTitleHandler,
};
