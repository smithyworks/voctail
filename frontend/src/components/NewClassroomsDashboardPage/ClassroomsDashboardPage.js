import React, { useState, useEffect } from "react";
import { AppPage, ClassroomTile, ClassroomSection } from "../common";
import { api } from "../../utils";
import { CircularProgress } from "@material-ui/core";

function ClassroomsDashboardPage() {
  const [classrooms, setClassrooms] = useState();
  console.log(classrooms);

  const [count, setCount] = useState(0);
  const reload = () => setCount(count + 1);
  useEffect(() => {
    api.fetchClassrooms().then((res) => {
      console.log(res.data);
      setClassrooms(res.data);
    });
  }, [count]);

  if (!classrooms) return <CircularProgress />;

  return (
    <AppPage id="classrooms-saved-page">
      <div>
        {classrooms.teacher_classrooms.length > 0 && (
          <ClassroomSection title="Classrooms as a Teacher">
            {classrooms.teacher_classrooms.map((c, i) => (
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
            ))}
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
          <ClassroomSection title="Classrooms as a Student">
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
      </div>
    </AppPage>
  );
}

export default ClassroomsDashboardPage;
