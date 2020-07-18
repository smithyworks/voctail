import React from "react";
import { api } from "../../utils";
import { toasts } from "../common/AppPage/AppPage";

export function indexOfStudent(studentId, students) {
  let output = 0;
  students.forEach((student, index) => {
    if (student.user_id === studentId) {
      output = index;
    }
  });
  return output;
}

export function addTeachers(classroomId, teacherId, classroomTeachersFromDatabase, setClassroomTeachersFromDatabase) {
  const addTeachersToThisClassroom = () => {
    api.addTeacherToClassroom(classroomId, teacherId).catch((err) => console.log(err));
  };
  addTeachersToThisClassroom();
  api
    .user(teacherId)
    .then((res) => {
      if (res) {
        setClassroomTeachersFromDatabase(classroomTeachersFromDatabase.concat([res.data]));
        toasts.toastSuccess("Teacher added to the classroom.");
      }
    })
    .catch((err) => console.log(err));
}

export function addStudents(classroomId, studentId, classroomStudentsFromDatabase, setClassroomStudentsFromDatabase) {
  const addStudentsToThisClassroom = () => {
    api.addStudentToClassroom(classroomId, studentId).catch((err) => console.log(err));
  };
  addStudentsToThisClassroom();
  api
    .user(studentId)
    .then((res) => {
      if (res) {
        setClassroomStudentsFromDatabase(classroomStudentsFromDatabase.concat([res.data]));
        toasts.toastSuccess("Student added to the classroom.");
      }
    })
    .catch((err) => console.log(err));
}

export function deleteStudent(classroomId, studentId, classroomStudentsFromDatabase, setClassroomStudentsFromDatabase) {
  const indexOfDeletedStudent = indexOfStudent(studentId, classroomStudentsFromDatabase);
  api
    .deleteStudentFromClassroom(classroomId, studentId)
    .then((res) => {
      setClassroomStudentsFromDatabase(
        classroomStudentsFromDatabase
          .slice(0, indexOfDeletedStudent)
          .concat(classroomStudentsFromDatabase.slice(indexOfDeletedStudent + 1))
      );
    })
    .catch((err) => console.log(err));
  toasts.toastSuccess("Student deleted!");
}

export function addDocuments(
  classroomId,
  documentId,
  section,
  classroomDocumentsFromDatabase,
  setClassroomDocumentsFromDatabase
) {
  const addDocumentsToThisClassroom = () => {
    api
      .addDocumentToClassroom(classroomId, documentId, section)
      .then((res) => {
        if (res) {
          setClassroomDocumentsFromDatabase(classroomDocumentsFromDatabase.concat([res.data.rows[0]]));
          toasts.toastSuccess("Document added to the classroom.");
        }
      })
      .catch((err) => console.log(err));
  };
  addDocumentsToThisClassroom();
}

export function getSections(classroomDocumentsFromDatabase) {
  let sections = [];
  classroomDocumentsFromDatabase.forEach((document) => {
    if (sections.indexOf(document.section) === -1) {
      sections.push(document.section);
    }
  });
  return sections;
}
