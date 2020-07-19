import React from "react";

import { api } from "../../utils";
import { toasts } from "../common/AppPage/AppPage";

export function deleteClassroom(classroomId, classroomDataFromDatabase, setClassroomDataFromDatabase) {
  const indexOfDeletedClassroom = indexOfClassroom(classroomId, classroomDataFromDatabase);
  api
    .deleteClassroom(classroomId)
    .then((res) => {
      setClassroomDataFromDatabase(
        classroomDataFromDatabase
          .slice(0, indexOfDeletedClassroom)
          .concat(classroomDataFromDatabase.slice(indexOfDeletedClassroom + 1))
      );
    })
    .catch((err) => console.log(err));
  toasts.toastSuccess("Classroom deleted!");
}

export function renameClassroom(classroomId, newTitle, classroomDataFromDatabase, setClassroomDataFromDatabase) {
  const indexOfRenamedClassroom = indexOfClassroom(classroomId, classroomDataFromDatabase);
  let classroomRenamed = classroomDataFromDatabase[indexOfRenamedClassroom];
  classroomRenamed.title = newTitle;
  api
    .renameClassroom(classroomId, newTitle)
    .then((res) => {
      setClassroomDataFromDatabase(
        classroomDataFromDatabase
          .slice(0, indexOfRenamedClassroom)
          .concat([classroomRenamed])
          .concat(classroomDataFromDatabase.slice(indexOfRenamedClassroom + 1))
      );
    })
    .catch((err) => console.log(err));
  toasts.toastSuccess("Classroom renamed!");
}

export function indexOfClassroom(classroomId, classrooms) {
  let output = 0;
  classrooms.forEach((classroom, index) => {
    if (classroom.classroom_id === classroomId) {
      output = index;
    }
  });
  return output;
}
