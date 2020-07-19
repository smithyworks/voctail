import React, { useState, useEffect, useContext } from "react";
import { AppPage, ClassroomTile, ClassroomSection, PlaceholderTile } from "../common";
import { api } from "../../utils";
import { CircularProgress } from "@material-ui/core";
import { UserContext } from "../../App";
import ClassroomCreateFormDialog from "../ClassroomPage/ClassroomCreateFormDialog";

function ClassroomsDashboardPage() {
  const [classrooms, setClassrooms] = useState();
  const user = useContext(UserContext);

  const [count, setCount] = useState(0);
  const reload = () => setCount(count + 1);
  useEffect(() => {
    api.fetchClassrooms().then((res) => {
      console.log(res.data);
      setClassrooms(res.data);
    });
  }, [count]);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  function createClassroom(title, topic, description) {
    api.createClassroom(title, topic, description).then(() => reload());
  }

  if (!classrooms) return <CircularProgress />;

  return (
    <AppPage id="classrooms-saved-page">
      <div>
        {!!user?.premium && (
          <ClassroomSection title="Classrooms as a Teacher" hasAddButton onAdd={() => setCreateDialogOpen(true)}>
            {classrooms.teacher_classrooms.length > 0 ? (
              classrooms.teacher_classrooms.map((c, i) => (
                <ClassroomTile
                  isOwned
                  key={i}
                  id={c.classroom_id}
                  title={c.title}
                  teacher={c.classroom_owner}
                  topic={c.topic}
                  linkTo={"/classrooms/" + c.classroom_id}
                  onDelete={() => {
                    console.log("delete");
                    api.deleteClassroom(c.classroom_id).then((res) => reload());
                  }}
                  onRename={(newTitle) => {
                    api.renameClassroom(c.classroom_id, newTitle).then(() => reload());
                  }}
                />
              ))
            ) : (
              <PlaceholderTile tooltipTitle="Create a new classroom!" onClick={() => setCreateDialogOpen(true)} />
            )}
          </ClassroomSection>
        )}

        {classrooms.student_classrooms.length > 0 && (
          <ClassroomSection title="Classrooms as a Student">
            {classrooms.student_classrooms.map((c, i) => (
              <ClassroomTile
                key={i}
                id={c.classroom_id}
                title={c.title}
                teacher={c.classroom_owner}
                topic={c.topic}
                linkTo={"/classrooms/" + c.classroom_id}
              />
            ))}
          </ClassroomSection>
        )}

        {classrooms.public_classrooms.length > 0 && (
          <ClassroomSection title="Public Classrooms">
            {classrooms.public_classrooms.map((c, i) => (
              <ClassroomTile
                isOwned={classrooms.administered_classroom_ids.includes(c.classroom_id)}
                key={i}
                id={c.classroom_id}
                title={c.title}
                teacher={c.classroom_owner}
                topic={c.topic}
                linkTo={"/classrooms/" + c.classroom_id}
                onDelete={() => {
                  console.log("delete");
                  api.deleteClassroom(c.classroom_id).then((res) => reload());
                }}
                onRename={(newTitle) => {
                  api.renameClassroom(c.classroom_id, newTitle).then(() => reload());
                }}
              />
            ))}
          </ClassroomSection>
        )}

        <ClassroomCreateFormDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onCreate={createClassroom}
        />
      </div>
    </AppPage>
  );
}

export default ClassroomsDashboardPage;
