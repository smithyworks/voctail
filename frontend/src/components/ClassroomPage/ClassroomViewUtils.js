import React from "react";
import { api } from "../../utils";
import { toasts } from "../common/AppPage/AppPage";

export function indexOfMember(memberId, members) {
  let output = 0;
  members.forEach((member, index) => {
    if (member.user_id === memberId) {
      output = index;
    }
  });
  return output;
}

export function addMembers(
  classroomId,
  studentIds,
  areTeacher,
  classroomMembersFromDatabase,
  setClassroomMembersFromDatabase
) {
  api
    .addMembersToClassroom(classroomId, studentIds, areTeacher)
    .then((res) => {
      if (res) {
        setClassroomMembersFromDatabase(classroomMembersFromDatabase.concat(res.data.membersAdded));
      }
    })
    .catch((err) => console.log(err));
  toasts.toastSuccess((areTeacher ? "Teachers" : "Students") + " added to the classroom.");
}

export function deleteMember(classroomId, memberId, classroomMembersFromDatabase, setClassroomMembersFromDatabase) {
  const indexOfDeletedMember = indexOfMember(memberId, classroomMembersFromDatabase);
  api
    .deleteMemberFromClassroom(classroomId, memberId)
    .then((res) => {
      setClassroomMembersFromDatabase(
        classroomMembersFromDatabase
          .slice(0, indexOfDeletedMember)
          .concat(classroomMembersFromDatabase.slice(indexOfDeletedMember + 1))
      );
    })
    .catch((err) => console.log(err));
  toasts.toastSuccess("Member deleted!");
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