import React, { useState, useEffect } from "react";
import { AppPage, ClassroomTile, ClassroomSection } from "../common";
import { api } from "../../utils";
import { CircularProgress } from "@material-ui/core";

function ClassroomsDashboardPage() {
  const [classrooms, setClassrooms] = useState();
  console.log(classrooms);

  useEffect(() => {
    api.fetchClassrooms().then((res) => setClassrooms(res.data));
  }, []);

  if (!classrooms) return <CircularProgress />;

  return (
    <AppPage id="classrooms-saved-page">
      <div>
        {classrooms.teacher_classrooms.length > 0 && (
          <ClassroomSection title="Classrooms as a Teacher">
            {classrooms.teacher_classrooms.map((c, i) => (
              <ClassroomTile
                key={i}
                id={c.classroom_id}
                title={c.title}
                teacher={c.classroom_owner}
                topic={c.topic}
                linkTo={"/classrooms/" + c.classroom_id}
                onDelete={() => {
                  // deleteClassroom(tile.classroom_id, classroomDataFromDatabase, setClassroomDataFromDatabase);
                }}
                onRename={(newTitle) => {
                  // renameClassroom(tile.classroom_id, newTitle, classroomDataFromDatabase, setClassroomDataFromDatabase);
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
                onDelete={() => {
                  // deleteClassroom(tile.classroom_id, classroomDataFromDatabase, setClassroomDataFromDatabase);
                }}
                onRename={(newTitle) => {
                  // renameClassroom(tile.classroom_id, newTitle, classroomDataFromDatabase, setClassroomDataFromDatabase);
                }}
              />
            ))}
          </ClassroomSection>
        )}

        {classrooms.public_classrooms.length > 0 && (
          <ClassroomSection title="Classrooms as a Student">
            {classrooms.public_classrooms.map((c, i) => (
              <ClassroomTile
                key={i}
                id={c.classroom_id}
                title={c.title}
                teacher={c.classroom_owner}
                topic={c.topic}
                linkTo={"/classrooms/" + c.classroom_id}
                onDelete={() => {
                  // deleteClassroom(tile.classroom_id, classroomDataFromDatabase, setClassroomDataFromDatabase);
                }}
                onRename={(newTitle) => {
                  // renameClassroom(tile.classroom_id, newTitle, classroomDataFromDatabase, setClassroomDataFromDatabase);
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
