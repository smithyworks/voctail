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

export function rangeOfSection(classroomDocumentsFromDatabase, section) {
  let documentIds = [];
  for (let document of classroomDocumentsFromDatabase) {
    if (document.section === section) {
      documentIds.push(classroomDocumentsFromDatabase.indexOf(document));
    }
  }
  return documentIds;
}

export function updateRenameSection(classroomDocumentsFromDatabase, section, newTitle) {
  const range = rangeOfSection(classroomDocumentsFromDatabase, section);
  let localDocuments = classroomDocumentsFromDatabase.slice(range[0], range[range.length - 1] + 1);
  for (let i in localDocuments) {
    localDocuments[i].section = newTitle;
  }
  return localDocuments;
}

export function addMembers(
  classroomId,
  memberIds,
  areTeacher,
  classroomMembersFromDatabase,
  setClassroomMembersFromDatabase
) {
  api
    .addMembersToClassroom(classroomId, memberIds, areTeacher)
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

export function renameSection(
  classroomId,
  section,
  newTitle,
  classroomDocumentsFromDatabase,
  setClassroomDocumentsFromDatabase
) {
  const range = rangeOfSection(classroomDocumentsFromDatabase, section);
  api
    .renameSection(classroomId, section, newTitle)
    .then(() => {
      setClassroomDocumentsFromDatabase(
        classroomDocumentsFromDatabase
          .slice(0, range[0])
          .concat(updateRenameSection(classroomDocumentsFromDatabase, section, newTitle))
          .concat(classroomDocumentsFromDatabase.slice(range[range.length - 1] + 1))
      );
    })
    .catch((err) => console.log(err));
  toasts.toastSuccess("Section renamed!");
}

export function deleteSection(classroomId, section, classroomDocumentsFromDatabase, setClassroomDocumentsFromDatabase) {
  const range = rangeOfSection(classroomDocumentsFromDatabase, section);
  api
    .deleteSection(classroomId, section)
    .then(() => {
      setClassroomDocumentsFromDatabase(
        classroomDocumentsFromDatabase
          .slice(0, range[0])
          .concat(classroomDocumentsFromDatabase.slice(range[range.length - 1] + 1))
      );
    })
    .catch((err) => console.log(err));
  toasts.toastSuccess("Section deleted!");
}
