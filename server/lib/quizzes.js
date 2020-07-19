const { log } = require("./log.js");
const { query } = require("./db.js");

/*JSONB for quizzes.questions : {vocabulary,suggestions,translation}
 * JSONB for users_quizzes.metrics: date: {wrong, taken, total, percentageTaken, percentageTotal, unknowns}
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
  //limit to length question items
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

async function insertSQL(title, questions, user_id, { ...props }) {
  //document_id = null, is_day = false, is_custom=false) {
  //insert quiz object - throws error
  const document_id = props.document_id ? props.document_id : null;
  const is_day = props.is_day ? true : false;
  const is_custom = props.is_custom ? true : false;

  const {
    rows: [{ quiz_id }],
  } = await query(
    "INSERT INTO quizzes (title, questions, is_day, is_custom, created) \
      VALUES($1, $2, $3, $4, NOW()) RETURNING quiz_id",
    [title, JSON.stringify(questions), is_day, is_custom]
  );

  //mod junction table
  await query("INSERT INTO users_quizzes (user_id, quiz_id) VALUES($1,$2)", [user_id, quiz_id]);

  if (document_id) {
    await query("INSERT INTO quizzes_documents (quiz_id, document_id) VALUES($1,$2)", [quiz_id, document_id]);
  }
  return quiz_id;
}

async function fetchMetrics(user_id, quiz_id) {
  let {
    rows: [{ best_run, metrics }],
  } = await query(
    "SELECT  best_run, metrics FROM users_quizzes  WHERE users_quizzes.quiz_id = $1 \
        AND users_quizzes.user_id=$2 ",
    [quiz_id, user_id]
  );

  const bestRun = best_run === null ? 0 : best_run;
  metrics = metrics === null ? {} : metrics;
  return { bestRun, metrics };
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

//fetch all quizzes that are created from documents
async function quizCategoryHandler(req, res) {
  /*if desired deal with null last_seen, created values via 'NULLS LAST|FIRST' when sorting */
  try {
    const { user_id } = req.authData.user;
    const {
      rows: quizDocuments,
    } = await query(
      "SELECT  quizzes.*, users_quizzes.last_seen FROM quizzes \
    INNER JOIN users_quizzes ON users_quizzes.quiz_id = quizzes.quiz_id AND users_quizzes.user_id = $1\
    INNER JOIN quizzes_documents \
        ON quizzes_documents.quiz_id = quizzes.quiz_id \
        ORDER BY COALESCE(users_quizzes.last_seen, quizzes.created) DESC",
      [user_id]
    );

    const {
      rows: quizCustom,
    } = await query(
      "SELECT  quizzes.*, users_quizzes.last_seen FROM quizzes \
    INNER JOIN users_quizzes ON users_quizzes.quiz_id = quizzes.quiz_id AND users_quizzes.user_id = $1\
    WHERE quizzes.is_custom = true\
    ORDER BY COALESCE(users_quizzes.last_seen, quizzes.created) DESC",
      [user_id]
    );

    const {
      rows: quizChallenges,
    } = await query(
      "SELECT  quizzes.*, users_quizzes.last_seen FROM quizzes \
    INNER JOIN users_quizzes ON users_quizzes.quiz_id = quizzes.quiz_id AND users_quizzes.user_id = $1\
    WHERE quizzes.is_day = true\
    ORDER BY COALESCE(users_quizzes.last_seen, quizzes.created) DESC",
      [user_id]
    );

    const {
      rows: quizzes,
    } = await query(
      "SELECT  quizzes.*, users_quizzes.last_seen FROM quizzes \
    INNER JOIN users_quizzes ON users_quizzes.quiz_id = quizzes.quiz_id AND users_quizzes.user_id = $1\
    ORDER BY COALESCE(users_quizzes.last_seen, quizzes.created) DESC",
      [user_id]
    );

    const nonRandom = quizChallenges
      .map((v) => v.quiz_id)
      .concat(quizCustom.map((v) => v.quiz_id).concat(quizDocuments.map((v) => v.quiz_id)));
    const quizRandom = [];
    quizzes.forEach((v) => {
      if (!nonRandom.includes(v.quiz_id)) {
        quizRandom.push(v);
      }
    });

    res.status(200).json({ quizChallenges, quizCustom, quizRandom, quizDocuments });
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

async function renameQuizHandler(req, res) {
  try {
    const quiz_id = req.body.quiz_id;
    const title = req.body.title;
    await query("UPDATE quizzes SET title = $1 WHERE quizzes.quiz_id=$2", [title, quiz_id]);
    res.status(200).send("Successful update of quiz title with id " + quiz_id + ".");
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

async function viewedNowQuizHandler(req, res) {
  try {
    const { user_id } = req.authData.user;
    const quiz_id = req.body.quiz_id;
    await query(
      "UPDATE users_quizzes SET last_seen = NOW() WHERE users_quizzes.quiz_id=$1 \
        AND users_quizzes.user_id=$2",
      [quiz_id, user_id]
    );
    res.status(200).send("Successful update of quiz with id " + quiz_id + ".");
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

async function updateMetricsQuizHandler(req, res) {
  try {
    const { user_id } = req.authData.user;
    const quiz_id = req.body.quiz_id;
    const results = req.body.results;

    let { bestRun, metrics } = await fetchMetrics(user_id, quiz_id);

    metrics[new Date(Date.now())] = results;
    bestRun = results.percentageTotal > bestRun ? results.percentageTotal : bestRun;

    await query(
      "UPDATE users_quizzes SET best_run=$1, metrics=$2 WHERE users_quizzes.quiz_id=$3 \
        AND users_quizzes.user_id=$4 ",
      [bestRun, metrics, quiz_id, user_id]
    );
    res
      .status(200)
      .send("Successful update of quiz metrics for user with id " + user_id + "and quiz with id " + quiz_id + ".");
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

async function viewMetricsHandler(req, res) {
  try {
    const { user_id } = req.authData.user;
    const quiz_id = req.query.quiz_id;

    let { bestRun, metrics } = await fetchMetrics(user_id, quiz_id);

    const metricKeys = Object.keys(metrics)
      .map((v) => new Date(v))
      .sort()
      .reverse();
    metrics = metricKeys.map((v) => {
      return { date: v, ...metrics[v] };
    });

    res.status(200).json({ bestRun, metrics });
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

async function quizzesMetricsHandler(req, res) {
  //wrong, taken, total, percentageTaken, percentageTotal, unknowns
  try {
    const { user_id } = req.query;

    //sorted by date desc - only taken quizzes appear -> metrics != null as well
    const {
      rows: quizList,
    } = await query(
      "SELECT  users_quizzes.metrics, quizzes.* FROM users_quizzes INNER JOIN quizzes ON users_quizzes.user_id=$1\
        AND users_quizzes.quiz_id=quizzes.quiz_id WHERE users_quizzes.last_seen IS NOT NULL \
        ORDER BY users_quizzes.last_seen DESC",
      [user_id]
    );

    // for each quiz:
    // - filter for completed taken=total
    // - sort by date
    // - determine best
    // -> return last,best
    let quizResults = [];
    let bestResult = undefined;
    let lastResult = undefined;
    quizList.forEach((q) => {
      bestResult = undefined;
      lastResult = undefined;
      for (const [k, v] of Object.entries(q.metrics)) {
        if (v.taken === v.total) {
          if (!lastResult || lastResult.date < k) {
            lastResult = { date: k, ...v };
          }
          if (!bestResult || bestResult.wrong > v.wrong) {
            bestResult = { date: k, ...v };
          }
        }
      }
      if (lastResult && bestResult) {
        quizResults.push({ lastResult, bestResult, ...q });
      }
    });

    res.status(200).json(quizResults);
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

function generateFromWordList(words, length) {
  const wordList = [];
  const transList = [];
  const included = [];
  const unknown = [];

  words.forEach((v) => {
    if (!included.includes(v.word_id)) {
      included.push(v.word_id);
      wordList.push({ word: v.word, word_id: v.word_id });
      transList.push({ translation: v.translation, word_id: v.word_id });
      if (!v.known) {
        // sage indices of unknown
        unknown.push(included.length - 1);
      }
    }
  });

  // if enough words unknown use unknown words only else fallback on all words
  const questions =
    unknown.length >= length
      ? generateQuestions(
          wordList.filter((v, i) => unknown.includes(i)),
          transList.filter((v, i) => unknown.includes(i)),
          length
        )
      : generateQuestions(wordList, transList, length);
  return questions;
}

async function createQuizHandler(req, res) {
  try {
    const { user_id } = req.authData.user;
    const length = req.body.length;
    const title = req.body.title;
    const { rows: entryList } = await query(
      //additional INNER JOIN with translations ensures translations exist
      "SELECT words.word, words.word_id, translations.translation, users_words.known FROM words \
        INNER JOIN users_words ON words.word_id = users_words.word_id \
        INNER JOIN translations ON words.word_id = translations.word_id WHERE users_words.user_id = $1",
      [user_id]
    );
    const questions = generateFromWordList(entryList, length);
    const quiz = await insertSQL(title, questions, user_id, {});

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
      "SELECT words.word, words.word_id, translations.translation, users_words.known\
         FROM words INNER JOIN documents_words ON documents_words.word_id = words.word_id\
          AND documents_words.document_id = 2 \
         INNER JOIN  users_words ON users_words.word_id = words.word_id \
           AND users_words.user_id = $1 \
           INNER JOIN translations ON translations.word_id = words.word_id",
      [user_id]
    );

    const questions = generateFromWordList(entryList, length);

    //check number of quizzes with this title
    //fetch all quizzes by this user created for the document with the document_id
    const {
      rows: quizList,
    } = await query(
      "SELECT users_quizzes.quiz_id FROM users_quizzes \
    INNER JOIN quizzes ON quizzes.quiz_id=users_quizzes.quiz_id \
    INNER JOIN quizzes_documents ON quizzes_documents.quiz_id=quizzes.quiz_id \
    WHERE users_quizzes.user_id=$1 AND quizzes_documents.document_id=$2",
      [user_id, document_id]
    );

    const format_title = (title, len) => (len > 0 ? title + " (" + len + ")" : title);

    const quiz = await insertSQL(format_title(document.title, quizList.length), questions, user_id, {
      document_id: document.document_id,
    });

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
    const is_custom = true;
    const quiz = await insertSQL(title, questions, user_id, { is_custom });

    res.status(200).json(quiz);
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

async function quizTitleHandler(req, res) {
  try {
    const { quiz_id } = req.query;

    const {
      rows: [{ title }],
    } = await query("SELECT title FROM quizzes WHERE quiz_id = $1", [quiz_id]);

    res.status(200).send(title);
  } catch (err) {
    log(err);
    res.status(500).send("Somethign went wrong.");
  }
}

module.exports = {
  quizzesHandler,
  quizHandler,
  quizByDocHandler,
  quizCategoryHandler,
  quizzesMetricsHandler,
  quizDeleteHandler,
  createQuizHandler,
  renameQuizHandler,
  createQuizFromDocHandler,
  createCustomQuizHandler,
  viewedNowQuizHandler,
  updateMetricsQuizHandler,
  viewMetricsHandler,
  quizTitleHandler,
};
