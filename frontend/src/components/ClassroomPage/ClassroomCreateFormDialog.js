import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { api } from "../../utils";
import VTButton from "../common/Buttons/VTButton";
import { toasts } from "../common/AppPage/AppPage";
import DialogContentText from "@material-ui/core/DialogContentText";
import VoctailDialogTitle from "../common/Dialogs/VoctailDialogTitle";
import ErrorDialogField from "../common/Dialogs/ErrorDialogField";

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
          <ErrorDialogField
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
          <ErrorDialogField
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
          <ErrorDialogField
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
            secondary
            style={{ margin: "1%" }}
            onClick={() => {
              closeCreateForm();
            }}
          >
            Cancel
          </VTButton>
          <VTButton
            neutral
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

export default ClassroomCreateFormDialog;
