import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import VTButton from "../common/Buttons/VTButton";
import { toasts } from "../common/AppPage/AppPage";
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

function ClassroomCreateFormDialog({ open, onClose, onCreate }) {
  const classes = formStyles();
  const [errorTitle, setErrorTitle] = useState(false);
  const [errorTopic, setErrorTopic] = useState(false);

  const [title, setTitle] = useState();
  const [topic, setTopic] = useState();
  const [description, setDescription] = useState();

  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
    if (errorTitle && title && title?.trim() !== "") {
      setErrorTitle(false);
    }
  };
  const handleChangeTopic = (event) => {
    setTopic(event.target.value);
    if (errorTopic && topic && topic?.trim() !== "") {
      setErrorTopic(false);
    }
  };
  const handleChangeDescription = (event) => {
    setDescription(event.target.value);
  };
  const clearForm = () => {
    setTitle("");
    setTopic("");
    setDescription("");
  };

  function createClassroom(title, topic, description) {
    if (onCreate) onCreate(title, topic, description);
  }

  return (
    <div>
      <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
        <VoctailDialogTitle id="form-dialog-title"> New Classroom </VoctailDialogTitle>
        <DialogContent>
          <ErrorDialogField
            required
            error={errorTitle}
            className={classes.textField}
            autoFocus
            value={title}
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
            value={topic}
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
            value={description}
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
              onClose();
            }}
          >
            Cancel
          </VTButton>
          <VTButton
            neutral
            style={{ margin: "1%" }}
            onClick={() => {
              if (!title || title.length < 1) {
                toasts.toastError("Please give your classroom a title !");
                setErrorTitle(true);
                return;
              }
              if (!topic || topic.length < 1) {
                toasts.toastError("Please give your classroom a topic !");
                setErrorTopic(true);
                return;
              }
              createClassroom(title, topic, description);
              clearForm();
              onClose();
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
