import React, { useState, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import { api } from "../../utils";
import { AppPage, ClassroomSection, UserTile, PlaceholderTile } from "../common";
import { timeParser, isConnected } from "../../utils/parsers";
import InviteMembersDialog from "../common/InviteMembersDialog";
import ChapterDialog from "./ChapterDialog";
import Chapter from "./Chapter";
import { toasts } from "../common/AppPage/AppPage";

function ClassroomPage() {
  const { params } = useRouteMatch();

  const [classroom, setClassroom] = useState();

  const [count, setCount] = useState(0);
  const reload = () => setCount(count + 1);
  useEffect(() => {
    api.fetchClassroom(params.classroom_id).then((res) => setClassroom(res.data));
  }, [count]);
  console.log(classroom);

  const [addStudentDialogOpen, setAddStudentDialogOpen] = useState(false);
  const [addTeacherDialogOpen, setAddTeacherDialogOpen] = useState(false);
  const [addChapterDialogOpen, setAddChapterDialogOpen] = useState(false);

  function addTeachers(ids) {
    setAddTeacherDialogOpen(false);
    api.addTeachersToClassroom(classroom.classroom_id, ids).then(reload);
  }
  function addStudents(ids) {
    setAddStudentDialogOpen(false);
    api.addStudentsToClassroom(classroom.classroom_id, ids).then(reload);
  }
  function addChapter(name) {
    setAddChapterDialogOpen(false);
    api.addChapterToClassroom(classroom.classroom_id, name).then(reload);
  }
  function removeMember(id) {
    if (classroom.owner.user !== id) {
      api.removeClassroomMember(classroom.classroom_id, id).then(reload);
    } else toasts.toastError("Cannot remove the classroom owner!");
  }

  if (!classroom) return <AppPage />;

  return (
    <AppPage>
      <div>
        <ClassroomSection title="Teachers" hasAddButton onAdd={() => setAddTeacherDialogOpen(true)}>
          {classroom.teachers.map((u, i) => (
            <UserTile
              key={i}
              user={u}
              tooltipTitle={timeParser(u.last_seen)}
              connected={isConnected(u.last_seen)}
              isMemberTeacher={true}
            />
          ))}
        </ClassroomSection>
        <InviteMembersDialog
          open={addTeacherDialogOpen}
          onClose={() => setAddTeacherDialogOpen(false)}
          title="Add Teachers"
          onInvite={addTeachers}
        />

        <ClassroomSection title="Students" hasAddButton onAdd={() => setAddStudentDialogOpen(true)}>
          {classroom.students && classroom.students.length > 0 ? (
            classroom.students.map((u, i) => (
              <UserTile
                key={i}
                user={u}
                tooltipTitle={timeParser(u.last_seen)}
                connected={isConnected(u.last_seen)}
                isMemberTeacher={true}
              />
            ))
          ) : (
            <PlaceholderTile tooltipTitle="Add students!" onClick={() => setAddStudentDialogOpen(true)} />
          )}
        </ClassroomSection>
        <InviteMembersDialog
          open={addStudentDialogOpen}
          onClose={() => setAddStudentDialogOpen(false)}
          title="Add Students"
          onInvite={addStudents}
        />

        <ClassroomSection title="Documents" hasAddButton onAdd={() => setAddChapterDialogOpen(true)}>
          {classroom.chapters && classroom.chapters.length > 0 ? (
            classroom.chapters.map((c, i) => (
              <Chapter documents={classroom.documents} name={c} classroom_id={classroom.classroom_id} />
            ))
          ) : (
            <div style={{ height: 150 }} />
          )}
        </ClassroomSection>
        <ChapterDialog
          title="Add a Chapter"
          open={addChapterDialogOpen}
          onClose={() => setAddChapterDialogOpen(false)}
          onSubmit={addChapter}
        />
      </div>
    </AppPage>
  );
}

export default ClassroomPage;
