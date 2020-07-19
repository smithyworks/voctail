import React, { useState, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import { api } from "../../utils";
import { AppPage, ClassroomSection, UserTile, PlaceholderTile } from "../common";
import { timeParser, isConnected } from "../../utils/parsers";
import InviteMembersDialog from "../common/InviteMembersDialog";

function ClassroomPage() {
  const { params } = useRouteMatch();

  const [classroom, setClassroom] = useState();

  useEffect(() => {
    api.fetchClassroom(params.classroom_id).then((res) => setClassroom(res.data));
  }, []);

  const [addStudentDialogOpen, setAddStudentDialogOpen] = useState();

  if (!classroom) return <AppPage />;

  return (
    <AppPage>
      <div>
        <ClassroomSection title="Teachers">
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

        <ClassroomSection title="Teachers" hasAddButton onAdd={() => setAddStudentDialogOpen(true)}>
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
        <InviteMembersDialog open={addStudentDialogOpen} onClose={() => setAddStudentDialogOpen(false)} />
      </div>
    </AppPage>
  );
}

export default ClassroomPage;
