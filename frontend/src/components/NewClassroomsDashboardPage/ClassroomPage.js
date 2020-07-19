import React, { useState, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import { api } from "../../utils";
import { AppPage, ClassroomSection, UserTile, PlaceholderTile } from "../common";
import { timeParser, isConnected } from "../../utils/parsers";
import InviteMembersDialog from "../common/InviteMembersDialog";

function ClassroomPage() {
  const { params } = useRouteMatch();

  const [classroom, setClassroom] = useState();

  const [count, setCount] = useState(0);
  const reload = () => setCount(count + 1);
  useEffect(() => {
    api.fetchClassroom(params.classroom_id).then((res) => setClassroom(res.data));
  }, [count]);

  const [addStudentDialogOpen, setAddStudentDialogOpen] = useState(false);
  const [addTeacherDialogOpen, setAddTeacherDialogOpen] = useState(false);

  function addTeachers(ids) {
    setAddTeacherDialogOpen(false);
    api.addTeachersToClassroom(classroom.classroom_id, ids).then(reload);
  }
  function addStudents(ids) {
    setAddStudentDialogOpen(false);
    api.addStudentsToClassroom(classroom.classroom_id, ids).then(reload);
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
      </div>
    </AppPage>
  );
}

export default ClassroomPage;
