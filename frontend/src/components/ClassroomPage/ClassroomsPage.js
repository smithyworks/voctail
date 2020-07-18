import React, { useState, useEffect } from "react";
import {
  Button,
  ButtonBase,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Grid,
  Typography,
  Tooltip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AppPage from "../common/AppPage";

import { api } from "../../utils";
import logo_classroom from "../../assets/classroom_logo.png";
import { ClassroomSection, ConfirmDialog } from "../common";
import VTButton from "../common/Buttons/VTButton";
import { toasts } from "../common/AppPage/AppPage";
import { Link } from "react-router-dom";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import ClassroomTile from "../common/ClassroomTile";
import VTIconFlexButton from "../common/Buttons/IconButton";
import VoctailDialogTitle from "../common/Dialogs/VoctailDialogTitle";

const formStyles = makeStyles(() => ({
  header: {
    color: "#0B6374",
    backgroundColor: "#D4E4E4",
  },
  description: {
    marginTop: "5%",
    marginBottom: "5%",
    fontStyle: "italic",
    textAlign: "center",
  },
  textField: {
    marginBottom: "3%",
  },
  buttons: { margin: "1%" },
}));

function ClassroomCreateFormDialog({
  user,
  openCreateForm,
  closeCreateForm,
  newTitle,
  setNewTitle,
  newTopic,
  setNewTopic,
  newDescription,
  setNewDescription,
  classroomDataFromDatabase,
  setClassroomDataFromDatabase,
  classroomAsTeacherDataFromDatabase,
  setClassroomAsTeacherDataFromDatabase,
}) {
  const classes = formStyles();
  const [errorTitle, setErrorTitle] = useState(false);
  const [errorTopic, setErrorTopic] = useState(false);

  const handleChangeTitle = (event) => {
    setNewTitle(event.target.value);
    if (errorTitle || newTitle > 0) {
      setErrorTitle(false);
    }
  };
  const handleChangeTopic = (event) => {
    setNewTopic(event.target.value);
    if (errorTopic || newTopic > 0) {
      setErrorTopic(false);
    }
  };
  const handleChangeDescription = (event) => {
    setNewDescription(event.target.value);
  };
  const clearForm = () => {
    setNewTitle("");
    setNewTopic("");
    setNewDescription("");
  };

  return (
    <div>
      <Dialog open={openCreateForm} onClose={closeCreateForm} aria-labelledby="form-dialog-title">
        <VoctailDialogTitle id="form-dialog-title"> New Classroom </VoctailDialogTitle>
        <DialogContent>
          <DialogContentText className={classes.description}>
            {" "}
            Please fill the details to create your classroom.{" "}
          </DialogContentText>
          <TextField
            required
            error={errorTitle}
            className={classes.textField}
            autoFocus
            value={newTitle}
            onChange={handleChangeTitle}
            margin="dense"
            id="name"
            label="Title"
            type="text"
            fullWidth
          />
          <TextField
            required
            error={errorTopic}
            className={classes.textField}
            autoFocus
            value={newTopic}
            onChange={handleChangeTopic}
            margin="dense"
            id="name"
            label="Topic"
            type="text"
            fullWidth
          />
          <TextField
            className={classes.textField}
            autoFocus
            value={newDescription}
            onChange={handleChangeDescription}
            margin="dense"
            id="name"
            label="Description"
            multiline
            rowsMax={10}
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <VTButton
            danger
            style={{ margin: "1%" }}
            onClick={() => {
              closeCreateForm();
            }}
          >
            Cancel
          </VTButton>
          <VTButton
            accept
            style={{ margin: "1%" }}
            onClick={() => {
              if (newTitle.length < 1) {
                toasts.toastError("Please give your classroom a title !");
                setErrorTitle(true);
                return;
              }
              if (newTopic.length < 1) {
                toasts.toastError("Please give your classroom a topic !");
                setErrorTopic(true);
                return;
              }
              createClassroom(
                user,
                newTitle,
                newTopic,
                newDescription,
                classroomDataFromDatabase,
                setClassroomDataFromDatabase,
                classroomAsTeacherDataFromDatabase,
                setClassroomAsTeacherDataFromDatabase
              );
              clearForm();
              closeCreateForm();
            }}
          >
            Create
          </VTButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function createClassroom(
  user,
  title,
  topic,
  description,
  classroomDataFromDatabase,
  setClassroomDataFromDatabase,
  classroomAsTeacherDataFromDatabase,
  setClassroomAsTeacherDataFromDatabase
) {
  const addThisClassroom = () => {
    api
      .createClassroom(user, title, topic, description, true)
      .then((res) => {
        setClassroomDataFromDatabase(res.data.rows.concat(classroomDataFromDatabase));
        setClassroomAsTeacherDataFromDatabase(res.data.rows.concat(classroomAsTeacherDataFromDatabase));
      })
      .catch((err) => console.log(err));
  };
  addThisClassroom();
  toasts.toastSuccess("Classroom created!");
}

function deleteClassroom(classroomId, classroomDataFromDatabase, setClassroomDataFromDatabase) {
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

function renameClassroom(classroomId, newTitle, classroomDataFromDatabase, setClassroomDataFromDatabase) {
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

function indexOfClassroom(classroomId, classrooms) {
  let output = 0;
  classrooms.forEach((classroom, index) => {
    if (classroom.classroom_id === classroomId) {
      output = index;
    }
  });
  return output;
}

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
      <ClassroomSection title="My Classrooms as a student" description="Your classrooms as a student">
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
                console.log("hllo");
                //deleteClassroom(tile.classroom_id, classroomDataFromDatabase, setClassroomDataFromDatabase);
              }}
              onRename={(newTitle) => {
                renameClassroom(tile.classroom_id, newTitle, classroomDataFromDatabase, setClassroomDataFromDatabase);
              }}
            />
          </React.Fragment>
        ))}
      </ClassroomSection>
      <ClassroomSection
        title="My Classrooms as a teacher"
        description="Your classrooms as a teacher"
        Button={
          <VTIconFlexButton
            toolTipLabel={
              user.premium ? "Create a classroom" : "Creating classrooms is only available in Voctail Premium"
            }
            onClick={() => setOpenCreateForm(true)}
            disabled={!user.premium}
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
      <ClassroomSection
        title="Public classrooms"
        description="You have here the classrooms you are registered to."
        Button={
          <VTIconFlexButton
            toolTipLabel={
              user.premium ? "Create a classroom" : "Creating classrooms is only available in Voctail Premium"
            }
            onClick={() => setOpenCreateForm(true)}
            disabled={!user.premium}
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
    </AppPage>
  );
}

export default Classrooms;
