import React, { useState, useEffect } from "react";
import {
  Button,
  ButtonBase,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Typography,
  Slide,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AppPage from "./common/AppPage";

import { api } from "../utils";
import logo_classroom from "../assets/classroom_logo.png";
import Header from "./common/HeaderSection";
import { DashboardSection } from "./common";
import IconButton from "@material-ui/core/IconButton";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { toasts } from "./common/AppPage/AppPage";
import VTButton from "./common/Buttons/VTButton";
import { Link } from "react-router-dom";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles(() => ({
  text: {
    paddingTop: "5%",
    paddingBottom: "5%",
    margin: "auto",
    textAlign: "center",
    textShadow: "1px 1px",
  },
  container: { height: "100%", width: "100%" },
  grid: { height: "100%", width: "100%" },
  userItem: { width: "150px" },
  button: {
    margin: "5%",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    borderWidth: "3px",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
  },
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
  },
  gridList: {
    width: 500,
    height: 450,
  },
  image: {
    position: "relative",
    height: 200,
    "&:hover, &$focusVisible": {
      zIndex: 1,
      "& $imageBackdrop": {
        opacity: 0.15,
      },
      "& $imageMarked": {
        opacity: 0,
      },
      "& $imageTitle": {
        border: "4px solid currentColor",
      },
    },
  },
  focusVisible: {},
  imageButton: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
  imageSrc: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: "cover",
    backgroundPosition: "center 40%",
  },
  imageBackdrop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "black",
    opacity: 0.4,
  },
  imageTitle: {
    position: "relative",
  },
  imageMarked: {
    height: 3,
    width: 18,
    backgroundColor: "white",
    position: "absolute",
    bottom: -2,
    left: "calc(50% - 9px)",
  },
}));

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

function ClassroomItem({
  classes,
  setPopUpOpen,
  setClassroomId,
  setClassroomTitle,
  setClassroomTopic,
  setClassroomAuthor,
  setClassroomDescription,
  tile,
}) {
  return (
    <ButtonBase
      focusRipple
      className={classes.image}
      focusVisibleClassName={classes.focusVisible}
      style={{
        width: "40%",
        margin: "5%",
      }}
      onClick={() => {
        setPopUpOpen(true);
        setClassroomId(tile.classroom_id);
        setClassroomTitle(tile.title);
        setClassroomTopic(tile.topic);
        teacherData(tile.classroom_owner, setClassroomAuthor);
        setClassroomDescription(tile.description);
      }}
    >
      <span
        className={classes.imageSrc}
        style={{
          backgroundImage: `url(${logo_classroom})`,
        }}
      />
      <span className={classes.imageBackdrop} />
      <span className={classes.imageButton}>
        <Typography component="span" variant="h4" color="inherit" className={classes.imageTitle}>
          {tile.title}
          <span className={classes.imageMarked} />
        </Typography>
      </span>
    </ButtonBase>
  );
}

function ClassroomOverviewPopUp({
  open,
  onClose,
  classroomId,
  classroomTitle,
  classroomTopic,
  classroomAuthor,
  classroomDescription,
}) {
  return (
    <Dialog
      onClose={onClose}
      aria-labelledby="classroom-overview-popup"
      open={open}
      TransitionComponent={Transition}
      keepMounted
    >
      <DialogTitle id="classroom-overview-popup-title" onClose={onClose}>
        {classroomTitle}
      </DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>Topic: {classroomTopic}</Typography>
        <Typography gutterBottom>Teacher: {classroomAuthor}</Typography>
        <Typography gutterBottom>Description: {classroomDescription}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            deleteClassroom(classroomId);
          }}
          color="secondary"
        >
          Delete
        </Button>
        <Button component={Link} to={"/classrooms/view?classroom=" + classroomId} color="primary">
          Open
        </Button>
      </DialogActions>
    </Dialog>
  );
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
        <DialogTitle id="form-dialog-title" className={classes.header}>
          {" "}
          New Classroom{" "}
        </DialogTitle>
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
              return toasts.toastError("You cancelled");
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
                setClassroomDataFromDatabase
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

function createClassroom(user, title, topic, description, classroomDataFromDatabase, setClassroomDataFromDatabase) {
  const addThisClassroom = () => {
    api
      .createClassroom(user, title, topic, description, true)
      .then((res) => {
        setClassroomDataFromDatabase(res.data.rows.concat(classroomDataFromDatabase));
      })
      .catch((err) => console.log(err));
  };
  addThisClassroom();
  toasts.toastSuccess("Classroom added to the database!");
}

function deleteClassroom(classroomId) {
  api.deleteClassroom(classroomId).catch((err) => console.log(err));
  toasts.toastSuccess("Classroom deleted from the database!");
}

function teacherData(user_id, setClassroomAuthorData) {
  api
    .user(user_id)
    .then((res) => {
      setClassroomAuthorData(res.data);
    })
    .catch((err) => console.log(err));
}

function Classrooms() {
  const classes = useStyles();
  const [user, setUser] = useState([]);
  const [classroomDataFromDatabase, setClassroomDataFromDatabase] = useState([]);
  const [openPopUp, setPopUpOpen] = useState(false);

  //Hooks to a current classroom
  const [classroomId, setClassroomId] = useState(null);
  const [classroomTitle, setClassroomTitle] = useState(null);
  const [classroomTopic, setClassroomTopic] = useState(null);
  const [classroomAuthor, setClassroomAuthor] = useState([]);
  const [classroomDescription, setClassroomDescription] = useState(null);
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
    <AppPage location="classrooms/saved" id="classrooms-saved-page">
      <Header mainTitle="Classrooms" description="Attend and manage your classrooms!" />

      <DashboardSection
        title="My Classrooms"
        description="You have here the classrooms you are registered to."
        Button={
          <IconButton aria-label="new-classroom" onClick={() => setOpenCreateForm(true)}>
            <AddBoxIcon fontSize="large" style={{ color: "darkblue" }} />
          </IconButton>
        }
      >
        <Typography> You have {classroomDataFromDatabase.length} classes </Typography>
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
        />
        {classroomDataFromDatabase.map((tile) => (
          <React.Fragment key={tile.classroom_id}>
            <ClassroomItem
              classes={classes}
              setPopUpOpen={setPopUpOpen}
              setClassroomId={setClassroomId}
              setClassroomTitle={setClassroomTitle}
              setClassroomTopic={setClassroomTopic}
              setClassroomAuthor={setClassroomAuthor}
              setClassroomDescription={setClassroomDescription}
              tile={tile}
            />

            <ClassroomOverviewPopUp
              open={openPopUp}
              onClose={() => {
                setPopUpOpen(false);
              }}
              classroomId={classroomId}
              classroomTitle={classroomTitle}
              classroomTopic={classroomTopic}
              classroomAuthor={classroomAuthor.name}
              classroomDescription={classroomDescription}
            />
          </React.Fragment>
        ))}
      </DashboardSection>
    </AppPage>
  );
}

export default Classrooms;
