const { log } = require("./log.js");
const { query } = require("./db.js");

async function classroomHandler(req, res) {
  try {
    const { rows } = await query("SELECT * FROM classrooms");
    res.status(200).json({ rows });
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong with the classrooms handler.");
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

async function createClassroom(req, res) {
  try {
    const { title, description, topic, open } = req.body;
    if (title.length < 1 || topic.length < 1) {
      log(`"Invalid document data ${title} ${topic}.`);
      res.status(400).send("Invalid classroom data.");
    }
    const {
      rows: [classroom],
    } = await query(
      "INSERT INTO classrooms (classroom_id, classroom_owner, title, description, topic, open) VALUES($1, $2, $3, $4, $5, $6)",
      [title, description, topic, open]
    );
    res.status(201).send(`Successfully created classroom ${title}.`);
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

async function addStudentToClassroom(req, res) {
  try {
    const { classroom_id, student_id } = req.body;
    const { rows } = await query("INSERT INTO classroom_members (classroom_id, student_id) VALUES ($1,$2)", [
      classroom_id,
      student_id,
    ]);
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

async function addDocumentToClassroom(req, res) {
  try {
    const { classroom_id, document_id } = req.body;
    const { rows } = await query("INSERT INTO classroom_documents (classroom_id, document_id) VALUES ($1, $2)", [
      classroom_id,
      document_id,
    ]);
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

module.exports = { classroomHandler, usersHandler, createClassroom, addStudentToClassroom, addDocumentToClassroom };
