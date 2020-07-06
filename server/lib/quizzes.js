const { log } = require("./log.js");
const { query } = require("./db.js");

/*JSONB for quizzes.questions : {vocabulary,suggestions,translation}
 * */

function shuffle(list) {
  var i, j, tmp;
  for (i = list.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * i);
    tmp = list[i];
    list[i] = list[j];
    list[j] = tmp;
  }
  return list;
}

function generateQuestions(wordList, transList, length) {
  /*uses transList to generate suggestions and find translation for each word in wordList
   *length is the desired quiz length
   * returns [{vocabulary,suggestions,translation},..]
   */

  //random suggestions
  const suggestionsList = shuffle(transList.map((v) => v.translation));
  const words = shuffle(wordList).slice(0, length);

  const len = suggestionsList.length;
  let i = 0;
  let questions = [];
  let suggestions = [];

  words.forEach((v) => {
    // choice: taking first translation - alt. random below - ideally users translation
    const translation = transList.filter((t) => v.word_id === t.word_id)[0].translation;
    //const translation = shuffle (translationList)[0].translation;
    suggestions = suggestionsList.slice((i * 3) % len, ((i + 1) * 3) % len);
    // ensures the correct translation is not added as suggestion
    if (suggestions.filter((v) => v === translation).length >= 1) {
      i++;
      suggestions = suggestionsList.slice((i * 3) % len, ((i + 1) * 3) % len);
    }
    i++;

    questions.push({
      vocabulary: v.word,
      suggestions: suggestions,
      translation: translation,
    });
  });

  return questions;
}

async function insertSQL(title, questions, user_id, document_id = null, is_day = false) {
  //insert quiz object - throws error
  const {
    rows: [{ quiz_id }],
  } = await query("INSERT INTO quizzes (title, questions, is_day) VALUES($1, $2, $3) RETURNING quiz_id", [
    title,
    JSON.stringify(questions),
    is_day,
  ]);

  //mod junction table
  await query("INSERT INTO users_quizzes (user_id, quiz_id) VALUES($1,$2)", [user_id, quiz_id]);

  if (document_id) {
    await query("INSERT INTO quizzes_documents (quiz_id, document_id) VALUES($1,$2)", [quiz_id, document_id]);
  }
  return quiz_id;
}

async function quizzesHandler(req, res) {
  try {
    const { user_id } = req.authData.user;
    const {
      rows: quizList,
    } = await query(
      "SELECT  quizzes.* FROM quizzes \
        INNER JOIN users_quizzes ON quizzes.quiz_id = users_quizzes.quiz_id \
        WHERE users_quizzes.user_id = $1",
      [user_id]
    );

    res.status(200).json({ quizList });
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

async function quizHandler(req, res) {
  try {
    const {
      rows: [quiz],
    } = await query("SELECT  quizzes.* FROM quizzes  WHERE quizzes.quiz_id = $1", [req.query.quiz_id]);

    res.status(200).json(quiz);
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

/*SELECT  quizzes.* FROM quizzes INNER JOIN quizzes_documents ON quizzes.quiz_id = quizzes_documents.quiz_id AND quizzes_documents.document_id = 2 INNER JOIN users_quizzes ON users_quizzes.quiz_id = quizzes.quiz_id AND users_quizzes.user_id = 1*/
async function quizByDocHandler(req, res) {
  try {
    const { user_id } = req.authData.user;
    const document_id = req.query.document_id;
    const {
      rows: quizList,
    } = await query(
      "SELECT  quizzes.* FROM quizzes INNER JOIN quizzes_documents \
        ON quizzes.quiz_id = quizzes_documents.quiz_id AND quizzes_documents.document_id = $1\
        INNER JOIN users_quizzes ON users_quizzes.quiz_id = quizzes.quiz_id AND users_quizzes.user_id = $2",
      [document_id, user_id]
    );

    res.status(200).json(quizList);
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

async function quizDeleteHandler(req, res) {
  try {
    const { user_id } = req.authData.user;
    const quiz_id = req.body.quiz_id;

    await query("DELETE FROM quizzes WHERE quiz_id = $1", [quiz_id]);
    res.status(200).send("Successful deletion of quiz with id " + quiz_id + ".");
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

// potentially think about a more sophisticated approach to determining suitable translations eg rank metric
async function createQuizHandler(req, res) {
  try {
    const { user_id } = req.authData.user;
    const length = req.body.length;
    const title = req.body.title;
    const { rows: entryList } = await query(
      //additional INNER JOIN with translations ensures translations exist
      "SELECT words.word, words.word_id, translations.translation FROM words INNER JOIN users_words ON words.word_id = users_words.word_id \
        INNER JOIN translations ON words.word_id = translations.word_id WHERE users_words.user_id = $1",
      [user_id]
    );
    const wordList = [];
    const transList = [];
    const included = [];
    entryList.forEach((v) => {
      if (!included.includes(v.word_id)) {
        included.push(v.word_id);
        wordList.push({ word: v.word, word_id: v.word_id });
        transList.push({ translation: v.translation, word_id: v.word_id });
      }
    });

    const questions = generateQuestions(wordList, transList, length);

    const quiz = await insertSQL(title, questions, user_id);

    res.status(200).json(quiz);
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

async function createQuizFromDocHandler(req, res) {
  try {
    const { user_id } = req.authData.user;
    const length = req.body.length;
    const document_id = req.body.document_id;

    const {
      rows: [document],
    } = await query("SELECT * FROM documents WHERE document_id=$1 ", [document_id]);

    const { rows: entryList } = await query(
      //for now df document_id 2 as boot strapped (DB) -> document_id=$1, user_id=$2, pass params document_id, user_id
      "SELECT words.word, words.word_id, translations.translation\
         FROM words INNER JOIN documents_words ON documents_words.word_id = words.word_id\
          AND documents_words.document_id = 2 \
         INNER JOIN  users_words ON users_words.word_id = words.word_id \
           AND users_words.user_id = $1 \
           INNER JOIN translations ON translations.word_id = words.word_id",
      [user_id]
    );

    const wordList = [];
    const transList = [];
    const included = [];
    entryList.forEach((v) => {
      if (!included.includes(v.word_id)) {
        included.push(v.word_id);
        wordList.push({ word: v.word, word_id: v.word_id });
        transList.push({ translation: v.translation, word_id: v.word_id });
      }
    });

    const questions = generateQuestions(wordList, transList, length);

    const quiz = await insertSQL(document.title, questions, user_id, document.document_id);

    res.status(200).json(quiz);
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

async function createCustomQuizHandler(req, res) {
  try {
    const { user_id } = req.authData.user;
    const questions = req.body.questions;
    const title = req.body.title;

    const quiz = await insertSQL(title, questions, user_id);

    res.status(200).json(quiz);
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

module.exports = {
  quizzesHandler,
  quizHandler,
  quizByDocHandler,
  quizDeleteHandler,
  createQuizHandler,
  createQuizFromDocHandler,
  createCustomQuizHandler,
};
