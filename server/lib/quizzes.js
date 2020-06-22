const { log } = require("./log.js");
const { query } = require("./db.js");

async function quizzesHandler(req, res) {
  //log("quizzesHandler called");
  try {
    //log("quizzesHandler called");
    //const { user_id, } = req.authData.user;
    //log(user_id)
    const { rows } = await query("SELECT * FROM users ORDER BY user_id ASC");
    //INNER JOIN users_quizzes ON quizzes.quiz_id = users_quizzes.quiz_id INNER JOIN users on users.user_id = users_quizzes.user_id WHERE users.user_id = 1
    //const { data }= await query("SELECT  quizzes.* FROM quizzes ");
    /*"INNER JOIN users_quizzes ON quizzes.quiz_id = users_quizzes.quiz_id " +
        "INNER JOIN users on users.user_id = users_quizzes.user_id WHERE users.user_id = $1", [user_id]);
        */
    //log(data);
    res.status(200).json({ rows });
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

module.exports = { quizzesHandler, usersHandler };
