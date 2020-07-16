const { log } = require("./log.js");
const { query } = require("./db.js");

async function classroomsHandler(req, res) {
  try {
    const { rows } = await query("SELECT * FROM classrooms ORDER BY classroom_id DESC");
    res.status(200).json({ rows });
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong with the classrooms handler.");
  }
}

async function classroomHandler(req, res) {
  try {
    const { rows } = await query("SELECT * FROM classrooms WHERE classroom_id = $1", [req.query.classroom_id]);
    res.status(200).json({ rows });
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong with the classroom handler.");
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

async function studentsHandler(req, res) {
  try {
    const { rows } = await query(
      "SELECT *" +
        "FROM users " +
        "INNER JOIN classroom_members ON user_id = member_id " +
        "WHERE classroom_id = $1 " +
        "ORDER BY name ASC",
      [req.query.classroom_id]
    );
    res.status(200).json({ rows });
  } catch (err) {
    log(err);
    res.status(500).send("There is a problem in the studentsHandler");
  }
}

async function ownerHandler(req, res) {
  try {
    const { rows } = await query(
      "SELECT *" +
        "FROM users " +
        "INNER JOIN classrooms ON user_id = classroom_owner " +
        "WHERE classroom_id = $1 " +
        "ORDER BY name ASC",
      [req.query.classroom_id]
    );
    res.status(200).json({ rows });
  } catch (err) {
    log(err);
    res.status(500).send("There is a problem in the ownerHandler");
  }
}

async function teachersHandler(req, res) {
  try {
    const { rows } = await query(
      "SELECT *" +
        "FROM users " +
        "INNER JOIN classroom_members ON user_id = member_id " +
        "WHERE classroom_id = $1 AND teacher = true " +
        "ORDER BY name ASC",
      [req.query.classroom_id]
    );
    res.status(200).json({ rows });
  } catch (err) {
    log(err);
    res.status(500).send("There is a problem in the teachersHandler");
  }
}

async function sectionsHandler(req, res) {
  try {
    const {
      rows,
    } = await query("SELECT section AS title FROM classroom_documents WHERE classroom_id = $1 GROUP BY section", [
      req.query.classroom_id,
    ]);
    res.status(200).json({ rows });
  } catch (err) {
    log(err);
    res.status(500).send("Something wrong happened while fetching sections from the database.");
  }
}

async function documentsHandler(req, res) {
  try {
    const { rows } = await query(
      "SELECT documents.document_id, title, author, classroom_documents.section " +
        "FROM documents " +
        "INNER JOIN classroom_documents ON documents.document_id = classroom_documents.document_id " +
        "WHERE classroom_id = $1",
      [req.query.classroom_id]
    );
    res.status(200).json({ rows });
  } catch (err) {
    log(err);
    res.status(500).send("There is a problem in the documentsHandler");
  }
}

async function createClassroom(req, res) {
  try {
    const { teacher, title, description, topic, open } = req.body;
    if (title.length < 1 || topic.length < 1) {
      log(`"Invalid document data ${title} ${topic}.`);
      res.status(400).send("Invalid classroom data.");
    }
    const {
      input,
    } = await query(
      "INSERT INTO classrooms (classroom_owner, title, description, topic, open) VALUES($1, $2, $3, $4, $5)",
      [teacher, title, description, topic, open]
    );
    const {
      rows,
    } = await query(
      "SELECT * FROM classrooms WHERE classroom_id = (SELECT MAX(classroom_id) AS LastClass FROM classrooms WHERE title = $1 AND topic = $2)",
      [title, topic]
    );
    res.status(201).json({ rows });
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

async function deleteClassroom(req, res) {
  try {
    const { classroom_id } = req.body;
    const { output } = await query("DELETE FROM classrooms WHERE classroom_id = $1", [classroom_id]);
    res.status(200).send("Classroom correctly deleted.");
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

async function deleteStudentFromClassroom(req, res) {
  try {
    const { classroom_id, student_id } = req.body;
    const { rows } = await query("DELETE FROM classroom_members WHERE classroom_id = $1 AND student_id = $2", [
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

module.exports = {
  classroomHandler,
  classroomsHandler,
  documentsHandler,
  sectionsHandler,
  studentsHandler,
  ownerHandler,
  teachersHandler,
  usersHandler,
  createClassroom,
  deleteClassroom,
  addStudentToClassroom,
  deleteStudentToClassroom: deleteStudentFromClassroom,
  addDocumentToClassroom,
};
