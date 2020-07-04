const { log } = require("./log.js");
const { query } = require("./db.js");

async function quizzesHandler(req, res) {
  try {
    const { user_id } = req.authData.user;
    const { rows: quizList } = await query(
      "SELECT  quizzes.* FROM quizzes " +
        "INNER JOIN users_quizzes ON quizzes.quiz_id = users_quizzes.quiz_id " +
        "INNER JOIN users on users.user_id = users_quizzes.user_id WHERE users.user_id = $1",
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
    } = await query(
      "SELECT  quizzes.* FROM quizzes  WHERE quizzes.quiz_id = $1",
      /*"INNER JOIN users_quizzes ON quizzes.quiz_id = users_quizzes.quiz_id " +
        "INNER JOIN users on users.user_id = users_quizzes.user_id WHERE quizzes.quiz_id = $1",*/
      [req.query.quiz_id]
    );

    res.status(200).json(quiz);
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

module.exports = { quizzesHandler, quizHandler };
