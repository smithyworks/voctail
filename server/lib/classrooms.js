const { log } = require("./log.js");
const { query } = require("./db.js");

async function addDocumentsHandler(req, res) {
  try {
    const { classroom_id, section, document_ids } = req.body;

    for (let i = 0; i < document_ids; i++) {
      const id = document_ids[i];
      await query("INSERT INTO classroom_documents (classroom_id, document_id, section) VALUES ($1,$2,$3)", [
        classroom_id,
        id,
        section,
      ]);
    }

    res.sendStatus(200);
  } catch (err) {
    log(err);
    res.sendStatus(500);
  }
}

async function deleteChapterHandler(req, res) {
  try {
    const { classroom_id, name } = req.body;
    await query("UPDATE classroom_documents SET section = NULL WHERE section = $1 AND classroom_id = $2", [
      name,
      classroom_id,
    ]);
    await query("DELETE FROM classroom_documents WHERE document_id IS NULL AND section IS NULL AND classroom_id = $1", [
      classroom_id,
    ]);
    res.sendStatus(200);
  } catch (err) {
    log(err);
    res.sendStatus(500);
  }
}

async function renameChapterHandler(req, res) {
  try {
    const { classroom_id, name, newName } = req.body;
    await query("UPDATE classroom_documents SET section = $1 WHERE section = $2 AND classroom_id = $3", [
      newName,
      name,
      classroom_id,
    ]);
    res.sendStatus(200);
  } catch (err) {
    log(err);
    res.sendStatus(500);
  }
}

async function removeDocumentHandler(req, res) {
  try {
    const { classroom_id, document_id } = req.body;
    await query("DELETE FROM classroom_documents WHERE document_id = $1 AND classroom_id = $2", [
      document_id,
      classroom_id,
    ]);
    res.sendStatus(200);
  } catch (err) {
    log(err);
    res.sendStatus(500);
  }
}

async function addChapterHandler(req, res) {
  try {
    const { classroom_id, name } = req.body;

    await query("INSERT INTO classroom_documents (classroom_id, section) VALUES ($1, $2)", [classroom_id, name]);

    res.sendStatus(200);
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong with the classrooms handler.");
  }
}

async function classroomsHandler(req, res) {
  try {
    const { user_id } = req.authData.user;

    const { rows: public_classrooms } = await query("SELECT * FROM classrooms ORDER BY classroom_id DESC");
    const {
      rows: student_classrooms,
    } = await query(
      "SELECT classrooms.* FROM classroom_members LEFT JOIN classrooms ON classroom_members.classroom_id = classrooms.classroom_id WHERE classroom_members.member_id = $1 AND teacher = false ORDER BY classroom_id DESC",
      [user_id]
    );

    const {
      rows: teacher_classrooms_ids,
    } = await query(
      "SELECT classroom_id FROM classroom_members WHERE member_id = $1 AND teacher = true ORDER BY classroom_id DESC",
      [user_id]
    );
    const taught_classroom_ids = teacher_classrooms_ids.map((c) => c.classroom_id);

    const {
      rows: teacher_classrooms,
    } = await query("SELECT * FROM classrooms WHERE classroom_id = ANY($1) OR classroom_owner = $2", [
      taught_classroom_ids,
      user_id,
    ]);

    const administered_classroom_ids = teacher_classrooms.map((c) => c.classroom_id);

    res.status(200).json({ public_classrooms, teacher_classrooms, student_classrooms, administered_classroom_ids });
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong with the classrooms handler.");
  }
}

async function addMembersHandler(req, res) {
  try {
    const { classroom_id, teacher_ids, student_ids } = req.body;

    if (teacher_ids) {
      for (let i = 0; i < teacher_ids.length; i++) {
        const id = teacher_ids[i];
        await query("INSERT INTO classroom_members (classroom_id, member_id, teacher) VALUES ($1, $2, true)", [
          classroom_id,
          id,
        ]);
      }
    }

    if (student_ids) {
      for (let i = 0; i < student_ids.length; i++) {
        const id = student_ids[i];
        await query("INSERT INTO classroom_members (classroom_id, member_id, teacher) VALUES ($1, $2, false)", [
          classroom_id,
          id,
        ]);
      }
    }

    res.sendStatus(200);
  } catch (err) {
    log(err);
    res.sendStatus(500);
  }
}

async function removeMemberHandler(req, res) {
  try {
    const { classroom_id, member_id } = req.body;
    await query("DELETE FROM classroom_members WHERE member_id = $1 AND classroom_id = $2", [member_id, classroom_id]);
    res.sendStatus(200);
  } catch (err) {
    log(err);
    res.sendStatus(500);
  }
}

async function classroomsAsStudentHandler(req, res) {
  try {
    const {
      rows,
    } = await query(
      "SELECT * FROM classroom_members INNER JOIN classrooms ON classrooms.classroom_id=classroom_members.classroom_id WHERE member_id = $1 AND teacher = false ORDER BY classrooms.classroom_id DESC",
      [req.query.member_id]
    );
    res.status(200).json({ rows });
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong with the classrooms handler.");
  }
}

async function classroomsAsTeacherHandler(req, res) {
  try {
    const {
      rows,
    } = await query(
      "SELECT * FROM classroom_members INNER JOIN classrooms ON classrooms.classroom_id=classroom_members.classroom_id WHERE member_id = $1 AND teacher = true ORDER BY classrooms.classroom_id DESC",
      [req.query.member_id]
    );
    res.status(200).json({ rows });
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong with the classrooms handler.");
  }
}

async function classroomHandler(req, res) {
  try {
    const { classroom_id } = req.body;

    const {
      rows: [classroom],
    } = await query("SELECT * FROM classrooms WHERE classroom_id = $1", [classroom_id]);

    const {
      rows: students,
    } = await query(
      "SELECT users.* FROM classroom_members LEFT JOIN users ON classroom_members.member_id = users.user_id WHERE classroom_members.classroom_id = $1 AND classroom_members.teacher = false",
      [classroom_id]
    );
    classroom.students = students;

    const {
      rows: teachers,
    } = await query(
      "SELECT users.* FROM classroom_members LEFT JOIN users ON classroom_members.member_id = users.user_id WHERE classroom_members.classroom_id = $1 AND classroom_members.teacher = true",
      [classroom_id]
    );
    classroom.teachers = teachers;

    const {
      rows: [owner],
    } = await query("SELECT * from users WHERE user_id = $1", [classroom.classroom_owner]);
    classroom.owner = owner;

    if (!teachers.find((t) => t.user_id === owner.user_id)) teachers.push(owner);

    const {
      rows: documents,
    } = await query(
      "SELECT classroom_documents.section AS chapter, documents.* FROM classroom_documents LEFT JOIN documents ON documents.document_id = classroom_documents.document_id WHERE classroom_documents.classroom_id = $1",
      [classroom_id]
    );

    classroom.documents = documents;
    classroom.chapters = [...new Set(documents.map((d) => d.chapter))];

    res.status(200).json(classroom);
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong with the classroom handler.");
  }
}

async function isTeacher(req, res) {
  try {
    const { rows } = await query(
      "SELECT teacher FROM classroom_members " + "WHERE classroom_id = $1 AND member_id = $2",
      [req.query.classroom_id, req.query.member_id]
    );
    res.status(200).json({ rows });
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong with the isTeacher request.");
  }
}

async function studentsHandler(req, res) {
  try {
    const { rows } = await query(
      "SELECT *" +
        "FROM users " +
        "INNER JOIN classroom_members ON user_id = member_id " +
        "WHERE classroom_id = $1 AND teacher = false " +
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
    if (req.query.document_id != 0) {
      console.log(req.query.document_id);
      const {
        rows,
      } = await query(
        "SELECT documents.document_id, title, author, category, classroom_documents.section " +
          "FROM documents " +
          "INNER JOIN classroom_documents ON documents.document_id = classroom_documents.document_id " +
          "WHERE classroom_id = $1 AND classroom_documents.document_id = $2 ORDER BY classroom_documents.section ASC",
        [req.query.classroom_id, req.query.document_id]
      );
      res.status(200).json({ rows });
    } else {
      const {
        rows,
      } = await query(
        "SELECT documents.document_id, title, author, category, classroom_documents.section " +
          "FROM documents " +
          "INNER JOIN classroom_documents ON documents.document_id = classroom_documents.document_id " +
          "WHERE classroom_id = $1 ORDER BY classroom_documents.section ASC",
        [req.query.classroom_id]
      );
      res.status(200).json({ rows });
    }
  } catch (err) {
    log(err);
    res.status(500).send("There is a problem in the documentsHandler");
  }
}

async function createClassroom(req, res) {
  try {
    const { user_id } = req.authData.user;
    const { title, description, topic } = req.body;

    if (title.length < 1 || topic.length < 1) {
      log(`"Invalid document data ${title} ${topic}.`);
      res.status(400).send("Invalid classroom data.");
    }

    await query(
      "INSERT INTO classrooms (classroom_owner, title, description, topic, open) VALUES($1, $2, $3, $4, $5)",
      [user_id, title, description, topic, true]
    );

    res.sendStatus(201);
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

async function deleteSection(req, res) {
  try {
    const { classroom_id, section } = req.body;
    const { output } = await query("DELETE FROM classroom_documents WHERE classroom_id = $1 AND section = $2", [
      classroom_id,
      section,
    ]);
    res.status(200).send("Section correctly deleted.");
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

async function renameClassroom(req, res) {
  try {
    const { classroom_id, new_title } = req.body;
    const { output } = await query("UPDATE classrooms SET title = $2 WHERE classroom_id = $1", [
      classroom_id,
      new_title,
    ]);
    res.status(200).send("Classroom correctly renamed.");
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

async function renameSection(req, res) {
  try {
    const { classroom_id, section, new_title } = req.body;
    const {
      output,
    } = await query("UPDATE classroom_documents SET section = $2 WHERE classroom_id = $1 AND section = $3", [
      classroom_id,
      new_title,
      section,
    ]);
    res.status(200).send("Section successfully renamed.");
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

async function addMembersToClassroom(req, res) {
  const membersAdded = [];
  try {
    const { classroom_id, member_ids, is_teacher } = req.body;
    for (let member_id of member_ids) {
      //Check if the member is not already registered
      const {
        rows: isMember,
      } = await query("SELECT member_id FROM classroom_members WHERE classroom_id = $1 AND member_id = $2", [
        classroom_id,
        member_id,
      ]);
      if (isMember.length == 0) {
        const {
          input,
        } = await query("INSERT INTO classroom_members (classroom_id, member_id, teacher) VALUES ($1, $2, $3)", [
          classroom_id,
          member_id,
          is_teacher,
        ]);
        const { rows: newMember } = await query("SELECT * FROM users WHERE user_id = $1", [member_id]);
        membersAdded.push(newMember[0]);
      }
    }
    res.status(201).json({ membersAdded });
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

async function deleteMemberFromClassroom(req, res) {
  try {
    const { classroom_id, member_id } = req.body;
    const { rows } = await query("DELETE FROM classroom_members WHERE classroom_id = $1 AND member_id = $2", [
      classroom_id,
      member_id,
    ]);
    res.status(200).send("Member correctly deleted.");
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

async function addDocumentToClassroom(req, res) {
  try {
    const { classroom_id, document_id, section } = req.body;
    const {
      input,
    } = await query("INSERT INTO classroom_documents (classroom_id, document_id, section) VALUES ($1, $2, $3)", [
      classroom_id,
      document_id,
      section,
    ]);
    const { rows } = await query(
      "SELECT documents.document_id, title, author, category, classroom_documents.section " +
        "FROM documents " +
        "INNER JOIN classroom_documents ON documents.document_id = classroom_documents.document_id " +
        "WHERE classroom_id = $1 AND classroom_documents.document_id = $2 ORDER BY classroom_documents.section ASC",
      [classroom_id, document_id]
    );
    res.status(201).json({ rows });
  } catch (err) {
    log(err);
    res.status(500).send("Something went wrong.");
  }
}

module.exports = {
  classroomHandler,
  classroomsHandler,
  addMembersHandler,
  classroomsAsStudentHandler,
  classroomsAsTeacherHandler,
  isTeacher,
  documentsHandler,
  sectionsHandler,
  studentsHandler,
  ownerHandler,
  teachersHandler,
  createClassroom,
  deleteClassroom,
  deleteSection,
  renameClassroom,
  renameSection,
  addMembersToClassroom,
  deleteMemberFromClassroom,
  addDocumentToClassroom,
  addChapterHandler,
  removeMemberHandler,
  removeDocumentHandler,
  deleteChapterHandler,
  renameChapterHandler,
  addDocumentsHandler,
};
