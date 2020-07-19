import React, { useState, useEffect } from "react";
import AppPage from "../common/AppPage";
import { api } from "../../utils";
import { ClassroomSection } from "../common";
import ClassroomTile from "../common/ClassroomTile";
import VTIconFlexButton from "../common/Buttons/IconButton";
import GoPremiumDialog from "../common/Dialogs/GoPremiumDialog";
import ClassroomCreateFormDialog from "./ClassroomCreateFormDialog";
import { deleteClassroom, renameClassroom } from "./ClassroomDashboardUtils";

function Classrooms() {
  const [user, setUser] = useState([]);
  const [classroomDataFromDatabase, setClassroomDataFromDatabase] = useState([]);
  const [classroomAsStudentDataFromDatabase, setClassroomAsStudentDataFromDatabase] = useState([]);
  const [classroomAsTeacherDataFromDatabase, setClassroomAsTeacherDataFromDatabase] = useState([]);

  //Hooks to a current classroom
  const [openCreateForm, setOpenCreateForm] = useState(false);
  //Hooks to create a new classroom
  const [newTopic, setNewTopic] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [goPremium, setGoPremium] = useState(false);

  const handleGoPremiumClose = () => {
    setGoPremium(false);
  };

  useEffect(() => {
    api
      .user()
      .then((res) => {
        if (res) setUser(res.data);
        api
          .fetchClassroomsAsStudent(res.data.user_id)
          .then((resForStudent) => {
            if (resForStudent) {
              setClassroomAsStudentDataFromDatabase(resForStudent.data.rows);
            }
          })
          .catch((err) => console.log(err));
        api
          .fetchClassroomsAsTeacher(res.data.user_id)
          .then((resForTeacher) => {
            if (resForTeacher) {
              setClassroomAsTeacherDataFromDatabase(resForTeacher.data.rows);
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    api
      .fetchClassrooms()
      .then((res) => {
        if (res) {
          setClassroomDataFromDatabase(res.data.rows);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <AppPage location="classrooms" id="classrooms-saved-page">
      {classroomAsStudentDataFromDatabase.length !== 0 && (
        <ClassroomSection title="My Classrooms as a Student" description="Your classrooms as a student">
          {classroomAsStudentDataFromDatabase.map((tile) => (
            <React.Fragment key={tile.classroom_id}>
              <ClassroomTile
                isOwned
                title={tile.title}
                teacher={tile.classroom_owner}
                topic={tile.topic}
                linkTo={"/classrooms/" + tile.classroom_id}
                classroomDataFromDatabase={classroomDataFromDatabase}
                setClassroomDataFromDatabase={setClassroomDataFromDatabase}
                onDelete={() => {
                  deleteClassroom(tile.classroom_id, classroomDataFromDatabase, setClassroomDataFromDatabase);
                }}
                onRename={(newTitle) => {
                  renameClassroom(tile.classroom_id, newTitle, classroomDataFromDatabase, setClassroomDataFromDatabase);
                }}
              />
            </React.Fragment>
          ))}
        </ClassroomSection>
      )}

      {classroomAsTeacherDataFromDatabase.length !== 0 && (
        <ClassroomSection
          title="My Classrooms as a Teacher"
          description="Your classrooms as a teacher"
          Button={
            <VTIconFlexButton
              toolTipLabel={
                user.premium ? "Create a classroom" : "Creating classrooms is only available in Voctail Premium"
              }
              onClick={user.premium ? () => setOpenCreateForm(true) : () => setGoPremium(true)}
              voctailDisabled={!user.premium}
              aria-label="new-classroom"
            />
          }
        >
          <ClassroomCreateFormDialog
            openCreateForm={openCreateForm}
            closeCreateForm={() => setOpenCreateForm(false)}
            user={user.user_id}
            newTitle={newTitle}
            setNewTitle={setNewTitle}
            newTopic={newTopic}
            setNewTopic={setNewTopic}
            newDescription={newDescription}
            setNewDescription={setNewDescription}
            classroomDataFromDatabase={classroomDataFromDatabase}
            setClassroomDataFromDatabase={setClassroomDataFromDatabase}
            classroomAsTeacherDataFromDatabase={classroomAsTeacherDataFromDatabase}
            setClassroomAsTeacherDataFromDatabase={setClassroomAsTeacherDataFromDatabase}
          />
          {classroomAsTeacherDataFromDatabase.map((tile) => (
            <React.Fragment key={tile.classroom_id}>
              <ClassroomTile
                isOwned
                title={tile.title}
                teacher={tile.classroom_owner}
                topic={tile.topic}
                linkTo={"/classrooms/" + tile.classroom_id}
                classroomDataFromDatabase={classroomDataFromDatabase}
                setClassroomDataFromDatabase={setClassroomDataFromDatabase}
                onDelete={() => {
                  deleteClassroom(tile.classroom_id, classroomDataFromDatabase, setClassroomDataFromDatabase);
                }}
                onRename={(newTitle) => {
                  renameClassroom(tile.classroom_id, newTitle, classroomDataFromDatabase, setClassroomDataFromDatabase);
                }}
              />
            </React.Fragment>
          ))}
        </ClassroomSection>
      )}
      <ClassroomSection
        title="Public Classrooms"
        description="You have here the classrooms you are registered to."
        Button={
          <VTIconFlexButton
            toolTipLabel={
              user.premium ? "Create a classroom" : "Creating classrooms is only available in Voctail Premium"
            }
            onClick={user.premium ? () => setOpenCreateForm(true) : () => setGoPremium(true)}
            voctailDisabled={!user.premium}
            aria-label="new-classroom"
          />
        }
      >
        <ClassroomCreateFormDialog
          openCreateForm={openCreateForm}
          closeCreateForm={() => setOpenCreateForm(false)}
          user={user.user_id}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          newTopic={newTopic}
          setNewTopic={setNewTopic}
          newDescription={newDescription}
          setNewDescription={setNewDescription}
          classroomDataFromDatabase={classroomDataFromDatabase}
          setClassroomDataFromDatabase={setClassroomDataFromDatabase}
          classroomAsTeacherDataFromDatabase={classroomAsTeacherDataFromDatabase}
          setClassroomAsTeacherDataFromDatabase={setClassroomAsTeacherDataFromDatabase}
        />
        {classroomDataFromDatabase.map((tile) => (
          <React.Fragment key={tile.classroom_id}>
            <ClassroomTile
              isOwned
              id={tile.classroom_id}
              title={tile.title}
              teacher={tile.classroom_owner}
              topic={tile.topic}
              linkTo={"/classrooms/" + tile.classroom_id}
              classroomDataFromDatabase={classroomDataFromDatabase}
              setClassroomDataFromDatabase={setClassroomDataFromDatabase}
              onDelete={() => {
                deleteClassroom(tile.classroom_id, classroomDataFromDatabase, setClassroomDataFromDatabase);
              }}
              onRename={(newTitle) => {
                renameClassroom(tile.classroom_id, newTitle, classroomDataFromDatabase, setClassroomDataFromDatabase);
              }}
            />
          </React.Fragment>
        ))}
      </ClassroomSection>

      <GoPremiumDialog open={goPremium} onClose={handleGoPremiumClose} />
    </AppPage>
  );
}

export default Classrooms;
